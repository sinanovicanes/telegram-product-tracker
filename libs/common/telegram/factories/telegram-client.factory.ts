<<<<<<< HEAD
<<<<<<< HEAD
import { container } from "tsyringe";
=======
>>>>>>> f22edf2 (Initial commit)
=======
import { container } from "tsyringe";
>>>>>>> b283f45 (chore: Add tsyringe for dependency injection)
import { TelegramClient } from "../client";

export class TelegramClientFactory {
  static create(token: string) {
<<<<<<< HEAD
<<<<<<< HEAD
    container.register("BOT_TOKEN", { useValue: token });

    return container.resolve(TelegramClient);
=======
    return new TelegramClient(token);
>>>>>>> f22edf2 (Initial commit)
=======
    container.register("BOT_TOKEN", { useValue: token });

    return container.resolve(TelegramClient);
>>>>>>> b283f45 (chore: Add tsyringe for dependency injection)
  }
}
