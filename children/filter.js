import {
    format
} from 'Utils/date'

import {
    value2key,
    keyFindValue
} from 'Utils/tool'

import {
    STATIC_URL,
    SHIPPING_SPACE
} from 'Utils/constants'
//证件类型
export const DOCUMENT_TYPE = {
    NATIONAL_ID: 1,
    VISA: 2,
    PASSPORT: 3,
    BIRTH_CERTIFICATE: 4,
    DRIVING_LICENSE: 5,
    OTHERS: 6
}
export const TITLE_TYPE_OPTIONS = [{
    key: 1,
    value: 'Tuan'
}, {
    key: 2,
    value: 'Nyonya'
}, {
    key: 3,
    value: 'Nona'
}]
export default {
    formatDate(value, fmt = 'YYYY-MM-DD', lang = 'id') {
        // FIX 修复对日期字符串的判断
        let newDate = Date.parse(value);
        if (!!newDate) {
            return format(value, fmt, lang)
        }
        return ''
    },
    week(value) {
        if (!!value) {
            return format(value, 'WW')
        }
        return ''
    },
    formatPrice(price) {
        let parts = '' + price;
        parts = parts.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        return parts;
    },
    formatMoney(number) {
        return (number + '').split('').reverse().join('').replace(/(\d{3})(?=[^$])/g, '$1,').split('').reverse().join('');
    },
    minThour(t) {
        if (t >= 60) {
            if (t % 60 === 0) {
                return (Math.floor(t / 60) + 'J');
            } else {
                return (Math.floor(t / 60) + 'J' + (t % 60) + 'mnt');
            }
        } else {
            return t + 'mnt';
        }
    },
    minThourFull(t) {
        if (!t) return '';
        if (t >= 60) {
            if (t % 60 === 0) {
                return `${Math.floor(t / 60)} jam`;
            } else {
                return `${Math.floor(t / 60)} jam ${(t % 60)} menit`;
            }
        } else {
            return `${t} menit`;
        }
    },
    documentType(type, upperCamelCase = false) {
        return value2key(type, DOCUMENT_TYPE)
    },
    seatType(type) {
        type = type + '';
        return keyFindValue(type, SHIPPING_SPACE);
    },
    formatTitleType(val) {
        return keyFindValue(val, TITLE_TYPE_OPTIONS)
    },
    // 乘客性别
    formatSex(insuranceSex) {
        switch (insuranceSex) {
            case 1:
                return 'Pria';
            case 2:
                return 'Wanita';
            case 3:
                return 'Wanita';
        }
    },
    // 根据知道枚举性别匹配展示字符串
    filterSex(val) {
        switch (val) {
            case 1:
                return 'Pria';
            case 2:
                return 'Wanita';
        }
    },
    // 根据知道枚举投保状态匹配展示字符串
    filterStatus(val) {
        switch (val) {
            case 'INSURE_PRE':
                return 'Proses Pendaftaran';
            case 'INSURE_SUCCESS':
                return 'Sukses';
            case 'INSURE_FAILURE':
                return 'Gagal';
            case 'INSURE_CANCEL':
                return 'Dibatalkan Otomatis';
        }
    },
    formatRefundPolicy(val) { // 退改签政策枚举值(英文对应的印尼文)
        switch (val) {
            case 'PERCENT_BASE_FARE':
                return 'tarif dasar'
            case 'PERCENT_BASE_NAT':
                return 'nat'
            case 'PERCENT_TOTAL_FARE':
                return 'total tarif'
            case 'CANCELLATION_FEE':
                return 'biaya pembatalan'
            case 'ADMIN_FEE':
                return 'biaya administrasi'
            case 'AFTER_PURCHASE':
                return 'setelah pembelian'
            case 'BEFORE_DEPARTURE':
                return 'sebelum keberangkatan'
            case 'AFTER_DEPARTURE':
                return 'setelah keberangkatan'
            default:
                return ''
        }
    },
    formatRefundDate(val) {
        if (val > 100) {
            if (val % 24 === 0) {
                return `${val / 24} Hari `
            } else {
                return `${val / 24} Hari ${val % 24} Jam`
            }
        }
        return `${val} Jam`;
    },
    displayValue(value, arrayData) {
        return keyFindValue(value, arrayData);
    },
    airlineIcon(data) { // 获取航司图标
        if (data) {
            return `${STATIC_URL}flightImage/${data}.png`
        }
        return '';
    },
    formatKey2value(val, dataSource) {
        return keyFindValue(val, dataSource)
    },
    /*
    * params为字符串，将其统一转化成小写，并且首字母大写
    * */
    formatStrLower(val) {
        return val.toLowerCase()
    },
    // 时间差是否大于31天
    formatTimeFn(departureDate, arrivalDate) {
        let showFlag = false
        // 获取一天的毫秒时间戳
        let oneDay = 24 * 3600 * 1000;
        let dates = 31 * oneDay
        if (arrivalDate.getTime() - departureDate.getTime() > dates) showFlag = true
        return showFlag
    },
    parseDate(date) {
        let parts = date.match(/(\d+)/g);
        return new Date(parts[0], parts[1] - 1, parts[2]);
    },
    // getTs(time) {
    //     var arr = time.split(/[- :]/),
    //         _date = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]),
    //         timeStr = Date.parse(_date)
    //     return timeStr
    // },
    parseDateTime(date, time) {
        let parts = date.match(/(\d+)/g);
        let newTime = time.split(':')
        return new Date(parts[0], parts[1], parts[2], newTime[0], newTime[1]);
    },
    filterSeatType(seatType) {
        seatType = seatType + '';
        switch (seatType) {
            case '1':
                return 'Economy';
            case '2':
                return 'Premium_Economy';
            case '3':
                return 'Business';
            case '4':
                return 'Promo';
            case '5':
                return 'First';
        }
    }
}