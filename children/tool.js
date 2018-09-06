/**
 *  http请求参数序列化
 * @param paramsObj
 * @param arrayFormat
 * @returns String
 *  使用：
 *  参数：paramsObj = {a:[0,1], b: [2, 3]}
 *  参数：arrayFormat = 'indices'
 *  返回值：a[0]=0&a[1]=1&b[0]=2&b[1]=3
 */
export function paramsArrayFormat(paramsObj, arrayFormat = 'indices') {
    let tempArr = [];
    for (let [paramsKey, paramsArr] of Object.entries(paramsObj)) {
        if (Object.prototype.toString.call(paramsArr) !== '[object Array]') {
            break;
        }
        for (let [key, value] of paramsArr.entries()) {
            switch (arrayFormat) {
                // 'a[0]=b&a[1]=c'
                case 'indices': {
                    if (Object.prototype.toString.call(value) === '[object Object]') { // 如果value为对象的时候
                        for (let [objKey, objValue] of Object.entries(value)) {
                            let serializationStr = `${paramsKey}[${key}].${objKey}=${objValue}`;
                            tempArr.push(serializationStr);
                        }
                    } else {
                        let serializationStr = `${paramsKey}[${key}]=${value}`;
                        tempArr.push(serializationStr);
                    }
                    break;
                }
                // 'a[]=b&a[]=c'
                case 'brackets': {
                    let serializationStr = `${paramsKey}[]=${value}`;
                    tempArr.push(serializationStr);
                    break;
                }
                // 'a=b&a=c'
                case 'repeat': {
                    let serializationStr = `${paramsKey}=${value}`;
                    tempArr.push(serializationStr);
                    break;
                }
                default: {
                    return paramsArr;
                }
            }
        }
    }
    return tempArr.join('&');
}

//姓名判断
export function isName(text) {
    return /^[a-zA-Z\s]+$/.test(text)
}

//手机号
export function isPhoneNo(text) {
    return /^0?8\d{7,11}$/.test(text)
}

//邮箱
export function isEmail(text) {
    return /^(?:[a-z0-9]+[_\-+.]+)*[a-z0-9]+@(?:([a-z0-9]+-?)*[a-z0-9]+.)+([a-z]{2,})+$/i.test(text)
}

export function value2key(value, obj, upperCamelCase = false) {
    if (!obj) {
        return ''
    }
    const key = Object.keys(obj).filter(key => obj[key] === value).join('')
    return upperCamelCase ? (key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()) : key
}

/**
 *  数组元素为对象，用key取value
 * @param key
 * @param arrData 必须为数组对象
 * @returns {string}
 *  使用：
 *  参数：key = '2'
 *  参数：arrData = '[{
                                    key: '1',
                                    value: 'Economy'
                                }, {
                                    key: '2',
                                    value: 'Business'
                                }, {
                                    key: '3',
                                    value: 'Premium Economy'
                                }]
 *  返回值：Business
 */
export function keyFindValue(key, arrData) {
    if (!arrData.length) {
        return ''
    }
    if (typeof arrData[0] === 'object') {
        // FIX es6 array find
        const match = arrData.find(option => {
            return option.key === key
        })
        if (match) {
            return match.value
        }
    }
}

/**
 *
 * @param method 函数
 * @param delay 延迟执行
 * @param time 触发时间
 * @returns {Function}
 */
export function throttle(method, delay = 600, time = 400) {
    let timeout, startTime = new Date();
    return function () {
        let context = this,
            args = arguments,
            curTime = new Date();
        clearTimeout(timeout);
        // 如果达到了规定的触发时间间隔，触发 handler
        if (curTime - startTime >= time) {
            method.apply(context, args);
            startTime = curTime;
            // 没达到触发间隔，重新设定定时器
        } else {
            timeout = setTimeout(method, delay);
        }
    }
}

// 页面刷新
export function refreshPage(forcedReload = true) {
    window.location.reload(forcedReload)
}

/**
 * @param  {Array} dateString
 * 把所有数据根据checked为true过滤出来
 */
export function filterData(arrayList) {
    let selectPassenger = []
    // 过滤数组，根据checked属性是否为true，判断投保人是否被选中，true代表选中
    // 最后返回一个新数组，为全部投保人全部选中数据
    arrayList.forEach((item) => {
        if (item.checked === true) {
            selectPassenger.push(item)
        }
    })
    return selectPassenger
}

/*
 * dateString {params:出生日期}
 * 根据出生日期获取年龄
 */
export function parseGetAge(dateString) {
    let today = new Date();
    let birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    if (m > 0 || (m === 0 && today.getDate() > birthDate.getDate())) {
        age++
    }
    return age;
}