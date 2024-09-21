export class ScraperError extends Error {
  constructor(private readonly scraper: Function) {
    super(`Failed to scrape ${scraper.name}`);
    this.name = "ScraperError";
  }
}
