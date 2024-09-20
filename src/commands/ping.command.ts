import { NotBotGuard } from "@/guards";
import { UseGuards } from "@app/common/decorators";
import { Command } from "@app/common/telegram";
import type { Context } from "telegraf";

@UseGuards(NotBotGuard)
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
