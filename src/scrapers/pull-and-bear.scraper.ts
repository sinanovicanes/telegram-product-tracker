import { ScraperError } from "@/errors";
import type { ScrapeResult } from "@/services";
import { Scraper } from "./scraper";

export class PullAndBearScraper extends Scraper {
  async scrape(): Promise<ScrapeResult> {
    await this.page.goto(this.url);

    const name = await this.getTextContent(".c-product-info--header #titleProductCard");
    const price = await this.getTextContent(".c-product-info--header .number");
    const sizes = (await this.getTextContentFromNestedShadowDOM(
      [
        "#productCard > div > div > div.c-product-info--size > size-selector-with-length",
        "size-selector-select",
        "div > div.size-list-select > size-list"
      ],
      "button:not(.is-disabled) .name",
      true
    )) as string[];

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
