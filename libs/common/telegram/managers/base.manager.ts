import type { Constructor } from "@app/common/interfaces";
import { Logger } from "@app/common/logger";
import type { Context } from "telegraf";
import { container } from "tsyringe";
import { Guard, Middleware } from "../classes";
import { GuardExecutor, MiddlewareExecutor } from "../executors";

export class BaseManager {
  protected readonly logger = new Logger(this.constructor.name);
  private readonly guardExecutor = new GuardExecutor();
  private readonly middlewareExecutor = new MiddlewareExecutor();

  protected async runExecutors(targetClass: Function, ctx: Context) {
    await this.middlewareExecutor.execute(targetClass, ctx);
    await this.guardExecutor.execute(targetClass, ctx);
  }

  useMiddlewares(...middlewares: Constructor<Middleware>[]) {
    this.middlewareExecutor.add(
      ...middlewares.map(middleware => container.resolve(middleware))
    );
  }

  useGuards(...guards: Constructor<Guard>[]) {
    this.guardExecutor.add(...guards.map(guard => container.resolve(guard)));
  }
}
