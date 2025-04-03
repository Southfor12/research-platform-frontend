import axios from 'axios';
import {
  MessageBox,
  Message
} from 'element-ui';
import {
  Notify
} from 'vant';
import store from '@/store';
import {
  getToken
} from '@/utils/auth';
import md5 from 'js-md5';
import {
  Base64
} from 'js-base64';
import router from '@/router';

/**
 * 开发环境：
如果你运行的是开发环境（例如，执行 npm run serve 或 yarn serve），Vue CLI 会加载 .env.development 文件中的环境变量。
因此，VUE_APP_BASE_API 会被设置为 .env.development 中的值，像是 http://192.168.1.26:8000/api/admin。

生产环境：
如果你执行的是生产环境构建（例如，执行 npm run build 或 yarn build），Vue CLI 会加载 .env.production 文件中的环境变量。
因此，VUE_APP_BASE_API 会被设置为 .env.production 中的值，像是 /api/admin 或其他路径。
 */
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000 // request timeout
});

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    let factoryId = parseInt(process.env.VUE_APP_FACTORY_ID);
    // console.log(this.currentFactoryId);

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      // config.headers['X-Token'] = getToken()
      config.headers['Authorization'] = getToken();
    }

    config.headers['Emcme'] = 'yes';
    config.headers['FD'] = factoryId; //1仁济区

    if (config.method === 'get') { // get 请求

    } else if (config.method === 'post') { // post 请求
      //  根据真实数据进行调整
      if (config.data instanceof FormData) { //instanceof  判断 config.data  是否是构造函数

      } else {
        // 第二次请求 数据会序列号 所以需要判断 解除二次序列化
        if (typeof config.data === 'string') {
          config.data = JSON.parse(config.data);
        }
      }
    }


    // console.log('config is')
    // console.log(config)

    return config;
  },
  error => {
    // do something with request error
    return Promise.reject(error);
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    var res = response.data;
    //取消解密 20210611, //开放解密 20210902
    if (typeof res == 'string') {
      //decrypt
      // console.log('response is')
      let origin = res;
      var key = md5('sucwjkey');
      const len = key.length;
      var code = '';
      for (var i = 0; i < res.length; i++) {
        var k = i % len;
        code += String.fromCharCode(res.charCodeAt(i) ^ key.charCodeAt(k));
      }
      code = Base64.decode(code);
      try {
        code = JSON.parse(code)
      } catch (e) {

      }
      res = code;
    }

    const clientType = localStorage.getItem('client-type')
    // if the custom status is not 1, it is judged as an error.
    if (res.status === 400 || res.status === 401) {
      store.dispatch('user/resetToken');
      if (clientType === 'h5') {
        router.push({
          path: "/h5/login"
        });
      } else {
        router.push({
          path: "/login"
        });
      }
    } else if (res.status === 1) {
      // 全局关闭success提示，除非特别指定需要显示
      if (response.config.params && response.config.params.showSuccess) {
        if (clientType === 'h5') {
          Notify({
            type: 'success',
            message: res.msg,
            duration: 2 * 1000
          });
        } else {
          Message({
            message: res.msg,
            type: 'success',
            duration: 2 * 1000
          });
        }
      }
    } else if (res.status === 200) { // 什么都不提示，对用户无感
    } else if (res.status === 801) { //多个地方登录，被迫下线
      MessageBox.alert(res.msg, '提示', {
        confirmButtonText: '确定',
        type: 'info'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload();
        });
      }).catch(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload();
        });
      })
    } else if (res.status === 1000) { // 信息提示
      if (clientType === 'h5') {
        Notify({
          type: 'primary',
          message: res.msg,
          duration: 2 * 1000
        });
      } else {
        Message({
          message: res.msg,
          duration: 2 * 1000
        });
      }
    } else if (res.status === 10006) {
      if (clientType === 'h5') {
        Notify({
          type: 'danger',
          message: res.msg,
          duration: 2 * 1000
        });
      } else {
        Message({
          message: res.msg,
          type: 'error',
          duration: 2 * 1000
        });
      }
      setTimeout(_ => {
        router.push({
          path: "/reset-password"
        });
      }, 1000);
    } else {
      if (clientType === 'h5') {
        Notify({
          type: 'danger',
          message: res.msg,
          duration: 2 * 1000
        });
      } else {
        Message({
          message: res.msg,
          type: 'error',
          duration: 2 * 1000
        });
      }
    }
    return res
  },
  error => {
    let errMsg = '系统错误：' + error
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          errMsg = '请求错误'
          break
        case 401:
          errMsg = '请求未授权，请先登录'
          break
        case 403:
          errMsg = '接口拒绝访问'
          break
        case 404:
          errMsg = '接口不存在'
          break
        case 408:
          errMsg = '请求超时'
          break
        case 500:
          errMsg = '服务器内部错误'
          break
        case 501:
          errMsg = '服务未实现'
          break
        case 502:
          errMsg = '网关错误'
          break
        case 503:
          errMsg = '服务不可用'
          break
        case 504:
          errMsg = '网关超时'
          break
        case 505:
          errMsg = 'HTTP版本不受支持'
          break
        default:
          errMsg = '其他错误'
      }
      errMsg += '，错误代码：' + error.response.status
    } else {
      errMsg = '服务器没有响应，您的网络可能断开了'
    }
    if (clientType === 'h5') {
      Notify({
        type: 'danger',
        message: errMsg,
        duration: 2 * 1000
      });
    } else {
      Message({
        message: errMsg,
        type: 'error',
        duration: 2 * 1000
      });
    }
    return Promise.reject(error);
  }
)

export default service;
