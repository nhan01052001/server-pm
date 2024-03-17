import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { MyJwtGuard } from '../service/guard/myjwt.guard';
import { UserService } from '../service/user.service';
import { User } from '../entity/user.entity';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {

    }

    // @UseGuards(MyJwtGuard)
    @Get('getAllUser')
    getAll(): Promise<unknown> {
        return this.userService.getAll();
    }

    // @UseGuards(MyJwtGuard)
    @Get('getUserById/:id')
    getUserByID(@Param() param: any): Promise<User> {
        return this.userService.getUserByID(param?.id);
    }

    @Get('getUserLoginSocial/:id')
    getUserLoginSocial(@Param() param: any): Promise<User> {
        return this.userService.getUserLoginSocial(param?.id);
    }

    @Post('addDeliveryAddress')
    addDeliveryAddress(@Body() body: {
        id: string,
        deliveryAddress: string
    }): Promise<User> {
        return this.userService.addDeliveryAddress(body);
    }
}
