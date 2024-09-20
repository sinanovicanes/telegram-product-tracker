import { ZaraItemScraper } from "@/scrapers";
import { Injectable } from "@app/common/decorators";

@Injectable()
export class ZaraService {
  async getItemInfo(url: string) {
    const scraper = new ZaraItemScraper(url);

    return await scraper.scrape();
  }
}
