import moment from "moment";

export default class Function {
    // copy from HieuTran Leader Team App VnResource
    static isEqual = (item1?: any, item2?: any, addIf?: any): boolean  => {
        let typeItem = Object.prototype.toString.call(item1);
        // kiem tra chung type
        if (typeItem !== Object.prototype.toString.call(item2)) {
            // console.log('kiem tra chung type', 'isEqual');
            return false;
        }

        //Sau khi chung type. Nếu typeItem là object hoặc array thì gọi đệ quy hàm (isEqual)
        if (['[object Array]', '[object Object]'].indexOf(typeItem) > -1) {
            if (!this.compare(item1, item2, addIf)) {
                // console.log('Nếu typeItem là object hoặc array thì gọi đệ quy hàm (isEqual)', 'isEqual');
                return false;
            }
        } else {
            // Nếu typeItem là function thì chuyển về string và so sánh.

            if (typeItem === '[object Function]') {
                if (item1.toString() !== item2.toString()) return false;
            } else if (typeof item1 === 'string' && item1.includes('Date')) {
                if (moment(item1).format('DD/MM/YYYY HH:mm:ss') !== moment(item2).format('DD/MM/YYYY HH:mm:ss'))
                    return false;
            } else if (item1 !== item2) {
                // console.log(item1, item2, 'Hai tham số không bằng nhau', 'isEqual');
                return false;
            }
        }

        return true
    };

    static compare = (
        value: any,
        other: any,
        addIf = (a?: any, b?: any): boolean => {
            return true;
        },
    ): boolean => {
        // hàm kiểm tra 2 phần tử trùng nhau
        // if (addIf == null) {
        //     addIf = () => { return true }
        // }

        // console.log(addIf)
        let type = Object.prototype.toString.call(value);
        // kiem tra chung type
        if (type !== Object.prototype.toString.call(other)) {
            // console.log('kiem tra chung type', 'compare');
            return false;
        }

        // khi 2 props chung type, Kiểm tra 2 prop phải là "Array" hoặc "object"
        if (['[object Array]', '[object Object]'].indexOf(type) < 0) {
            // console.log('Kiểm tra 2 prop phải là "Array" hoặc "object"', 'compare');
            return false;
        }

        let lengthValue = type === '[object Array]' ? value.length : Object.keys(value).length,
            lengthOther = type === '[object Array]' ? other.length : Object.keys(other).length;

        // Kiểm tra length bằng nhau
        if (lengthOther !== lengthValue) {
            // console.log('Kiểm tra length bằng nhau', 'compare');
            return false;
        }
        if (type == '[object Array]') {
            for (let i = 0; i < lengthValue; i++) {
                if (!this.isEqual(value[i], other[i], addIf) && addIf(value[i], other[i])) {
                    return false;
                }
            }
        } else {
            for (let key in value) {
                if (!this.isEqual(value[key], other[key], addIf) && addIf(value[key], other[key])) {
                    //&& key != 'DateUpdate'
                    return false;
                }
            }
        }

        return true;
    };

    static isValidNumberPhone = (numberPhone: string) => {
        return numberPhone.match(
          /((0[3|5|7|8|9])+([0-9]{8})|([+]84[3|5|7|8|9])+([0-9]{8}))\b/g
        );
    };

    static isValidPassword = (password: string) => {
        return password.match(
          /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,20}$/
        );
    };
}