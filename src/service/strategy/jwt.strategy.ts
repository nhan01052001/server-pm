import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user.service';
import { User } from '../../entity/user.entity';
import { UserRepository } from '../../repository/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike } from 'typeorm';
import { StaffRepository } from '../../repository/staff.repository';
import { Staff } from '../../entity/staff.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(configService: ConfigService, 
        private userService: UserService,
        @InjectRepository(User)
        private readonly userRepository: UserRepository,

        @InjectRepository(Staff)
        private readonly staffRepository: StaffRepository,
        ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('JWT_SECRET'),
        });
    }

    async validate(payload: { sub: string; username: string, isApp: boolean }) {
        let user = null
        if(payload.isApp === true) {
            user = await this.userRepository.findOne({ where: {id: ILike(payload.sub), isDeleted: false} });
        } else {
            user = await this.staffRepository.findOne({ where: {id: ILike(payload.sub), isDeleted: false} });
        }

        delete user.password;
        return user;
    }
}
