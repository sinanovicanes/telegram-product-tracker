import { SubscriptionService } from "@/services/subscription.service";
import { Injectable } from "@app/common/decorators";
import { Command } from "@app/common/telegram";
import { getCommandArgsFromRawText } from "@app/common/utils";
import { isURL } from "class-validator";
import type { Context } from "telegraf";

@Injectable()
export class UnsubscribeCommand extends Command {
  constructor(private readonly subscriptionService: SubscriptionService) {
    super({
      name: "unsubscribe",
      description: "Unsubscribe command"
    });
  }

  async handler(ctx: Context) {
    const [targetURL] = getCommandArgsFromRawText(ctx.text ?? "");

    // TODO: Implement a better URL validation
    if (!targetURL) {
      return ctx.reply("Please provide a URL to unsubscribe to.");
    }

    if (!isURL(targetURL) || !targetURL.startsWith("https://www.zara.com/tr/tr/")) {
      return ctx.reply("Please provide a valid URL to unsubscribe to.");
    }

    const userId = ctx.from!.id.toString();

    try {
      await this.subscriptionService.unsubscribe(userId, targetURL);
      return ctx.reply("You have successfully unsubscribed from the item!");
    } catch (error) {
      return ctx.reply(
        "An error occurred while trying to unsubscribe to the item. Maybe you are not subscribed to this item."
      );
    }
  }
}
