import { MERCHANT } from "@/enums";
import { PullAndBearUrlParser } from "./pull-and-bear-url-parser";
import { ZaraUrlParser } from "./zara-url-parser";
import type { Product } from "@/database/entities";
import { OyshoUrlParser } from "./oysho-url-parser";

export namespace UrlParser {
  export function isValidUrl(url: string): boolean {
    return (
      ZaraUrlParser.isValidUrl(url) ||
      PullAndBearUrlParser.isValidUrl(url) ||
      OyshoUrlParser.isValidUrl(url)
    );
  }

  export function getMerchantFromUrl(url: string): MERCHANT | null {
    if (ZaraUrlParser.isValidUrl(url)) {
      return MERCHANT.ZARA;
    }

    if (PullAndBearUrlParser.isValidUrl(url)) {
      return MERCHANT.PULL_AND_BEAR;
    }

    if (OyshoUrlParser.isValidUrl(url)) {
      return MERCHANT.OYSHO;
    }

    return null;
  }

  export function extractProductId(url: string): string | null {
    const merchant = getMerchantFromUrl(url);

    switch (merchant) {
      case MERCHANT.ZARA:
        return ZaraUrlParser.extractProductId(url);
      case MERCHANT.PULL_AND_BEAR:
        return PullAndBearUrlParser.extractProductId(url);
      case MERCHANT.OYSHO:
        return OyshoUrlParser.extractProductId(url);
      default:
        return null;
    }
  }

  export function getUrlFromProductId(merchant: MERCHANT, productId: string): string {
    switch (merchant) {
      case MERCHANT.ZARA:
        return ZaraUrlParser.getUrlFromProductId(productId);
      case MERCHANT.PULL_AND_BEAR:
        return PullAndBearUrlParser.getUrlFromProductId(productId);
      case MERCHANT.OYSHO:
        return OyshoUrlParser.getUrlFromProductId(productId);
      default:
        return null;
    }
  }

  export function getUrlFromProduct(product: Product): string {
    return getUrlFromProductId(product.merchant, product.identifier);
  }
}
