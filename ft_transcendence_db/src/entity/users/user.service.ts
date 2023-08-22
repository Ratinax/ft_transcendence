import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Users } from './user.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UserService {
    constructor(
        @Inject('USER_REPOSITORY')
        private userRepository: Repository<Users>,
    ) {}
    /**
     * call a function of UserService
     * 
     * @param fct the fonction to be calleg
     * @param body the body of the function to be called
     * @returns the result of the request
     * @throws InternalServerErrorException in case of failing
     */
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
    /**
     * register a new user
     * 
     * @param body user to be registered {pseudo, password, isConnected, image}
     * @returns the new user registered with {pseudo, password, isConnected, image}
     * @throws InternalServerErrorException in case of failing or user already exists
     */
    async signUp(body: any)
    {
        let imageName;
        let userFound = await this.userRepository.findOne({where: {pseudo : body.pseudo}});
        
        console.log(userFound);
        if (userFound)
        {
            console.log(21)
            throw new InternalServerErrorException('already exists');
        }
        try 
        {
            imageName = await this.uploadImage(body.image)
        }
        catch (e)
        {
            console.log(e)
            throw new InternalServerErrorException(e);
        }
        const user = { // TODO hash password
            pseudo: body.pseudo,
            password: body.password,
            profilPic: imageName,
            isConnected: body.isConnected,
        };
        const newUser = this.userRepository.create(user);
        const res = await this.userRepository.save(newUser);
        return ({
            pseudo: res.pseudo,
            profilPic: res.profilPic,
            isConnected: res.isConnected,
            id: res.id,
        });
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
    /**
     * generate a random string
     * 
     * @param length length of the string to be created
     * @returns the random string created
     */
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
    /**
     * create the image of the user ProfilPic in /images/image_name
     * 
     * @param image content of image
     * @returns the name of the image
     */
    async uploadImage(image: string)
    {
        let extension;
        if (!image)
            extension = '.jpg'
        else
            extension = image.substring(11, 15);
        if (extension === 'jpg;' || extension === 'jpeg')
            extension = '.jpg';
        else if (extension === 'png;')
            extension = '.png'
        try 
        {
            const uniqueFileName = Date.now() + '_' + this.generateRandomString(12) + extension;
            const uploadDirectory = path.join(__dirname, '../../../', 'images');
            await fs.promises.mkdir(uploadDirectory, {recursive: true}); // create directory, if already exists do nothing 
            const filePath = path.join(__dirname, '../../../', 'images', uniqueFileName);
            // Save image with replacing useles chars and convert it to buffer using base 64 codage
            if (!image) // TODO : mettre image par defaut
                return (uniqueFileName);
            const imageBuffer = Buffer.from(image.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''), 'base64'); // remove useless beginning of string
            fs.writeFileSync(filePath, imageBuffer); //create image
            return (uniqueFileName);
        } 
        catch (error) 
        {
            throw new InternalServerErrorException('Failed to save image');
        }
    }
}
