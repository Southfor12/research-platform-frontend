import Layout from '@/layout-personal'

const platform = {
  path: '/personal/platform',
  component: Layout,
  redirect: '/personal/platform/list',
  name: 'personalPlatform',
  meta: {
    title: '科研组室管理',
    icon: 'platform',
    node: 'platform',
    activeClass: 'platform'
  },
  alwaysShow: true,
  children: [{
      path: '/personal/platform/list',
      name: 'personalPlatformList',
      component: () => import('@/views/personal/platform/list'),
      meta: {
        title: '实验室列表',
        node: 'platform',
        activeClass: 'platform'
      }
    },
    {
      path: '/personal/platform/edit/:id',
      name: 'personalPlatformEdit',
      component: () => import('@/views/personal/platform/add'),
      hidden: true,
      meta: {
        title: '修改入室规则',
        node: 'platform',
        activeMenu: '/personal/platform/list',
        preName: '实验室列表',
        activeClass: 'platform'
      }
    },
    {
      path: '/personal/platform/finance-list',
      name: 'personalPlatformFinanceList',
      component: () => import('@/views/personal/platform/finance-list'),
      meta: {
        title: '财务管理',
        node: 'platform',
        activeClass: 'platform'
      }
    },
    {
      path: '/personal/platform/finance/:id',
      name: 'personalPlatformFinance',
      component: () => import('@/views/personal/platform/finance'),
      hidden: true,
      meta: {
        title: '财务详情',
        node: 'platform',
        activeMenu: '/personal/platform/finance-list',
        preName: '财务管理',
        activeClass: 'platform'
      }
    },
    {
      path: '/personal/platform-user/list',
      name: 'personal_platform_user_list',
      component: () => import('@/views/personal/platform-user/list'),
      meta: {
        title: '科研组室成员列表',
        node: 'platform',
        activeClass: 'platform'
      }
    },
    {
      path: '/personal/platform-user/add',
      name: 'personalPlatformUserAdd',
      component: () => import('@/views/personal/platform-user/add'),
      hidden: true,
      meta: {
        title: '添加科研组室成员',
        node: 'platform',
        activeMenu: '/personal/platform-user/list',
        preName: '科研组室成员列表',
        activeClass: 'platform'
      }
    },
    {
      path: '/personal/platform-user/edit/:id',
      name: 'personalPlatformUserEdit',
      component: () => import('@/views/personal/platform-user/add'),
      hidden: true,
      meta: {
        title: '修改科研组室成员',
        node: 'platform',
        activeMenu: '/personal/platform-user/list',
        preName: '科研组室成员列表',
        activeClass: 'platform'
      }
    },
    {
      path: '/personal/platform-apply/list',
      name: 'personalPlatformApplyList',
      component: () => import('@/views/personal/platform-apply/index'),
      meta: {
        title: '入室审核',
        node: 'platform',
        activeClass: 'platform'
      }
    },
    {
      path: '/personal/platform-leave-apply/list',
      name: 'personalPlatformLeaveApplyList',
      component: () => import('@/views/personal/platform-leave-apply/index'),
      meta: {
        title: '离室审核',
        node: 'platform',
        activeClass: 'platform'
      }
    },
    // {
    //   path: '/personal/platform-score-record/list/:platform_user_id',
    //   name: 'personalPlatformScoreRecordList',
    //   component: () => import('@/views/personal/platform-user/score-list'),
    //   hidden: true,
    //   meta: { title: '评分列表', node: 'platform', activeMenu: '/personal/platform-user/list', preName: '子平台/实验室成员列表', activeClass: 'platform' }
    // },
    {
      path: '/personal/platform-score-record/add/:platform_user_id',
      name: 'personalPlatformScoreRecordAdd',
      component: () => import('@/views/personal/platform-user/add-score'),
      hidden: true,
      meta: {
        title: '添加评分',
        node: 'platform',
        activeMenu: '/personal/platform-user/list',
        preName: '科研组室成员',
        activeClass: 'platform'
      }
    },
    {
      path: '/personal/platform-score-record/edit/:id',
      name: 'personalPlatformScoreRecordEdit',
      component: () => import('@/views/personal/platform-user/add-score'),
      hidden: true,
      meta: {
        title: '修改评分',
        node: 'platform',
        activeMenu: '/personal/platform-user/list',
        preName: '科研组室成员',
        activeClass: 'platform'
      }
    }
  ]
}

export default platform
