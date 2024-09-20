import { Command } from "@app/common/telegram";
import type { Context } from "telegraf";

export class PingCommand extends Command {
  constructor() {
    super({
      name: "ping",
      description: "Replies with pong"
    });
  }

  async handler(ctx: Context) {
    ctx.reply("Pong!");
  }
}
