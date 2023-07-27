import { Body, Controller, Get, InternalServerErrorException, Param, Post, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';

@Controller('users')
export class UserController {
    constructor (private readonly userService: UserService) {}
    @Get('')
    async findAll()
    {
        return (await this.userService.findAll());
    }
    
    async callFunction(fct, body)
    {
        try 
        {
            const res = await this.userService.callFunction(fct.bind(this.userService), body);
            return (res); 
        }
        catch (e)
        {
            throw new InternalServerErrorException(e);
        }
    }

    @Post('signup')
    async signUp(@Body() body)
    {
        try
        {
            const res = await this.callFunction(this.userService.signUp, body);
            console.log(res);
            return (res);
        }
        catch (e)
        {
            throw new InternalServerErrorException(e);
        }
    }

    @Post('signin')
    async signIn(@Body() body)
    {
        return (await this.callFunction(this.userService.signIn, body))
    }

    @Post('logout')
    async logOut(@Body() body)
    {
        return (await this.callFunction(this.userService.logOut, body))
    }

    @Get('/images/:imageName')
    async getImage(@Param('imageName') imageName: string, @Res() res: Response) {
        const imagePath = path.join(__dirname, '../../../', 'uploads', imageName);
    return res.sendFile(imagePath);
  }
}
