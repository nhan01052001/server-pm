import { Medicine } from "../entity/medicine.entity";
import { Repository, EntityRepository } from "typeorm";

@EntityRepository(Medicine)
export class MedicineRepository extends Repository<Medicine> {}