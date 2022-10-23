import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('/batch/')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  public async addItem(@Body() body: { data: string[] }) {
    if (!body?.data?.length) {
      throw new Error('Invalid Value');
    }

    if (body?.data?.some((val) => typeof val !== 'string')) {
      throw new Error('Invalid Value');
    }

    return await this.appService.addItem({ data: body?.data });
  }

  @Get()
  public async getItems(@Body() body: { length: number }) {
    if (typeof body?.length !== 'number' || Number.isNaN(length)) return [];
    return await this.appService.getItems<string>({ length: body?.length });
  }

  public async clear() {
    return await this.appService.clear();
  }
}
