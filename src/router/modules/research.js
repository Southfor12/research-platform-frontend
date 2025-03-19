import Layout from '@/layout'

const research = {
  path: '/research-group',
  component: Layout,
  redirect: '/research-group/list',
  name: 'researchGroup',
  meta: {
    title: '课题组管理',
    icon: 'research-group',
    node: 'research_group',
    activeClass: 'researchGroup'
  },
  alwaysShow: true,
  children: [{
      path: '/research-group/list',
      name: 'researchGroupList',
      component: () => import('@/views/admin/research-group/list'),
      meta: {
        title: '课题组列表',
        node: 'research_group_list',
        activeClass: 'researchGroup'
      }
    },
    {
      path: '/research-group/add',
      name: 'researchGroupAdd',
      component: () => import('@/views/admin/research-group/add'),
      hidden: true,
      meta: {
        title: '新建课题组',
        node: 'add_research_group',
        activeMenu: '/research-group/list',
        preName: '课题组列表',
        activeClass: 'researchGroup'
      }
    },
    {
      path: '/research-group/edit/:id',
      name: 'researchGroupEdit',
      component: () => import('@/views/admin/research-group/add'),
      hidden: true,
      meta: {
        title: '修改课题组',
        node: 'edit_research_group',
        activeMenu: '/research-group/list',
        preName: '课题组列表',
        activeClass: 'researchGroup'
      }
    },
    {
      path: '/research-group-user/list',
      name: 'researchGroupUserList',
      component: () => import('@/views/admin/research-group/user/list'),
      meta: {
        title: '课题组成员列表',
        node: 'research_group_user_list',
        activeClass: 'researchGroup'
      }
    },
    {
      path: '/research-group-account/list',
      name: 'researchGroupAccountList',
      component: () => import('@/views/admin/research-group/account/list'),
      meta: {
        title: '课题组账号管理',
        node: 'research_group_account_list',
        activeClass: 'researchGroup'
      }
    },
    {
      path: '/research-group-account/add',
      name: 'researchGroupAccountAdd',
      component: () => import('@/views/admin/research-group/account/add'),
      hidden: true,
      meta: {
        title: '添加课题组账号',
        node: 'add_research_group_account',
        activeMenu: '/research-group-account/list',
        preName: '课题组账号管理',
        activeClass: 'researchGroup'
      }
    },
    {
      path: '/research-group-account/edit/:id',
      name: 'researchGroupAccountEdit',
      component: () => import('@/views/admin/research-group/account/add'),
      hidden: true,
      meta: {
        title: '修改课题组账号',
        node: 'edit_research_group_account',
        activeMenu: '/research-group-account/list',
        preName: '课题组账号管理',
        activeClass: 'researchGroup'
      }
    },
    {
      path: '/research-group-account/cash-flow',
      name: 'researchGroupAccountCashFlow',
      component: () => import('@/views/admin/research-group/account/cash-flow'),
      meta: {
        title: '课题组账号消费记录',
        node: 'cash_flow_list',
        activeClass: 'researchGroup'
      }
    },
    {
      path: '/research-group-account-auth/list',
      name: 'researchGroupAccountAuthList',
      component: () => import('@/views/admin/research-group/account-auth/list'),
      meta: {
        title: '课题组账号授权管理',
        node: 'research_group_account_auth_list',
        activeClass: 'researchGroup'
      }
    },
    {
      path: '/research-group-account-auth/add',
      name: 'researchGroupAccountAuthAdd',
      component: () => import('@/views/admin/research-group/account-auth/add'),
      hidden: true,
      meta: {
        title: '添加课题组账号授权',
        node: 'add_research_group_account_auth',
        activeMenu: '/research-group-account-auth/list',
        preName: '课题组账号授权管理',
        activeClass: 'researchGroup'
      }
    },
  ]
}

export default research
