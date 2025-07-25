import { ScraperError } from "@/errors";
import { TrackerService } from "@/services";
import { UrlParser } from "@/utils";
import { Injectable } from "@app/common/decorators";
import { Command } from "@app/common/telegram";
import { getCommandArgsFromRawText } from "@app/common/utils";
import type { Context } from "telegraf";

@Injectable()
export class TrackCommand extends Command {
  constructor(private readonly trackerService: TrackerService) {
    super({
      name: "track",
      description: "Track product"
    });
  }

  async handler(ctx: Context) {
    const [url] = getCommandArgsFromRawText(ctx.text ?? "");

    // TODO: Implement a better URL validation
    if (!url) {
      return ctx.reply("Please provide a URL to track.");
    }

    if (!UrlParser.isValidUrl(url)) {
      return ctx.reply("Please provide a valid URL to track.");
    }

    const productId = UrlParser.extractProductId(url);

    if (!productId) {
      return ctx.reply("An error occurred while extracting product ID.");
    }

    const userId = ctx.from.id.toString();

    try {
      await this.trackerService.track(userId, url);
      return ctx.reply("You have successfully start tracking the product!");
    } catch (error) {
      if (error instanceof ScraperError) {
        return ctx.reply("An error occurred while retrieving product data.");
      }

      // TODO: Implement a better error handling
      // Duplicate key error code
      if (typeof error == "object" && "code" in error && error.code === "23505") {
        return ctx.reply("You are already tracking this product.");
      }

      return ctx.reply("An error occurred while trying to track the product.");
    }
  }
}
