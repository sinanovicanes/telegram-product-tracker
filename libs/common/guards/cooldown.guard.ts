import { COOLDOWN_METADATA_KEY } from "../constants";
import { Injectable } from "../decorators";
import { CooldownService } from "../services";
import { ExecutionContext, Guard } from "../telegram";

@Injectable()
export class CooldownGuard extends Guard {
  constructor(private readonly cooldownService: CooldownService) {
    super();
  }

  private readonly getCooldownKey = (ctx: ExecutionContext) => {
    const user = ctx.getCtx().from?.id;

    if (!user) {
      return null;
    }

    const command = ctx.getClass();

    return `${user}:${command.name}`;
  };

  canActivate(ctx: ExecutionContext): boolean {
    const handler = ctx.getClass();
    const timeout: number = Reflect.getMetadata(COOLDOWN_METADATA_KEY, handler);

    if (!timeout) return true;

    const cooldownKey = this.getCooldownKey(ctx);

    if (!cooldownKey) return true;

    const remainingTime = this.cooldownService.getRemainingTime(cooldownKey);

    if (remainingTime > 0) {
      throw new Error(`You are on cooldown. Please wait ${remainingTime} seconds.`);
    }

    this.cooldownService.setCooldown(cooldownKey, timeout);

    return true;
  }
}
