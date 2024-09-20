import { MIDDLEWARE_METADATA_KEY } from "@app/common/constants";
import { MiddlewareError } from "@app/common/errors";
import type { Constructor } from "@app/common/interfaces";
import type { Context } from "telegraf";
import { ExecutionContext } from "../classes";
import type { Middleware } from "../classes/middleware";

export class MiddlewareExecutor {
  constructor(private readonly defaultMiddlewares: Middleware[] = []) {}

  private async useMiddlewares(middlewares: Middleware[], ctx: ExecutionContext) {
    for (const middleware of middlewares) {
      try {
        await middleware.use(ctx);
      } catch (e: any) {
        throw new MiddlewareError(
          !!middleware.getErrorMessage ? middleware.getErrorMessage(ctx) : e,
          ctx
        );
      }
    }
  }

  add(...middlewares: Middleware[]) {
    this.defaultMiddlewares.push(...middlewares);
  }

  async execute<T extends Function>(targetClass: T, ctx: Context) {
    const executionCtx = new ExecutionContext(
      ctx,
      targetClass.constructor as Constructor<T>
    );

    // Apply default guards
    await this.useMiddlewares(this.defaultMiddlewares, executionCtx);

    const appliedGuards = Reflect.getMetadata(
      MIDDLEWARE_METADATA_KEY,
      targetClass.constructor
    );

    if (!appliedGuards) return;

    // Apply class guards
    await this.useMiddlewares(appliedGuards, executionCtx);
  }
}
