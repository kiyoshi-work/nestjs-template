import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { DatabaseModule } from '@/database';
import { HealthController } from '@/api/controllers';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { QueueModule } from '@/queue/queue.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { CustomThrottlerGuard } from './guards/custom-throttler.guard';
import { ThrottlerModule } from '@nestjs/throttler';
import { redisStore } from 'cache-manager-redis-store';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { configAuth } from './configs/auth';
import { configCache } from './configs/cache';
import { FormatResponseInterceptor } from './interceptors';
@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: process.env.APP_ENV === 'production' ? 60 : 600,
    }),
    DatabaseModule,
    QueueModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const urlRedis = `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/${process.env.REDIS_DATABASE}`;
        return {
          ttl: configService.get('cache.api.cache_ttl'),
          store: (await redisStore({
            url: urlRedis,
            ttl: Number(configService.get('cache.api.cache_ttl')) / 1000,
          })) as unknown as CacheStore,
        };
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [configAuth, configCache],
    }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('auth.jwt.jwt_secret_key'),
        global: true,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: FormatResponseInterceptor,
    },
  ],
})
export class ApiModule implements OnApplicationBootstrap {
  constructor() {}

  async onApplicationBootstrap() {}
}
