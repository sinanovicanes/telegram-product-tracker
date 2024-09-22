import { Telegraf } from "telegraf";
import { container } from "tsyringe";
import { Injectable } from "../decorators";
import { env } from "../env.validation";
import type { Constructor } from "../interfaces";
import type { Guard, Middleware } from "./classes";
import { CommandManager, ScheduleManager } from "./managers";

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

  async launch() {
    await this.commandManager.initialize(this);
    await this.scheduleManager.initialize();

    return super.launch(
      {
        webhook: {
          domain: env.URL,
          port: env.PORT,
          path: "/telegraf/webhook",
          secretToken: env.WEBHOOK_SECRET
        }
      },
      () => {
        this.scheduleManager.start();
      }
    );
  }
}
