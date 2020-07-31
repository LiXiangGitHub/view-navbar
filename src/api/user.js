import axios from '@/libs/api.request'
import {getToken, getUserId} from '@/libs/util'

export const login = ({userName, password, captchaCode}) => {

    const data = 'grant_type=password&username=' + userName + '&password=' + password + '&captchaCode=' + captchaCode;

    return axios.request({
        url: '/oauth/token',
        data,
        method: 'post'
    })
}
export const chitu2userlogin = (data) => {

    return axios.request({
        url: '/user/login',
        data,
        method: 'post'
    })
}
export const chitu2userlogout = (data) => {

    return axios.request({
        url: '/user/loginout',
        data,
        method: 'post'
    })
}
export const trans = (data) => {
    return axios.request({
        url: '/user/trans',
        data,
        method: 'post'
    })
}

export const queryMenu = (data) => {
    return axios.request({
        url: '/user/menu/query',
        data,
        method: 'post'
    })
}

export const getUserInfo = (data) => {
    return axios.request({
        url: '/user/query',
        data: data,
        method: 'POST'
    })
}

export const logout = (token) => {
    var data = 'access_token=' + getToken();
    return axios.request({
        url: '/oauth/token?' + data,
        method: 'delete'
    })
}

export const getUnreadCount = () => {
    return axios.request({
        url: 'standing/selectCountStatus',
        method: 'get',
        params: {
            uid: getUserId(),
            type: 'unread'
        }
    })
}

export const getMessage = () => {
    return axios.request({
        url: 'standing/message/init',
        method: 'get',
        params: {
            uid: getUserId()
        }
    })
}

export const getContentByMsgId = msg_id => {
    return axios.request({
        url: 'standing/message/content',
        method: 'get',
        params: {
            msg_id
        }
    })
}

export const hasRead = msg_id => {
    return axios.request({
        url: 'standing/read',
        method: 'post',
        data: {
            standingMessageSerialNo: msg_id,
            uid: getUserId()
        }
    })
}

export const removeReaded = msg_id => {
    return axios.request({
        url: 'standing/deleteOrReduct',
        method: 'post',
        data: {
            standingMessageSerialNo: msg_id,
            uid: getUserId(),
            isDelete: 'Y'
        }
    })
}

export const restoreTrash = msg_id => {
    return axios.request({
        url: 'standing/deleteOrReduct',
        method: 'post',
        data: {
            standingMessageSerialNo: msg_id,
            uid: getUserId(),
            isDelete: 'N'
        }
    })
}

export const orgQuery = orgCode =>{
    return axios.request({
        url: 'org/queryPage',
        method: 'post',
        data: {
            orgCode
        }
    })
}

export const updatePassWord = (data) => {

    return axios.request({
        url: '/user/updatePassWord',
        data,
        method: 'post'
    })
}
export const queryUser = (data) => {

    return axios.request({
        url: 'user/query',
        data,
        method: 'post'
    })
}
export const updateHead = (data) => {

    return axios.request({
        url: '/user/updateHead',
        data,
        method: 'post'
    })
}

