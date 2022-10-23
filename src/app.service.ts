import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  private readonly _store = 'storage';

  public async addItem<T>({ data }: { data: T }) {
    const reply = {
      success: false,
    };
    if (!data) return reply;

    this.redis.rpush(this._store, JSON.stringify(data)).catch((err) => {
      //TODO добавить логгер
      console.log(err);
    });

    reply.success = true;

    return reply;
  }

  public async getLength() {
    return await this.redis.llen(this._store);
  }

  public async getItems<T>({ length }: { length: number }) {
    if (!length) {
      length = await this.getLength();
    }
    if (!length) return [];
    const data = (await this.redis.lpop(this._store, length)) || [];

    return data.filter(Boolean) as T[];
  }

  public clear() {
    this.redis.del(this._store);
  }
}
