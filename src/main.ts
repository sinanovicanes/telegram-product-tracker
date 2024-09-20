import { TelegramClientFactory } from "@app/common/telegram";
import { NotBotGuard } from "./guards";

async function main() {
  const client = TelegramClientFactory.create(process.env.TELEGRAM_BOT_TOKEN);

  client.useGlobalGuards(NotBotGuard);

  await client.launch();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
