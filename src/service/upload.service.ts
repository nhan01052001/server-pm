import { BadRequestException, Injectable } from '@nestjs/common';
import { ErrorResponse } from '../error/error-response.error';
import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import multer from 'multer';
import config from '../firebase/config.firebase';
import { v4 as uuidv4 } from 'uuid';

initializeApp(config.firebaseConfig);

const storage = getStorage();

// const upload = multer({ storage: multer.memoryStorage() });

@Injectable()
export class UploadService {
    constructor(


        // private readonly userRepository: UserRepository,

    ) { }

    async uploadImage(file: Express.Multer.File): Promise<unknown> {

        console.log(file, 'file');
        try {
            const id = uuidv4();

            const storageRef = ref(storage, `Avatar/${id + "" + file[0].originalname}`);

            // Create file metadata including the content type
            const metadata = {
                contentType: file[0].mimetype,
            };

            // Upload the file in the bucket storage
            const snapshot = await uploadBytesResumable(storageRef, file[0].buffer, metadata);
            //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

            // Grab the public url
            const downloadURL = await getDownloadURL(snapshot.ref);

            return {
                status: 200,
                statusText: 'SUCCESS',
                message: 'File successfully uploaded.!',
                data: {
                    name: file[0]?.originalname,
                    type: file[0]?.mimetype,
                    downloadURL: downloadURL
                },
            }
        } catch (error) {
            throw new ErrorResponse({ ... new BadRequestException(error), errorCode: "FAIL" });
        }
    }

    giveCurrentDateTime = (): string => {
        const today = new Date();
        const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        const dateTime = date + ' ' + time;
        return dateTime;
    }

}
