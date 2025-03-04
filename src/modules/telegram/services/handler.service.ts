import { Inject, Injectable } from '@nestjs/common';
import { ComingSoonHandler, Handler } from '../handlers';
import { UserInputHandler } from '../handlers/user-input.handler';
import { COMMAND_KEYS } from '../constants/command-keys';

@Injectable()
export class HandlerService {
  @Inject(ComingSoonHandler)
  private comingSoonHandler: ComingSoonHandler;

  @Inject(UserInputHandler)
  private userInputHandler: UserInputHandler;

  getHandlers(): Record<string, Handler> {
    return {
      [COMMAND_KEYS.USER_INPUT]: this.userInputHandler,
      [COMMAND_KEYS.COMMING_SOON]: this.comingSoonHandler,
    };
  }
}
