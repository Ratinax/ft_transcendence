import { BadRequestException, ForbiddenException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Users } from './user.entity';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcrypt';
import axios from 'axios';
import * as speakeasy from 'speakeasy';

@Injectable()
export class UserService {
    constructor(
        @Inject('USER_REPOSITORY')
        private userRepository: Repository<Users>,
    ) {}

    async signUp(body: {pseudo: string, image: string, password: string})
    {
        let imageName;
        let userFound = await this.userRepository.findOne({where: {pseudo : body.pseudo}});
        
        if (userFound)
        {
            throw new ForbiddenException('User already exists');
        }
        try 
        {
            imageName = await this.uploadImage(body.image)
        }
        catch (e)
        {
            throw new BadRequestException(e);
        }
        const user = {
            pseudo: body.pseudo,
            password: await this.hashedPassword(body.password),
            profilPic: imageName,
            nickname: body.pseudo,
        };
        const newUser = this.userRepository.create(user);
        const res = await this.userRepository.save(newUser);
        if (!res)
            return ({pseudo: '', profilPic: '', id: -1});
        return ({
            pseudo: res.pseudo,
            profilPic: res.profilPic,
            id: res.id,
        });
    }
    async signIn(user: {password: string, pseudo: string})
    {
        let userFound = await this.userRepository.findOne({where: {pseudo : user.pseudo}});
        if (!userFound)
            return (false);
        if (!await this.comparePasswords(userFound, user.password))
            return ('Wrong password');
        if (userFound.doubleFa)
        {
            return ({user: userFound, uri: userFound.doubleFaURL})
        }
        return ({user: userFound, uri: false});
    }
    async login42(user: {pseudo: string, profilPic: string})
    {
        let userFromPseudo = await this.userRepository.findOne({where: {pseudo : user.pseudo}});
        let userFrom42 = await this.userRepository.findOne({where: {pseudo : user.pseudo, is42User: true}});
        if (userFromPseudo && !userFrom42)
        	throw new UnauthorizedException('You are not able to access this data')
        else if (!userFromPseudo && !userFrom42)
        {
            const userToCreate = {pseudo: user.pseudo, profilPic: user.profilPic, is42User: true, nickname: user.pseudo};
            const newUser = this.userRepository.create(userToCreate);
            const res = await this.userRepository.save(newUser);
            if (!res)
                return ({pseudo: '', profilPic: '', id: -1});
            return ({user: {
                pseudo: res.pseudo,
                profilPic: res.profilPic,
                id: res.id,
            }, uri: false});
        }
        else if (userFrom42)
        {
            await this.userRepository.save(userFrom42);
            if (userFrom42.doubleFa)
            {
                return ({user: {
                    pseudo: userFrom42.pseudo,
                    profilPic: userFrom42.profilPic,
                    id: userFrom42.id,
                }, uri: userFrom42.doubleFaURL});
            }
            return ({user: userFrom42, uri: false});
        }
    }
    async getToken(code: string)
    {
        try
        {
            const token = await axios({
                method: 'post',
                url: `https://api.intra.42.fr/oauth/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&redirect_uri=${process.env.REDIRECT_URI}&grant_type=authorization_code&code=${code}`,
            })
            return token;
        }
        catch (e)
        {
        	throw new UnauthorizedException('You are not able to access this data')
        }
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
        let extension;
        if (!image)
            return 'default.png';
        else
            extension = image.substring(11, 15);
        if (!this.getImgType(image))
            throw new BadRequestException('Bad file format, (required .png .jpg)');
        if (extension === 'jpg;' || extension === 'jpeg')
            extension = '.jpg';
        else if (extension === 'png;')
            extension = '.png'
        else
            throw new BadRequestException('Bad file format, (required .png .jpg)');
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
            throw new UnauthorizedException('Failed to save image');
        }
    }
    getImgType(fileContent) {      
        const fileSignature = fileContent.substring(11, 14);
        const fileSignature2 = fileContent.substring(11, 15);
        console.log(fileSignature);
        if (fileSignature === 'jpg') {
          return 'png';
        }
        else if (fileSignature === 'png') {
          return 'jpg';
        }
        else if (fileSignature2 === 'jpeg') {
            return 'jpeg';
          }
        else {
          return '';
        }
      }
    async comparePasswords(user: {password: string}, password: string)
    {
        return (await bcrypt.compare(password + process.env.PEPPER, user.password));
    }

    async hashedPassword(password: string)
    {
        return (await bcrypt.hash(password + process.env.PEPPER, +process.env.SALTROUNDS))
    }
    async getMyInfos(token: string): Promise<any>
    {
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
        .where('pseudo LIKE :userPart OR nickname LIKE :userPart', { userPart: `%${userPart}%` })
            .getMany();
        const usersMapped = users.map((user) => ({
            id: user.id, 
            pseudo: user.pseudo, 
            profilPic: (user.is42User && !user.hasPersoPP) ? user.profilPic : `http://${process.env.IP_ADDRESS}:3000/users/image/${user.profilPic}`,
            is42User: user.is42User,
            nickname: user.nickname,
            hasPersoPP: user.hasPersoPP,
            }));
        return (usersMapped);
    }
    async getUser(username: string)
    {
        const users = await this.userRepository.createQueryBuilder('users')
        .where('pseudo = :username', { username: username })
            .getMany();
        const usersMapped = users.map((user) => ({
            id: user.id,
            pseudo: user.pseudo,
            profilPic: user.profilPic,
            is42User: user.is42User,
            doubleFa: user.doubleFa,
            nickname: user.nickname,
            hasPersoPP: user.hasPersoPP,
            }));
        if (!usersMapped)
            return (null)
        return (usersMapped[0]);
    }
    async change2fa(user_id: number)
    {
        let user = await this.userRepository.findOne({where: {id : user_id}});
        if (user)
        {
            if (user.doubleFa)
            {
                user.doubleFa = false;
                user.doubleFaAscii = '';
                user.doubleFaURL = ''; 
            }
            else
            {
                const secret = this.getUri();
                user.doubleFaAscii = secret.ascii;
                user.doubleFaURL = secret.otpauth_url;
            }
            return (await this.userRepository.save(user));
        }
        return (null);
    }
    async validate2Fa(is_validate: boolean, user_id: number)
    {
        let user = await this.userRepository.findOne({where: {id : user_id}});
        if (user)
        {
            user.doubleFa = is_validate;
            if (!is_validate)
            {
                user.doubleFaAscii = '';
                user.doubleFaURL = '';
            }
            return (await this.userRepository.save(user));
        }
        return (null);
    }
    getUri()
    {
        const secret = speakeasy.generateSecret({
            name: 'ft_transcendence',
        });
        return secret;
    }
    async getUserAscii2fa(pseudo: string)
    {
        const user = await this.userRepository.createQueryBuilder('users')
        .where('pseudo = :pseudo', { pseudo: pseudo })
            .getMany();
        if (!user[0])
            return (null);
        return (user[0].doubleFaAscii);
    }
    async changeNickname(user_id: number, newNickname: string)
    {
        const user = await this.userRepository.findOne({where: {id : user_id}});
     
        user.nickname = newNickname;
        return (await this.userRepository.save(user));
    }
    async changePP(user_id: number, image: string)
    {
        if (!this.getImgType(image))
            throw new BadRequestException('Bad file format, (required .png .jpg)');
        const user = await this.userRepository.findOne({where: {id : user_id}});
        let imageName;

        if (!user.is42User || user.hasPersoPP)
        {
            const relativePathDirectory = path.join(__dirname, '../../../', 'images');
            if (user.hasPersoPP)
            {
                try
                {
                    if (fs.existsSync(relativePathDirectory + user.profilPic))
                    {
                        const absolutePath = path.resolve(relativePathDirectory + '/' + user.profilPic);

                        fs.unlink(absolutePath, (err) => {
                            if (err) {
                                console.error('not deleted', err);
                                throw new UnauthorizedException('Error when deleting previous image');
                            }
                        });
                    }
                    else
                        console.error('Did not remove previous pp because did not exists')

                }
                catch (e)
                {
                    console.error('Did not remove previous pp because did not exists')
                }
            }
        }
        imageName = await this.uploadImage(image);
        user.profilPic = imageName;
        user.hasPersoPP = true;
        await this.userRepository.save(user);
        return (imageName);
    }
    
}
