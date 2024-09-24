import { TrackerService } from "@/services";
import { ZaraUrlParser } from "@/utils";
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
      description: "Returns the list of items you're tracking."
    });
  }

  async handler(ctx: Context) {
    const userId = ctx.from.id.toString();

    if (!userId) return;

    const trackedItems = await this.trackerService.getTrackedItems(userId);

    if (!trackedItems.length) {
      return await ctx.reply("You are not tracking any items.");
    }

    const replies = trackedItems.map(item =>
      ctx.reply(
        `Name: ${item.metadata.name}\nPrice: ${
          item.metadata.price
        }\n\n${ZaraUrlParser.getUrlFromItemId(item.identifier)}`
      )
    );

    await Promise.all(replies);

    await ctx.reply(
      `You are currently tracking ${trackedItems.length} ${pluralify(
        "item",
        "items",
        trackedItems.length
      )}.`
    );
  }
}
