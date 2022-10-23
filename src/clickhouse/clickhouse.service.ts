import { Injectable } from '@nestjs/common';
import { MayBeArray } from 'src/types/common';
import fetch from 'node-fetch';

@Injectable()
export class ClickhouseService {
  private readonly _url = process.env.CLICKHOUSE_URL;
  private readonly _username = process.env.CLICKHOUSE_USERNAME;
  private readonly _password = process.env.CLICKHOUSE_PASSWORD;

  async batchInsert({ data }: { data: MayBeArray<string>[] }) {
    const table = 'storage';
    const values = data
      .map((line: MayBeArray<string>) => {
        let res = line;
        if (Array.isArray(line)) res = line.join(',');
        return `(${res})`;
      })
      .join(',');
    const query = `INSERT INTO ${table} VALUES  ${values} FORMAT TabSeparated`;

    const res = await this._callMethod({ query });

    return res;
  }

  private async _callMethod({ query }: { query: string }) {
    const reply = {
      success: false,
      error: null,
    };

    if (!this._url) {
      reply.error = 'invalid clickhouse config';
      return reply;
    }

    const res = await fetch(this._url, {
      method: 'post',
      headers: {
        Authorization:
          'Basic ' +
          Buffer.from(this._username + ':' + this._password).toString('base64'),
      },
      body: query,
    });

    if (res.status === 200 || res.status === 201) {
      return reply;
    }

    const data = await res.text();

    return data;
  }
}
