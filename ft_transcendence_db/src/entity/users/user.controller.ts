import { Body, Controller, Get, InternalServerErrorException, Param, Post, Query, Req, Res } from '@nestjs/common';
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
     * @param body user to be signed up {id, pseudo, password, profilPic, isConencted}
     * @returns the user created
     * @throws InternalServerErrorException in case of failing
     */
    @Post('signup')
    async signUp(@Body() body, @Res({passthrough: true}) res: Response)
    {
        // TODO check input
        const user = await this.callFunction(this.userService.signUp, body);
        const session = await this.sessionService.createSession(user.id);
        res.cookie('SESSION_KEY', session.sessionKey, {httpOnly: true, expires: new Date(session.expirationDate)});
        return (true);
    }
    @Post('signin')
    async signIn(@Body() body, @Res({passthrough: true}) res: Response)
    {
        // TODO check input
        const user = await this.callFunction(this.userService.signIn, body);
        if (!user || user === 'Wrong password')
            return (false); // TODO handle error in front
        if (user.is42User)
            return (false); // TODO handle its a user 42, cannot connect like this
        const session = await this.sessionService.createSession(user.id);
        res.cookie('SESSION_KEY', session.sessionKey, {httpOnly: true, expires: new Date(session.expirationDate)});
        return (true);
    }

    /**
     * 
     * @param code code sent by 42 when connect
     * @param res interface already provided without givig it, used to set cookies
     * @returns result of request
     */
    @Get('callback42/:code')
    async getToken(@Param('code') code: string, @Res({passthrough: true}) res: Response)
    {
        const token = await this.userService.getToken(code);
        if (token && token.data)
		{
            const infos = await this.userService.getMyInfos(token.data.access_token);
            const user = await this.callFunction(this.userService.login42, {pseudo: infos.data.login, profilPic: infos.data.image.link, is42User: true});
            if (!user) // TODO faire quelque chose quand renvoie null
                return (false);
            const session = await this.sessionService.createSession(user.id);
            res.cookie('SESSION_KEY', session.sessionKey, {httpOnly: true, expires: new Date(session.expirationDate)});
			res.cookie('42_TOKEN', token.data.access_token, {httpOnly: true, expires: new Date(Date.now() + token.data.expires_in * 1000)});
			res.cookie('42_REFRESH', token.data.refresh_token, {httpOnly: true, maxAge: 1000000000});
			return (true);
		}
        return (false); // TODO handle le fait que ce soit pas le meme false que plus haut
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
        }
        const user = await this.sessionService.getUser(req.cookies['SESSION_KEY']);
        if (user.is42User)
            return (user.profilPic);
        return (`http://${process.env.IP_ADDRESS}:3000/users/images/${user.profilPic}`);
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
        return (res.sendFile(imagePath));
    }
    @Get(':pseudoPart')
    async getUsers(@Param('pseudoPart') pseudoPart: string)
    {
        if (pseudoPart.length < 3)
            return ('Not enough chars');
        const res = await this.userService.getUsers(pseudoPart);
        return (res);
    }
}
