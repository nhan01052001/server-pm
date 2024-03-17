import "reflect-metadata";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { BaseEntity, IBaseEntity } from './baseEntity/base.entity';
import { Medicine } from "./medicine.entity";
import { Supplier } from "./supplier.entity";

interface IMedicineDetail extends IBaseEntity {
    origin?: string;
    dateStart?: Date;
    dateEnd?: Date;
    conversionUnit?: string;
    rate?: number;
    importPrice?: number;
    describe?: string;
    manual?: string;
    VAT?: number;
    price?: number;
    quantity?: number;
    unit?: string;
    unitView?: string;
    lsImage?: string;
    supplier?: Supplier;
    medicine?: Medicine;
}

@Entity('MedicineDetail')
export class MedicineDetail extends BaseEntity {
    constructor(props?: IMedicineDetail) {
        const {
            origin,
            dateStart,
            dateEnd,
            conversionUnit,
            rate,
            importPrice,
            describe,
            manual,
            VAT,
            price,
            quantity,
            unit,
            unitView,
            lsImage,
            supplier,
            medicine,
            ...superItem
        } = props || {};;

        super(superItem);

        Object.assign(this, {
            origin,
            dateStart,
            dateEnd,
            conversionUnit,
            rate,
            importPrice,
            describe,
            manual,
            VAT,
            price,
            quantity,
            unit,
            unitView,
            lsImage,
            supplier,
            medicine,
        });
    }

    @Column({ nullable: true, width: 600 })
    origin?: string;

    @Column({ nullable: true, type: 'datetime' })
    dateStart?: Date;

    @Column({ nullable: true, type: 'datetime' })
    dateEnd?: Date;

    @Column({ nullable: true, width: 300 })
    conversionUnit?: string;

    @Column({ nullable: true, type: 'mediumtext' })
    describe?: string;

    @Column({ nullable: true, width: 1024 })
    manual?: string;

    @Column({ nullable: true })
    rate?: number;

    @Column('decimal', { nullable: true, })
    importPrice?: number;

    @Column('decimal', { nullable: true, })
    price?: number;

    @Column('decimal', { nullable: true, })
    VAT?: number;

    @Column({ nullable: true })
    quantity?: number;

    @Column({ nullable: true })
    unit?: string;

    unitView?: string;

    @Column({ nullable: true, type: 'mediumtext' })
    lsImage?: string;

    @OneToOne(() => Medicine, (medicine) => medicine.medicineDetail)
    @JoinColumn()
    medicine?: Medicine;
}