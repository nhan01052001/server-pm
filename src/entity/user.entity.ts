import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity, IBaseEntity } from './baseEntity/base.entity';
import { Bill } from './bill.entity';
import { Cart } from './cart.entity';
import { provinces } from './provinces.entity';
import { districts } from './districts.entity';
import { wards } from './wards.entity';

export interface IUser extends IBaseEntity {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    fullName?: string;
    avatar?: string;
    phone?: string;
    email?: string;
    gender?: string;
    birthday?: string;
    address?: string;
    isDeleted?: boolean;
    isFirstLogin?: boolean;
    bill?: Bill[];
    cart?: Cart;
    isLoginSocial?: boolean;
    provinces_code?: string;
    districts_code?: string;
    ward_code?: string;
    deliveryAddress?: string;
    // permission?: string[];
    // cart?: string[];
}

@Entity('User')
export class User extends BaseEntity {
    constructor(props?: IUser) {
        const {
            username,
            password,
            firstName,
            lastName,
            fullName,
            avatar,
            phone,
            email,
            gender,
            birthday,
            address,
            isDeleted,
            isFirstLogin,
            bill,
            // permission,
            cart,
            isLoginSocial,
            provinces_code,
            districts_code,
            ward_code,
            deliveryAddress,
            ...superItem
        } = props || {};

        super(superItem);

        Object.assign(this, {
            username,
            password,
            firstName,
            lastName,
            fullName,
            avatar,
            phone,
            email,
            gender,
            birthday,
            address,
            isDeleted,
            isFirstLogin,
            bill,
            // permission,
            cart,
            isLoginSocial,
            provinces_code,
            districts_code,
            ward_code,
            deliveryAddress,
        });
    }

    @Column({ nullable: false, width: 32 | 128 })
    username?: string;

    @Column({ nullable: false, width: 300 })
    password?: string;

    @Column({ nullable: false, width: 300 })
    firstName?: string;

    @Column({ nullable: false, width: 300 })
    lastName?: string;

    @Column({ nullable: true, width: 600 })
    fullName?: string;

    @Column({ nullable: true, width: 128 })
    email?: string;

    @Column({ nullable: true })
    avatar?: string;

    @Column({ nullable: true, width: 32 })
    phone?: string;

    @Column({ nullable: true, width: 32 })
    gender?: string;

    @Column({ nullable: true })
    birthday?: string;

    @Column({ nullable: true, width: 500 })
    address?: string;

    @Column({ nullable: true, default: false })
    isDeleted?: boolean

    @Column({ nullable: true, default: false })
    isFirstLogin?: boolean;

    @OneToMany(() => Bill, (bill) => bill.user)
    bill?: Bill[];

    @OneToOne(() => Cart, (cart) => cart.users)
    cart?: Cart;

    @Column({ nullable: true, default: false })
    isLoginSocial?: boolean;

    @OneToOne(() => provinces)
    @Column({ nullable: true, width: 32 | 128 })
    provinces_code?: string;

    @OneToOne(() => districts)
    @Column({ nullable: true, width: 32 | 128 })
    districts_code?: string;

    @OneToOne(() => wards)
    @Column({ nullable: true, width: 32 | 128 })
    ward_code?: string;

    @Column({ nullable: true, type: 'mediumtext' })
    deliveryAddress?: string;
}