import { fetch } from "bun";
import * as cheerio from "cheerio";

interface ZaraItemResult {
  name: string;
  price: string;
  sizes: string[];
}

export class ZaraItemScraper {
  constructor(private readonly url: string) {}

  async scrape(): Promise<ZaraItemResult> {
    const response = await fetch(this.url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const name = $(".product-detail-info__header-name").text();
    const price = $(".money-amount__main").text();
    const sizes = $(
      ".size-selector-list__item:not(.size-selector-list__item--out-of-stock) .product-size-info__main-label"
    )
      .map((_, el) => $(el).text())
      .get();

    return {
      name,
      price,
      sizes
    };
  }
}
