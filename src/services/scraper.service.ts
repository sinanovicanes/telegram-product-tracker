import { MERCHANT } from "@/enums";
import { PullAndBearScraper, ZaraScraper } from "@/scrapers";
import { BershkaScraper } from "@/scrapers/bershka.scraper";
import { OyshoScraper } from "@/scrapers/oysho.scraper";
import { UrlParser } from "@/utils";
import { Injectable } from "@app/common/decorators";
import { env } from "@app/common/env.validation";
import type { Page } from "puppeteer";
import { Cluster } from "puppeteer-cluster";

export interface ScrapeResult {
  name: string;
  price: string;
  sizes: string[];
}

@Injectable()
export class ScraperService {
  private cluster: Cluster<string, ScrapeResult | null | any>;
  private closeClusterTimeout: Timer | null = null;

  private createScraper(
    page: Page,
    url: string
  ): PullAndBearScraper | ZaraScraper | OyshoScraper | null {
    const merchant = UrlParser.getMerchantFromUrl(url);

    switch (merchant) {
      case MERCHANT.ZARA:
        return new ZaraScraper(page, url);
      case MERCHANT.PULL_AND_BEAR:
        return new PullAndBearScraper(page, url);
      case MERCHANT.OYSHO:
        return new OyshoScraper(page, url);
      case MERCHANT.BERSHKA:
        return new BershkaScraper(page, url);
      default:
        return null;
    }
  }

  async initialize() {
    if (this.closeClusterTimeout) {
      clearTimeout(this.closeClusterTimeout);
      this.closeClusterTimeout = null;
    }

    if (this.cluster) return;

    this.cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_BROWSER,
      maxConcurrency: env.SCRAPER_CONCURRENCY,
      puppeteerOptions: {
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
        headless: true,
        timeout: 120000,
        args: [
          "--no-sandbox",
          "--disable-dev-shm-usage"
          // "--disable-setuid-sandbox",
          // "--disable-gpu"
        ]
      }
    });

    await this.cluster.task(async ({ page, data: url }) => {
      try {
        await page.setViewport({ width: 1920, height: 1080 });
        await page.setUserAgent(
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.5845.96 Safari/537.36"
        );

        const scraper = this.createScraper(page, url);

        if (!scraper) {
          console.error("Scraper not found for url:", url);
          return null;
        }

        const result = await scraper.scrape();

        return result;
      } catch (e) {
        console.error(e);
        return null;
      } finally {
        this.closeCluster();
      }
    });
  }

  private async closeCluster() {
    if (this.closeClusterTimeout) {
      clearTimeout(this.closeClusterTimeout);
      this.closeClusterTimeout = null;
    }

    this.closeClusterTimeout = setTimeout(() => {
      this.cluster?.close();
      this.cluster = null;
      this.closeClusterTimeout = null;
    }, 5 * 60 * 1000);
  }

  async scrapeMany(urls: string[]): Promise<(ScrapeResult | null)[]> {
    await this.initialize();

    return Promise.all(urls.map(url => this.scrape(url)));
  }

  async scrape(url: string): Promise<ScrapeResult | null> {
    await this.initialize();

    return this.cluster.execute(url);
  }
}
