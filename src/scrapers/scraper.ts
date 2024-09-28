import type { ScrapeResult } from "@/services";
import type { Page, ScreenshotOptions } from "puppeteer";

export class Scraper {
  constructor(protected readonly page: Page, protected readonly url: string) {}

  protected async goto(url = this.url): Promise<void> {
    await this.page.goto(url);
  }

  protected async getTextContent(selector: string): Promise<string> {
    await this.page.waitForSelector(selector);

    return await this.page.$eval(selector, el => el.textContent.trim());
  }

  protected async getTextContentFromShadowDOM(
    selector: string,
    shadowRootSelector: string
  ): Promise<string> {
    await this.page.waitForSelector(selector);

    return await this.page.$eval(
      selector,
      (el, shadowRootSelector) => {
        const shadowRoot = el.shadowRoot;
        if (!shadowRoot) {
          throw new Error("Shadow DOM not found");
        }

        return shadowRoot.querySelector(shadowRootSelector).textContent.trim();
      },
      shadowRootSelector
    );
  }

  async takeScreenshot(options?: Readonly<ScreenshotOptions>): Promise<Uint8Array> {
    return await this.page.screenshot(options);
  }

  async scrape(): Promise<ScrapeResult> {
    throw new Error("Method not implemented.");
  }
}
