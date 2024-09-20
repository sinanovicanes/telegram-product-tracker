import { Telegraf } from "telegraf";
<<<<<<< HEAD
import { container } from "tsyringe";
import { CommandManager, ScheduleManager } from "./managers";
import { Injectable } from "../decorators";

@Injectable()
export class TelegramClient extends Telegraf {
  constructor(
    private readonly commandManager: CommandManager,
    private readonly scheduleManager: ScheduleManager
  ) {
    super(container.resolve("BOT_TOKEN"));
=======
import { CommandManager } from "./managers";

export class TelegramClient extends Telegraf {
  private readonly commandManager: CommandManager = new CommandManager(this);

  constructor(token: string) {
    super(token);
>>>>>>> f22edf2 (Initial commit)
  }

  async launch(onLaunch?: (() => void) | undefined): Promise<void>;
  async launch(
    config: Telegraf.LaunchOptions,
    onLaunch?: (() => void) | undefined
  ): Promise<void>;
  async launch(config?: unknown, onLaunch?: unknown): Promise<void> {
<<<<<<< HEAD
    await this.commandManager.initialize(this);
    await this.scheduleManager.initialize();

    super.launch(config as any, () => {
      this.scheduleManager.start();
    });
=======
    await this.commandManager.initialize();
    await super.launch(config as any, onLaunch as any);
>>>>>>> f22edf2 (Initial commit)
  }
}
