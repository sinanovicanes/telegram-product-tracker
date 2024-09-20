import { container } from "tsyringe";
import { Guard } from "../classes";
import { GuardExecutor } from "../executors";
import { Logger } from "@app/common/logger";
import type { Constructor } from "@app/common/interfaces";
import type { Context } from "telegraf";

export class BaseManager {
  protected readonly logger = new Logger(this.constructor.name);
  protected readonly guardExecutor = new GuardExecutor();

  protected async runExecutors(targetClass: Function, ctx: Context) {
    await this.guardExecutor.execute(targetClass, ctx);
  }

  useGuards(...guards: Constructor<Guard>[]) {
    this.guardExecutor.add(...guards.map(guard => container.resolve(guard)));
  }
}
