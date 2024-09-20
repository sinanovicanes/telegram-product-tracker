import { itemRepository } from "@/database";
import { Injectable } from "@app/common/decorators";
import { ZaraService } from "./zara.service";
import type { Item } from "@/database/entities";

@Injectable()
export class ItemsService {
  constructor(private readonly zaraService: ZaraService) {}

  getItems(): Promise<Item[]> {
    return itemRepository.find({
      relations: {
        subscribers: {
          user: true
        }
      }
    });
  }

  async findItem(url: string): Promise<Item | null> {
    return itemRepository.findOne({
      where: {
        url
      }
    });
  }

  async createItem(url: string): Promise<Item> {
    const itemData = await this.zaraService.getItemInfo(url);
    const item = itemRepository.create({
      url,
      metadata: itemData
    });

    await item.save();

    return item;
  }

  async getOrCreateItem(url: string): Promise<Item> {
    let item = await this.findItem(url);

    if (!item) {
      item = await this.createItem(url);
    }

    return item;
  }

  async deleteItem(url: string): Promise<void> {
    await itemRepository.delete({ url });
  }
}
