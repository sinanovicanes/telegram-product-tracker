import { BRAND } from "@/enums";
import { PullAndBearUrlParser } from "./pull-and-bear-url-parser";
import { ZaraUrlParser } from "./zara-url-parser";
import type { Product } from "@/database/entities";

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

  export function extractProductId(url: string): string | null {
    const brand = getBrandFromUrl(url);

    switch (brand) {
      case BRAND.ZARA:
        return ZaraUrlParser.extractProductId(url);
      case BRAND.PULL_AND_BEAR:
        return PullAndBearUrlParser.extractProductId(url);
      default:
        return null;
    }
  }

  export function getUrlFromProductId(brand: BRAND, productId: string): string {
    switch (brand) {
      case BRAND.ZARA:
        return ZaraUrlParser.getUrlFromProductId(productId);
      case BRAND.PULL_AND_BEAR:
        return PullAndBearUrlParser.getUrlFromProductId(productId);
      default:
        return null;
    }
  }

  export function getUrlFromProduct(product: Product): string {
    return getUrlFromProductId(product.brand, product.identifier);
  }
}
