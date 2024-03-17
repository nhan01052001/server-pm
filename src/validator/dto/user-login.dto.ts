import { Transform } from 'class-transformer';
import { IsEmail, IsEmpty, IsNotEmpty, IsPhoneNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class UserLoginDTO {

    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(128)
    username: string;

    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(300)
    @IsString()
    password: string;
}