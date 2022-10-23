import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AppService } from 'src/app.service';
import { ClickhouseService } from 'src/clickhouse/clickhouse.service';

@Injectable()
export class LoaderService {
  constructor(
    @Inject(ClickhouseService) private readonly clickHouse: ClickhouseService,
    @Inject(AppService) private readonly appService: AppService,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    if (process.env.MODE !== 'production') return;

    const length = await this.appService.getLength();

    const data = await this.appService.getItems<string>({ length });
    if (!data?.length) return;

    this.clickHouse.batchInsert({ data });
  }
}
