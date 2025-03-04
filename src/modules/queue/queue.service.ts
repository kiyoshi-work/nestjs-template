import { QUEUE_NAME, QUEUE_PROCESSOR } from '@/shared/constants/queue';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

export class QueueService {
  constructor(
    @InjectQueue(QUEUE_NAME.USER)
    private userQueue: Queue,

    @InjectQueue(QUEUE_NAME.TELEGRAM_BOT)
    private telegramQueue: Queue,
  ) {}

  async fetchDataWhenSignUp(username: string) {
    console.log(
      '🚀 ~ QueueService ~ fetchDataWhenSignUp ~ username:',
      username,
    );
    await this.userQueue.add(
      QUEUE_PROCESSOR.USER.FETCH_DATA_WHEN_SIGN_UP,
      {
        username,
      },
      {
        removeOnComplete: 20,
        removeOnFail: true,
      },
    );
  }

  addCommandToQueue(cmd: string, params?: any, data?: any) {
    this.telegramQueue.add(
      QUEUE_PROCESSOR.TELEGRAM_BOT.POOLING_QUEUE,
      {
        cmd: cmd,
        params,
        data,
      },
      {
        removeOnComplete: 20,
        removeOnFail: true,
      },
    );
  }
}
