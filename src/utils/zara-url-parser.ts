export namespace ZaraUrlParser {
  export function isValidUrl(url: string): boolean {
    return url.startsWith("https://www.zara.com/");
  }

  export function extractItemId(url: string): string {
    return (new URL(url).pathname.split("/").pop() ?? "").replace(".html", "");
  }

  export function getUrlFromItemId(itemId: string): string {
    return `https://www.zara.com/tr/tr/${itemId}.html`;
  }
}
