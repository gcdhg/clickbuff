import { RedisModule } from '@nestjs-modules/ioredis';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoaderService } from './cron-loader/cron-loader.service';
import { ClickhouseService } from './clickhouse/clickhouse.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ cache: true }),
    ScheduleModule.forRoot(),
    RedisModule.forRoot({
      config: { url: process.env.REDIS_URL },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, LoaderService, ClickhouseService],
})
export class AppModule {}
