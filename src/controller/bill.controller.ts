import { Controller, Get, Param, Post, UseGuards, Body } from '@nestjs/common';
import { MyJwtGuard } from '../service/guard/myjwt.guard';
import { Bill } from '../entity/bill.entity';
import { BillService } from '../service/bill.service';

@Controller('bill')
export class BillController {
    constructor(private readonly billService: BillService) {

    }

    // @UseGuards(MyJwtGuard)
    @Post('/confirmBill')
    confirmBill(@Body() body: any): Promise<unknown> {
        return this.billService.confirmBill(body);
    }

    // @UseGuards(MyJwtGuard)
    @Post('/addBill')
    addBill(@Body() body: any): Promise<unknown> {
        return this.billService.addBill(body);
    }

    // @UseGuards(MyJwtGuard)
    @Get('/getBillConfirmed/:id')
    getBillConfirmed(@Param() param: any): Promise<unknown> {
        return this.billService.getBillConfirmed(param?.id);
    }

    // @UseGuards(MyJwtGuard)
    @Get('/getBillDelivering/:id')
    getBillDelivering(@Param() param: any): Promise<unknown> {
        return this.billService.getBillDelivering(param?.id);
    }

    // @UseGuards(MyJwtGuard)
    @Get('/getBillCanceled/:id')
    getBillCanceled(@Param() param: any): Promise<unknown> {
        return this.billService.getBillCanceled(param?.id);
    }

    // @UseGuards(MyJwtGuard)
    @Post('/setDeliveryBills')
    setDeliveryBills(@Body() body: any): Promise<unknown> {
        return this.billService.setDeliveryBills(body?.ids);
    }

    // @UseGuards(MyJwtGuard)
    @Post('/setCanceledBills')
    setCanceledBills(@Body() body: any): Promise<unknown> {
        return this.billService.setCanceledBills(body?.ids);
    }

    @Post('/setReceivedBill')
    setReceivedBill(@Body() body: any): Promise<unknown> {
        return this.billService.setReceivedBill(body?.id);
    }

        // @UseGuards(MyJwtGuard)
        @Get('/getBillReceived/:id')
        getBillReceived(@Param() param: any): Promise<unknown> {
            return this.billService.getBillReceived(param?.id);
        }
}
