import router from './router'
import store from './store'
import {
  Message
} from 'element-ui'
import {
  Notify
} from 'vant'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {
  getToken
} from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import Vue from 'vue';

NProgress.configure({
  showSpinner: false
}) // NProgress Configuration

const whiteList = ['/login', '/', '/index', '/register']; // no redirect whitelist
const clientType = localStorage.getItem('client-type');

router.beforeEach(async (to, from, next) => {
  // start progress bar
  if (clientType !== 'h5') {
    NProgress.start();
  }

  // set page title
  document.title = getPageTitle(to.meta.title);

  // determine whether the user has logged in
  const hasToken = getToken();

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({
        path: '/'
      });
      if (clientType !== 'h5') NProgress.done()
    } else {
      const hasMember = store.getters.member == undefined || store.getters.member.name;
      if (hasMember) {
        next()
      } else {
        try {
          // get user info
          const {
            nodes,
            auth
          } = await store.dispatch('user/getInfo');

          Vue.prototype.currentFactoryId = store.getters.member.factory_id;
          console.log('currentFactoryId = ' + Vue.prototype.currentFactoryId)

          // generate accessible routes map based on roles
          const accessRoutes = await store.dispatch('permission/generateRoutes', nodes);
          const accessPersonalRoutes = await store.dispatch('personal_permission/generateRoutes', auth.split(
          ','));

          // dynamically add accessible routes
          router.addRoutes(accessRoutes);
          router.addRoutes(accessPersonalRoutes);

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({
            ...to,
            replace: true
          });
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken');
          if (clientType === 'h5') {
            Notify({
              type: 'primary',
              message: (error || 'Has Error'),
              duration: 2 * 1000
            });
            next(`/h5/login`);
          } else {
            Message.info(error || 'Has Error');
            next(`/login?redirect=${to.path}`);
          }
          if (clientType !== 'h5') {
            NProgress.done();
          }
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1 || to.meta.permission) {
      // in the free login whitelist, go directly
      next();
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      if (clientType === 'h5') {
        Notify({
          type: 'primary',
          message: '登录已失效，请重新登录',
          duration: 2 * 1000
        });
        next(`/h5/login`);
      } else {
        next(`/login?redirect=${to.path}`);
      }
      if (clientType !== 'h5') {
        NProgress.done();
      }
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  if (clientType !== 'h5') {
    NProgress.done();
  }
})
