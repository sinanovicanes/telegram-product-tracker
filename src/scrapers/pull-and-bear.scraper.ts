import { ScraperError } from "@/errors";
import type { ScrapeResult } from "@/services";
import { Scraper } from "./scraper";

export class PullAndBearScraper extends Scraper {
  async scrape(): Promise<ScrapeResult> {
    await this.page.goto(this.url);

    const name = await this.getTextContent(".c-product-info--header #titleProductCard");
    const price = await this.getTextContent(".c-product-info--header .number");

    console.log(price);

    await this.takeScreenshot();

    await this.page.waitForSelector(".size-list-select");

    const sizes = await this.page.$$eval(
      ".size-list-select .size-list .size:not(.is-disabled) .name",
      els => els.map(el => el.textContent)
    );

    console.log(name, price, sizes);

    if (!name || !price) {
      throw new ScraperError(PullAndBearScraper);
    }

    return {
      name,
      price,
      sizes
    };
  }
}
