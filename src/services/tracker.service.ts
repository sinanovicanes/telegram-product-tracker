import { trackerRepository } from "@/database";
import { Injectable } from "@app/common/decorators";
import { ProductService } from "./product.service";

@Injectable()
export class TrackerService {
  constructor(private readonly productService: ProductService) {}

  async getTrackedProducts(userId: string) {
    const trackedProducts = await trackerRepository.find({
      select: {
        product: {
          identifier: true,
          brand: true,
          metadata: {
            name: true,
            price: true,
            image: true
          }
        }
      },
      where: {
        user: { id: userId }
      },
      relations: {
        product: true
      }
    });

    return trackedProducts.map(tracker => tracker.product);
  }

  async track(userId: string, url: string) {
    const product = await this.productService.getOrCreate(url);

    const tracker = await trackerRepository.insert({
      user: { id: userId },
      product: { id: product.id }
    });

    return tracker;
  }

  async untrack(userId: string, productIdentifier: string) {
    const product = await this.productService.findOne(productIdentifier);

    if (!product) return;

    await trackerRepository.delete({
      user: { id: userId },
      product: { id: product.id }
    });

    // TODO: Add event bus to handle this type of things
    this.productService.ensureTrackers(product.id);
  }
}
