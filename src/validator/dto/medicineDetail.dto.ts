import { Transform } from 'class-transformer';
import { IsEmail, IsEmpty, IsNotEmpty, IsPhoneNumber, IsString, MaxLength, MinLength, IsDate, IsNumber, IsDateString } from 'class-validator';

export class MedicineDetailDTO {

    @IsString()
    origin?: string;

    @IsDateString()
    @IsNotEmpty()
    dateStart?: Date;

    @IsDateString()
    @IsNotEmpty()
    dateEnd?: Date;

    @IsString()
    conversionUnit?: string;

    @IsNumber()
    rate?: number;

    @IsNumber()
    importPrice?: number;

    @IsString()
    @IsNotEmpty()
    describe?: string;

    @IsString()
    manual?: string;

    @IsNumber()
    VAT?: number;

    @IsNumber()
    @IsNotEmpty()
    price?: number;

    @IsNumber()
    @IsNotEmpty()
    quantity?: number;

    @IsString()
    unit?: string;

    @IsString()
    lsImage?: string;

    medicineId?: string;
}