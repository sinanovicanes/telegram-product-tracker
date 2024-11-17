import { ScraperError } from "@/errors";
import type { ScrapeResult } from "@/services";
import { Scraper } from "./scraper";

export class ZaraScraper extends Scraper {
  async scrape(): Promise<ScrapeResult> {
    await this.goto();

    const name = await this.getTextContent(".product-detail-info__header-name");
    const price = await this.getTextContent(".money-amount__main");
    const sizes = await this.page.$$eval(
      ".size-selector-sizes__size:not(.size-selector-sizes__size--disabled) .size-selector-sizes-size__label",
      els => els.map(el => el.textContent)
    );

    if (!name || !price) {
      throw new ScraperError(ZaraScraper);
    }

    return {
      name,
      price,
      sizes
    };
  }
}
