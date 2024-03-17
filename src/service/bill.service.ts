import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorResponse } from '../error/error-response.error';
import { ENUM } from '../util/enum.util';
import { Bill } from '../entity/bill.entity';
import { BillDetail } from '../entity/bill-detail.entity';
import { BillRepository } from '../repository/bill.repository';
import { CartService } from './cart.service';
import { CartRepository } from '../repository/cart.repository';
import { Cart } from '../entity/cart.entity';
import moment from 'moment';

@Injectable()
export class BillService {
    constructor(
        @InjectRepository(Bill)
        private readonly billRepository: BillRepository,

        @InjectRepository(Cart)
        private readonly cartRepository: CartRepository,

        private cartService: CartService,

    ) { }

    async confirmBill(dataBody?: any): Promise<unknown> {
        try {
            const { lsId, userId } = dataBody;
            if (lsId) {
                let carts: any = null;
                if (userId) {
                    carts = await this.cartService.getCartOrderByProfileID(userId);
                }
                console.log(carts, 'carts');


                // await this.billRepository.createQueryBuilder()
                //     .update('Cart')
                //     .set({
                //         status: true
                //     })
                //     .where("id = :id", { id: id }).andWhere("Cart.isDelete = false")
                //     .execute();

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

    // confirm bill
    async addBill(dataBody?: any): Promise<unknown> {
        try {
            const { lsId, userId, staffId, deliveryAddress, note, isPaid } = dataBody;
            if (Array.isArray(lsId) && lsId.length > 0 && staffId) {
                let carts: any = null;
                let bill: any = null;
                // if (userId) {
                //     carts = await this.cartService.getCartOrderByProfileID(userId);
                // }

                await Promise.all(
                    lsId.map(async (item: string) => {
                        carts = await this.cartService.getCartWaitingById(item);
                        if (carts?.id) {
                            const updateCart: any = await this.cartService.confirmCart(carts?.id);
                            if (updateCart?.status === 200) {
                                const newBill = new Bill({
                                    note: note ? note : null,
                                    deliveryAddress: carts?.deliveryAddressTemp ? carts?.deliveryAddressTemp : null,
                                    staff: staffId,
                                    user: carts?.users,
                                    isPaid: carts?.isPaidTemp ? carts?.isPaidTemp : false,
                                    isConfirmed: true,
                                    billDetail: {
                                        medicine: carts?.medicine,
                                        price: Number(carts?.pricePurchase),
                                        unit: carts?.unitPurchase,
                                        quantity: Number(carts?.quantityPurchase),

                                    }
                                });
                                bill = await this.billRepository.save(newBill);
                            }
                        } else {
                            return {
                                status: 500,
                                statusText: ENUM.E_ERROR,
                                message: 'Không tìm thấy đơn hàng để xác nhận!',
                                data: null,
                            };
                        }
                    })
                )

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

    async getBillConfirmed(userId?: string): Promise<unknown> {
        try {
            if (userId && userId.length > 0) {
                const result = await this.cartRepository.query(
                    `
                    select *, Bill.id as billId, b.price as pricePurchase, b.unit as unitPurchase, b.quantity as quantityPurchase from Bill
	                LEFT JOIN BillDetail b ON b.billId = Bill.id
                    LEFT JOIN Medicine m ON m.id = b.medicine
                    LEFT JOIN MedicineDetail d ON m.id = d.medicineId
                    WHERE Bill.isDelete = false AND b.isDelete = false 
                    AND Bill.userId = "${userId}"
                    AND Bill.status = false
                    AND Bill.isConfirmed = true
                    AND Bill.isDelivering = false
                    AND Bill.isCanceled = false
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

    async getBillDelivering(userId?: string): Promise<unknown> {
        try {
            if (userId && userId.length > 0) {
                const result = await this.cartRepository.query(
                    `
                    select *, Bill.id as billId, b.price as pricePurchase, b.unit as unitPurchase, b.quantity as quantityPurchase from Bill
	                LEFT JOIN BillDetail b ON b.billId = Bill.id
                    LEFT JOIN Medicine m ON m.id = b.medicine
                    LEFT JOIN MedicineDetail d ON m.id = d.medicineId
                    WHERE Bill.isDelete = false AND b.isDelete = false 
                    AND Bill.userId = "${userId}" 
                    AND Bill.status = false
                    AND Bill.isDelivering = true
                    AND Bill.isCanceled = false
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

    async getBillCanceled(userId?: string): Promise<unknown> {
        try {
            if (userId && userId.length > 0) {
                const result = await this.cartRepository.query(
                    `
                    select *, Bill.id as billId, b.price as pricePurchase, b.unit as unitPurchase, b.quantity as quantityPurchase from Bill
	                LEFT JOIN BillDetail b ON b.billId = Bill.id
                    LEFT JOIN Medicine m ON m.id = b.medicine
                    LEFT JOIN MedicineDetail d ON m.id = d.medicineId
                    WHERE Bill.isDelete = false AND b.isDelete = false 
                    AND Bill.userId = "${userId}" 
                    AND Bill.isCanceled = true
                    AND Bill.status = false
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

    async setDeliveryBill(id?: string): Promise<unknown> {
        try {
            if (id) {
                await this.billRepository.createQueryBuilder()
                    .update('Bill')
                    .set({
                        isDelivering: true, 
                    })
                    .where("id = :id", { id: id }).andWhere("Bill.isDelete = false")
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

    async setDeliveryBills(ids?: string[]): Promise<unknown> {
        try {
            if (ids && ids.length > 0) {
                let idError = [];

                await Promise.all(
                    ids.map(async (item: string) => {
                        const result: any = await this.setDeliveryBill(item);
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

    async setCanceledBill(id?: string): Promise<unknown> {
        try {
            if (id) {
                await this.billRepository.createQueryBuilder()
                    .update('Bill')
                    .set({
                        isCanceled: true,
                    })
                    .where("id = :id", { id: id }).andWhere("Bill.isDelete = false")
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

    async setCanceledBills(ids?: string[]): Promise<unknown> {
        try {
            if (ids && ids.length > 0) {
                let idError = [];

                await Promise.all(
                    ids.map(async (item: string) => {
                        const result: any = await this.setCanceledBill(item);
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

    async setReceivedBill(id?: string): Promise<unknown> {
        try {
            if (id) {
                const rs = await this.billRepository.createQueryBuilder()
                    .update('Bill')
                    .set({
                        status: true,
                        // updatedAt: moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
                    })
                    .where("id = :id", { id: id }).andWhere("Bill.isDelete = false").andWhere("Bill.isDelivering = true")
                    .execute();

                if(rs.affected <= 0) {
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

    async getBillReceived(userId?: string): Promise<unknown> {
        try {
            if (userId && userId.length > 0) {
                const result = await this.cartRepository.query(
                    `
                    select *, Bill.createdAt as billCreateAt, Bill.id as billId, b.price as pricePurchase, b.unit as unitPurchase, b.quantity as quantityPurchase from Bill
	                LEFT JOIN BillDetail b ON b.billId = Bill.id
                    LEFT JOIN Medicine m ON m.id = b.medicine
                    LEFT JOIN MedicineDetail d ON m.id = d.medicineId
                    WHERE Bill.isDelete = false AND b.isDelete = false 
                    AND Bill.userId = "${userId}" 
                    AND Bill.status = true
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
}
