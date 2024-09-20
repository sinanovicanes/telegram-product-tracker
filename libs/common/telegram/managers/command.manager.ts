import { Logger } from "@app/common/logger";
import { Command } from "../classes";
import { CommandLoader } from "../loaders";
<<<<<<< HEAD
import { Injectable } from "@app/common/decorators";
import type { TelegramClient } from "../client";

@Injectable()
export class CommandManager {
  constructor() {}
=======
import type { TelegramClient } from "../client";

export class CommandManager {
  constructor(private readonly client: TelegramClient) {}
>>>>>>> f22edf2 (Initial commit)

  private readonly logger = new Logger(CommandManager.name);
  private readonly commands: Map<Command["name"], Command> = new Map();

<<<<<<< HEAD
  private loadCommand(command: Command, client: TelegramClient) {
    this.commands.set(command.name, command);

    client.command(command.name, async ctx => {
=======
  private loadCommand(command: Command) {
    this.commands.set(command.name, command);

    this.client.command(command.name, async ctx => {
>>>>>>> f22edf2 (Initial commit)
      try {
        await command.handler(ctx);
      } catch (e) {
        this.logger.error(`Failed to execute command ${command.name}: ${e}`);
      }
    });
  }

<<<<<<< HEAD
  async initialize(client: TelegramClient) {
    const commands = await CommandLoader.load("src/commands/**/*.ts");

    for (const command of commands) {
      this.loadCommand(command, client);
=======
  async initialize() {
    const commands = await CommandLoader.load("src/commands/**/*.ts");

    for (const command of commands) {
      this.loadCommand(command);
>>>>>>> f22edf2 (Initial commit)
    }

    this.logger.info(`Loaded ${this.commands.size} commands`);
  }
}
