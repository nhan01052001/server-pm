import { Controller, Post, Req, Body, Get, Param, Headers } from "@nestjs/common";

import { AuthService } from "../service/auth.service";
import { UserRegisterDTO } from "../validator/dto/user-register.dto";
import { UserLoginDTO } from "../validator/dto/user-login.dto";


@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }

    @Post('/register')
    register(@Body() userRegister: UserRegisterDTO, @Headers() headers: any): Promise<unknown> {
        return this.authService.register(userRegister, headers);
    }

    @Post('/login')
    login(@Body() userLogin: UserLoginDTO, @Headers() headers: any): Promise<unknown> {
        return this.authService.login(userLogin, headers);
    }

    @Post('/registerWithSocial')
    registerWithSocial(@Body() body: any): Promise<unknown> {
        return this.authService.registerWithSocial(body);
    }
}