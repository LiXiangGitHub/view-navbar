import Router from 'vue-router'
import {routers} from './routers';
import store from '@/store'
import iView from 'iview'
import {setToken, getToken, canTurnTo, setTitle, getUserId} from '@/libs/util'
import config from '@/config'
import Main from '@/components/main'
//主页面定义
const {homeName} = config

//登录页面定义
const LOGIN_PAGE_NAME = 'login'

//防止页面刷新时菜单丢失,出现404问题
let converMenus = JSON.parse(sessionStorage.getItem('navbar-converMenus'));
let syss = JSON.parse(sessionStorage.getItem('navbar-syss'));

if(converMenus && syss){
    let addRouters = [];
    syss.forEach(item => {
        let sys=
            {
                path: '/view-'+item.sysCode,
                name: item.sysCode,
                meta: {
                    icon: item.sysIcon,
                    title: item.sysName
                },
                component: Main,
                children: converMenus.filter(m => item.sysCode === m.resParCode)
            };
        addRouters.push(sys);

    });

    routers.push(...(addRouters.filter(item => {
        return routers.indexOf(item) < 0
    })));
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
    // if((converMenus==null || syss==null) && to.name !== LOGIN_PAGE_NAME){
    //     //菜单缓存失效且要跳转的页面不是登录页
    //     location.href='/login'
    // }else
    if ((!token || converMenus==null || syss==null) && to.name !== LOGIN_PAGE_NAME) {
        // 未登录（或菜单缓存失效）且要跳转的页面不是登录页
       /* next({
            name: LOGIN_PAGE_NAME // 跳转到登录页
        })*/
        location.href='/login'
    } else if ((!token || converMenus==null || syss==null) && to.name === LOGIN_PAGE_NAME) {
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
                /*next({
                    name: 'login'
                })*/
                location.href='/login'
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
