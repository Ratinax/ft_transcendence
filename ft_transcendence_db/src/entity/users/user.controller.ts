import { Body, Controller, Get, InternalServerErrorException, Post } from '@nestjs/common';
import { UserService } from './user.service';

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
}
