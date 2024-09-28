import { BRAND } from "@/enums";
import { PullAndBearUrlParser } from "./pull-and-bear-url-parser";
import { ZaraUrlParser } from "./zara-url-parser";
import type { Item } from "@/database/entities";

export namespace UrlParser {
  export function isValidUrl(url: string): boolean {
    return ZaraUrlParser.isValidUrl(url) || PullAndBearUrlParser.isValidUrl(url);
  }

  export function getBrandFromUrl(url: string): BRAND | null {
    if (ZaraUrlParser.isValidUrl(url)) {
      return BRAND.ZARA;
    }

    if (PullAndBearUrlParser.isValidUrl(url)) {
      return BRAND.PULL_AND_BEAR;
    }

    return null;
  }

  export function extractItemId(url: string): string | null {
    const brand = getBrandFromUrl(url);

    switch (brand) {
      case BRAND.ZARA:
        return ZaraUrlParser.extractItemId(url);
      case BRAND.PULL_AND_BEAR:
        return PullAndBearUrlParser.extractItemId(url);
      default:
        return null;
    }
  }

  export function getUrlFromItemId(brand: BRAND, itemId: string): string {
    switch (brand) {
      case BRAND.ZARA:
        return ZaraUrlParser.getUrlFromItemId(itemId);
      case BRAND.PULL_AND_BEAR:
        return PullAndBearUrlParser.getUrlFromItemId(itemId);
      default:
        return null;
    }
  }

  export function getUrlFromItem(item: Item): string {
    return getUrlFromItemId(item.brand, item.identifier);
  }
}
