import { container } from "tsyringe";
import { TelegramClient } from "../client";
import { CooldownGuard } from "@app/common/guards";

export class TelegramClientFactory {
  static create(token: string) {
    container.register("BOT_TOKEN", { useValue: token });

    const client = container.resolve(TelegramClient);

    client.useGlobalGuards(CooldownGuard);

    return client;
  }
}
