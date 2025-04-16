import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'

import style_demo from './style_demo'

//admin
import system from './modules/system'
import research from './modules/research'
import platform from './modules/platform'
import apparatus from './modules/apparatus'
import security from './modules/security'
import news from './modules/news'
import website from './modules/website'
import reagent from './modules/reagent'
import hcs from './modules/hcs'
import charge from './modules/charge'
import booking from './modules/booking'
import platformapply from './modules/platformapply'
import train from './modules/train'
import score from './modules/score'
import log from './modules/log'
import room from './modules/room'
import finance from './modules/finance'
import examine from './modules/examine'
import scientific_examine from './modules/scientific'
import personal_college from './modules/colleges'
import feed from './modules/feed'
import personal_product from './modules/product'
import order from './modules/order'

//index
import index from './modules/index'
//h5
import h5 from './modules/h5'
//personal
import personal_center from './personal/center'
import personal_research from './personal/research'
import personal_platform from './personal/platform'
import personal_apparatus from './personal/apparatus'
import personal_security from './personal/security'
// import personal_news from './personal/news'
import personal_reagent from './personal/reagent'
import personal_charge from './personal/charge'
import personal_booking from './personal/booking'
import personal_platformapply from './personal/platformapply'
import personal_train from './personal/train'
import chemical from './personal/chemical'
import apply_chemical from './personal/applychemical'
import platformroom from './personal/platformroom'
import scientific from './personal/scientific'
import personal_examine from './personal/examine'
import personal_shopping from './personal/shopping'

import store from '../store'
import RackDisplay from '@/components/RackDisplay.vue'


//静态路由，这些路由是所有用户都能访问的， 主要用于基础功能，不受权限管理影响
//登录 注册 找回密码 401、404错误页 首页index
export const constantRoutes = [

  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/register/index'),
    hidden: true
  },
  {
    path: '/room-overview/:id',
    component: () => import('@/views/index/room-overview/index'),
    hidden: true,
    meta: {
      permission: true
    }
  },
  {
    path: '/reset-password',
    component: () => import('@/views/index/reset-password/index'),
    hidden: true,
    meta: {
      permission: true
    }
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/index',
    redirect: '/'
  },
  index,
  h5,
  //feed
  //style_demo
  {
    path: '/rack-display',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '',
        name: 'RackDisplay',
        component: RackDisplay,
        meta: { title: '笼位展示', icon: 'tree' }
      }
    ]
  },
]

//动态路由，主要用于后台管理，这部分路由是基于权限动态加载的
export const asyncRoutes = [{
  path: '/home',
  component: Layout,
  redirect: '/admin-info',
  children: [{
    path: '/admin-info',
    name: 'Home',
    component: () => import('@/views/admin/home/admin'),
    meta: {
      title: '系统信息',
      icon: 'home',
      node: 'admin_info'
    }
  }]
},


  system, //用户管理
  booking, //预约管理
  apparatus, //仪器管理
  charge, //仪器费用管理
  platform, //科研组室管理
  platformapply, //入室管理
  finance, //财务管理
  room, //门禁管理
  research, //课题组管理
  score, //信用分管理
  train, //培训管理
  examine, //考核管理
  scientific_examine, //科研考核
  security, //考试（安全教育）管理
  reagent, //试剂耗材管理
  hcs, //危化品管理
  website, //网站管理
  news, //信息管理
  log, //日志管理
  personal_college, //学校管理
  personal_product, //产品管理
  feed,
  order,

// 404 page must be placed at the end !!!
{
  path: '*',
  redirect: '/404',
  hidden: true
}
]

//动态路由，主要用于个人中心
export const asyncPersonalRoutes = [
  personal_center, //个人中心
  personal_research, //课题组管理
  personal_booking, //仪器预约管理
  personal_apparatus, //仪器管理
  personal_charge, //仪器费用管理
  personal_platform, //科研组室管理
  platformroom, //门禁管理
  personal_examine, //考核管理
  scientific, //科研考核管理
  // personal_platformapply,
  personal_security, //考试管理
  // personal_news,
  personal_train, //培训管理
  personal_reagent, //耗材管理
  // chemical,
  apply_chemical, //申领管理
  personal_shopping, //购物车管理
  // 404 page must be placed at the end !!!
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter = () => new Router({
  mode: 'hash', // require service support 路由模式是 hash（URL 以 # 开头）
  scrollBehavior: () => ({
    y: 0 //每次路由切换以后，页面回到顶部
  }),
  routes: constantRoutes
})
const router = createRouter()

function initRouter(router) {
  // console.log('initRouter')

  router.beforeEach((to, from, next) => {
    // if (to.path == '/') {
    //   return next();
    // }

    return next();

    // let member = store.state.user.member;
    // //如果用户已登录，并且没有通过平台的安全考核，则让用户进入平台安全考核
    // if (member && !member.is_trained) {
    //   return next({
    //     path: '/security',
    //     query: {
    //       redirect: to.fullPath
    //     }
    //   })
    // }
    // console.log('member is ')
    // console.log(member.is_trained)
    // console.log('to is ');
    // console.log(to.path);
    return next()
    // return;
    // if (to.matched.some(record => record.meta.requiresAuth)) {
    //   // this route requires auth, check if logged in
    //   // if not, redirect to login page.
    //   if (!auth.loggedIn()) {
    //     next({
    //       path: '/login',
    //       query: {
    //         redirect: to.fullPath
    //       }
    //     })
    //   } else {
    //     next()
    //   }
    // } else {
    //   next() // 确保一定要调用 next()
    // }
  })
}

initRouter(router)
// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
  initRouter(router)
}

export default router
