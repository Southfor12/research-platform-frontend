// import "@babel/polyfill";
import Vue from 'vue';

//引入重置样式
import 'normalize.css/normalize.css'; // A modern alternative to CSS resets

//vant是手机端的UI库
//Element是PC端的UI组件库
import Vant from 'vant';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/styles/element-variables.scss';


import locale from 'element-ui/lib/locale/lang/zh-CN'; // lang i18n


import Viser from 'viser-vue';
import VueClipboards from 'vue-clipboard2';
import FullCalendar from 'vue-full-calendar';

import {
  mapGetters
} from 'vuex';
import VueBus from 'vue-bus';

import {
  Base64
} from 'js-base64';
import md5 from 'js-md5';
import {
  encrypt,
  decrypt
} from './utils/RenJiUtils';

import CommonMixin from '@/mixins/common';

//引入自己写的CSS全局样式
import './styles/index.scss'; // global css

//引入APP组件
import App from './App';

//引入仓库
import store from './store';

//引入路由
import router from './router';

//引入自己封装的icon图标
import '@/icons'; // icon

//引入权限模块，非常重要
import '@/permission'; // permission control

import {
  allFactory
} from '@/api/factory';

// set ElementUI lang to EN
Vue.use(ElementUI, {
  locale
});
Vue.use(Viser);
Vue.use(VueClipboards);
Vue.use(FullCalendar);
Vue.use(Vant);
Vue.use(VueBus);

Vue.prototype.navTo = function(url) {
  this.$router.push(url);
}

Vue.prototype.navOpen = function(url) {
  let routeUrl = this.$router.resolve({
    path: url,
  });
  window.open(routeUrl.href, '_blank');
}

//加密与解密数据
Vue.prototype.encrypt = encrypt;
Vue.prototype.decrypt = decrypt;

//存储工厂ID到名称的映射
let factoryIdToName = {};
// 存储工厂列表
let factories = [];

// 从 localStorage 获取工厂数据
if (localStorage.getItem('factories')) {
  try {
    factories = JSON.parse(localStorage.getItem('factories'))
  } catch (e) {

  }
}
// 从 localStorage 获取工厂ID与名称的映射
if (localStorage.getItem('factory_id_to_name')) {
  try {
    factoryIdToName = JSON.parse(localStorage.getItem('factory_id_to_name'))
  } catch (e) {

  }
// 这样可以在页面加载时，从 localStorage 恢复工厂数据。🚀
}

//系统的厂家ID
Vue.prototype.currentFactoryId = 1;

Vue.prototype.getFactoryName = function(factoryId) {
  if (factoryId == 0) {
    return '通用';
  }

  if (factoryIdToName[factoryId]) {
    return factoryIdToName[factoryId];
  }

  return factoryId;
}

//获取当前单位名称
Vue.prototype.getCurrentFactoryName = function() {
  return this.getFactoryName(this.currentFactoryId);
}

//todo获取可以选择的单位信息；
//如果是全单位系统管理员，则可以选择全部单位；如果是特定单位的管理员，只能选择特定单位
//给后台管理系统使用
Vue.prototype.getSelectableFactories = function() {
  //todo(区分全单位件系统管理员或特定单位管理员)

  return factories;
}

Vue.mixin(CommonMixin);
Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  store,
  data: {

  },
  //使用 Vuex 的 mapGetters() 从 store 获取 member 这个状态，方便组件使用。
  computed: {
    ...mapGetters(['member']),
  },
  render: h => h(App),
  methods: {
    onFactoryIdChange(newId) {
      console.log('onFactoryIdChange' + newId)
    }
  },
  mounted: function() {
    // console.log('on mounted');

    this.$bus.on('onFactoryIdChange', this.onFactoryIdChange)
    //查询所有厂家
    allFactory().then(res => {
      if (res.status == 200) {
        factories = res.data;
        // console.log(factories);
        res.data.forEach(factory => {
          factoryIdToName[factory.id] = factory.name;
        })

        localStorage.setItem("factories", JSON.stringify(factories));
        localStorage.setItem("factory_id_to_name", JSON.stringify(factoryIdToName));
      }
    })
  }
})
/**
 *  这份 main.js 主要用于
✅ 初始化 Vue 项目（引入插件、样式、权限控制）。
✅ 挂载全局方法（路由跳转、加密解密、厂家管理）。
✅ 监听事件总线（动态更新厂家 ID）。
✅ 缓存厂家数据（减少 API 请求，提高性能）。

这份代码是 Vue-Element-Admin 项目的 main.js，它的核心作用是 初始化 Vue 应用，
并提供全局功能，
保证项目的权限管理、厂家管理、全局事件等功能能顺利运行。🚀
 */