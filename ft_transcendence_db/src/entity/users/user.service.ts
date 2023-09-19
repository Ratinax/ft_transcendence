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
    async login42(user: Partial<Users>)
    {
        let userFromPseudo = await this.userRepository.findOne({where: {pseudo : user.pseudo}});
        let userFrom42 = await this.userRepository.findOne({where: {pseudo : user.pseudo, is42User: true}});
        if (userFromPseudo && !userFrom42)
        {
            // TODO handle le fait que quelqu'un ai deja ce pseudo et ne soit pas de 42
            return (null);
        }
        else if (!userFromPseudo)
        {
            const newUser = this.userRepository.create(user);
            const res = await this.userRepository.save(newUser);
            return ({
                pseudo: res.pseudo,
                profilPic: res.profilPic,
                id: res.id,
            });
        }
        else if (userFrom42)
        {
            return (userFrom42);
        }
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
    async getToken(code)
    {
        try
        {
            const	token = await axios({
                method: 'post',
                url: `https://api.intra.42.fr/oauth/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&redirect_uri=${process.env.REDIRECT_URI}&grant_type=authorization_code&code=${code}`,
            })
            return token;
        }
        catch (e)
        {
            return (null);
        }
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
            return 'default.png';
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
    async getMyInfos(token) : Promise<any> {
		const	userInfos = await axios({
			method: 'get',
			url: 'https://api.intra.42.fr/v2/me',
			headers: {Authorization: `Bearer ${token}`}
		}).catch(console.error);
		return userInfos;
	}
    async getUsers(userPart: string)
    {
        const users = await this.userRepository.createQueryBuilder('users')
        .where('pseudo LIKE :userPart', { userPart: `%${userPart}%` })
            .getMany();
        console.log(users);
        const usersMapped = users.map((user) => ({
            id: user.id, 
            pseudo: user.pseudo, 
            profilPic: user.profilPic, 
            }));
        return (usersMapped);
    }
}
