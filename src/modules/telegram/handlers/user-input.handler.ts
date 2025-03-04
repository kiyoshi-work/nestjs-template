import { Inject, Injectable } from '@nestjs/common';
import { ChatId } from 'node-telegram-bot-api';
import { TelegramBot } from '../telegram-bot';
import { Handler } from './handler';

@Injectable()
export class UserInputHandler implements Handler {
  @Inject(TelegramBot)
  private readonly bot: TelegramBot;

  handler = async (data: {
    chatId: ChatId;
    telegramId: string;
    messageId: number;
    text: string;
    reply_to_message_id: number;
    firstName: string;
  }) => {
    try {
      // TODO: write logic for user input
      // {
      //   messageId: 5611,
      //   chatId: -1002103555207,
      //   telegramId: 5665860415,
      //   firstName: 'kiyoshi',
      //   text: 'acs',
      //   message_thread_id: 10,
      //   reply_to_message_id: 10
      // }
      await this.bot.sendMessage(data.chatId, 'result');

      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };
}
