import { EntityRepository } from "typeorm";
import { User } from "../entity/user.entity";
import { Repository } from "typeorm";

@EntityRepository(User)
export class UserRepository extends Repository<User> {}