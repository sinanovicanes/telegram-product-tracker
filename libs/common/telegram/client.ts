import { container } from "tsyringe";
import { Injectable } from "../decorators";
import { CommandManager, ScheduleManager } from "./managers";
import { Telegraf } from "telegraf";
import type { Constructor } from "../interfaces";
import type { Guard, Middleware } from "./classes";

@Injectable()
export class TelegramClient extends Telegraf {
  constructor(
    private readonly commandManager: CommandManager,
    private readonly scheduleManager: ScheduleManager
  ) {
    super(container.resolve("BOT_TOKEN"));
  }

  useGlobalMiddlewares(...middlewares: Constructor<Middleware>[]) {
    this.useCommandMiddlewares(...middlewares);
  }

  useGlobalGuards(...guards: Constructor<Guard>[]) {
    this.useCommandGuards(...guards);
  }

  useCommandMiddlewares(...middlewares: Constructor<Middleware>[]) {
    this.commandManager.useMiddlewares(...middlewares);
  }

  useCommandGuards(...guards: Constructor<Guard>[]) {
    this.commandManager.useGuards(...guards);
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
