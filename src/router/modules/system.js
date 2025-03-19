import Layout from '@/layout'

const system = {
  path: '/system',
  component: Layout,
  redirect: '/system/role/list',
  name: 'system',
  meta: {
    title: '用户管理',
    icon: 'system',
    node: 'system',
    activeClass: 'system'
  },
  alwaysShow: true,
  children: [{
      path: '/system/role/list',
      name: 'roleList',
      component: () => import('@/views/admin/system/role/list/index'),
      meta: {
        title: '角色列表',
        node: 'query_role_list',
        activeClass: 'system'
      }
    },
    {
      path: '/system/role/add',
      name: 'roleAdd',
      component: () => import('@/views/admin/system/role/add/index'),
      hidden: true,
      meta: {
        title: '新建角色',
        node: 'add_role',
        activeMenu: '/system/role/list',
        preName: '角色列表',
        activeClass: 'system'
      }
    },
    {
      path: '/system/role/edit/:id',
      name: 'roleEdit',
      component: () => import('@/views/admin/system/role/add/index'),
      hidden: true,
      meta: {
        title: '修改角色',
        node: 'edit_role',
        activeMenu: '/system/role/list',
        preName: '角色列表',
        activeClass: 'system'
      }
    },
    {
      path: '/system/admin/list',
      name: 'adminList',
      component: () => import('@/views/admin/system/admin/list/index'),
      meta: {
        title: '管理员列表',
        node: 'query_admin_list',
        activeClass: 'system'
      }
    },
    {
      path: '/system/admin/add',
      name: 'adminAdd',
      component: () => import('@/views/admin/system/admin/add/index'),
      hidden: true,
      meta: {
        title: '新建管理员',
        node: 'add_admin',
        activeMenu: '/system/admin/list',
        preName: '管理员列表',
        activeClass: 'system'
      }
    },
    {
      path: '/system/admin/edit/:id',
      name: 'adminEdit',
      component: () => import('@/views/admin/system/admin/add/index'),
      hidden: true,
      meta: {
        title: '修改管理员',
        node: 'edit_admin',
        activeMenu: '/system/admin/list',
        preName: '管理员列表',
        activeClass: 'system'
      }
    },
    {
      path: '/system/verify/list',
      name: 'verifyList',
      component: () => import('@/views/admin/system/verify/list'),
      meta: {
        title: '用户列表',
        node: 'admin_verify_list',
        activeClass: 'system'
      }
    },
    {
      path: '/system/verify/edit/:id',
      name: 'verifyEdit',
      component: () => import('@/views/admin/system/verify/edit'),
      hidden: true,
      meta: {
        title: '修改用户信息',
        node: 'edit_verify_user',
        activeMenu: '/system/verify/list',
        preName: '用户审核',
        activeClass: 'system'
      }
    },
    {
      path: '/system/card/list',
      name: 'cardList',
      component: () => import('@/views/admin/system/card/list'),
      meta: {
        title: '一卡通列表',
        node: 'card_list',
        activeClass: 'system'
      }
    },
    {
      path: '/system/card/add',
      name: 'cardAdd',
      component: () => import('@/views/admin/system/card/add'),
      hidden: true,
      meta: {
        title: '新建一卡通',
        node: 'add_card',
        activeMenu: '/system/card/list',
        preName: '一卡通列表',
        activeClass: 'system'
      }
    },
    {
      path: '/system/card/edit/:id',
      name: 'cardEdit',
      component: () => import('@/views/admin/system/card/add'),
      hidden: true,
      meta: {
        title: '修改一卡通',
        node: 'edit_card',
        activeMenu: '/system/card/list',
        preName: '一卡通列表',
        activeClass: 'system'
      }
    },
    {
      path: '/system/user-grade/list',
      name: 'userGradeList',
      component: () => import('@/views/admin/system/user/list'),
      meta: {
        title: '用户评分',
        node: 'user_grade_list',
        activeClass: 'system'
      }
    }
  ]
}

export default system
