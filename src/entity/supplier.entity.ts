import "reflect-metadata";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity, IBaseEntity } from './baseEntity/base.entity';
import { MedicineDetail } from "./medicine-detail.entity";
import { Medicine } from "./medicine.entity";

interface ISupplier extends IBaseEntity {
    phone?: string;
    email?: string;
    name?: string,
    address?: string;
    status?: boolean;
    medicine?: Medicine;
    provinces_code?: string;
    districts_code?: string;
    ward_code?: string;
}

@Entity('Supplier')
export class Supplier extends BaseEntity {
    constructor(props?: ISupplier) {
        const {
            phone,
            email,
            name,
            address,
            status,
            medicine,
            provinces_code,
            districts_code,
            ward_code,
            ...superItem
        } = props || {};

        super(superItem);

        Object.assign(this, {
            phone,
            email,
            name,
            address,
            status,
            medicine,
            provinces_code,
            districts_code,
            ward_code,
        });
    }

    @Column({ nullable: true, width: 32 })
    phone?: string;

    @Column({ nullable: true, width: 128 })
    email?: string;

    @Column({ nullable: true })
    status?: boolean;

    @Column({ nullable: true, width: 600 })
    name?: string;

    @Column({ nullable: true, width: 600 })
    address?: string;

    @OneToOne(() => Medicine, (medicine) => medicine.supplier)
    medicine?: Medicine;

    @Column({ nullable: false, width: 32 | 128 })
    provinces_code?: string;

    @Column({ nullable: false, width: 32 | 128 })
    districts_code?: string;

    @Column({ nullable: false, width: 32 | 128 })
    ward_code?: string;
}