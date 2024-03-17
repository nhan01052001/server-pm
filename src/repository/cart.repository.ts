import { Cart } from "../entity/cart.entity";
import { Repository, EntityRepository } from "typeorm";

@EntityRepository(Cart)
export class CartRepository extends Repository<Cart> {}