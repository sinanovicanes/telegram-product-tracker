import { Command } from "@app/common/telegram";
import type { Context } from "telegraf";

export class StartCommand extends Command {
  constructor() {
    super({
      name: "start",
      description: "Start command"
    });
  }

<<<<<<< HEAD
  async handler(ctx: Context) {
    console.log(ctx.message.from);
  }
=======
  async handler(ctx: Context) {}
>>>>>>> f22edf2 (Initial commit)
}
