import { Body, Controller, Get, Post, Query, Redirect, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor (private readonly appService: AppService) {}
    @Get()
    getHello()
    {
        return this.appService.getHello();
    }

}
