import { TrackerService } from "@/services";
import { Injectable } from "@app/common/decorators";
import { Command } from "@app/common/telegram";
import { getCommandArgsFromRawText } from "@app/common/utils";
import { isURL } from "class-validator";
import type { Context } from "telegraf";

@Injectable()
export class UntrackCommand extends Command {
  constructor(private readonly trackerService: TrackerService) {
    super({
      name: "untrack",
      description: "Untrack the item"
    });
  }

  async handler(ctx: Context) {
    const [targetURL] = getCommandArgsFromRawText(ctx.text ?? "");

    // TODO: Implement a better URL validation
    if (!targetURL) {
      return ctx.reply("Please provide a URL to untrack.");
    }

    if (!isURL(targetURL) || !targetURL.startsWith("https://www.zara.com/tr/tr/")) {
      return ctx.reply("Please provide a valid URL to untrack.");
    }

    const userId = ctx.from.id.toString();

    try {
      await this.trackerService.untrack(userId, targetURL);
      return ctx.reply("You have successfully untracked the item!");
    } catch (error) {
      return ctx.reply(
        "An error occurred while trying to untracking the item. Maybe you are not tracking this item."
      );
    }
  }
}
