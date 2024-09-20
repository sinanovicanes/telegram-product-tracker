import { Telegraf } from "telegraf";
<<<<<<< HEAD
<<<<<<< HEAD
import { container } from "tsyringe";
import { CommandManager, ScheduleManager } from "./managers";
<<<<<<< HEAD
import { Injectable } from "../decorators";

@Injectable()
export class TelegramClient extends Telegraf {
  constructor(
    private readonly commandManager: CommandManager,
    private readonly scheduleManager: ScheduleManager
  ) {
    super(container.resolve("BOT_TOKEN"));
=======
=======
import { container } from "tsyringe";
>>>>>>> b283f45 (chore: Add tsyringe for dependency injection)
import { CommandManager } from "./managers";
=======
>>>>>>> 52a77c9 (feat: Schedules)
import { Injectable } from "../decorators";

@Injectable()
export class TelegramClient extends Telegraf {
<<<<<<< HEAD
<<<<<<< HEAD
  private readonly commandManager: CommandManager = new CommandManager(this);

  constructor(token: string) {
    super(token);
>>>>>>> f22edf2 (Initial commit)
=======
  constructor(private readonly commandManager: CommandManager) {
=======
  constructor(
    private readonly commandManager: CommandManager,
    private readonly scheduleManager: ScheduleManager
  ) {
>>>>>>> 52a77c9 (feat: Schedules)
    super(container.resolve("BOT_TOKEN"));
>>>>>>> b283f45 (chore: Add tsyringe for dependency injection)
  }

  async launch(onLaunch?: (() => void) | undefined): Promise<void>;
  async launch(
    config: Telegraf.LaunchOptions,
    onLaunch?: (() => void) | undefined
  ): Promise<void>;
  async launch(config?: unknown, onLaunch?: unknown): Promise<void> {
<<<<<<< HEAD
<<<<<<< HEAD
    await this.commandManager.initialize(this);
    await this.scheduleManager.initialize();

    super.launch(config as any, () => {
      this.scheduleManager.start();
    });
<<<<<<< HEAD
=======
    await this.commandManager.initialize();
=======
    await this.commandManager.initialize(this);
>>>>>>> b283f45 (chore: Add tsyringe for dependency injection)
    await super.launch(config as any, onLaunch as any);
>>>>>>> f22edf2 (Initial commit)
=======
>>>>>>> 52a77c9 (feat: Schedules)
  }
}
