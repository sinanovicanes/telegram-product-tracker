import type { Constructor } from "@app/common/interfaces";
import { getCommandArgsFromRawText } from "@app/common/utils";
import type { Context } from "telegraf";

export class ExecutionContext {
  constructor(
    private readonly ctx: Context,
    private readonly constructorRef: Constructor<any>
  ) {}

  getClass<T = any>(): Constructor<T> {
    return this.constructorRef;
  }

  getCtx() {
    return this.ctx;
  }

  getArgs(): string[] {
    return getCommandArgsFromRawText(this.ctx.text ?? "");
  }

  getArgByIndex(index: number): string | undefined {
    return this.getArgs()[index];
  }
}
