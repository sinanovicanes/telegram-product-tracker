import { itemRepository } from "@/database";
import type { Item } from "@/database/entities";
import { Injectable } from "@app/common/decorators";
import { ScraperService } from "./scraper.service";
import { ZaraUrlParser } from "@/utils";

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

  async findItem(identifier: string): Promise<Item | null> {
    return itemRepository.findOne({
      where: {
        identifier
      }
    });
  }

  async createItem(identifier: string): Promise<Item> {
    const itemData = await this.scraperService.scrape(
      ZaraUrlParser.getUrlFromItemId(identifier)
    );

    if (!itemData) {
      throw new Error("Failed to scrape item data.");
    }

    const item = itemRepository.create({
      identifier,
      metadata: itemData
    });

    await item.save();

    return item;
  }

  async getOrCreateItem(identifier: string): Promise<Item> {
    let item = await this.findItem(identifier);

    if (!item) {
      item = await this.createItem(identifier);
    }

    return item;
  }

  async deleteItem(identifier: string): Promise<void> {
    await itemRepository.delete({ identifier });
  }
}
