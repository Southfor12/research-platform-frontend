import Layout from '@/layout-personal'

const apparatus = {
  path: '/personal/apparatus',
  component: Layout,
  redirect: '/personal/apparatus/list',
  name: 'personalApparatus',
  meta: {
    title: '仪器管理',
    icon: 'apparatus',
    node: 'apparatus',
    activeClass: 'apparatus'
  },
  alwaysShow: true,
  children: [{
      path: '/personal/apparatus/list',
      name: 'personalApparatusList',
      component: () => import('@/views/personal/apparatus/list'),
      meta: {
        title: '仪器列表',
        node: 'apparatus',
        activeClass: 'apparatus'
      }
    },
    {
      path: '/personal/apparatus/add',
      name: 'personalApparatusAdd',
      component: () => import('@/views/personal/apparatus/add'),
      hidden: true,
      meta: {
        title: '添加仪器',
        node: 'apparatus',
        activeMenu: '/personal/apparatus/list',
        preName: '仪器列表',
        activeClass: 'apparatus'
      }
    },
    {
      path: '/personal/apparatus/edit/:id',
      name: 'personalApparatusEdit',
      component: () => import('@/views/personal/apparatus/add'),
      hidden: true,
      meta: {
        title: '修改仪器',
        node: 'apparatus',
        activeMenu: '/personal/apparatus/list',
        preName: '仪器列表',
        activeClass: 'apparatus'
      }
    },
    {
      path: '/personal/apparatus-auth-user/list',
      name: 'personalApparatusAuthUserList',
      component: () => import('@/views/personal/apparatus-auth-user/list'),
      meta: {
        title: '仪器授权管理',
        node: 'apparatus',
        activeClass: 'apparatus'
      }
    },
    {
      path: '/personal/apparatus-auth-user/add',
      name: 'personalApparatusAuthUserAdd',
      component: () => import('@/views/personal/apparatus-auth-user/add'),
      hidden: true,
      meta: {
        title: '添加仪器授权用户',
        node: 'apparatus',
        activeMenu: '/personal/apparatus-auth-user/list',
        preName: '仪器授权管理',
        activeClass: 'apparatus'
      }
    },
    {
      path: '/personal/apparatus-auth-user/edit/:id',
      name: 'personalApparatusAuthUserEdit',
      component: () => import('@/views/personal/apparatus-auth-user/add'),
      hidden: true,
      meta: {
        title: '修改仪器授权用户',
        node: 'apparatus',
        activeMenu: '/personal/apparatus-auth-user/list',
        preName: '仪器授权管理',
        activeClass: 'apparatus'
      }
    },
    {
      path: '/personal/apparatus-reagent/list',
      name: 'personalApparatusReagentList',
      component: () => import('@/views/personal/apparatus-reagent/list'),
      meta: {
        title: '仪器可用耗材管理',
        node: 'apparatus',
        activeClass: 'apparatus'
      }
    },
    {
      path: '/personal/apparatus-reagent/add',
      name: 'personalApparatusReagentAdd',
      component: () => import('@/views/personal/apparatus-reagent/add'),
      hidden: true,
      meta: {
        title: '添加仪器可用耗材',
        node: 'apparatus',
        activeMenu: '/personal/apparatus-reagent/list',
        preName: '仪器可用耗材管理',
        activeClass: 'apparatus'
      }
    },
    {
      path: '/personal/apparatus-reagent/edit/:id',
      name: 'personalApparatusReagentEdit',
      component: () => import('@/views/personal/apparatus-reagent/add'),
      hidden: true,
      meta: {
        title: '修改仪器可用耗材',
        node: 'apparatus',
        activeMenu: '/personal/apparatus-reagent/list',
        preName: '仪器可用耗材管理',
        activeClass: 'apparatus'
      }
    },
    {
      path: '/personal/apparatus-hcs/list',
      name: 'personalApparatusHcsList',
      component: () => import('@/views/personal/apparatus-hcs/list'),
      meta: {
        title: '仪器可用危化品管理',
        node: 'apparatus',
        activeClass: 'apparatus'
      }
    },
    {
      path: '/personal/apparatus-hcs/add',
      name: 'personalApparatusHcsAdd',
      component: () => import('@/views/personal/apparatus-hcs/add'),
      hidden: true,
      meta: {
        title: '添加仪器可用危化品',
        node: 'apparatus',
        activeMenu: '/personal/apparatus-hcs/list',
        preName: '仪器可用危化品管理',
        activeClass: 'apparatus'
      }
    },
    {
      path: '/personal/apparatus-hcs/edit/:id',
      name: 'personalApparatusHcsEdit',
      component: () => import('@/views/personal/apparatus-hcs/add'),
      hidden: true,
      meta: {
        title: '修改仪器可用危化品',
        node: 'apparatus',
        activeMenu: '/personal/apparatus-hcs/list',
        preName: '仪器可用危化品管理',
        activeClass: 'apparatus'
      }
    }
  ]
}

export default apparatus
