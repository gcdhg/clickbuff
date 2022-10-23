import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as faker from '@faker-js/faker';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ConfigModule } from '@nestjs/config';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ cache: true }),
        RedisModule.forRoot({
          config: {
            url: process.env.REDIS_URL,
          },
        }),
      ],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('add item to list"', async () => {
      const name = faker.faker.name.fullName();
      const res = await appController.addItem({
        data: [name],
      });
      expect(res?.success).toBeTruthy();

      const data = await appController.getItems({ length: 1 });

      expect(data).not.toEqual(expect.arrayContaining([name]));
    });
  });
});
