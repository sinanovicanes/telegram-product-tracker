import { ScraperError } from "@/errors";
import type { ScrapeResult } from "@/services";
import { delay } from "@app/common/utils";
import { Page } from "puppeteer";

export class ZaraScraper {
  static async takeScreenshot(page: Page, url: string): Promise<Uint8Array> {
    await page.goto(url);

    await delay(20 * 1000);

    return await page.screenshot();
  }

  static async scrape(page: Page, url: string): Promise<ScrapeResult> {
    await page.goto(url);

    await page.waitForSelector(".product-detail-info__header-name");

    const name = await page.$eval(
      ".product-detail-info__header-name",
      el => el.textContent
    );
    const price = await page.$eval(".money-amount__main", el => el.textContent);
    const sizes = await page.$$eval(
      ".size-selector-list__item:not(.size-selector-list__item--out-of-stock) .product-size-info__main-label",
      els => els.map(el => el.textContent)
    );

    if (!name || !price) {
      throw new ScraperError(this);
    }

    return {
      name,
      price,
      sizes
    };
  }
}
