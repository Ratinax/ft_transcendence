import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor (private readonly userService: UserService) {}
    @Get('')
    async findAll()
    {
        return (await this.userService.findAll());
    }
    
    callFunction(fct, body)
    {
        return (this.userService.callFunction(fct.bind(this.userService), body));
    }

    @Post('signup')
    async signUp(@Body() body)
    {
        return (await this.callFunction(this.userService.signUp, body));
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
