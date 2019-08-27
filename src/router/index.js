import Router from 'vue-router'
import {appRouter,addRouters, routers} from './routers';
import store from '@/store'
import iView from 'iview'
import {setToken, getToken, canTurnTo, setTitle, getUserId} from '@/libs/util'
import config from '@/config'

//主页面定义
const {homeName} = config

//登录页面定义
const LOGIN_PAGE_NAME = 'login'

//防止页面刷新时菜单丢失,出现404问题
let converMenus = sessionStorage.getItem('navbar-routers')
if (converMenus != null && converMenus != '') {
    converMenus = JSON.parse(converMenus);
    appRouter.forEach(item => {
        item.children = converMenus.filter(m => item.name === m.sysCode)
        if (item.children != null && item.children.length>0)
            routers.push(item)
    })
}
//路由信息
const router = new Router({
    routes: routers,
    base: process.env.BASE_URL,
    mode: 'history'
})
/**
 * 鉴权
 * @param to
 * @param access
 * @param next
 */
const turnTo = (to, access, next) => {
    if (canTurnTo(to.name, access, routers))
        next() // 有权限，可访问
    else
        next({replace: true, name: 'error_401'}) // 无权限，重定向到401页面
}
/**
 * 路由前处理
 */
router.beforeEach((to, from, next) => {
    iView.LoadingBar.start()
    const token = getToken()
    if (!token && to.name !== LOGIN_PAGE_NAME) {
        // 未登录且要跳转的页面不是登录页
        next({
            name: LOGIN_PAGE_NAME // 跳转到登录页
        })
    } else if (!token && to.name === LOGIN_PAGE_NAME) {
        // 未登陆且要跳转的页面是登录页
        next() // 跳转
    } else if (token && to.name === LOGIN_PAGE_NAME) {
        // 已登录且要跳转的页面是登录页
        next({
            name: homeName // 跳转到homeName页
        })
    } else {
        if (store.state.user.hasGetInfo) {
            turnTo(to, store.state.user.access, next)
        } else {
            store.dispatch('getUserInfo', {
                userCode: getUserId()
            }).then(user => {
                // 拉取用户信息，通过用户权限和跳转的页面的name来判断是否有权限访问;access必须是一个数组，如：['super_admin'] ['super_admin', 'admin']
                turnTo(to, user.access, next)
            }).catch(() => {
                setToken('')
                console.log('catch')
                next({
                    name: 'login'
                })
            })
        }
    }
})
/**
 * 路由后处理
 */
router.afterEach(to => {
    setTitle(to, router.app)
    iView.LoadingBar.finish()
    window.scrollTo(0, 0)
})

export default router
