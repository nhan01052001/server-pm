import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import { provinces } from './provinces.entity';
import { wards } from './wards.entity';

interface IDistricts {
    code: string;
    name: string;
    name_en?: string;
    full_name?: string;
    full_name_en?: string;
    code_name?: string;
    administrative_unit_id?: number;
    provinces_code?: provinces;
    wards?: wards[];
}

@Entity('districts')
export class districts {
    constructor(props?: IDistricts) {
        const {
            code,
            name,
            name_en,
            full_name,
            full_name_en,
            code_name,
            administrative_unit_id,
            provinces_code,
            wards
        } = props || {};

        Object.assign(this, {
            code,
            name,
            name_en,
            full_name,
            full_name_en,
            code_name,
            administrative_unit_id,
            provinces_code,
            wards
        });
    }

    @Column({ nullable: false, type: "varchar", width: 20 })
    @PrimaryColumn()
    code?: string;

    @Column({ nullable: false, width: 300 })
    name?: string;

    @Column({ nullable: true, width: 300 })
    name_en?: string;

    @Column({ nullable: true, width: 300 })
    full_name?: string;

    @Column({ nullable: true, width: 300 })
    full_name_en?: string;

    @Column({ nullable: true, type: "varchar", width: 20 })
    code_name?: string;

    @Column({ nullable: true, width: 128 })
    administrative_unit_id?: number;

    @ManyToOne(() => provinces, (provinces) => provinces.districts, { cascade: true, nullable: true })
    @JoinColumn({name: 'province_code'})
    provinces_code?: provinces;

    @OneToMany(() => wards, (wards) => wards.district_code)
    wards?: wards[];
}