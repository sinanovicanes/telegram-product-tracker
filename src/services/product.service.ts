import { productRepository } from "@/database";
import type { Product } from "@/database/entities";
import { Injectable } from "@app/common/decorators";
import { ScraperService } from "./scraper.service";
import { UrlParser } from "@/utils";
import type { MERCHANT } from "@/enums";

@Injectable()
export class ProductService {
  constructor(private readonly scraperService: ScraperService) {}

  getAll(): Promise<Product[]> {
    return productRepository.find({
      relations: {
        trackers: {
          user: true
        }
      }
    });
  }

  async findOne(identifier: string): Promise<Product | null> {
    return productRepository.findOne({
      where: {
        identifier
      }
    });
  }

  async create(merchant: MERCHANT, identifier: string): Promise<Product> {
    const metadata = await this.scraperService.scrape(
      UrlParser.getUrlFromProductId(merchant, identifier)
    );

    if (!metadata) {
      throw new Error("Failed to scrape product data.");
    }

    const product = productRepository.create({
      identifier,
      merchant: merchant,
      metadata
    });

    await product.save();

    return product;
  }

  async getOrCreate(url: string): Promise<Product> {
    const identifier = UrlParser.extractProductId(url);

    if (!identifier) {
      throw new Error("Failed to extract product ID.");
    }

    let product = await this.findOne(identifier);

    if (!product) {
      const merchant = UrlParser.getMerchantFromUrl(url);
      product = await this.create(merchant, identifier);
    }

    return product;
  }

  async delete(identifier: string): Promise<void> {
    await productRepository.delete({ identifier });
  }

  async ensureTrackers(productId: number): Promise<void> {
    const product = await productRepository.findOne({
      where: { id: productId },
      relations: {
        trackers: {}
      }
    });

    if (!product) return;

    if (product.trackers.length === 0) {
      await productRepository.delete({ id: productId });
    }
  }
}
