/**
 * http配置
 */
import axios from 'axios'
import JdIdNativeModule from '../utils/jd-id.native';
import {
    isApp
} from '../utils/isAPP'

import toast from 'Components/Toast/index'

const  API_BASE_URL = 'api'

const goLogin = function (loginUrl) {
    let wlh = window.location.href.indexOf('?') === -1 ? window.location.href + '?t=1' : window.location.href + '&t=1';
    let url = `${loginUrl}${loginUrl.indexOf('?') === -1 ? '?' : '&'}ReturnUrl=${encodeURIComponent(wlh)}`;
    if (isApp()) {
        window.location.href = url;
    } else {
        window.location.replace(url);
    }
}

// 超时时间
axios.defaults.timeout = 5 * 60 * 1000;
axios.defaults.baseURL = API_BASE_URL;
// 请求携带cookie
axios.defaults.withCredentials = true;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
// http请求拦截器
//添加时间戳 防止缓存
axios.interceptors.request.use(function (config) {
    if (config.method.toLowerCase() === 'get') {
        const url = config.url
        const t = new Date().getTime()
        config.url = `${url}${url.indexOf('?') === -1 ? '?' : '&'}t=${t}`

    }
    console.log('axios config: ', config)
    return config
}, function (error) {
    return Promise.reject(error);
});

//统一处理结果
axios.interceptors.response.use(function (response) {
    const data = response.data;
    if (data.code === 203) {
        let JdIdNative = window['JdIdNative'] || JdIdNativeModule
        if (JdIdNative && JdIdNative.isJdIdNative) {
            // FIX 登录成功后的回调函数
            JdIdNative.webViewFocus(() => {
                // alert('webViewFocus JdIdNative')
                window.location.reload()
            })
            // alert('isJdIdNative loginRpc before')
            let loginRpc = JdIdNative.loginRpc();
            loginRpc.login((token) => {
                // alert('isJdIdNative loginRpc token')
                console.log('login:APP登录完成:TOKEN=' + token);
            });
            return {
                code: 203
            }
        } else {
            goLogin(data.data.loginUrl);
            return {
                code: 203
            };
        }
    } else {
        return data;
    }
}, function (error) {
    console.log('axios error', error)
    // TODO 跳转到报错页
    toast('Maaf, sistem kami sedang sibuk. Silakan ulangi kembali');
    return Promise.reject(error);
});

export {
    axios as http
}
export default axios