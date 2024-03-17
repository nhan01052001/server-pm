import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorResponse } from '../error/error-response.error';
import { Cart } from '../entity/cart.entity';
import { CartRepository } from '../repository/cart.repository';
import { ENUM } from '../util/enum.util';
import { MedicineRepository } from '../repository/medicines.repository';
import { Medicine } from '../entity/medicine.entity';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart)
        private readonly cartRepository: CartRepository,

        @InjectRepository(Medicine)
        private readonly medicineRepository: MedicineRepository,

    ) { }

    async getCartByProfileID(id?: string): Promise<unknown> {
        try {
            if (id && id.length > 0) {
                const result = await this.cartRepository.query(
                    `
                    select *, c.id as cartId, m.id as medicineID from Cart c
	                    LEFT JOIN User u ON u.id = c.users
                        LEFT JOIN Medicine m ON m.id = c.medicine
                        LEFT JOIN MedicineDetail d ON m.id = d.medicineId
                        WHERE c.isDelete = false AND u.isDelete = false AND m.isDelete = false AND c.status = false
                        AND c.users = "${id}"
                    `
                )

                if (result) {
                    if (Array.isArray(result) && result.length > 0) {
                        result.forEach((element, index) => {
                            if (element?.unitPurchase) {
                                element.unitPurchaseView = [
                                    {
                                        id: index,
                                        name: ENUM[`${element?.unitPurchase.trim()}`],
                                        isHave: true,
                                        isActive: true,
                                        code: element?.unitPurchase,
                                    }
                                ]
                            }
                        })
                    }
                    return {
                        status: 200,
                        statusText: ENUM.E_SUCCESS,
                        message: "Thành công!",
                        data: result,
                    }
                }
            } else {
                return {
                    status: 400,
                    statusText: ENUM.E_ERROR,
                    message: "",
                    data: null,
                }
            }
        } catch (error) {
            throw new ErrorResponse({ ... new BadRequestException(error), errorCode: "FAIL" });
        }
    }

    async getCartById(id: string): Promise<Cart> {
        try {
            if (id.length > 0) {
                const rs = this.cartRepository.createQueryBuilder('Cart')
                    .where('Cart.isDelete = false')
                    .andWhere('Cart.status = false')
                    .andWhere(`Cart.id = "${id}"`).getOne();


                return rs;
            }
        } catch (error) {
            throw new ErrorResponse({ ... new BadRequestException(error), errorCode: "FAIL" });
        }
    }

    async getCartWaitingById(id: string): Promise<Cart> {
        try {
            if (id.length > 0) {
                const rs = this.cartRepository.createQueryBuilder('Cart')
                    .where('Cart.isDelete = false')
                    .andWhere('Cart.status = true')
                    .andWhere(`Cart.id = "${id}"`).getOne();


                return rs;
            }
        } catch (error) {
            throw new ErrorResponse({ ... new BadRequestException(error), errorCode: "FAIL" });
        }
    }

    async getMedicineById(id?: string, column?: string): Promise<Medicine> {
        if (id) {
            const result = await this.medicineRepository
                .createQueryBuilder('Medicine')
                .leftJoinAndSelect('Medicine.medicineDetail', 'd', 'Medicine.id = d.medicineId')
                .where(`Medicine.id = "${id}"`)
                .andWhere("Medicine.isDelete = false").andWhere("d.isDelete = false").getOne();

            let unitView = [];
            result.typeView = ENUM[`${result.type.trim()}`];
            if (result.medicineDetail.unit.length > 0) {
                result.medicineDetail.unit.split(',').map((value, index) => {
                    unitView.push({
                        id: index,
                        name: ENUM[`${value.trim()}`],
                        isHave: true,
                        isActive: false,
                        code: value,
                    })
                })
            }
            result.medicineDetail.unitView = JSON.stringify(unitView);

            return result;
        }
        return null;
    }

    async updateQuantityAndPrice(dataBody?: any): Promise<unknown> {
        try {
            const id = dataBody?.id ? dataBody?.id : null;
            const quantity = dataBody?.quantity ? Number(dataBody?.quantity) : 0;
            const medicineId = dataBody?.medicineId ? dataBody?.medicineId : null;

            if (id && quantity > 0 && medicineId) {
                const medicines = await this.getMedicineById(medicineId);
                const carts = await this.getCartById(id);
                const increase = Number(carts.quantityPurchase) < quantity ? true : false
                const quantityTemp = increase
                    ? quantity - Number(carts.quantityPurchase)
                    : Number(carts.quantityPurchase) - quantity;
                if (medicines) {
                    if (increase && Number(medicines?.medicineDetail?.quantity) < quantityTemp) {
                        return {
                            status: 401,
                            statusText: "ERROR",
                            message: 'Đã hết hàng!',
                            data: [medicineId],
                        }
                    } else {
                        const price = Number(medicines?.medicineDetail?.price) * quantity;
                        const quantityMedicineUpdate = increase ? Number(medicines?.medicineDetail?.quantity) + quantityTemp : Number(medicines?.medicineDetail?.quantity) - quantityTemp;
                        await this.cartRepository.createQueryBuilder()
                            .update('Cart')
                            .set({
                                quantityPurchase: quantity,
                                pricePurchase: price
                            })
                            .where("id = :id", { id: id }).andWhere("Cart.isDelete = false").andWhere('Cart.status = false')
                            .execute();

                        await this.medicineRepository.createQueryBuilder()
                            .update('MedicineDetail')
                            .set({
                                quantity: quantityMedicineUpdate
                            })
                            .where("medicineId = :id", { id: medicineId }).andWhere("MedicineDetail.isDelete = false")
                            .execute();
                    }
                }
            }

            return {
                status: 200,
                statusText: ENUM.E_SUCCESS,
                message: 'Thêm Thành công!',
                data: [],
            }
        } catch (error) {
            throw new ErrorResponse({ ... new BadRequestException(error), errorCode: "FAIL" });
        }
    }

    async deleteItemInCart(id?: string): Promise<unknown> {
        try {
            if (id) {
                const carts = await this.getCartById(id);
                const quantity = Number(carts.quantityPurchase);
                const medicineId = carts?.medicine;
                const medicines = await this.getMedicineById(medicineId);

                if (carts && medicines) {
                    await this.cartRepository.createQueryBuilder()
                        .update('Cart')
                        .set({
                            isDelete: true
                        })
                        .where("id = :id", { id: id }).andWhere("Cart.isDelete = false").andWhere('Cart.status = false')
                        .execute();

                    await this.medicineRepository.createQueryBuilder()
                        .update('MedicineDetail')
                        .set({
                            quantity: Number(medicines.medicineDetail.quantity) + quantity
                        })
                        .where("medicineId = :id", { id: medicineId }).andWhere("MedicineDetail.isDelete = false")
                        .execute();

                    return {
                        status: 200,
                        statusText: ENUM.E_SUCCESS,
                        message: 'Xoá thành công',
                        data: [],
                    };
                }

                return {
                    status: 500,
                    statusText: ENUM.E_ERROR,
                    message: 'Lỗi 500',
                    data: null,
                };
            }

            return {
                status: 500,
                statusText: ENUM.E_ERROR,
                message: 'Lỗi 500',
                data: null,
            };
        } catch (error) {
            throw new ErrorResponse({ ... new BadRequestException(error), errorCode: "FAIL" });
        }
    }

    async deleteItemsInCart(ids?: string[]): Promise<unknown> {
        try {
            if (ids && ids.length > 0) {
                let idError = [];

                await Promise.all(
                    ids.map(async (item: string) => {
                        const result: any = await this.deleteItemInCart(item);
                        if (result?.status !== 200) {
                            idError.push(item);
                        }
                    })
                );

                if (idError.length === ids.length) {
                    return {
                        status: 500,
                        statusText: ENUM.E_ERROR,
                        message: 'Lỗi 500',
                        data: null,
                    };
                }

                return {
                    status: 200,
                    statusText: ENUM.E_SUCCESS,
                    message: 'Xoá thành công',
                    data: [],
                };
            } else {
                return {
                    status: 200,
                    statusText: ENUM.E_SUCCESS,
                    message: '',
                    data: null,
                };
            }
        } catch (error) {
            throw new ErrorResponse({ ... new BadRequestException(error), errorCode: "FAIL" });
        }
    }

    async setStatusItemInCart(id?: string, isPaid?: boolean, deliveryAddress?: string): Promise<unknown> {
        try {
            if (id) {
                let data = {

                };

                if(isPaid) {
                    data = {
                        ...data,
                        isPaidTemp: isPaid,
                    }
                }

                if(deliveryAddress) {
                    if(isPaid) {
                        data = {
                            ...data,
                            deliveryAddressTemp: deliveryAddress,
                        }
                    }
                }
console.log(data, 'data');

                await this.cartRepository.createQueryBuilder()
                    .update('Cart')
                    .set({
                        status: true,
                        ...data
                    })
                    .where("id = :id", { id: id }).andWhere("Cart.isDelete = false")
                    .execute();

                return {
                    status: 200,
                    statusText: ENUM.E_SUCCESS,
                    message: 'Thành công',
                    data: [],
                };
            }

            return {
                status: 500,
                statusText: ENUM.E_ERROR,
                message: 'Lỗi 500',
                data: null,
            };
        } catch (error) {
            throw new ErrorResponse({ ... new BadRequestException(error), errorCode: "FAIL" });
        }
    }

    async setStatusItemsInCart(ids?: string[], isPaid?: boolean, deliveryAddress?: string): Promise<unknown> {
        try {
            if (ids && ids.length > 0) {
                let idError = [];

                await Promise.all(
                    ids.map(async (item: string) => {
                        const result: any = await this.setStatusItemInCart(item, isPaid, deliveryAddress);
                        if (result?.status !== 200) {
                            idError.push(item);
                        }
                    })
                );

                if (idError.length === ids.length) {
                    return {
                        status: 500,
                        statusText: ENUM.E_ERROR,
                        message: 'Lỗi 500',
                        data: null,
                    };
                }

                return {
                    status: 200,
                    statusText: ENUM.E_SUCCESS,
                    message: 'Đặt hàng thành công!',
                    data: [],
                };
            } else {
                return {
                    status: 200,
                    statusText: ENUM.E_SUCCESS,
                    message: '',
                    data: null,
                };
            }
        } catch (error) {
            throw new ErrorResponse({ ... new BadRequestException(error), errorCode: "FAIL" });
        }
    }

    async getCartOrderByProfileID(id?: string): Promise<unknown> {
        try {
            if (id && id.length > 0) {
                const result = await this.cartRepository.query(
                    `
                    select *, c.id as cartId, m.id as medicineID from Cart c
	                    LEFT JOIN User u ON u.id = c.users
                        LEFT JOIN Medicine m ON m.id = c.medicine
                        LEFT JOIN MedicineDetail d ON m.id = d.medicineId
                        WHERE c.isDelete = false AND u.isDelete = false AND m.isDelete = false AND c.status = true
                        AND c.users = "${id}"
                    `
                )

                if (result) {
                    if (Array.isArray(result) && result.length > 0) {
                        result.forEach((element, index) => {
                            if (element?.unitPurchase) {
                                element.unitPurchaseView = [
                                    {
                                        id: index,
                                        name: ENUM[`${element?.unitPurchase.trim()}`],
                                        isHave: true,
                                        isActive: true,
                                        code: element?.unitPurchase,
                                    }
                                ]
                            }
                        })
                    }
                    return {
                        status: 200,
                        statusText: ENUM.E_SUCCESS,
                        message: "Thành công!",
                        data: result,
                    }
                }
            } else {
                return {
                    status: 400,
                    statusText: ENUM.E_ERROR,
                    message: "",
                    data: null,
                }
            }
        } catch (error) {
            throw new ErrorResponse({ ... new BadRequestException(error), errorCode: "FAIL" });
        }
    }

    async confirmCart(id?: string): Promise<unknown> {
        try {
            if (id) {
                await this.cartRepository.createQueryBuilder()
                    .update('Cart')
                    .set({
                        status: true,
                        isDelete: true
                    })
                    .where("id = :id", { id: id }).andWhere("Cart.isDelete = false")
                    .execute();

                return {
                    status: 200,
                    statusText: ENUM.E_SUCCESS,
                    message: 'Thành công',
                    data: [],
                };
            }

            return {
                status: 500,
                statusText: ENUM.E_ERROR,
                message: 'Lỗi 500',
                data: null,
            };
        } catch (error) {
            throw new ErrorResponse({ ... new BadRequestException(error), errorCode: "FAIL" });
        }
    }
}
