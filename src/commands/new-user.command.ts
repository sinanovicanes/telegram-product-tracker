import { Command } from "@app/common/telegram";
import type { Context } from "telegraf";

export class NewUserCommand extends Command {
  constructor() {
    super({
      name: "newuser",
      description: "Adds user to the database"
    });
  }

  async handler(ctx: Context) {
    const [userId] = ctx.text
      .replace(`/${this.name}`, "")
      .trim()
      .split(" ")
      .filter(arg => arg);

    if (!userId) {
      return await ctx.reply("You must provide a user id");
    }
  }
}
