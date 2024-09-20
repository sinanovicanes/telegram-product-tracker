import { ZaraService } from "@/services";
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
    private readonly zaraService: ZaraService
  ) {
    // Run every 30 minutes
    super("0 */30 * * * *");
  }

  async onSchedule() {
    const items = await this.itemsService.getItems();
    this.logger.log(`Checking ${items.length} items`);

    for (const item of items) {
      const itemData = await this.zaraService.getItemInfo(item.url).catch(() => null);

      if (!itemData) {
        this.logger.warn(`Item ${item.url} not found. Removing from database.`);
        this.itemsService.deleteItem(item.url);
        continue;
      }

      const differences: string[] = ["sizes"];

      // Compare the item data with the metadata
      for (const key in itemData) {
        const type = typeof itemData[key as keyof typeof itemData];
        const type2 = typeof item.metadata[key];

        if (type != type2) {
          differences.push(key);
          continue;
        }

        if (type === "object") {
          if (!isEqualObjects(itemData[key], item.metadata[key])) {
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
        if (typeof itemData[curr] === "object") {
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

        return `${acc}\n${capitalize(curr)}: ${item.metadata[curr]} -> ${itemData[curr]}`;
      }, "");

      const text = `${itemData.name} has been updated. The following fields have changed:\n${changesString}\n\n${item.url}`;

      // Update the item metadata
      item.metadata = itemData;
      await item.save();

      // Notify the subscribers
      for (const subscriber of item.subscribers) {
        // Notify the subscriber
        this.client.telegram.sendMessage(subscriber.user.id, text);
      }
    }
  }
}
