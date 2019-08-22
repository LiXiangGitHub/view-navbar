import HttpRequest from '@/libs/axios'
import config from '@/config'
// const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
//const baseUrl = config.baseUrl.dev
const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:8100/portal' :
    process.env.NODE_ENV === 'production' ? 'http://mps-ht.chunghwa56.com/portal' : 'http://192.168.1.251:8150/portal';
const axios = new HttpRequest(baseUrl)
export default axios
