import { TelegramClientFactory } from "@app/common/telegram";
import { AuthGuard, NotBotGuard } from "./guards";

const client = TelegramClientFactory.create(process.env.TELEGRAM_BOT_TOKEN);

client.useGlobalGuards(NotBotGuard);
client.useGlobalGuards(AuthGuard);
client.launch().catch(console.error);
