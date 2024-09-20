import { Injectable } from "@app/common/decorators";
import { ItemsService } from "./items.service";
import { subscriptionRepository } from "@/database";

@Injectable()
export class SubscriptionService {
  constructor(private readonly itemsService: ItemsService) {}

  async subscribe(userId: string, url: string) {
    const item = await this.itemsService.getOrCreateItem(url);

    const subscription = await subscriptionRepository.insert({
      user: { id: userId },
      item: { id: item.id },
      metadata: {}
    });

    return subscription;
  }

  async unsubscribe(userId: string, url: string) {
    const item = await this.itemsService.findItem(url);

    if (!item) {
      return;
    }

    await subscriptionRepository.delete({
      user: { id: userId },
      item: { id: item.id }
    });
  }
}
