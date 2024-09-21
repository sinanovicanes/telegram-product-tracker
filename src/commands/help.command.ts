import { Cooldown, Injectable } from "@app/common/decorators";
import { Command } from "@app/common/telegram";
import { CommandManager } from "@app/common/telegram/managers";
import type { Context } from "telegraf";

@Injectable()
@Cooldown(5000)
export class HelpCommand extends Command {
  constructor(private readonly commandManager: CommandManager) {
    super({
      name: "help",
      description: "Shows the list of available commands"
    });
  }

  async handler(ctx: Context) {
    const commands = this.commandManager.getCommandList();
    const message = commands
      .map(command => `/${command.name} - ${command.description}`)
      .join("\n");

    return await ctx.reply(message);
  }
}
