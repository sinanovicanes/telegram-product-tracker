import { Injectable } from "@app/common/decorators";
import { ItemsService } from "./items.service";
import { trackerRepository } from "@/database";

@Injectable()
export class TrackerService {
  constructor(private readonly itemsService: ItemsService) {}

  async getTrackedItems(userId: string) {
    const trackedItems = await trackerRepository.find({
      select: {
        item: {
          url: true,
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

  async track(userId: string, url: string) {
    const item = await this.itemsService.getOrCreateItem(url);

    const tracker = await trackerRepository.insert({
      user: { id: userId },
      item: { id: item.id }
    });

    return tracker;
  }

  async untrack(userId: string, url: string) {
    const item = await this.itemsService.findItem(url);

    if (!item) {
      return;
    }

    await trackerRepository.delete({
      user: { id: userId },
      item: { id: item.id }
    });
  }
}
