import Layout from '@/layout-personal'

const research = {
  path: '/personal/research-group',
  component: Layout,
  redirect: '/personal/research-group/list',
  name: 'personalResearchGroup',
  meta: {
    title: '课题组管理',
    icon: 'research-group',
    node: 'research_group',
    activeClass: 'researchGroup'
  },
  alwaysShow: true,
  children: [{
    path: '/personal/research-group/list',
    name: 'personalResearchGroupList',
    component: () => import('@/views/personal/research-group/list'),
    meta: {
      title: '课题组列表',
      node: 'research_group',
      activeClass: 'researchGroup'
    }
  },
  {
    path: '/personal/research-group/add',
    name: 'personalResearchGroupAdd',
    component: () => import('@/views/personal/research-group/add'),
    hidden: true,
    meta: {
      title: '新建课题组',
      node: 'platform',
      activeMenu: '/personal/research-group/list',
      preName: '课题组列表',
      activeClass: 'researchGroup'
    }
  },
  {
    path: '/personal/research-group/edit/:id',
    name: 'personalResearchGroupEdit',
    component: () => import('@/views/personal/research-group/add'),
    hidden: true,
    meta: {
      title: '修改课题组',
      node: 'platform',
      activeMenu: '/personal/research-group/list',
      preName: '课题组列表',
      activeClass: 'researchGroup'
    }
  },
  {
    path: '/personal/research-group-user/list',
    name: 'personalResearchGroupUserList',
    component: () => import('@/views/personal/research-group/user/list'),
    meta: {
      title: '学生管理',
      node: 'research_group',
      activeClass: 'researchGroup'
    }
  },
  {
    path: '/personal/research-group/finance-list',
    name: 'personalResearchGroupFinanceList',
    component: () => import('@/views/personal/research-group/finance-list'),
    meta: {
      title: '财务管理',
      node: 'research_group',
      activeClass: 'researchGroup'
    }
  },

  {
    path: '/personal/research-group/order-list',
    name: 'personalResearchGroupOrderList',
    component: () => import('@/views/personal/research-group/order-list'),
    meta: {
      title: '订单管理',
      node: 'research_group',
      activeClass: 'researchGroup'
    }
  },


  {
    path: '/personal/research-group/finance/:id',
    name: 'personalResearchGroupFinance',
    component: () => import('@/views/personal/research-group/finance'),
    hidden: true,
    meta: {
      title: '财务详情',
      node: 'research_group',
      activeMenu: '/personal/research-group/finance-list',
      preName: '财务管理',
      activeClass: 'researchGroup'
    }
  },
  {
    path: '/personal/platform-apply/leader-check',
    name: 'leaderCheckList',
    component: () => import('@/views/personal/platform-apply/leader-check'),
    meta: {
      title: '入室审核',
      node: 'research_group',
      activeClass: 'researchGroup'
    }
  },
  {
    path: '/personal/platform-leave-apply/leader-check',
    name: 'leaderCheckExitList',
    component: () => import('@/views/personal/platform-leave-apply/leader-check'),
    meta: {
      title: '离室审核',
      node: 'research_group',
      activeClass: 'researchGroup'
    }
  },
  {
    path: '/personal/research-group-account/list',
    name: 'personalResearchGroupAccountList',
    component: () => import('@/views/personal/research-group/account/list'),
    meta: {
      title: '课题组账号',
      node: 'research_group',
      activeClass: 'researchGroup'
    }
  },
  {
    path: '/personal/research-group-account/cash-flow',
    name: 'personalResearchGroupAccountCashFlow',
    component: () => import('@/views/personal/research-group/account/cash-flow'),
    meta: {
      title: '课题组账号消费记录',
      node: 'research_group',
      activeClass: 'researchGroup'
    }
  },
  {
    path: '/personal/research-group-account-auth/list',
    name: 'personalResearchGroupAccountAuthList',
    component: () => import('@/views/personal/research-group/account-auth/list'),
    meta: {
      title: '课题组账号授权管理',
      node: 'research_group',
      activeClass: 'researchGroup'
    }
  },
  {
    path: '/personal/research-group-account-auth/add',
    name: 'personalResearchGroupAccountAuthAdd',
    component: () => import('@/views/personal/research-group/account-auth/add'),
    hidden: true,
    meta: {
      title: '添加课题组账号授权',
      node: 'research_group',
      activeMenu: '/personal/research-group-account-auth/list',
      preName: '课题组账号授权管理',
      activeClass: 'researchGroup'
    }
  },
  {
    path: '/personal/invoice/list',
    name: 'personalInvoiceList',
    component: () => import('@/views/personal/invoice/list'),
    meta: {
      title: '发票列表',
      node: 'research_group',
      activeClass: 'researchGroup'
    }
  },
  {
    path: '/personal/invoice/add',
    name: 'personalInvoiceAdd',
    component: () => import('@/views/personal/invoice/add'),
    hidden: true,
    meta: {
      title: '新建发票',
      node: 'research_group',
      activeMenu: '/personal/invoice/list',
      preName: '发票列表',
      activeClass: 'researchGroup'
    }
  },
  {
    path: '/personal/invoice/edit/:id',
    name: 'personalInvoiceEdit',
    component: () => import('@/views/personal/invoice/add'),
    hidden: true,
    meta: {
      title: '修改发票',
      node: 'research_group',
      activeMenu: '/personal/invoice/list',
      preName: '发票列表',
      activeClass: 'researchGroup'
    }
  }
  ]
}

export default research
