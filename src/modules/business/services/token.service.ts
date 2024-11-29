import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { EntityManager, In } from 'typeorm';

@Injectable()
export class TokenService {
  constructor(
    @InjectPinoLogger(TokenService.name)
    private readonly logger: PinoLogger,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}
}
