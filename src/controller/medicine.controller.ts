import { Controller, Post, Req, Body, Get, Param, Headers, Query } from "@nestjs/common";

import { MedicinesService } from "../service/medicine.service";
import { MedicineDTO, MedicinesDTO, SaleMedicineDTO } from "../validator/dto/medicine.dto";
import { FindDTO } from "../validator/dto/find.dto";

@Controller('medicine')
export class MedicinesController {
    constructor(
        private medicinesService: MedicinesService
    ) { }

    
    @Post('/addMedicines')
    addMedicines(@Headers() headers: any, @Body() body?: MedicinesDTO): Promise<unknown> {
        return this.medicinesService.addMedicines(headers, body);
    }
    
    @Get('/getMedicineByCode/:code')
    getMedicineByCode(@Param() param: any): Promise<unknown> {
        return this.medicinesService.getMedicineByCode(param?.code);
    }

    @Post('/updateOneMedicine')
    updateOneMedicine(@Headers() headers: any, @Body() body?: any, value?: any): Promise<unknown> {
        return this.medicinesService.updateOneMedicine(headers, body, value);
    }

    @Post('/deleteMedicine')
    deleteMedicine(@Body() body?: any): Promise<unknown> {
        return this.medicinesService.deleteMedicine(body);
    }

    @Post('/revertDeleteMedicine')
    revertDeleteMedicine(@Body() body?: any): Promise<unknown> {
        return this.medicinesService.revertDeleteMedicine(body);
    }

    @Get('/getMedicineById/:id')
    getMedicineById(@Param() param: any): Promise<unknown> {
        return this.medicinesService.getMedicineById(param?.id);
    }

    @Post('/findMedicine/')
    findMedicine(
        @Headers() headers: any, 
        @Query("typeFind") typeFind: string,
        @Query("search") search?: string, 
        @Body() body?: FindDTO
        ): Promise<unknown> {
        return this.medicinesService.findMedicine(headers, search, typeFind, body);
    }

    @Post('/addToCart')
    addToCart(@Headers() headers: any,  @Body() body?: any) : Promise<unknown> {
        return this.medicinesService.addToCart(headers, body );
    }
}