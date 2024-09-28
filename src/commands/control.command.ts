import { USER_ROLE, type Item } from "@/database/entities";
import { ItemsService, ScraperService, type ScrapeResult } from "@/services";
import { UrlParser } from "@/utils";
import { Injectable, Roles } from "@app/common/decorators";
import { Logger } from "@app/common/logger";
import { Command } from "@app/common/telegram";
import { TelegramClient } from "@app/common/telegram/client";
import { capitalize, isEqualObjects, pluralify } from "@app/common/utils";

const MAX_SCRAPE_FAILURES = 3;

@Injectable()
@Roles(USER_ROLE.ADMIN)
export class ControlCommand extends Command {
  private readonly logger = new Logger(ControlCommand.name);

  constructor(
    private readonly client: TelegramClient,
    private readonly itemsService: ItemsService,
    private readonly scraperService: ScraperService
  ) {
    super({
      name: "control",
      description: "Control items"
    });
  }

  async notifyTrackers(trackers: Item["trackers"], text: string) {
    for (const tracker of trackers) {
      this.client.telegram.sendMessage(tracker.user.id, text);
    }
  }

  async controlItem(item: Item) {
    const url = UrlParser.getUrlFromItemId(item.brand, item.identifier);
    const scrapeResult = await this.scraperService.scrape(url);

    if (!scrapeResult) {
      if (item.scrapeFailures >= MAX_SCRAPE_FAILURES) {
        this.logger.warn(
          `Item ${url} has reached the maximum number of scrape failures. Removing from database.`
        );

        this.notifyTrackers(
          item.trackers,
          `${item.metadata.name} has been removed from the system.\n\n${url}`
        );

        this.itemsService.deleteItem(item.identifier);
        return;
      }

      // Increment the scrape failures
      item.scrapeFailures++;
      item.save();

      return;
    }

    const differences: (keyof ScrapeResult)[] = [];

    // Compare the item data with the metadata
    for (const key in scrapeResult) {
      const type = typeof scrapeResult[key as keyof typeof scrapeResult];
      const type2 = typeof item.metadata[key];

      if (type != type2) {
        differences.push(key as keyof ScrapeResult);
        continue;
      }

      if (type === "object") {
        if (
          !isEqualObjects(
            scrapeResult[key as keyof typeof scrapeResult] as Object,
            item.metadata[key]
          )
        ) {
          differences.push(key as keyof ScrapeResult);
        }
        continue;
      }

      if (scrapeResult[key as keyof ScrapeResult] != item.metadata[key]) {
        differences.push(key as keyof ScrapeResult);
      }
    }

    // Nothing has changed since the last check
    if (!differences.length) {
      // Reset the scrape failures
      if (item.scrapeFailures > 0) {
        item.scrapeFailures = 0;
        await item.save();
      }

      return;
    }

    const changesString = differences.reduce((acc, curr) => {
      if (typeof scrapeResult[curr] === "object") {
        if (curr === "sizes") {
          const oldSizes: string[] = item.metadata[curr];
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

      return `${acc}\n${capitalize(curr)}: ${item.metadata[curr]} -> ${
        scrapeResult[curr as keyof typeof scrapeResult]
      }`;
    }, "");

    const text = `${scrapeResult.name} has been updated. The following fields have changed:\n${changesString}\n\n${url}`;

    item.scrapeFailures = 0;
    // Update the item metadata
    item.metadata = scrapeResult;
    await item.save();

    // Notify the trackers
    this.notifyTrackers(item.trackers, text);
  }

  async handler() {
    this.logger.log("Control command received");
    const items = await this.itemsService.getItems();

    this.logger.log(`Checking ${items.length} items`);

    if (!items.length) return;

    const startTime = Date.now();

    // await Promise.all(items.map((item, i) => this.controlItem(item)));

    for (const item of items) {
      await this.controlItem(item);
    }

    this.logger.log(
      `${items.length} ${pluralify("item", "items", items.length)} checked in ${
        Date.now() - startTime
      }ms`
    );
  }
}
