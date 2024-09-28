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

  protected async getTextContentFromNestedShadowDOM(
    shadowRootSelectors: string[], // Array of shadow root selectors for nested traversal
    selector: string,
    selectAll = false
  ): Promise<string | string[]> {
    // Ensure the first shadow root host exists
    await this.page.waitForSelector(shadowRootSelectors[0]);

    return await this.page.$eval(
      shadowRootSelectors[0],
      (el, shadowRootSelectors, selector, selectAll) => {
        // Recursive function to traverse nested shadow roots
        const getShadowElement = (element: Element, selectors: string[]): Element => {
          if (!selectors.length) return element;
          const nextShadowHost = element.shadowRoot?.querySelector(selectors[0]);
          if (!nextShadowHost || !nextShadowHost.shadowRoot) {
            throw new Error(`Shadow DOM not found for selector: ${selectors[0]}`);
          }
          return getShadowElement(nextShadowHost, selectors.slice(1)); // Recurse deeper
        };

        // Traverse nested shadow roots
        const finalShadowElement = getShadowElement(el, shadowRootSelectors.slice(1)); // Slice to skip the first, as it's already passed

        if (selectAll) {
          return Array.from(finalShadowElement.shadowRoot.querySelectorAll(selector)).map(
            el => el.textContent?.trim() || ""
          );
        }

        const targetElement = finalShadowElement.shadowRoot.querySelector(selector);
        if (!targetElement) {
          throw new Error(`Element with selector '${selector}' not found in shadow DOM`);
        }

        return targetElement.textContent?.trim() || "";
      },
      shadowRootSelectors,
      selector,
      selectAll
    );
  }

  async takeScreenshot(options?: Readonly<ScreenshotOptions>): Promise<Uint8Array> {
    return await this.page.screenshot(options);
  }

  async scrape(): Promise<ScrapeResult> {
    throw new Error("Method not implemented.");
  }
}
