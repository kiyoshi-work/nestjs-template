import { ChatId } from 'node-telegram-bot-api';
import { Inject, Injectable } from '@nestjs/common';
import { Handler } from './handler';
import { TelegramBot } from '../telegram-bot';

@Injectable()
export class ComingSoonHandler implements Handler {
  @Inject(TelegramBot)
  private readonly bot: TelegramBot;

  handler = async (data: {
    chatId: ChatId;
    telegramId: string;
    firstName: string;
  }) => {
    await this.bot.sendMessage(data.chatId, 'Comming soon!');
  };
}
