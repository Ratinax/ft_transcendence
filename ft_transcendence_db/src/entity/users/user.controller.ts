import { Body, Controller, Get, InternalServerErrorException, Param, Post, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { SessionService } from '../sessions/session.service';

@Controller('users')
export class UserController {
    constructor (private readonly userService: UserService, private readonly sessionService: SessionService) {}
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
     * //TODO doc
     * @param body user to be signed up {id, pseudo, password, profilPic, isConencted}
     * @returns the user created
     * @throws InternalServerErrorException in case of failing
     */
    @Post('signup')
    async signUp(@Body() body, @Res({passthrough: true}) res: Response)
    {
        const user = await this.callFunction(this.userService.signUp, body);
        const session = await this.sessionService.createSession(user.id);
        res.cookie('SESSION_KEY', session.sessionKey, {httpOnly: true, expires: new Date(session.expirationDate)});
        return (true);
    }
    @Post('signin')
    async signIn(@Body() body)
    {
        return (await this.callFunction(this.userService.signIn, body))
    }

    /**
     * 
     * @param code code sent by 42 when connect
     * @param res interface already provided without givig it, used to set cookies
     * @returns result of request
     */
    @Get('login42/:code')
    async login42(@Param('code') code, @Res({passthrough: true}) res: Response)
    {
        const token = await this.userService.login42(code);
		if (token)
		{
			res.cookie('42_TOKEN', token.data.access_token, {httpOnly: true, expires: new Date(Date.now() + token.data.expires_in * 1000)});
			res.cookie('42_REFRESH', token.data.refresh_token, {httpOnly: true, maxAge: 1000000000});
			return token.data; // TODO enlever pour securite
		}
		return 'Error';
    }

    @Post('logout')
    async logOut(@Body() body)
    {
        return (await this.callFunction(this.userService.logOut, body))
    }

    @Get('imageName')
    async getImageName(@Req() req)
    {
        if (!req.cookies['SESSION_KEY'] || !this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        {
            return (null);
            // TODO redirect to log page
        }
        const user = await this.sessionService.getUser(req.cookies['SESSION_KEY']);
        return (user.profilPic);
    }

    /**
     * get the image according to its name
     * 
     * @param imageName name of the image to get
     * @param res interface already provided without givig it, used to send file to fronted
     * @returns the data of the image
     */
    @Get('/images/:imageName')
    async getImage(@Param('imageName') imageName: string, @Res() res: Response) 
    {
        let imagePath = path.join(__dirname, '../../../', 'images', imageName);
        try {
            if (!fs.existsSync(imagePath)) {
                // TODO imagePath = quelquechose qui existes;
                return (null); 
              }
            return (res.sendFile(imagePath));
        }
        catch (e)
        {
            console.error('Error while loading image :', e);
        }
    }
}
