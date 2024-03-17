import { Injectable, BadRequestException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from "../repository/user.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entity/user.entity";
import { UserService } from "./user.service";
import { StaffService } from "./staff.service";
import { Staff } from "../entity/staff.entity";
import { StaffRepository } from "../repository/staff.repository";
import { UserRegisterDTO, EmailDTO, PhoneNumberDTO } from "../validator/dto/user-register.dto";
import { UserLoginDTO } from '../validator/dto/user-login.dto';
import { ErrorResponse } from "../error/error-response.error";


@Injectable({})
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,

        private userService: UserService,

        private staffService: StaffService,

        @InjectRepository(Staff)
        private staffRepository: StaffRepository,

        @InjectRepository(User)
        private userRepository: UserRepository,
    ) { }

    async register(userRegister: UserRegisterDTO, headers: any): Promise<unknown> {
        const { username, password, firstName, lastName } = userRegister;
        let data = null;
        // check username is not exists
        // before check request register from app or web
        if (headers?.isapp === 'true' || headers?.isapp === true) {
            data = await this.userService.getUserByUsername(username);
        } else {
            data = await this.staffService.getStaffByUsername(username);
        }

        if (data) {
            throw new ErrorResponse({ ...new BadRequestException('username is exists!'), errorCode: "USERNAME_EXISTS" });
        } else {
            // register on app
            if (headers?.isapp === 'true' || headers?.isapp === true) {
                if (this.checkUsername(username)) {
                    return this.createAccount(userRegister, true);
                }
            } else {
                // register web main
                return this.createAccount(userRegister, false);
            }
        }
    }

    async login(userLogin: UserLoginDTO, headers: any): Promise<unknown> {
        const { username, password } = userLogin;
        const isApp = headers?.isapp === 'true' || headers?.isapp === true ? true : false;

        if (username && password) {
            let data = null;
            if (isApp) {
                data = await this.userService.getUserByUsername(username);
            } else {
                data = await this.staffService.getStaffByUsername(username);
            }
            if (data) {
                if (!bcrypt.compareSync(password, data.password)) {
                    throw new ErrorResponse({ ... new BadRequestException('Invalid username or password! Please again.'), errorCode: "INVALID_USERNAME_PASSWORD" });
                } else {
                    delete data.password;
                    return {
                        status: 200,
                        statusText: 'SUCCESS',
                        message: 'Thành công!',
                        data: {
                            ...data,
                            accessToken: (await this.signWithToken(data.id, data.username, isApp))
                                .accessToken,
                        },
                    }
                }
            } else {
                throw new ErrorResponse({ ... new BadRequestException('Invalid username or password! Please again.'), errorCode: "INVALID_USERNAME_PASSWORD" });
            }
        } else {
            throw new ErrorResponse({ ... new BadRequestException('username and password is not empty!'), errorCode: "USERNAME_PASSWORD_IS_NOT_EMPTY" });
        }

        return;
    }

    isValidNumberPhone = (numberPhone: string): unknown => {
        return /((0[3|5|7|8|9])+([0-9]{8})|([+]84[3|5|7|8|9])+([0-9]{8}))\b/g.test(numberPhone);
    };

    isValidEmail = (email: string): unknown => {
        return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email));
    }

    checkUsername = (username: string): unknown => {
        const regexNumber = /^\d+\.?\d*$/;

        // check username is email
        if (username.includes('@')) {
            if (this.isValidEmail(username)) {
                return true;
            } else {
                throw new ErrorResponse({ ...new BadRequestException('Email Invalid!'), errorCode: "EMAIL_INVALID" });
            }
        } else {
            // or username is numberPhone
            if (regexNumber.test(username)) {
                // check numberphone valid
                if (this.isValidNumberPhone(username)) {
                    return true;
                } else {
                    throw new ErrorResponse({ ...new BadRequestException('NumberPhone Invalid!'), errorCode: "NUMBERPHONE_INVALID" });
                }
            } else {
                throw new ErrorResponse({ ...new BadRequestException('Email or NumberPhone Invalid!'), errorCode: "USERNAME_INVALID" });
            }
        }
    }

    async createAccount(userRegister: UserRegisterDTO, isApp: boolean): Promise<unknown> {
        debugger
        const { username, password, firstName, lastName } = userRegister;

        let fullName = firstName + " " + lastName;

        try {
            let user = null;
            if (isApp) {
                const newUser = new User({ ...userRegister, password: bcrypt.hashSync(password, 10), fullName, isDeleted: false, isFirstLogin: false });
                user = await this.userRepository.save(newUser);
            } else {
                const newStaff = new Staff({ ...userRegister, password: bcrypt.hashSync(password, 10), fullName, isDeleted: false, isFirstLogin: false });
                user = await this.staffRepository.save(newStaff);
            }
            delete user.password;
            return user;
        } catch (error) {
            throw new ErrorResponse(...error, { errorCode: error.errorCode || "DON'T_CREATE_ACCOUNT!" });
        }
    }

    async signWithToken(userId: string, username: string, isApp: boolean): Promise<{ accessToken: string }> {
        const payload = {
            sub: userId,
            username,
            isApp
        };

        const jwt = await this.jwtService.signAsync(payload, {
            expiresIn: '9999m',
            secret: this.configService.get('JWT_SECRET'),
        });

        return {
            accessToken: jwt,
        };
    }

    async registerWithSocial(dataBody?: any): Promise<unknown> {
        try {
            if (dataBody?.id) {
                let fullName = dataBody?.firstName + " " + dataBody?.lastName;
                const newUser = new User({ ...dataBody, id: dataBody?.id, username: "", fullName: dataBody?.fullName ? dataBody?.fullName : fullName, firstName: dataBody?.firstName, lastName: dataBody?.lastName, password: bcrypt.hashSync("", 10), isDeleted: false, isFirstLogin: false, isLoginSocial: true });
                const user = await this.userRepository.save(newUser);
                delete user.password;
                return user;
            }
            return null;
        } catch (error) {
            throw new ErrorResponse(...error, { errorCode: error.errorCode || "DON'T_CREATE_ACCOUNT!" });
        }
    }
}