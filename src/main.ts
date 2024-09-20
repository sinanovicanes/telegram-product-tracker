import { TelegramClientFactory } from "@app/common/telegram";

async function main() {
  const client = TelegramClientFactory.create(process.env.TELEGRAM_BOT_TOKEN);

  await client.launch();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
