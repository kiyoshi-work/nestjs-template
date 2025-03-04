export const QUEUE_NAME = {
  USER: 'user',
  TELEGRAM_BOT: 'telegram_bot',
};

export const QUEUE_PROCESSOR = {
  USER: {
    FETCH_DATA_WHEN_SIGN_UP: 'FETCH_DATA_WHEN_SIGN_UP',
  },
  TELEGRAM_BOT: {
    POOLING_QUEUE: 'pooling_queue',
    SEND_MESSAGE: 'send_message',
    SEND_PAGE_MESSAGE: 'send_page_message',
    SEND_PHOTO_MESSAGE: 'send_photo_message',
  },
};
