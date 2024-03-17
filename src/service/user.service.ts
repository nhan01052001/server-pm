import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { ErrorResponse } from '../error/error-response.error';
import { UserRepository } from '../repository/user.repository';
import { ILike } from 'typeorm';
import { ENUM } from '../util/enum.util';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: UserRepository,

    ) { }

    async getAll(): Promise<unknown> {
        return await this.userRepository.find();
    }

    async getUserByUsername(username: string): Promise<User> {
        return await this.userRepository.findOne({ where: { username: ILike(username), isDelete: false, isLoginSocial: false } });
    }

    async getUserByID(id: string): Promise<User> {
        if (id) {
            const user = await this.userRepository.findOne({ where: { id: ILike(id), isDelete: false } });
            delete user.password;
            return user;
        } else {
            throw new ErrorResponse({ ...new BadRequestException('NOT FOUND USER'), errorCode: "NOT_FOUND" });
        }
    }

    async getUserLoginSocial(id: string): Promise<User> {
        return await this.userRepository.findOne({ where: { id: ILike(id), isDelete: false, isLoginSocial: true } });
    }

    async addDeliveryAddress(dataBody: {
        id: string,
        deliveryAddress: string
    }): Promise<unknown> {
        try {
            const { id, deliveryAddress } = dataBody;

            if (id.length > 0 && deliveryAddress.length > 0) {
                const user = await this.getUserByID(id);
                if (user) {
                    // let deliveryAddressTemp: any[] = JSON.parse(user.deliveryAddress);
                    let deliveryAddressNew: any[] = JSON.parse(deliveryAddress);
                    // deliveryAddressTemp.push(deliveryAddressNew);

                    const resultUpdateUser = await this.userRepository.createQueryBuilder()
                        .update('User')
                        .set({ deliveryAddress: JSON.stringify(deliveryAddressNew) })
                        .where("id = :id", { id: id }).andWhere("isDelete = false")
                        .execute();

                    if (resultUpdateUser && resultUpdateUser.affected > 0) {
                        return {
                            status: 200,
                            statusText: ENUM.E_SUCCESS,
                            message: 'Thành công!',
                            data: [],
                        }
                    } else {
                        return {
                            status: 400,
                            statusText: ENUM.E_ERROR,
                            message: 'Không thành công!',
                            data: null,
                        }
                    }
                } else {
                    return {
                        status: 400,
                        statusText: ENUM.E_ERROR,
                        message: 'Không thành công!',
                        data: null,
                    }
                }
            }

            return {
                status: 400,
                statusText: ENUM.E_ERROR,
                message: 'Không thành công!',
                data: null,
            }
        } catch (error) {
            throw new ErrorResponse({ ...new BadRequestException('NOT FOUND USER'), errorCode: "NOT_FOUND" });
        }
    }

}
