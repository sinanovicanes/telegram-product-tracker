import { ScraperError } from "@/errors";
import type { ScrapeResult } from "@/services";
import { Scraper } from "./scraper";

export class ZaraScraper extends Scraper {
  async scrape(): Promise<ScrapeResult> {
    await this.goto();

    const name = await this.getTextContent(".product-detail-info__header-name");
    const price = await this.getTextContent(".money-amount__main");

    // Open size selector
    await this.page.click(
      "#main > div > div > div.product-detail-view__main-content > div > div > div.product-detail-size-selector-std.product-detail-info__size-selector > div > div.product-detail-cart-buttons__main-action > button"
    );

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
