import { itemRepository } from "@/database";
import type { Item } from "@/database/entities";
import { Injectable } from "@app/common/decorators";
import { ScraperService } from "./scraper.service";

@Injectable()
export class ItemsService {
  constructor(private readonly scraperService: ScraperService) {}

  getItems(): Promise<Item[]> {
    return itemRepository.find({
      relations: {
        trackers: {
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
    const itemData = await this.scraperService.scrape(url);
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
