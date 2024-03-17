import { Bill } from "../entity/bill.entity";
import { Repository, EntityRepository } from "typeorm";

@EntityRepository(Bill)
export class BillRepository extends Repository<Bill> {}