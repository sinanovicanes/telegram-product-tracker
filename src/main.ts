import { TelegramClientFactory } from "@app/common/telegram";
import { AuthGuard, NotBotGuard } from "./guards";

const client = TelegramClientFactory.create(process.env.TELEGRAM_BOT_TOKEN);

client.useGlobalGuards(NotBotGuard);
client.useGlobalGuards(AuthGuard);

// const server = Bun.serve({
//   port: 8080,
//   fetch(req: Request): Response | Promise<Response> {
//     return client.onRequest(req) || new Response("Hello World!");
//   }
// });

client.launch().catch(console.error);

// client.initialize(server).catch(console.error);
