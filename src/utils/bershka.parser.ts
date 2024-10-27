export namespace BershkaUrlParser {
  export function isValidUrl(url: string): boolean {
    return url.startsWith("https://www.bershka.com/");
  }

  export function extractProductId(url: string): string {
    return new URL(url).pathname.split("/").pop()?.replace(".html", "") ?? "";
  }

  export function getUrlFromProductId(productId: string): string {
    return `https://www.bershka.com/tr/${productId}.html`;
  }
}
