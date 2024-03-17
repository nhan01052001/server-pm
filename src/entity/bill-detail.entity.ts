import "reflect-metadata";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { BaseEntity, IBaseEntity } from './baseEntity/base.entity';
import { Bill } from './bill.entity';
import { Medicine } from "./medicine.entity";

interface IBillDetail extends IBaseEntity {
    price?: number;
    quantity?: number;
    bill?: Bill;
    unit?: string;
    medicine?: string;
}

@Entity('BillDetail')
export class BillDetail extends BaseEntity {
    constructor(props?: IBillDetail) {
        const {
             
            price,
            quantity,
            bill,
            unit,
            medicine,
            ...superItem
        } = props || {};;

        super(superItem);

        Object.assign(this, {
            price,
            quantity,
            bill,
            unit,
            medicine,
        });
    }

    // @PrimaryColumn()
    @Column('decimal', { nullable: true, })
    price?: number;

    @Column({ nullable: true })
    quantity?: number;

    @Column({ nullable: true })
    unit?: string;

    @OneToOne(() => Medicine, (medicine) => medicine.bill)
    // @JoinColumn()
    // @Index({unique: false})
    @Column({ nullable: true })
    medicine?: string;

    @OneToOne(() => Bill, (bill) => bill.billDetail)
    @JoinColumn()
    bill?: Bill;
}