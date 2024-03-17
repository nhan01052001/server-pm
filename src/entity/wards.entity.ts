import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import { districts } from './districts.entity';

interface IWards {
    code: string;
    name: string;
    name_en?: string;
    full_name?: string;
    full_name_en?: string;
    code_name?: string;
    administrative_unit_id?: number;
    districts_code?: districts;
}

@Entity('wards')
export class wards {
    constructor(props?: IWards) {
        const {
            code,
            name,
            name_en,
            full_name,
            full_name_en,
            code_name,
            administrative_unit_id,
            districts_code,
        } = props || {};

        Object.assign(this, {
            code,
            name,
            name_en,
            full_name,
            full_name_en,
            code_name,
            administrative_unit_id,
            districts_code
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

    @ManyToOne(() => districts, (districts) => districts.wards, { cascade: true, nullable: true })
    @JoinColumn({name: 'district_code'})
    district_code?: districts;
}