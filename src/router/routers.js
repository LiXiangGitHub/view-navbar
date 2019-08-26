import Main from '@/components/main'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录',
        hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    meta: {
        hideInMenu: true,
        notCache: true
    },
    children: [
        {
            path: '/home',
            name: 'home',
            meta: {
                hideInMenu: true,
                title: '首页',
                notCache: true,
                icon: 'md-home'
            },
            component: () => import('@/view/single-page/home')
        },
        {
            path: 'message_page',
            name: 'message_page',
            meta: {
                icon: 'md-notifications',
                title: '消息中心'
            },
            component: () => import('@/view/single-page/message/index.vue')
        }
    ]
};

export const page500 = {
    path: '/500',
    name: 'error_500',
    meta: {
        hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
};

export const page401 = {
    path: '/401',
    name: 'error_401',
    meta: {
        hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
};

export const page404 = {
    path: '*',
    name: 'error_404',
    meta: {
        hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
};

//动态添加路由信息
export const appRouter = [
    {
        path: '/view-tms',
        name: 'tms',
        meta: {
            icon: 'md-menu',
            title: '运输管理系统'
        },
        component: Main,
        children: []
    },
    {
        path: '/view-bms',
        name: 'bms',
        meta: {
            icon: 'md-menu',
            title: '财务管理系统'
        },
        component: Main,
        children: []
    },
    {
        path: '/view-qms',
        name: 'qms',
        meta: {
            icon: 'md-menu',
            title: '质量管理系统'
        },
        component: Main,
        children: []
    },
    {
        path: '/view-tcp',
        name: 'tcp',
        meta: {
            icon: 'md-menu',
            title: '运力管理系统'
        },
        component: Main,
        children: []
    },
    {
        path: '/view-pay',
        name: 'pay',
        meta: {
            icon: 'md-menu',
            title: '支付管理系统'
        },
        component: Main,
        children: []
    },
    {
        path: '/view-mpp',
        name: 'mpp',
        meta: {
            icon: 'md-menu',
            title: '定价管理系统'
        },
        component: Main,
        children: []
    },
    {
        path: '/view-crm',
        name: 'crm',
        meta: {
            icon: 'md-menu',
            title: '客户管理系统'
        },
        component: Main,
        children: [
            /*{
                path: 'base',
                name: 'base',
                meta: {
                    icon: 'md-funnel',
                    title: '基础资料'
                },
                // component: () => import('@/view/multilevel/level-2-1.vue')
            },
            {
                path: 'customer',
                name: 'customer',
                meta: {
                    icon: 'md-funnel',
                    title: '客户管理'
                },
            }*/
        ]
    },
    {
        path: '/view-rps',
        name: 'rps',
        meta: {
            icon: 'md-menu',
            title: '报表管理系统',
        },
        component: Main
        /*  children: [
              {
                  path: 'table',
                  name: 'table',
                  meta: {
                      icon: 'md-funnel',
                      title: '表格管理'
                  },
                  // component: () => import('@/view/multilevel/level-2-1.vue')
              },
              {
                  path: 'other',
                  name: 'other',
                  meta: {
                      icon: 'md-funnel',
                      title: '其他管理'
                  },
                  // component: () => import('@/view/multilevel/level-2-3.vue')
              }
          ]*/
    }
];

let converMenus = sessionStorage.getItem('navbar-routers')
let addRouters = []
if (converMenus != null && converMenus != '') {
    converMenus = JSON.parse(converMenus);
    appRouter.forEach(item => {
        item.children = converMenus.filter(m => item.name === m.sysCode)
        if (item.children != null && item.children.length>0)
            addRouters.push(item)
        return item;
    })

}
// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    ...addRouters,
    page500,
    page401,
    page404
];
