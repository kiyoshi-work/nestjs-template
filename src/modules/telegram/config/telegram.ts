import { registerAs } from '@nestjs/config';

export const configTelegram = registerAs('telegram', () => ({
  token: process.env.TELEGRAM_TOKEN,
}));
