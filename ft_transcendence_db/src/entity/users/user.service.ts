import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Users } from './user.entity';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcrypt';
import axios from 'axios';

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
     * @param body user to be registered {pseudo, password, image}
     * @returns the new user registered with {pseudo, password, image}
     * @throws InternalServerErrorException in case of failing or user already exists
     */
    async signUp(body: any)
    {
        let imageName;
        let userFound = await this.userRepository.findOne({where: {pseudo : body.pseudo}});
        
        if (userFound)
        {
            throw new InternalServerErrorException('already exists');
        }
        try 
        {
            imageName = await this.uploadImage(body.image)
        }
        catch (e)
        {
            throw new InternalServerErrorException(e);
        }
        const user = {
            pseudo: body.pseudo,
            password: await this.hashedPassword(body.password),
            profilPic: imageName
        };
        const newUser = this.userRepository.create(user);
        const res = await this.userRepository.save(newUser);
        return ({
            pseudo: res.pseudo,
            profilPic: res.profilPic,
            id: res.id,
        });
    }
    async signIn(user: Partial<Users>)
    {
        let userFound = await this.userRepository.findOne({where: {pseudo : user.pseudo}});
        if (!userFound)
            return (false);
        if (!this.comparePasswords(userFound, user.password))
            return ('Wrong password');
        return (userFound);
    }

    async logOut(user: Partial<Users>)
    {
        let userFound = await this.userRepository.findOne({where: {pseudo : user.pseudo}});
        if (!userFound)
            return (false);
        userFound = await this.userRepository.findOne({where: {pseudo : user.pseudo}});
        if (!userFound)
            return (false);
        return (userFound);
    }
    async login42(code)
    {
        const	token = await axios({
            method: 'post',
			url: `https://api.intra.42.fr/oauth/token?client_id=u-s4t2ud-94bfa47720442c69e6266c335aaccc7262119a51ef0af6de8e5c8937db806547&client_secret=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&redirect_uri=http%3A%2F%2F10.0.4.53%3A8080%2F&grant_type=authorization_code&code=${code}`,
		}).catch(console.error);
		return token;
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
            const uniqueFileName = Date.now() + '_' + this.generateRandomString(42) + extension;
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
    /**
     * compare password given with password hashed of channel
     * 
     * @param user user to compare password with
     * @param password password to be compared
     * @returns true | false
     */
    async comparePasswords(user, password: string)
    {
        return (await bcrypt.compare(password + process.env.PEPPER, user.password));
    }
    /**
     * 
     * @param password password to be hashed
     * @returns the hashed version of password
     */
    async hashedPassword(password: string)
    {
        return (await bcrypt.hash(password + process.env.PEPPER, +process.env.SALTROUNDS))
    }
}
