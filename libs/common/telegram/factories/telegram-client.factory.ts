<<<<<<< HEAD
import { container } from "tsyringe";
=======
>>>>>>> f22edf2 (Initial commit)
import { TelegramClient } from "../client";

export class TelegramClientFactory {
  static create(token: string) {
<<<<<<< HEAD
    container.register("BOT_TOKEN", { useValue: token });

    return container.resolve(TelegramClient);
=======
    return new TelegramClient(token);
>>>>>>> f22edf2 (Initial commit)
  }
}
