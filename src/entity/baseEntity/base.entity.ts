import { PrimaryGeneratedColumn, Column, PrimaryColumn, Generated } from 'typeorm';
import * as moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

async function generateId() {
    return await uuidv4();
}

export interface IBaseEntity {
    id?: string;
    createdBy?: number;
    createdAt?: Date;
    updatedBy?: number;
    updatedAt?: Date;
    isDelete?: boolean;
}

export abstract class BaseEntity {

    @Column({ nullable: false, width: 300 })
    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @Column({ nullable: true, type: 'bigint' })
    createdBy?: number;

    @Column({ nullable: true, type: 'datetime', default: () => 'NOW()' })
    createdAt?: Date;

    @Column({ nullable: true, type: 'bigint' })
    updatedBy?: number;

    @Column({ nullable: true, type: 'datetime' })
    updatedAt?: Date;

    @Column({ nullable: true, default: () => false})
    isDelete?: boolean;

    constructor(props?: IBaseEntity) {
        const { id, createdBy, createdAt, updatedBy, updatedAt, isDelete } = props || {};

        if (id) {
            this.id = id;
        }

        if (createdBy) {
            this.createdBy = createdBy;
        }

        if (createdAt) {
            this.createdAt = createdAt;
        }

        if (updatedBy) {
            this.updatedBy = updatedBy;
        }

        if (updatedAt) {
            this.updatedAt = updatedAt;
        }

        if (isDelete) {
            this.isDelete = isDelete;
        }
    }
}