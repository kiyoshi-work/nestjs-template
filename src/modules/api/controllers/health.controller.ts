import { UserRepository } from '@/database/repositories';
import { Controller, ForbiddenException, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
// const Sentry = require("@sentry/node");
// import * as Sentry from '@sentry/node';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private userRepository: UserRepository) {}

  funErr() {
    console.log('Test error ');
    try {
      throw new Error('Test error');
    } catch (e) {
      throw e;
      // Sentry.captureException(e);
    }
  }

  @Get('')
  async healthCheck() {
    return 1;
  }

  @Get('check-db')
  async checkDB() {
    return await this.userRepository.findOne({ where: {} });
  }

  @Get('throw')
  throwError() {
    this.funErr();
  }
}
