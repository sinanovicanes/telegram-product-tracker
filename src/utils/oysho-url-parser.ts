export namespace OyshoUrlParser {
  export function isValidUrl(url: string): boolean {
    return url.startsWith("https://www.oysho.com/");
  }

  export function extractProductId(url: string): string {
    return new URL(url).pathname.split("/").pop() ?? "";
  }

  export function getUrlFromProductId(productId: string): string {
    return `https://www.oysho.com/tr/${productId}`;
  }
}
