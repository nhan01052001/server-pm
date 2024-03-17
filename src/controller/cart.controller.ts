import { Controller, Get, Param, Post, UseGuards, Body } from '@nestjs/common';
import { MyJwtGuard } from '../service/guard/myjwt.guard';
import { Cart } from '../entity/cart.entity';
import { CartService } from '../service/cart.service';

@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) {

    }

    // @UseGuards(MyJwtGuard)
    @Get('/getCartByProfileID/:id')
    getCartByProfileID(@Param() param: any): Promise<unknown> {
        return this.cartService.getCartByProfileID(param?.id);
    }

    // @UseGuards(MyJwtGuard)
    @Post('/updateQuantityAndPrice')
    updateQuantityAndPrice(@Body() body: any): Promise<unknown> {
        return this.cartService.updateQuantityAndPrice(body)
    }

    // @UseGuards(MyJwtGuard)
    @Post('/deleteItemsInCart')
    deleteItemsInCart(@Body() body: any): Promise<unknown> {
        return this.cartService.deleteItemsInCart(body?.ids);
    }

    // @UseGuards(MyJwtGuard)
    @Get('/getCartOrderByProfileID/:id')
    getCartOrderByProfileID(@Param() param: any): Promise<unknown> {
        return this.cartService.getCartOrderByProfileID(param?.id);
    }

    // @UseGuards(MyJwtGuard)
    @Post('/setStatusItemsInCart')
    setStatusItemsInCart(@Body() body: any): Promise<unknown> {
        return this.cartService.setStatusItemsInCart(body?.ids, body?.isPaid, body?.deliveryAddress);
    }
}
