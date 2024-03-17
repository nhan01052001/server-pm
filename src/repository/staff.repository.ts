
import { EntityRepository } from "typeorm";
import { Staff } from "../entity/staff.entity";
import { Repository } from "typeorm";

@EntityRepository(Staff)
export class StaffRepository extends Repository<Staff> {}