import { ScraperError } from "@/errors";
import type { ScrapeResult } from "@/services";
import { Scraper } from "./scraper";

export class OyshoScraper extends Scraper {
  async scrape(): Promise<ScrapeResult> {
    await this.page.goto(this.url);

    const name = await this.getTextContent(".product-info__name");
    const price = await this.getTextContent(".multi-currency-wrapper__price");
    const sizes = await this.page.$$eval(".sizes__list-size-name", els =>
      els.map(el => el.textContent.trim())
    );

    if (!name || !price) {
      throw new ScraperError(OyshoScraper);
    }

    return {
      name,
      price,
      sizes
    };
  }
}
