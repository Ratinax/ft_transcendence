"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const axios_1 = require("axios");
let UserService = exports.UserService = class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async callFunction(fct, body) {
        let res;
        try {
            res = await fct(body);
            return (res);
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    async signUp(body) {
        let imageName;
        let userFound = await this.userRepository.findOne({ where: { pseudo: body.pseudo } });
        if (userFound) {
            throw new common_1.InternalServerErrorException('already exists');
        }
        try {
            imageName = await this.uploadImage(body.image);
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
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
    async signIn(user) {
        let userFound = await this.userRepository.findOne({ where: { pseudo: user.pseudo } });
        if (!userFound)
            return (false);
        if (!this.comparePasswords(userFound, user.password))
            return ('Wrong password');
        return (userFound);
    }
    async login42(user) {
        let userFromPseudo = await this.userRepository.findOne({ where: { pseudo: user.pseudo } });
        let userFrom42 = await this.userRepository.findOne({ where: { pseudo: user.pseudo, is42User: true } });
        if (userFromPseudo && !userFrom42) {
            return (null);
        }
        else if (!userFromPseudo) {
            const newUser = this.userRepository.create(user);
            const res = await this.userRepository.save(newUser);
            return ({
                pseudo: res.pseudo,
                profilPic: res.profilPic,
                id: res.id,
            });
        }
        else if (userFrom42) {
            return (userFrom42);
        }
    }
    async logOut(user) {
        let userFound = await this.userRepository.findOne({ where: { pseudo: user.pseudo } });
        if (!userFound)
            return (false);
        userFound = await this.userRepository.findOne({ where: { pseudo: user.pseudo } });
        if (!userFound)
            return (false);
        return (userFound);
    }
    async getToken(code) {
        try {
            const token = await (0, axios_1.default)({
                method: 'post',
                url: `https://api.intra.42.fr/oauth/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&redirect_uri=${process.env.REDIRECT_URI}&grant_type=authorization_code&code=${code}`,
            });
            return token;
        }
        catch (e) {
            return (null);
        }
    }
    generateRandomString(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters[randomIndex];
        }
        return result;
    }
    async uploadImage(image) {
        let extension;
        if (!image)
            extension = '.jpg';
        else
            extension = image.substring(11, 15);
        if (extension === 'jpg;' || extension === 'jpeg')
            extension = '.jpg';
        else if (extension === 'png;')
            extension = '.png';
        try {
            const uniqueFileName = Date.now() + '_' + this.generateRandomString(42) + extension;
            const uploadDirectory = path.join(__dirname, '../../../', 'images');
            await fs.promises.mkdir(uploadDirectory, { recursive: true });
            const filePath = path.join(__dirname, '../../../', 'images', uniqueFileName);
            if (!image)
                return (uniqueFileName);
            const imageBuffer = Buffer.from(image.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''), 'base64');
            fs.writeFileSync(filePath, imageBuffer);
            return (uniqueFileName);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to save image');
        }
    }
    async comparePasswords(user, password) {
        return (await bcrypt.compare(password + process.env.PEPPER, user.password));
    }
    async hashedPassword(password) {
        return (await bcrypt.hash(password + process.env.PEPPER, +process.env.SALTROUNDS));
    }
    async getMyInfos(token) {
        const userInfos = await (0, axios_1.default)({
            method: 'get',
            url: 'https://api.intra.42.fr/v2/me',
            headers: { Authorization: `Bearer ${token}` }
        }).catch(console.error);
        return userInfos;
    }
    async getUsers(userPart) {
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
};
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('USER_REPOSITORY')),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map