import { Logger } from "@app/common/logger";
import { ExecutionContext, Middleware } from "@app/common/telegram";

export class LogMessageMiddleware extends Middleware {
  private readonly logger = new Logger(LogMessageMiddleware.name);

  use(ctx: ExecutionContext) {
    const { text } = ctx.getCtx();

    if (!text) {
      return;
    }

    this.logger.info(`Received message: ${text}`);
  }
}
