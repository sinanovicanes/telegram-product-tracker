import { USER_ROLE } from "@/database/entities";
import { UserService } from "@/services";
import { Injectable, Roles } from "@app/common/decorators";
import { Command } from "@app/common/telegram";
import { getCommandArgsFromRawText } from "@app/common/utils";
import type { Context } from "telegraf";

@Injectable()
@Roles(USER_ROLE.ADMIN)
export class RemoveUserCommand extends Command {
  constructor(private readonly userService: UserService) {
    super({
      name: "removeuser",
      description: "Removes user from the database"
    });
  }

  async handler(ctx: Context) {
    const [userId] = getCommandArgsFromRawText(ctx.text ?? "");

    if (!userId) {
      return await ctx.reply("You must provide a user id");
    }

    try {
      await this.userService.deleteUser(userId);
      return await ctx.reply("User has been removed from the database");
    } catch (error) {
      return await ctx.reply("An error occurred while removing user from the database");
    }
  }
}
