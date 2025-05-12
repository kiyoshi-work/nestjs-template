import TelegramBotApi, {
  ChatId,
  SendMessageOptions,
} from 'node-telegram-bot-api';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import {
  parseCommand,
  parserCallbackMessageTelegram,
  parserMessageTelegram,
} from './utils';
import { COMMAND_KEYS } from './constants/command-keys';
import { Handler } from './handlers';
import { QueueService } from '@/queue/queue.service';

@Injectable()
export class TelegramBot {
  public bot: TelegramBotApi;

  public handlers: Record<string, Handler>;

  constructor(
    private readonly configService: ConfigService,
    private readonly queueService: QueueService,
  ) {
    const token = this.configService.get<string>('telegram.token');
    const isBot = Boolean(Number(process.env.IS_TELEGRAM_BOT || 0));
    if (isBot) {
      this.bot = new TelegramBotApi(token, {
        polling: true,
        request: {
          url: '',
          agentOptions: {
            keepAlive: true,
            family: 4,
          },
        },
      });
      this.bot.getMe().then((bot) => console.log('---- BOT INFO: ----', bot));
    } else {
      this.bot = new TelegramBotApi(token, { polling: false });
    }
    this.bot.on('polling_error', (msg) => console.log(msg));
  }

  async deleteMessage(chatId: ChatId, messageId: number, seconds = 0) {
    const timeout = setTimeout(async () => {
      try {
        await this.bot.deleteMessage(chatId, messageId);
      } catch (error) {
        console.log('🚀 ~ TelegramBot ~ timeout ~ error:', error);
      }
      clearTimeout(timeout);
    }, seconds * 1000);
  }

  async sendMessage(
    chatId: ChatId,
    text: string,
    options?: SendMessageOptions,
  ) {
    try {
      return await this.bot.sendMessage(chatId, text, options);
    } catch (error) {
      console.log('🚀 ~ file: telegram-bot.ts:89 ~ error:', error);
    }
  }

  setupStartCommand(callback: any) {
    this.bot.onText(/\/start/, (msg) => {
      callback(parserMessageTelegram(msg));
    });
  }

  userReply(callback: any) {
    this.bot.on('message', (msg) => {
      callback(parserMessageTelegram(msg));
    });
  }

  registerHandlers(handlers: Record<string, Handler>) {
    this.handlers = handlers;
  }

  setupMenuCallback(callback: any) {
    this.bot.on('callback_query', (query) => {
      const { data: action } = query;
      const data = parserCallbackMessageTelegram(query);
      callback(action, data);
    });
  }

  async start() {
    // const userInputHandler = this.handlers[COMMAND_KEYS.USER_INPUT];
    // if (userInputHandler) {
    //   this.userReply(this.handlers[COMMAND_KEYS.USER_INPUT].handler);
    // }
    this.userReply((data) => {
      return this.queueService.addCommandToQueue(
        COMMAND_KEYS.USER_INPUT,
        undefined,
        data,
      );
    });
    this.setupMenuCallback((cmd, data) => {
      console.log('🚀 ~ REQUEST COMMAND:', { cmd });
      const { cmd: _cmd, params } = parseCommand(cmd);
      console.log(
        '🚀 ~ file: telegram-bot.ts:102 ~ TelegramBot ~ this.setupMenuCallback ~ params:',
        params,
      );
      return this.queueService.addCommandToQueue(_cmd, params, data);
    });
  }
}
