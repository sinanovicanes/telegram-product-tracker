import { SubscriptionService } from "@/services/subscription.service";
import { Cooldown, Injectable } from "@app/common/decorators";
import { Command } from "@app/common/telegram";
import { pluralify } from "@app/common/utils";
import type { Context } from "telegraf";

@Injectable()
@Cooldown(10 * 1000)
export class SubscriptionsCommand extends Command {
  constructor(private readonly subscriptionService: SubscriptionService) {
    super({
      name: "subscriptions",
      description: "Returns the list of items you're subscribed to."
    });
  }

  async handler(ctx: Context) {
    const userId = ctx.from?.id.toString();

    if (!userId) {
      return;
    }

    const subscriptions = await this.subscriptionService.getSubscribedItems(userId);

    if (!subscriptions.length) {
      return await ctx.reply("You are not subscribed to any items.");
    }

    const replies = subscriptions.map(subscription =>
      ctx.reply(
        `Name: ${subscription.metadata.name}\nPrice: ${subscription.metadata.price}\n\n${subscription.url}`
      )
    );

    replies.push(
      ctx.reply(
        `You are subscribed to ${subscriptions.length} ${pluralify(
          "item",
          "items",
          subscriptions.length
        )}.`
      )
    );

    await Promise.all(replies);
  }
}
