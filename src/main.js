import './set-public-path'
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store'
import iView from 'iview'
import 'iview/dist/styles/iview.css';
import i18n from '@/locale'
import config from '@/config'
import singleSpaVue from 'single-spa-vue';
/**
 * @description 实际打包时应该不引入mock
 */
if (process.env.NODE_ENV !== 'production') require('@/mock')
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
/**
 * @description Single-SPA 应用注册
 */
const vueLifecycles = singleSpaVue({
  Vue,
  appOptions: {
      router,
      i18n,
      store,
      render: (h) => h(App)
  },
});

export const bootstrap = vueLifecycles.bootstrap;
export const mount = vueLifecycles.mount;
export const unmount = vueLifecycles.unmount;