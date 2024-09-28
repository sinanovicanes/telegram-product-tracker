import { itemRepository } from "@/database";
import type { Item } from "@/database/entities";
import { Injectable } from "@app/common/decorators";
import { ScraperService } from "./scraper.service";
import { UrlParser } from "@/utils";
import type { BRAND } from "@/enums";

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

  async createItem(brand: BRAND, identifier: string): Promise<Item> {
    const itemData = await this.scraperService.scrape(
      UrlParser.getUrlFromItemId(brand, identifier)
    );

    if (!itemData) {
      throw new Error("Failed to scrape item data.");
    }

    const item = itemRepository.create({
      identifier,
      brand,
      metadata: itemData
    });

    await item.save();

    return item;
  }

  async getOrCreateItem(url: string): Promise<Item> {
    const identifier = UrlParser.extractItemId(url);

    if (!identifier) {
      throw new Error("Failed to extract item ID.");
    }

    let item = await this.findItem(identifier);

    if (!item) {
      const brand = UrlParser.getBrandFromUrl(url);
      item = await this.createItem(brand, identifier);
    }

    return item;
  }

  async deleteItem(identifier: string): Promise<void> {
    await itemRepository.delete({ identifier });
  }

  async ensureTrackers(itemId: number): Promise<void> {
    const item = await itemRepository.findOne({
      where: { id: itemId },
      relations: {
        trackers: {}
      }
    });

    if (!item) return;

    if (item.trackers.length === 0) {
      await itemRepository.delete({ id: itemId });
    }
  }
}
