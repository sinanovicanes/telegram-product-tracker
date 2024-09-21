import { Injectable } from "@app/common";

interface Cooldown {
  timeoutId: Timer;
  timestamp: number;
  timeout: number;
}

@Injectable()
export class CooldownService {
  private readonly cooldowns: Map<string, Cooldown> = new Map();

  isOnCooldown(commandKey: string) {
    return this.cooldowns.has(commandKey);
  }

  setCooldown(commandKey: string, timeout: number) {
    this.cooldowns.set(commandKey, {
      timeoutId: setTimeout(() => this.cooldowns.delete(commandKey), timeout),
      timestamp: Date.now(),
      timeout
    });
  }

  resetCooldown(commandKey: string) {
    this.cooldowns.delete(commandKey);
  }

  getRemainingTime(commandKey: string): number {
    const cooldown = this.cooldowns.get(commandKey);

    if (!cooldown) return 0;

    return Math.max(
      0,
      Math.ceil((cooldown.timestamp + cooldown.timeout - Date.now()) / 1000)
    );
  }
}
