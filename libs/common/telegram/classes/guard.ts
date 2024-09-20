import type { ExecutionContext } from "./execution-context";

export abstract class Guard {
  abstract canActivate(ctx: ExecutionContext): boolean | Promise<boolean>;
  getErrorMessage?(ctx: ExecutionContext): string;
}
