<<<<<<< HEAD
import { USER_ROLE } from "@/database/entities";
import { UserService } from "@/services";
import { Injectable } from "@app/common/decorators";
import { Command } from "@app/common/telegram";
import { getCommandArgsFromRawText } from "@app/common/utils";
import type { Context } from "telegraf";

@Injectable()
export class NewUserCommand extends Command {
  constructor(private readonly userService: UserService) {
=======
import { Command } from "@app/common/telegram";
import type { Context } from "telegraf";

export class NewUserCommand extends Command {
  constructor() {
>>>>>>> d9ca25a (feat: Add zara scraper with service)
    super({
      name: "newuser",
      description: "Adds user to the database"
    });
  }

  async handler(ctx: Context) {
<<<<<<< HEAD
    const [userId] = getCommandArgsFromRawText(ctx.text);
=======
    const [userId] = ctx.text
      .replace(`/${this.name}`, "")
      .trim()
      .split(" ")
      .filter(arg => arg);
>>>>>>> d9ca25a (feat: Add zara scraper with service)

    if (!userId) {
      return await ctx.reply("You must provide a user id");
    }
<<<<<<< HEAD

    const currentUserId = ctx.from.id.toString();

    const user = await this.userService.getUser(currentUserId);

    if (!user || user.role != USER_ROLE.ADMIN) {
      return await ctx.reply("You are not authorized to perform this action");
    }

    try {
      await this.userService.createUser(currentUserId);
      return await ctx.reply("User has been added to the database");
    } catch (error) {
      return await ctx.reply(
        "An error occurred while trying to add the user to the database"
      );
    }
=======
>>>>>>> d9ca25a (feat: Add zara scraper with service)
  }
}
