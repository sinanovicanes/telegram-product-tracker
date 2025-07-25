import type { Product } from "@/database/entities";
import { UrlParser } from "@/utils";
import { Injectable } from "@app/common/decorators";
import { env } from "@app/common/env.validation";
import { Logger } from "@app/common/logger";
import { TelegramClient } from "@app/common/telegram/client";
import { capitalize, isEqualObjects, pluralify } from "@app/common/utils";
import { ProductService } from "./product.service";
import { type ScrapeResult, ScraperService } from "./scraper.service";

const { MAX_SCRAPE_FAILURES } = env;

@Injectable()
export class ProductControlService {
  private readonly logger = new Logger(ProductControlService.name);

  constructor(
    private readonly client: TelegramClient,
    private readonly productService: ProductService,
    private readonly scraperService: ScraperService
  ) {}

  private async notifyTrackers(trackers: Product["trackers"], text: string) {
    this.logger.info(`Notifying ${trackers.length} trackers: ${text}`);
    for (const tracker of trackers) {
      this.client.telegram.sendMessage(tracker.user.id, text).catch(() => {
        this.logger.error(`Failed to notify tracker: ${tracker.user.id}`);
      });
    }
  }

  async controlOne(product: Product) {
    const url = UrlParser.getUrlFromProductId(product.merchant, product.identifier);
    const scrapeResult = await this.scraperService.scrape(url);

    if (!scrapeResult) {
      if (product.scrapeFailures >= MAX_SCRAPE_FAILURES) {
        this.logger.warn(
          `Product ${url} has reached the maximum number of scrape failures. Removing from database.`
        );

        this.notifyTrackers(
          product.trackers,
          `${product.metadata.name} has been removed from the system.\n\n${url}`
        );

        this.productService.delete(product.identifier);
        return;
      }

      // Increment the scrape failures
      product.scrapeFailures++;
      product.save();

      return;
    }

    const differences: (keyof ScrapeResult)[] = [];

    // Compare the old scrape result data with the new one
    for (const key in scrapeResult) {
      const type = typeof scrapeResult[key as keyof typeof scrapeResult];
      const type2 = typeof product.metadata[key];

      if (type != type2) {
        differences.push(key as keyof ScrapeResult);
        continue;
      }

      if (type === "object") {
        if (
          !isEqualObjects(
            scrapeResult[key as keyof typeof scrapeResult] as Object,
            product.metadata[key]
          )
        ) {
          differences.push(key as keyof ScrapeResult);
        }
        continue;
      }

      if (scrapeResult[key as keyof ScrapeResult] != product.metadata[key]) {
        differences.push(key as keyof ScrapeResult);
      }
    }

    // Nothing has changed since the last check
    if (!differences.length) {
      // Reset the scrape failures
      if (product.scrapeFailures > 0) {
        product.scrapeFailures = 0;
        await product.save();
      }

      return;
    }

    const changesString = differences.reduce((acc, curr) => {
      if (typeof scrapeResult[curr] === "object") {
        if (curr === "sizes") {
          const oldSizes: string[] = product.metadata[curr];
          const newSizes: string[] = scrapeResult[curr];
          const addedSizes = newSizes.filter(size => !oldSizes.includes(size));
          const removedSizes = oldSizes.filter(size => !newSizes.includes(size));

          acc = addedSizes.reduce((acc, size) => {
            return `${acc}\nSize ${size} -> ✅`;
          }, acc);

          acc = removedSizes.reduce((acc, size) => {
            return `${acc}\nSize ${size} -> ❌`;
          }, acc);

          return acc;
        }

        return `${acc}\n${capitalize(curr)}`;
      }

      return `${acc}\n${capitalize(curr)}: ${product.metadata[curr]} -> ${
        scrapeResult[curr as keyof typeof scrapeResult]
      }`;
    }, "");

    const text = `${scrapeResult.name} has been updated. The following fields have changed:\n${changesString}\n\n${url}`;

    product.scrapeFailures = 0;
    // Update the product metadata
    product.metadata = scrapeResult;
    await product.save();

    // Notify the trackers
    this.notifyTrackers(product.trackers, text);
  }

  async controlAll() {
    const products = await this.productService.getAll();

    this.logger.log(`Checking ${products.length} products`);

    if (!products.length) return;

    const startTime = Date.now();

    await Promise.all(products.map(product => this.controlOne(product)));

    this.logger.log(
      `${products.length} ${pluralify(
        "product",
        "products",
        products.length
      )} controlled in ${Date.now() - startTime}ms`
    );
  }
}
