import { ZaraScraper } from "@/scrapers";
import { Injectable } from "@app/common/decorators";
import { delay, getRandomUserAgent } from "@app/common/utils";
import { Cluster } from "puppeteer-cluster";

export interface ScrapeResult {
  name: string;
  price: string;
  sizes: string[];
}

@Injectable()
export class ScraperService {
  private cluster: Cluster<string, ScrapeResult>;

  constructor() {
    this.initialize();
  }

  async initialize() {
    this.cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_CONTEXT,
      maxConcurrency: 2,
      puppeteerOptions: {
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        headless: "shell"
      }
    });

    this.cluster.task(async ({ page, data: url }) => {
      try {
        const userAgent = getRandomUserAgent();

        await page.setUserAgent(userAgent);

        return await ZaraScraper.scrape(page, url);
      } catch {
        return null;
      }
    });
  }

  private async waitForInitialization() {
    while (!this.cluster) {
      await delay(100);
    }
  }

  async scrapeMany(urls: string[]): Promise<ScrapeResult[]> {
    if (!this.cluster) {
      await this.waitForInitialization();
    }

    return Promise.all(urls.map(url => this.scrape(url)));
  }

  async scrape(url: string): Promise<ScrapeResult> {
    if (!this.cluster) {
      await this.waitForInitialization();
    }

    return this.cluster.execute(url);
  }
}
