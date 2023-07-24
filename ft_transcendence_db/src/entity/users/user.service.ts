import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Users } from './user.entity';
import { Channel } from 'diagnostics_channel';

@Injectable()
export class UserService {
    constructor(
        @Inject('USER_REPOSITORY')
        private userRepository: Repository<Users>,
    ) {}
    
    async callFunction(fct, body)
    {
        let res;
        try
        {
            res = await fct(body);
            return (res);
        }
        catch (error)
        {
            return (false);
        }
    }
    async findAll(): Promise<Users[]>
    {
        return this.userRepository.find();
    }
    
    async signUp(user: Partial<Users>)
    {
        let userFound = await this.userRepository.findOne({where: {pseudo : user.pseudo}});
        if (userFound)
            return ('allready exists');
        const newUser = this.userRepository.create(user);
        return (this.userRepository.save(newUser));
    }
    async signIn(user: Partial<Users>)
    {
        let userFound = await this.userRepository.findOne({where: {pseudo : user.pseudo}});
        if (!userFound)
            return (false);
        if (userFound.password !== user.password)
            return ('Wrong password');
        const result = await this.userRepository.update(userFound.id, { isConnected: true });
        userFound = await this.userRepository.findOne({where: {pseudo : user.pseudo}});
        if (!userFound)
            return (false);
    
        return (userFound);
    }

    async logOut(user: Partial<Users>)
    {
        let userFound = await this.userRepository.findOne({where: {pseudo : user.pseudo}});
        if (!userFound)
            return (false);
        const result = await this.userRepository.update(userFound.id, { isConnected: false });
        userFound = await this.userRepository.findOne({where: {pseudo : user.pseudo}});
        if (!userFound)
            return (false);

        return (userFound);
    }
}
