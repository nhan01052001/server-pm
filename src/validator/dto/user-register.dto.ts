import { Transform } from 'class-transformer';
import { IsEmail, IsEmpty, IsNotEmpty, IsPhoneNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class UserRegisterDTO {

    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(128)
    username: string;

    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(300)
    @IsString()
    password: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(300)
    firstName: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(300)
    lastName: string;

    email?: string;

    phone?: string;
}

export class EmailDTO {
    @IsEmail()
    email?: string;
}

export class PhoneNumberDTO {

    @IsPhoneNumber('VN')
    phone?: string;
}