import { ScraperError } from "@/errors";
import { TrackerService } from "@/services";
import { ZaraUrlParser } from "@/utils";
import { Injectable } from "@app/common/decorators";
import { Command } from "@app/common/telegram";
import { getCommandArgsFromRawText } from "@app/common/utils";
import type { Context } from "telegraf";

@Injectable()
export class TrackCommand extends Command {
  constructor(private readonly trackerService: TrackerService) {
    super({
      name: "track",
      description: "Track item"
    });
  }

  async handler(ctx: Context) {
    const [targetURL] = getCommandArgsFromRawText(ctx.text ?? "");

    // TODO: Implement a better URL validation
    if (!targetURL) {
      return ctx.reply("Please provide a URL to track.");
    }

    const isZaraUrl = ZaraUrlParser.isZaraUrl(targetURL);

    if (!isZaraUrl) {
      return ctx.reply("Please provide a valid URL to track.");
    }

    const itemId = ZaraUrlParser.extractItemId(targetURL);
    const userId = ctx.from.id.toString();

    try {
      await this.trackerService.track(userId, itemId);
      return ctx.reply("You have successfully start tracking the item!");
    } catch (error) {
      if (error instanceof ScraperError) {
        return ctx.reply("An error occurred while retrieving item data.");
      }

      // TODO: Implement a better error handling
      // Duplicate key error code
      if (typeof error == "object" && "code" in error && error.code === "23505") {
        return ctx.reply("You are already tracking this item.");
      }

      return ctx.reply(`${error}`);
      // return ctx.reply("An error occurred while trying to track the item.");
    }
  }
}
