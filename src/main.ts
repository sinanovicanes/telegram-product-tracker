import { TelegramClientFactory } from "@app/common/telegram";
import { subscriptionRepository } from "./database";

async function main() {
  const client = TelegramClientFactory.create(process.env.TELEGRAM_BOT_TOKEN);

  subscriptionRepository.find().then(console.log);

  await client.launch();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
