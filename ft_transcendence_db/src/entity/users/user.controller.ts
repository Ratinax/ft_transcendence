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
        if (body.password.length < 8 || body.password.length > 20)
            throw new InternalServerErrorException('Password should be between 8 and 20 caracteres');
        if (body.pseudo.length < 3 || body.pseudo.length > 8)
            throw new InternalServerErrorException('Login should be between 3 and 8 caracteres');
        const regex = /^[A-Za-z0-9_.]+$/;
        if (!regex.test(body.pseudo))
            throw new InternalServerErrorException('Login should only contains A-Z, a-z, 0-9, and \'._\'');
        const user = await this.userService.signUp(body);
        const session = await this.sessionService.createSession(user.id);
        res.cookie('SESSION_KEY', session.sessionKey, {httpOnly: true, expires: new Date(session.expirationDate)});
        return (true);
    }
    @Post('signin')
    async signIn(@Body() body, @Res({passthrough: true}) res: Response)
    {
        const user = await this.callFunction(this.userService.signIn, body);
        if (!user || user === 'Wrong password')
        {
            throw new InternalServerErrorException('Not good user nor password');
        }
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
    @Post('logout') // TODO implementer logout
    async logOut(@Body() body)
    {
        return (await this.callFunction(this.userService.logOut, body))
    }

    @Get('image-pseudo')
    async getImagePseudo(@Req() req)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        {
            return (null);
        }
        const user = await this.sessionService.getUser(req.cookies['SESSION_KEY']);
        let pp;
        if (user.is42User)
            pp = user.profilPic;
        else
            pp = `http://${process.env.IP_ADDRESS}:3000/users/images/${user.profilPic}`;
        return ({ProfilPic: pp, pseudo: user.pseudo});
    }

    @Get('imageName')
    async getImageName(@Req() req)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        {
            return (null);
        }
        const user = await this.sessionService.getUser(req.cookies['SESSION_KEY']);
        if (user.is42User)
            return (user.profilPic);
        return (`http://${process.env.IP_ADDRESS}:3000/users/images/${user.profilPic}`);
    }
    @Get('imageNameByPseudo/:pseudo')
    async getImageNamePseudo(@Param('pseudo') pseudo, @Req() req)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        {
            return (null);
        }
        const user = (await this.userService.getUser(pseudo))[0];
        if (user.is42User)
        {
            return (user.profilPic);
        }
        return (`http://${process.env.IP_ADDRESS}:3000/users/images/${user.profilPic}`);
    }
    @Get('pseudo')
    async getPSeudo(@Req() req)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        {
            return (null);
        }
        const user = await (this.sessionService.getUser(req.cookies['SESSION_KEY']));
        return (user.pseudo);
    }
    /**
     * get the image according to its name
     * 
     * @param imageName name of the image to get
     * @param res interface already provided without givig it, used to send file to fronted
     * @returns the data of the image
     */
    @Get('/images/:imageName')
    async getImage(@Param('imageName') imageName: string, @Req() req, @Res() res: Response) 
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        {
            return (null);
        }
        const users = await this.userService.getUsers('');
        for (let i = 0; i < users.length; i++)
        {
            if (users[i].profilPic === imageName)
            {
                if (users[i].is42User)
                {
                    return (res.sendFile(imageName));
                }
                break ;
            }
        }
        let imagePath = path.join(__dirname, '../../../', 'images', imageName);
        return (res.sendFile(imagePath));
    }
    @Get('users/:pseudoPart')
    async getUsers(@Param('pseudoPart') pseudoPart: string)
    {
        if (pseudoPart.length < 3)
            return ([]);
        const res = await this.userService.getUsers(pseudoPart);
        return (res);
    }
}