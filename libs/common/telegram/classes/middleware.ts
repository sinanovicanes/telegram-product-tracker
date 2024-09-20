import type { ExecutionContext } from "./execution-context";

export abstract class Middleware {
  abstract use(ctx: ExecutionContext): any | Promise<any>;
  getErrorMessage?(ctx: ExecutionContext): string;
}
