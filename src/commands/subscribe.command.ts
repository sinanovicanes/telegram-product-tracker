import { ScraperError } from "@/errors";
import { SubscriptionService } from "@/services/subscription.service";
import { Injectable } from "@app/common/decorators";
import { Command } from "@app/common/telegram";
import { getCommandArgsFromRawText } from "@app/common/utils";
import { isURL } from "class-validator";
import type { Context } from "telegraf";

@Injectable()
export class SubscribeCommand extends Command {
  constructor(private readonly subscriptionService: SubscriptionService) {
    super({
      name: "subscribe",
      description: "Subscribe command"
    });
  }

  async handler(ctx: Context) {
    const [targetURL] = getCommandArgsFromRawText(ctx.text ?? "");

    // TODO: Implement a better URL validation
    if (!targetURL || !isURL(targetURL)) {
      if (!targetURL.startsWith("https://www.zara.com/tr/tr/")) {
        return ctx.reply("Please provide a valid Zara URL to subscribe to.");
      }
      return ctx.reply("Please provide a valid URL to subscribe to.");
    }

    const userId = ctx.from!.id.toString();

    try {
      await this.subscriptionService.subscribe(userId, targetURL);
      return ctx.reply("You have successfully subscribed to the item!");
    } catch (error) {
      if (error instanceof ScraperError) {
        return ctx.reply("An error occurred while retrieving item data.");
      }

      // TODO: Implement a better error handling
      // Duplicate key error code
      if (typeof error == "object" && "code" in error && error.code === "23505") {
        return ctx.reply("You are already subscribed to this item.");
      }
      return ctx.reply("An error occurred while trying to subscribe to the item.");
    }
  }
}
