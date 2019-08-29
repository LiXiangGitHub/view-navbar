import './set-public-path'
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store'
import iView from 'iview'
import 'iview/dist/styles/iview.css';
// import i18n from '@/locale'
import config from '@/config'
import singleSpaVue from 'single-spa-vue';
/**
 * @description 实际打包时应该不引入mock
 */
//if (process.env.NODE_ENV !== 'production') require('@/mock')
/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config
/**
 * @description 应用iview组件
*/
Vue.use(iView);

const node_env=process.env.NODE_ENV
//验证码路径 为'' 或者 undefined 将不启用验证码功能
Vue.prototype.$captchaUrl =  node_env === 'development'
    ? 'http://localhost:8100/portal/user/captcha/create'
    : node_env === 'production'
        ? 'http://mps-ht.chunghwa56.com/portal/user/captcha/create'
        : 'http://192.168.1.251:8150/portal/user/captcha/create';

//文件服务器ip地址
Vue.prototype.$fmsHost= node_env === 'development'
    ? 'http://192.168.1.236:8088'
    :node_env === 'production'
        ? 'http://10.0.0.56:8088'
        : 'http://192.168.1.236:8088';

/**
 * @description Single-SPA 应用注册
 */
const vueLifecycles = singleSpaVue({
  Vue,
  appOptions: {
      router,
      // i18n,
      store,
      render: (h) => h(App)
  },
});

export const bootstrap = vueLifecycles.bootstrap;
export const mount = vueLifecycles.mount;
export const unmount = vueLifecycles.unmount;
