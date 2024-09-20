import { Command } from "@app/common/telegram";
import type { Context } from "telegraf";

export class StartCommand extends Command {
  constructor() {
    super({
      name: "start",
      description: "Start command"
    });
  }

  async handler(ctx: Context) {}
}
