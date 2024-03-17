import "reflect-metadata";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity, IBaseEntity } from './baseEntity/base.entity';
import { Staff } from "./staff.entity";
import { Medicine } from "./medicine.entity";

interface IOrder extends IBaseEntity {
    staff?: Staff,
    status?: boolean;
    medicine?: Medicine[];
}

@Entity('Order')
export class Order extends BaseEntity {
    constructor(props?: IOrder) {
        const {
            staff,
            status,
            medicine,
            ...superItem
        } = props || {};

        super(superItem);

        Object.assign(this, {
            staff,
            status,
            medicine,
        });
    }

    @Column({ nullable: true })
    status?: boolean;

    @OneToOne(() => Staff, (staff) => staff.order, { cascade: true, nullable: true })
    @JoinColumn()
    staffs?: Staff;

    @OneToMany(() => Medicine, (medicine) => medicine.order)
    medicine?: Medicine[];
}