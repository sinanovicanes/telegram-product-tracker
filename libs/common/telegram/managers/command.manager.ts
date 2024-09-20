import { Logger } from "@app/common/logger";
import { Command } from "../classes";
import { CommandLoader } from "../loaders";
<<<<<<< HEAD
<<<<<<< HEAD
import { Injectable } from "@app/common/decorators";
import type { TelegramClient } from "../client";
import { BaseManager } from "./base.manager";
import { GuardError } from "@app/common/errors";

@Injectable()
<<<<<<< HEAD
export class CommandManager {
  constructor() {}
=======
=======
import { Injectable } from "@app/common/decorators";
>>>>>>> b283f45 (chore: Add tsyringe for dependency injection)
import type { TelegramClient } from "../client";

@Injectable()
export class CommandManager {
<<<<<<< HEAD
  constructor(private readonly client: TelegramClient) {}
>>>>>>> f22edf2 (Initial commit)
=======
  constructor() {}
>>>>>>> b283f45 (chore: Add tsyringe for dependency injection)

  private readonly logger = new Logger(CommandManager.name);
=======
export class CommandManager extends BaseManager {
>>>>>>> a630d27 (feat: Add guards)
  private readonly commands: Map<Command["name"], Command> = new Map();

<<<<<<< HEAD
<<<<<<< HEAD
  private loadCommand(command: Command, client: TelegramClient) {
    this.commands.set(command.name, command);

    client.command(command.name, async ctx => {
=======
  private loadCommand(command: Command) {
    this.commands.set(command.name, command);

    this.client.command(command.name, async ctx => {
>>>>>>> f22edf2 (Initial commit)
=======
  private loadCommand(command: Command, client: TelegramClient) {
    this.commands.set(command.name, command);

    client.command(command.name, async ctx => {
>>>>>>> b283f45 (chore: Add tsyringe for dependency injection)
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

<<<<<<< HEAD
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
=======
  async initialize(client: TelegramClient) {
    const commands = await CommandLoader.load("src/commands/**/*.ts");

    for (const command of commands) {
      this.loadCommand(command, client);
>>>>>>> b283f45 (chore: Add tsyringe for dependency injection)
    }

    this.logger.info(`Loaded ${this.commands.size} commands`);
  }
}
