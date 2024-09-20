import { USER_ROLE } from "@/database/entities";
import { UserService } from "@/services";
import { Injectable, Roles } from "@app/common/decorators";
import { Command } from "@app/common/telegram";
import { getCommandArgsFromRawText } from "@app/common/utils";
import type { Context } from "telegraf";

@Injectable()
@Roles(USER_ROLE.ADMIN)
export class NewUserCommand extends Command {
  constructor(private readonly userService: UserService) {
    super({
      name: "newuser",
      description: "Adds user to the database"
    });
  }

  async handler(ctx: Context) {
    const [userId] = getCommandArgsFromRawText(ctx.text!);

    if (!userId) {
      return await ctx.reply("You must provide a user id");
    }

    const currentUserId = ctx.from!.id.toString();

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
  }
}
