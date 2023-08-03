import { Body, Controller, Get, InternalServerErrorException, Param, Post, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';

@Controller('users')
export class UserController {
    constructor (private readonly userService: UserService) {}
    /**
     * call a function of userService
     * 
     * @param fct the function of userService to be called
     * @param body body of the function to be called
     * @returns result of request
     * @throws InternalServerErrorException in case of failing
     */
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
    /**
     * 
     * @param body user to be signed up {id, pseudo, password, profilPic, isConencted}
     * @returns the user created
     * @throws InternalServerErrorException in case of failing
     */
    @Post('signup')
    async signUp(@Body() body)
    {
        try
        {
            const res = await this.callFunction(this.userService.signUp, body);
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

    /**
     * get the image according to its name
     * 
     * @param imageName name of the image to get
     * @param res interface already provided without givig it, used to send file to fronted
     * @returns the data of the image
     */
    @Get('/images/:imageName')
    async getImage(@Param('imageName') imageName: string, @Res() res: Response) {
        const imagePath = path.join(__dirname, '../../../', 'uploads', imageName);
    return res.sendFile(imagePath);
  }
}
