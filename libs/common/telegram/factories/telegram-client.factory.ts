import { container } from "tsyringe";
import { TelegramClient } from "../client";

export class TelegramClientFactory {
  static create(token: string) {
    container.register("BOT_TOKEN", { useValue: token });

    return container.resolve(TelegramClient);
  }
}
