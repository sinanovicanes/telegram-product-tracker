import { ScraperService } from "@/services";
import { ItemsService } from "@/services/items.service";
import { Injectable } from "@app/common/decorators";
import { Schedule } from "@app/common/telegram";
import { TelegramClient } from "@app/common/telegram/client";
import { capitalize, isEqualObjects } from "@app/common/utils";

@Injectable()
export class ItemControlSchedule extends Schedule {
  name = "item-control-schedule";

  constructor(
    private readonly client: TelegramClient,
    private readonly itemsService: ItemsService,
    private readonly scraperService: ScraperService
  ) {
    // Run every 30 minutes
    super("0 */30 * * * *");
  }

  async onSchedule() {
    const items = await this.itemsService.getItems();
    this.logger.log(`Checking ${items.length} items`);

    if (!items.length) return;

    const results = await this.scraperService.scrapeMany(items.map(item => item.url));

    let i = 0;

    for (const item of items) {
      const itemData = results[i];
      i++;

      if (!itemData) {
        this.logger.warn(`Item ${item.url} not found. Removing from database.`);
        this.itemsService.deleteItem(item.url);
        continue;
      }

      const differences: string[] = [];

      // Compare the item data with the metadata
      for (const key in itemData) {
        const type = typeof itemData[key as keyof typeof itemData];
        const type2 = typeof item.metadata[key];

        if (type != type2) {
          differences.push(key);
          continue;
        }

        if (type === "object") {
          if (
            !isEqualObjects(
              itemData[key as keyof typeof itemData] as Object,
              item.metadata[key]
            )
          ) {
            differences.push(key);
          }
          continue;
        }

        if (itemData[key as keyof typeof itemData] != item.metadata[key]) {
          differences.push(key);
        }
      }

      // If there are no differences, skip the item
      if (!differences.length) {
        continue;
      }

      const changesString = differences.reduce((acc, curr) => {
        if (typeof itemData[curr as keyof typeof itemData] === "object") {
          if (curr === "sizes") {
            const oldSizes: string[] = item.metadata[curr];
            const newSizes: string[] = itemData[curr];
            const addedSizes = newSizes.filter(size => !oldSizes.includes(size));
            const removedSizes = oldSizes.filter(size => !newSizes.includes(size));

            acc = addedSizes.reduce((acc, size) => {
              return `${acc}\nSize ${size} -> ✅`;
            }, acc);

            acc = removedSizes.reduce((acc, size) => {
              return `${acc}\nSize ${size} -> ❌`;
            }, acc);

            return acc;
          }

          return `${acc}\n${capitalize(curr)}`;
        }

        return `${acc}\n${capitalize(curr)}: ${item.metadata[curr]} -> ${
          itemData[curr as keyof typeof itemData]
        }`;
      }, "");

      const text = `${itemData.name} has been updated. The following fields have changed:\n${changesString}\n\n${item.url}`;

      // Update the item metadata
      item.metadata = itemData;
      await item.save();

      // Notify the trackers
      for (const tracker of item.trackers) {
        this.client.telegram.sendMessage(tracker.user.id, text);
      }
    }
  }
}
