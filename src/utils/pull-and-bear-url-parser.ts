export namespace PullAndBearUrlParser {
  export function isValidUrl(url: string): boolean {
    return url.startsWith("https://www.pullandbear.com/");
  }

  export function extractProductId(url: string): string {
    return new URL(url).pathname.split("/").pop() ?? "";
  }

  export function getUrlFromProductId(productId: string): string {
    return `https://www.pullandbear.com/tr/${productId}`;
  }
}
