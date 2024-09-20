import { ExecutionContext, Guard } from "@app/common/telegram";

export class NotBotGuard extends Guard {
  canActivate(ctx: ExecutionContext) {
    return !ctx.getCtx().message?.from.is_bot;
  }

  getErrorMessage() {
    return "Bots are not allowed to use this command";
  }
}
