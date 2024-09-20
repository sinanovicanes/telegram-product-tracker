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
<<<<<<< HEAD
  async handler(ctx: Context) {
    console.log(ctx.message.from);
  }
=======
  async handler(ctx: Context) {}
>>>>>>> f22edf2 (Initial commit)
=======
  async handler(ctx: Context) {
    console.log(ctx.message.from);
  }
>>>>>>> d9ca25a (feat: Add zara scraper with service)
}
