import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Users } from './user.entity';
import { Channel } from 'diagnostics_channel';
import * as fs from 'fs';
import * as path from 'path';

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
        catch (e)
        {
            throw new InternalServerErrorException(e);
        }
    }
    async findAll(): Promise<Users[]>
    {
        return this.userRepository.find();
    }
    
    async signUp(body: any)
    {
        let imageName;
        let userFound = await this.userRepository.findOne({where: {pseudo : body.pseudo}});
        if (userFound)
        {
            console.log('pseudo: ', body.pseudo, 'le user :' , userFound)
            throw new InternalServerErrorException('already exists');
        }
        try 
        {
            imageName = await this.uploadImage(body.image)
        }
        catch (e)
        {
            console.log('till here :', e);
            throw new InternalServerErrorException(e);
        }
        const user = {
            pseudo: body.pseudo,
            password: body.password,
            profilPic: imageName,
            isConnected: body.isConnected,
        };
        const newUser = this.userRepository.create(user);
        this.userRepository.save(newUser);
        return ({ statusCode: 200 });
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
    generateRandomString(length: number): string 
    {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          result += characters[randomIndex];
        }
        return result;
    }
    async uploadImage(image: string)
    {
        console.log('image :', image, ': over');
        let extension = image.substring(11, 15);
        if (extension === 'jpg;' || extension === 'jpeg')
            extension = '.jpg';
        else if (extension === 'png;')
            extension = '.png'
        try 
        {
            const uniqueFileName = Date.now() + '_' + this.generateRandomString(12) + extension;
            console.log(uniqueFileName);
            const uploadDirectory = path.join(__dirname, '../../../', 'uploads');
            await fs.promises.mkdir(uploadDirectory, {recursive: true}); // create directory, if already exists do nothing 
            const filePath = path.join(__dirname, '../../../', 'uploads', uniqueFileName);
            // Save image with replacing useles chars and convert it to buffer using base 64 codage
            if (!image)
                return (uniqueFileName);
            const imageBuffer = Buffer.from(image.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''), 'base64');
            fs.writeFileSync(filePath, imageBuffer); //create image
            return (uniqueFileName);
        } 
        catch (error) 
        {
            throw new InternalServerErrorException('Failed to save image');
        }
    }
}
