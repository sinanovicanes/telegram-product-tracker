import { TrackerService } from "@/services";
import { UrlParser } from "@/utils";
import { Injectable } from "@app/common/decorators";
import { Command } from "@app/common/telegram";
import { getCommandArgsFromRawText } from "@app/common/utils";
import type { Context } from "telegraf";

@Injectable()
export class UntrackCommand extends Command {
  constructor(private readonly trackerService: TrackerService) {
    super({
      name: "untrack",
      description: "Untrack the product"
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
      await this.trackerService.untrack(userId, productId);
      return ctx.reply("You have successfully untracked the product!");
    } catch (error) {
      return ctx.reply(
        "An error occurred while trying to untracking the product. Maybe you are not tracking this product."
      );
    }
  }
}
