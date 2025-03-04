import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { TelegramBot } from '@/telegram/telegram-bot';
import { Inject } from '@nestjs/common';
import { QUEUE_NAME, QUEUE_PROCESSOR } from '@/shared/constants/queue';

@Processor(QUEUE_NAME.TELEGRAM_BOT)
export class TelegramBotConsumer {
  @Inject(TelegramBot)
  private readonly bot: TelegramBot;

  @Process(QUEUE_PROCESSOR.TELEGRAM_BOT.POOLING_QUEUE)
  async sendMessage(
    job: Job<{
      cmd: string;
      params: Record<string, any>;
      data: any;
    }>,
  ) {
    const { cmd, params, data } = job.data;

    const handler = this.bot.handlers[cmd];
    console.log(handler, cmd, params);
    if (handler) {
      handler
        .handler({ ...data, ...params })
        .then()
        .catch((e) => {
          console.log(
            '🚀 ~ file: telegram-bot.consumer.ts:29 ~ TelegramBotConsumer ~ cmd handler error:',
            cmd,
            e,
          );
        });
    } else {
      console.log(
        '🚀 ~ file: telegram-bot.consumer.ts:38 ~ TelegramBotConsumer ~ cmd unknown callback:',
        cmd,
      );
    }
  }
}
