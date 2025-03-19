import Layout from '@/layout'

const apparatus = {
  path: '/apparatus',
  component: Layout,
  redirect: '/apparatus/list',
  name: 'apparatus',
  meta: {
    title: '仪器管理',
    icon: 'apparatus',
    node: 'apparatus',
    activeClass: 'apparatus'
  },
  alwaysShow: true,
  children: [{
      path: '/apparatus/list',
      name: 'apparatusList',
      component: () => import('@/views/admin/apparatus/list'),
      meta: {
        title: '仪器列表',
        node: 'apparatus_list',
        activeClass: 'apparatus'
      }
    },
    {
      path: '/apparatus/add',
      name: 'apparatusAdd',
      component: () => import('@/views/admin/apparatus/add'),
      hidden: true,
      meta: {
        title: '添加仪器',
        node: 'add_apparatus',
        activeMenu: '/apparatus/list',
        preName: '仪器列表',
        activeClass: 'apparatus'
      }
    },
    {
      path: '/apparatus/edit/:id',
      name: 'apparatusEdit',
      component: () => import('@/views/admin/apparatus/add'),
      hidden: true,
      meta: {
        title: '修改仪器',
        node: 'edit_apparatus',
        activeMenu: '/apparatus/list',
        preName: '仪器列表',
        activeClass: 'apparatus'
      }
    },
    {
      path: '/apparatus/use-list',
      name: 'apparatusUseList',
      component: () => import('@/views/admin/apparatus/uselist'),
      meta: {
        title: '仪器使用统计',
        node: 'apparatus_book_stat',
        activeClass: 'apparatus'
      }
    },
    {
      path: '/apparatus-type/list',
      name: 'apparatusTypeList',
      component: () => import('@/views/admin/apparatus-type/list'),
      meta: {
        title: '仪器类型管理',
        node: 'query_admin_list',
        activeClass: 'apparatus'
      }
    },
    {
      path: '/apparatus-type/add',
      name: 'apparatusTypeAdd',
      component: () => import('@/views/admin/apparatus-type/add'),
      hidden: true,
      meta: {
        title: '添加仪器类型',
        node: 'add_apparatus_type',
        activeMenu: '/apparatus-type/list',
        preName: '仪器类型管理',
        activeClass: 'apparatus'
      }
    },
    {
      path: '/apparatus-type/edit/:id',
      name: 'apparatusTypeEdit',
      component: () => import('@/views/admin/apparatus-type/add'),
      hidden: true,
      meta: {
        title: '修改仪器类型',
        node: 'edit_apparatus_type',
        activeMenu: '/apparatus-type/list',
        preName: '仪器类型管理',
        activeClass: 'apparatus'
      }
    },
    {
      path: '/apparatus-auth-user/list',
      name: 'apparatusAuthUserList',
      component: () => import('@/views/admin/apparatus-auth-user/list'),
      meta: {
        title: '仪器授权管理',
        node: 'apparatus_hcs_list',
        activeClass: 'apparatus'
      }
    },
    {
      path: '/apparatus-auth-user/add',
      name: 'apparatusAuthUserAdd',
      component: () => import('@/views/admin/apparatus-auth-user/add'),
      hidden: true,
      meta: {
        title: '添加仪器授权用户',
        node: 'add_apparatus_auth_user',
        activeMenu: '/apparatus-auth-user/list',
        preName: '仪器授权管理',
        activeClass: 'apparatus'
      }
    },
    {
      path: '/apparatus-auth-user/edit/:id',
      name: 'apparatusAuthUserEdit',
      component: () => import('@/views/admin/apparatus-auth-user/add'),
      hidden: true,
      meta: {
        title: '修改仪器授权用户',
        node: 'edit_apparatus_auth_user',
        activeMenu: '/apparatus-auth-user/list',
        preName: '仪器授权管理',
        activeClass: 'apparatus'
      }
    },
    {
      path: '/apparatus-reagent/list',
      name: 'apparatusReagentList',
      component: () => import('@/views/admin/apparatus-reagent/list'),
      meta: {
        title: '仪器可用耗材管理',
        node: 'apparatus_reagent_list',
        activeClass: 'apparatus'
      }
    },
    {
      path: '/apparatus-reagent/add',
      name: 'apparatusReagentAdd',
      component: () => import('@/views/admin/apparatus-reagent/add'),
      hidden: true,
      meta: {
        title: '添加仪器可用耗材',
        node: 'add_apparatus_reagent',
        activeMenu: '/apparatus-reagent/list',
        preName: '仪器可用耗材管理',
        activeClass: 'apparatus'
      }
    },
    {
      path: '/apparatus-reagent/edit/:id',
      name: 'apparatusReagentEdit',
      component: () => import('@/views/admin/apparatus-reagent/add'),
      hidden: true,
      meta: {
        title: '修改仪器可用耗材',
        node: 'edit_apparatus_reagent',
        activeMenu: '/apparatus-reagent/list',
        preName: '仪器可用耗材管理',
        activeClass: 'apparatus'
      }
    },
    {
      path: '/apparatus-hcs/list',
      name: 'apparatusHcsList',
      component: () => import('@/views/admin/apparatus-hcs/list'),
      meta: {
        title: '仪器可用危化品管理',
        node: 'apparatus_hcs_list',
        activeClass: 'apparatus'
      }
    },
    {
      path: '/apparatus-hcs/add',
      name: 'apparatusHcsAdd',
      component: () => import('@/views/admin/apparatus-hcs/add'),
      hidden: true,
      meta: {
        title: '添加仪器可用危化品',
        node: 'add_apparatus_hcs',
        activeMenu: '/apparatus-hcs/list',
        preName: '仪器可用危化品管理',
        activeClass: 'apparatus'
      }
    },
    {
      path: '/apparatus-hcs/edit/:id',
      name: 'apparatusHcsEdit',
      component: () => import('@/views/admin/apparatus-hcs/add'),
      hidden: true,
      meta: {
        title: '修改仪器可用危化品',
        node: 'edit_apparatus_hcs',
        activeMenu: '/apparatus-hcs/list',
        preName: '仪器可用危化品管理',
        activeClass: 'apparatus'
      }
    }
  ]
}

export default apparatus
