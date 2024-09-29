import { TrackerService } from "@/services";
import { UrlParser } from "@/utils";
import { Cooldown, Injectable } from "@app/common/decorators";
import { Command } from "@app/common/telegram";
import { pluralify } from "@app/common/utils";
import type { Context } from "telegraf";

@Injectable()
@Cooldown(10 * 1000)
export class TrackListCommand extends Command {
  constructor(private readonly trackerService: TrackerService) {
    super({
      name: "tracklist",
      description: "Returns the list of products you are tracking."
    });
  }

  async handler(ctx: Context) {
    const userId = ctx.from.id.toString();

    if (!userId) return;

    const trackedProducts = await this.trackerService.getTrackedProducts(userId);

    if (!trackedProducts.length) {
      return await ctx.reply("You are not tracking any products.");
    }

    const replies = trackedProducts.map(product =>
      ctx.reply(
        `Name: ${product.metadata.name}\nMerchant: ${product.brand}\nPrice: ${
          product.metadata.price
        }\n\n${UrlParser.getUrlFromProduct(product)}`
      )
    );

    await Promise.all(replies);

    await ctx.reply(
      `You are currently tracking ${trackedProducts.length} ${pluralify(
        "product",
        "products",
        trackedProducts.length
      )}.`
    );
  }
}
