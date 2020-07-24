import axios from 'axios'
import store from '@/store'
import {setToken, getToken, canTurnTo, setTitle} from '@/libs/util'


// import { Spin } from 'iview'
const addErrorLog = errorInfo => {
    const {statusText, status, request: {responseURL}} = errorInfo
    let info = {
        type: 'ajax',
        code: status,
        mes: statusText,
        url: responseURL
    }
    if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
}

class HttpRequest {
    constructor(baseUrl = baseURL) {
        this.baseUrl = baseUrl
        this.queue = {}
    }

    getInsideConfig() {
        const config = {
            baseURL: this.baseUrl,
            withCredentials: true
        }
        return config
    }

    destroy(url) {
        delete this.queue[url]
        if (!Object.keys(this.queue).length) {
            // Spin.hide()
        }
    }

    interceptors(instance, url) {
        // 请求拦截
        instance.interceptors.request.use(config => {

            // config.headers['X-Token'] = Cookies.get('Admin-Token');// 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
            if (config.url === '/oauth/token' && config.method === 'post') {
                config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
                config.headers['Authorization'] = 'Basic d2ViQXBwOndlYkFwcA==';
            } else if (config.url === '/oauth/token?access_token='+getToken() && config.method === 'delete') {
                config.headers['Authorization'] = 'Basic d2ViQXBwOndlYkFwcA==';
            }else if (config.url !== '/user/trans' && config.url !== '/user/login'  && config.url !== '/user/loginout' ) {
                config.headers['Authorization'] = 'bearer '+getToken();
            }

            // 添加全局的loading...
            if (!Object.keys(this.queue).length) {
                // Spin.show() // 不建议开启，因为界面不友好
            }
            this.queue[url] = true
            return config
        }, error => {
            return Promise.reject(error)
        })
        // 响应拦截
        instance.interceptors.response.use(res => {
            this.destroy(url)
            const {data, status} = res
            return {data, status}
        }, error => {
            this.destroy(url)
            let errorInfo = error.response
            if (!errorInfo) {
                const {request: {statusText, status}, config} = JSON.parse(JSON.stringify(error))
                errorInfo = {
                    statusText,
                    status,
                    request: {responseURL: config.url}
                }
            }
            addErrorLog(errorInfo)
            return Promise.reject(error)
        })
    }

    request(options) {
        const instance = axios.create()
        options = Object.assign(this.getInsideConfig(), options)
        this.interceptors(instance, options.url)
        return instance(options)
    }
}

export default HttpRequest
