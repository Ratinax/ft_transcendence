import { BadRequestException, Body, Controller, ForbiddenException, Get, Param, Post, Query, Req, Res, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { Request, Response } from 'express';
import * as path from 'path';
import { SessionService } from '../sessions/session.service';
import * as speakeasy from 'speakeasy';

@Controller('users')
export class UserController {
    constructor (private readonly userService: UserService, private readonly sessionService: SessionService) {}

    @Post('signup')
    async signUp(@Body() body: {password: string, image: string, pseudo: string}, @Res({passthrough: true}) res: Response)
    {
		if (!body.password || !body.image || !body.pseudo)
			throw new BadRequestException('Uncomplete request');
        if (body.password.length < 8 || body.password.length > 20)
            throw new BadRequestException('Password should be between 8 and 20 caracteres');
        if (body.pseudo.length < 3 || body.pseudo.length > 8)
            throw new BadRequestException('Login should be between 3 and 8 caracteres');
        const regex = /^[A-Za-z0-9_-]+$/;
        if (!regex.test(body.pseudo))
            throw new BadRequestException('Login should only contains A-Z, a-z, 0-9, and \'_\'');
        const user = await this.userService.signUp(body);
        if (!user)
            throw new BadRequestException('Couldn\'t register you');
        const session = await this.sessionService.createSession(user.id);
        if (!session)
            throw new UnauthorizedException('User created but could\'nt sign you in');
        res.cookie('SESSION_KEY', session.sessionKey, {httpOnly: true, expires: new Date(session.expirationDate)});
        return (true);
    }
    @Post('signin')
    async signIn(@Body() body: {password: string, pseudo: string}, @Res({passthrough: true}) res: Response)
    {
		if (!body.password || !body.pseudo)
			throw new BadRequestException('Uncomplete request');
        const result = await this.userService.signIn(body);
        if (!result || result === 'Wrong password')
        {
            throw new BadRequestException('Not good user nor password');
        }
        const user = result.user;
        const uri = result.uri;
        if (user.is42User)
        {
            throw new ForbiddenException('This is a user registered using login with 42');
        }
        if (!uri)
        {
            const session = await this.sessionService.createSession(user.id);
            if (!session)
                throw new UnauthorizedException('Couldn\'t sign you in');
            res.cookie('SESSION_KEY', session.sessionKey, {httpOnly: true, expires: new Date(session.expirationDate)});
            return (true);
        }
        res.cookie('2FAKEY', user.pseudo, {httpOnly: true, expires: new Date(Date.now() + 30000)});
        return (uri);
    }

    @Get('callback42/:code')
    async getToken(@Param('code') code: string, @Res({passthrough: true}) res: Response)
    {
        const token = await this.userService.getToken(code);
        if (token && token.data)
		{
            const infos = await this.userService.getMyInfos(token.data.access_token);
            if (!infos)
                throw new BadRequestException('Couldn\'t log you in');
            const result = await this.userService.login42({pseudo: infos.data.login, profilPic: infos.data.image.link});
            if (!result)
                throw new ForbiddenException('There\'s allready a user with that username');
            const user = result.user;
            const uri = result.uri;
            if (!uri)
            {

                const session = await this.sessionService.createSession(user.id);
                if (!infos)
                    throw new UnauthorizedException('Couldn\'t log you in');
                res.cookie('SESSION_KEY', session.sessionKey, {httpOnly: true, expires: new Date(session.expirationDate)});
                return (true);
            }
            res.cookie('2FAKEY', user.pseudo, {httpOnly: true, expires: new Date(Date.now() + 30000)});
            return (uri);
            
		}
        throw new BadRequestException('Authentication failed, try again later');
    }
    @Post('logOut')
    async logOut(@Req() req: Request, @Res({passthrough: true}) res: Response)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        {
            return (false);
        }
        res.clearCookie('SESSION_KEY');
        return (true);
    }

    @Get('imageNameByPseudo/:pseudo')
    async getImageNamePseudo(@Param('pseudo') pseudo, @Req() req: Request)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        	throw new UnauthorizedException('You are not able to access this data')
        const user = (await this.userService.getUser(pseudo))[0];
        if (!user)
            return ('');
        if (user.is42User && !user.hasPersoPP)
        {
            console.log('here')
            return (user.profilPic);
        }
        console.log(user.profilPic)
        return (`http://${process.env.IP_ADDRESS}:3000/users/image/${user.profilPic}`);
    }
    @Get('pseudo')
    async getPSeudo(@Req() req: Request)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        	throw new UnauthorizedException('You are not able to access this data')
        const user = await (this.sessionService.getUser(req.cookies['SESSION_KEY']));
        if (!user)
            return ('');
        return (user.pseudo);
    }

    @Get('users/:pseudoPart')
    async getUsers(@Param('pseudoPart') pseudoPart: string)
    {
        if (pseudoPart.length < 3)
            return ([]);
        const res = await this.userService.getUsers(pseudoPart);
        return (res);
    }
    @Get('is2fa')
    async getIs2fa(@Param('pseudo') pseudo: string, @Req() req: Request)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        	throw new UnauthorizedException('You are not able to access this data')
        const user = (await this.userService.getUser(pseudo))[0];
        if (!user)
            return (false);
        return (user.doubleFa);
    }
    @Post('change2fa')
    async change2fa(@Req() req: Request)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        	throw new UnauthorizedException('You are not able to access this data')
        const user = await (this.sessionService.getUser(req.cookies['SESSION_KEY']));
        if (!user)
            throw new BadRequestException('Couldn\'t get user');
        const res = await this.userService.change2fa(user.id);
        if (!res)
            throw new UnauthorizedException('Couldn\'t get user');
        return (true);
    }
    @Get('/image/:imageName')
    async getImage(@Param('imageName') imageName: string, @Req() req: Request, @Res() res: Response) 
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        	throw new UnauthorizedException('You are not able to access this data')
        const users = await this.userService.getUsers('');
        for (let i = 0; i < users.length; i++)
        {
            if (users[i].profilPic === imageName)
            {
                if (users[i].is42User && !users[i].hasPersoPP)
                {
                    return (res.sendFile(imageName));
                }
                break ;
            }
        }
        let imagePath = path.join(__dirname, '../../../', 'images', imageName);
        console.log('imagePath')
        return (res.sendFile(imagePath));
    }
    @Get('verify2Fa/:code')
    async verify2Fa(@Param('code') code: string, @Req() req: Request, @Res({passthrough: true}) res: Response)
    {
        if (!req.cookies['2FAKEY'])
            return ('false cause no more cookie');
        const ascii = await this.userService.getUserAscii2fa(req.cookies['2FAKEY']);
        const user = (await this.userService.getUser(req.cookies['2FAKEY']))[0];
        if (!user)
            return ('false cause no more cookie');
        const result = speakeasy.totp.verify({
            secret: ascii,
            encoding: 'ascii',
            token: code,
        })
        if (result === true)
        {
            const session = await this.sessionService.createSession(user.id);
            if (!session)
                return ('false cause no more cookie');
            res.cookie('SESSION_KEY', session.sessionKey, {httpOnly: true, expires: new Date(session.expirationDate)});
        }
        return (result);
    }
    @Get('timeLeft2Fa')
    async getTimeLeft2Fa(@Req() req: Request)
    {
        const twoFaCookie = req.cookies['2FAKEY'];
        if (!twoFaCookie)
            return (-1);
        return true;
    }
    @Get('link2Fa')
    async getLink2Fa(@Req() req: Request)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        	throw new UnauthorizedException('You are not able to access this data')
        const user = await (this.sessionService.getUser(req.cookies['SESSION_KEY']));
        if (!user)
            return (null);
        return (user.doubleFaURL); 
    }
    @Get('doUserExists/:username')
    async getDoUserExists(@Req() req: Request, @Param('username') username: string)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        	throw new UnauthorizedException('You are not able to access this data')
        const user = await this.userService.getUser(username);
        if (!user || !user[0])
            return (false);
        return (true);
    }

    @Get('nickname/:username')
    async nickname(@Req() req: Request, @Param('username') username: string)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        	throw new UnauthorizedException('You are not able to access this data')
        const user = await this.userService.getUser(username);
        if (!user || !user[0])
            return (false);
        return (user[0].nickname);
    }
    @Get('nickname')
    async getNickname(@Req() req: Request, @Param('username') username: string)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        {
        	throw new UnauthorizedException('You are not able to access this data')
        }
        const user = await this.sessionService.getUser(req.cookies['SESSION_KEY']);
        if (!user)
            throw new UnauthorizedException('You are not able to access this data')

        return (user.nickname);
    }
}