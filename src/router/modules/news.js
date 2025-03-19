import Layout from '@/layout'

const news = {
  path: '/news',
  component: Layout,
  redirect: '/news/list',
  name: 'news',
  meta: {
    title: '信息管理',
    icon: 'news',
    node: 'news_management',
    activeClass: 'news'
  },
  alwaysShow: true,
  children: [
    // {
    //   path: '/news/list',
    //   name: 'newsList',
    //   component: () => import('@/views/admin/news/list'),
    //   meta: { title: '信息列表', node: 'news_list', activeClass: 'news' }
    // },
    // {
    //   path: '/news/add',
    //   name: 'newsAdd',
    //   component: () => import('@/views/admin/news/add'),
    //   hidden: true,
    //   meta: { title: '新建信息', node: 'add_news', activeMenu: '/news/list', preName: '信息列表', activeClass: 'news' }
    // },
    // {
    //   path: '/news/edit/:id',
    //   name: 'newsEdit',
    //   component: () => import('@/views/admin/news/add'),
    //   hidden: true,
    //   meta: { title: '修改信息', node: 'edit_news', activeMenu: '/news/list', preName: '信息列表', activeClass: 'news' }
    // }
    {
      path: '/news-notice/list',
      name: 'newsNoticeList',
      component: () => import('@/views/admin/news/news-notice/list'),
      meta: {
        title: '信息公告',
        node: 'news_notice',
        activeClass: 'news'
      }
    },
    {
      path: '/news-notice/add',
      name: 'newsNoticeAdd',
      component: () => import('@/views/admin/news/news-notice/edit'),
      hidden: true,
      meta: {
        title: '新建信息公告',
        node: 'add_news_notice',
        activeMenu: '/news-notice/list',
        preName: '信息公告',
        activeClass: 'news'
      }
    },
    {
      path: '/news-notice/edit/:id',
      name: 'newsNoticeEdit',
      component: () => import('@/views/admin/news/news-notice/edit'),
      hidden: true,
      meta: {
        title: '修改信息公告',
        node: 'edit_news_notice',
        activeMenu: '/news-notice/list',
        preName: '信息公告',
        activeClass: 'news'
      }
    },
    {
      path: '/education/list',
      name: 'news_educationList',
      component: () => import('@/views/admin/news/education/list'),
      meta: {
        title: '科研教学信息',
        node: 'education_list',
        activeClass: 'news'
      }
    },
    {
      path: '/education/add',
      name: 'educationAdd',
      component: () => import('@/views/admin/news/education/edit'),
      hidden: true,
      meta: {
        title: '新建科研教学信息',
        node: 'add_education',
        activeMenu: '/education/list',
        preName: '科研教学信息',
        activeClass: 'news'
      }
    },
    {
      path: '/education/edit/:id',
      name: 'educationEdit',
      component: () => import('@/views/admin/news/education/edit'),
      hidden: true,
      meta: {
        title: '修改科研教学信息',
        node: 'edit_education',
        activeMenu: '/education/list',
        preName: '科研教学信息',
        activeClass: 'news'
      }
    },
    {
      path: '/service-content/list',
      name: 'serviceContentList',
      component: () => import('@/views/admin/news/service-content/list'),
      meta: {
        title: '服务内容信息',
        node: 'service_content_list',
        activeClass: 'news'
      }
    },
    {
      path: '/service-content/add',
      name: 'serviceContentAdd',
      component: () => import('@/views/admin/news/service-content/edit'),
      hidden: true,
      meta: {
        title: '新建服务内容信息',
        node: 'add_service_content',
        activeMenu: '/service-content/list',
        preName: '服务内容信息',
        activeClass: 'news'
      }
    },
    {
      path: '/service-content/edit/:id',
      name: 'serviceContentEdit',
      component: () => import('@/views/admin/news/service-content/edit'),
      hidden: true,
      meta: {
        title: '修改服务内容信息',
        node: 'edit_service_content',
        activeMenu: '/service-content/list',
        preName: '服务内容信息',
        activeClass: 'news'
      }
    },
    {
      path: '/rules-info/list',
      name: 'rulesInfoList',
      component: () => import('@/views/admin/news/rules-info/list'),
      meta: {
        title: '规章制度信息',
        node: 'rules_info_list',
        activeClass: 'news'
      }
    },
    {
      path: '/rules-info/add',
      name: 'rulesInfoAdd',
      component: () => import('@/views/admin/news/rules-info/edit'),
      hidden: true,
      meta: {
        title: '新建规章制度信息',
        node: 'add_rules_info',
        activeMenu: '/rules-info/list',
        preName: '规章制度信息',
        activeClass: 'news'
      }
    },
    {
      path: '/rules-info/edit/:id',
      name: 'rulesInfoEdit',
      component: () => import('@/views/admin/news/rules-info/edit'),
      hidden: true,
      meta: {
        title: '修改规章制度信息',
        node: 'edit_rules_info',
        activeMenu: '/rules-info/list',
        preName: '规章制度信息',
        activeClass: 'news'
      }
    },
    {
      path: '/work-info/list',
      name: 'workInfoList',
      component: () => import('@/views/admin/news/work-info/list'),
      meta: {
        title: '办事指南信息',
        node: 'work_info_list',
        activeClass: 'news'
      }
    },
    {
      path: '/work-info/add',
      name: 'workInfoAdd',
      component: () => import('@/views/admin/news/work-info/edit'),
      hidden: true,
      meta: {
        title: '新建办事指南信息',
        node: 'add_work_info',
        activeMenu: '/work-info/list',
        preName: '办事指南信息',
        activeClass: 'news'
      }
    },
    {
      path: '/work-info/edit/:id',
      name: 'workInfoEdit',
      component: () => import('@/views/admin/news/work-info/edit'),
      hidden: true,
      meta: {
        title: '修改办事指南信息',
        node: 'edit_work_info',
        activeMenu: '/work-info/list',
        preName: '办事指南信息',
        activeClass: 'news'
      }
    },
    {
      path: '/recharge-info/list',
      name: 'rechargeInfoList',
      component: () => import('@/views/admin/news/recharge-info/list'),
      meta: {
        title: '收费标准信息',
        node: 'recharge_info_list',
        activeClass: 'news'
      }
    },
    {
      path: '/recharge-info/add',
      name: 'rechargeInfoAdd',
      component: () => import('@/views/admin/news/recharge-info/edit'),
      hidden: true,
      meta: {
        title: '新建收费标准信息',
        node: 'add_recharge_info',
        activeMenu: '/recharge-info/list',
        preName: '收费标准信息',
        activeClass: 'news'
      }
    },
    {
      path: '/recharge-info/edit/:id',
      name: 'rechargeInfoEdit',
      component: () => import('@/views/admin/news/recharge-info/edit'),
      hidden: true,
      meta: {
        title: '修改收费标准信息',
        node: 'edit_recharge_info',
        activeMenu: '/recharge-info/list',
        preName: '收费标准信息',
        activeClass: 'news'
      }
    }
  ]
}

export default news
