import { Injectable } from "@app/common/decorators";
import { GuardError } from "@app/common/errors";
import type { Command } from "../classes";
import type { TelegramClient } from "../client";
import { CommandLoader } from "../loaders";
import { BaseManager } from "./base.manager";

@Injectable()
export class CommandManager extends BaseManager {
  private readonly commands: Map<Command["name"], Command> = new Map();

  getCommandList(): { name: Command["name"]; description: Command["description"] }[] {
    return Array.from(this.commands.values()).map(command => ({
      name: command.name,
      description: command.description
    }));
  }

  private loadCommand(command: Command, client: TelegramClient) {
    this.commands.set(command.name, command);

    client.command(command.name, async ctx => {
      try {
        await this.runExecutors(command as Function & Command, ctx);
        await command.handler(ctx);
      } catch (e) {
        if (e instanceof GuardError) {
          return;
        }
        this.logger.error(`Failed to execute command ${command.name}: ${e}`);
      }
    });
  }

  async initialize(client: TelegramClient) {
    const commands = await CommandLoader.load("src/commands/**/*.ts");

    client.telegram.setMyCommands(
      commands.map(command => ({
        command: command.name,
        description: command.description
      }))
    );

    for (const command of commands) {
      this.loadCommand(command, client);
    }

    this.logger.info(`Loaded ${this.commands.size} commands`);
  }
}
