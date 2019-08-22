import axios from '@/libs/api.request'
import {getToken} from '@/libs/util'

export const login = ({userName, password, captchaCode}) => {

    const data = 'grant_type=password&username=' + userName + '&password=' + password + '&captchaCode=' + captchaCode;

    return axios.request({
        url: '/oauth/token',
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
        url: 'message/count',
        method: 'get'
    })
}

export const getMessage = () => {
    return axios.request({
        url: 'message/init',
        method: 'get'
    })
}

export const getContentByMsgId = msg_id => {
    return axios.request({
        url: 'message/content',
        method: 'get',
        params: {
            msg_id
        }
    })
}

export const hasRead = msg_id => {
    return axios.request({
        url: 'message/has_read',
        method: 'post',
        data: {
            msg_id
        }
    })
}

export const removeReaded = msg_id => {
    return axios.request({
        url: 'message/remove_readed',
        method: 'post',
        data: {
            msg_id
        }
    })
}

export const restoreTrash = msg_id => {
    return axios.request({
        url: 'message/restore',
        method: 'post',
        data: {
            msg_id
        }
    })
}
