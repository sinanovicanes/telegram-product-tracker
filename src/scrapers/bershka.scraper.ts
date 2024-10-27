import { ScraperError } from "@/errors";
import type { ScrapeResult } from "@/services";
import { Scraper } from "./scraper";

export class BershkaScraper extends Scraper {
  async scrape(): Promise<ScrapeResult> {
    await this.page.goto(this.url);

    const name = await this.getTextContent(".product-detail-info-layout__title");
    const price = await this.getTextContent(".current-price-elem");
    const sizes = await this.page.$$eval("[data-qa-anchor='sizeListItem']", els =>
      els.map(el => el.textContent.trim())
    );

    if (!name || !price) {
      throw new ScraperError(BershkaScraper);
    }

    return {
      name,
      price,
      sizes
    };
  }
}
