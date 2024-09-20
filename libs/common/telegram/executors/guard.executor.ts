import { GuardError } from "@app/common/errors";
import { ExecutionContext, Guard } from "../classes";
import type { Context } from "telegraf";
import type { Constructor } from "@app/common/interfaces";
import { GUARD_METADATA_KEY } from "@app/common/constants";

export class GuardExecutor {
  constructor(private readonly defaultGuards: Guard[] = []) {}

  private async useGuards(guards: Guard[], ctx: ExecutionContext) {
    for (const guard of guards) {
      try {
        const canActivate = await guard.canActivate(ctx);

        if (!canActivate) {
          throw new Error("You shall not pass!");
        }
      } catch (e: any) {
        throw new GuardError(
          !!guard.getErrorMessage ? guard.getErrorMessage(ctx) : e,
          ctx
        );
      }
    }
  }

  add(...guards: Guard[]) {
    this.defaultGuards.push(...guards);
  }

  async execute<T extends Function>(targetClass: T, ctx: Context) {
    const executionCtx = new ExecutionContext(
      ctx,
      targetClass.constructor as Constructor<T>
    );

    // Apply default guards
    await this.useGuards(this.defaultGuards, executionCtx);

    const appliedGuards = Reflect.getMetadata(
      GUARD_METADATA_KEY,
      targetClass.constructor
    );

    if (!appliedGuards) return;

    // Apply class guards
    await this.useGuards(appliedGuards, executionCtx);
  }
}
