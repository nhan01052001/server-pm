import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { districts } from './districts.entity';

interface IProvinces {
    code: string;
    name: string;
    name_en?: string;
    full_name: string;
    full_name_en?: string;
    code_name?: string;
    administrative_unit_id?: number;
    administrative_region_id?: number;
    districts?: districts[];
}

@Entity('provinces')
export class provinces {
    constructor(props?: IProvinces) {
        const {
            code,
            name,
            name_en,
            full_name,
            full_name_en,
            code_name,
            administrative_unit_id,
            administrative_region_id,
            districts,
        } = props || {};

        Object.assign(this, {
            code,
            name,
            name_en,
            full_name,
            full_name_en,
            code_name,
            administrative_unit_id,
            administrative_region_id,
            districts,
        });
    }

    @Column({ nullable: false, type: "varchar", width: 20 })
    @PrimaryColumn()
    code?: string;

    @Column({ nullable: false, width: 300 })
    name?: string;

    @Column({ nullable: true, width: 300 })
    name_en?: string;

    @Column({ nullable: false, width: 300 })
    full_name?: string;

    @Column({ nullable: true, width: 300 })
    full_name_en?: string;

    @Column({ nullable: true, type: "varchar", width: 20 })
    code_name?: string;

    @Column({ nullable: true, width: 128 })
    administrative_unit_id?: number;

    @Column({ nullable: true })
    administrative_region_id?: number;

    @OneToMany(() => districts, (districts) => districts.provinces_code)
    districts?: districts[];
}