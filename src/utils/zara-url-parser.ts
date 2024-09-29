export namespace ZaraUrlParser {
  export function isValidUrl(url: string): boolean {
    return url.startsWith("https://www.zara.com/");
  }

  export function extractProductId(url: string): string {
    return (new URL(url).pathname.split("/").pop() ?? "").replace(".html", "");
  }

  export function getUrlFromProductId(productId: string): string {
    return `https://www.zara.com/tr/tr/${productId}.html`;
  }
}
