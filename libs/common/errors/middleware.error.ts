import type { ExecutionContext } from "../telegram";

export class MiddlewareError extends Error {
  constructor(message: string, ctx: ExecutionContext) {
    super(message);

    ctx
      .getCtx()
      .reply(message)
      .catch(() => {});
  }
}
