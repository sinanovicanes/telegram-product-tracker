import { trackerRepository } from "@/database";
import { Injectable } from "@app/common/decorators";
import { ItemsService } from "./items.service";

@Injectable()
export class TrackerService {
  constructor(private readonly itemsService: ItemsService) {}

  async getTrackedItems(userId: string) {
    const trackedItems = await trackerRepository.find({
      select: {
        item: {
          identifier: true,
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
        item: true
      }
    });

    return trackedItems.map(tracker => tracker.item);
  }

  async track(userId: string, itemIdentifier: string) {
    const item = await this.itemsService.getOrCreateItem(itemIdentifier);

    const tracker = await trackerRepository.insert({
      user: { id: userId },
      item: { id: item.id }
    });

    return tracker;
  }

  async untrack(userId: string, itemIdentifier: string) {
    const item = await this.itemsService.findItem(itemIdentifier);

    if (!item) {
      return;
    }

    await trackerRepository.delete({
      user: { id: userId },
      item: { id: item.id }
    });
  }
}
