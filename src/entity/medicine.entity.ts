
import "reflect-metadata";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity, IBaseEntity } from './baseEntity/base.entity';
import { MedicineDetail } from "./medicine-detail.entity";
import { Cart } from "./cart.entity";
import { Order } from "./oder.entity";
import { Supplier } from "./supplier.entity";
import { BillDetail } from './bill-detail.entity';

interface IMedicine extends IBaseEntity {
    code?: string;
    name?: string;
    fullName?: string;
    active?: boolean;
    type?: string,
    status?: boolean;
    medicineDetail?: MedicineDetail;
    cart?: Cart;
    bill?: BillDetail;
    order?: Order;
    typeView?: string;
    supplier?: string;
}

@Entity('Medicine')
export class Medicine extends BaseEntity {
    constructor(props?: IMedicine) {
        const {
            code,
            name,
            fullName,
            active,
            type,
            status,
            medicineDetail,
            cart,
            bill,
            order,
            typeView,
            supplier,
            ...superItem
        } = props || {};

        super(superItem);

        Object.assign(this, {
            code,
            name,
            fullName,
            active,
            type,
            status,
            medicineDetail,
            cart,
            bill,
            order,
            typeView,
            supplier
        });
    }

    @Column({ nullable: false, width: 300 })
    code?: string;

    @Column({ nullable: true, width: 300 })
    name?: string;

    @Column({ nullable: true, width: 600 })
    fullName?: string;

    @Column({ nullable: true, default: false })
    active?: boolean;

    @Column({ nullable: true, width: 300 })
    type?: string;

    @Column({ nullable: true })
    status?: boolean;

    @Column({ nullable: true, width: 300 })
    typeView?: string;

    @OneToOne(() => MedicineDetail, (medicineDetail) => medicineDetail.medicine, {cascade: true, nullable: true})
    medicineDetail?: MedicineDetail;

    @OneToOne(() => Cart, (cart) => cart.medicine)
    cart?: Cart;

    @OneToOne(() => BillDetail, (bill) => bill.medicine)
    bill?: BillDetail;

    @OneToOne(() => Supplier, (supplier) => supplier.medicine, { cascade: true, nullable: true })
    @Column({ nullable: true })
    supplier?: string;

    @ManyToOne(() => Order, (order) => order.medicine)
    order?: Order;
}