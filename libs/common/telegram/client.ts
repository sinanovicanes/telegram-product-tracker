import { Telegraf } from "telegraf";
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
  }

  async launch(onLaunch?: (() => void) | undefined): Promise<void>;
  async launch(
    config: Telegraf.LaunchOptions,
    onLaunch?: (() => void) | undefined
  ): Promise<void>;
  async launch(config?: unknown, onLaunch?: unknown): Promise<void> {
    await this.commandManager.initialize(this);
    await this.scheduleManager.initialize();

    super.launch(config as any, () => {
      this.scheduleManager.start();
    });
  }
}
