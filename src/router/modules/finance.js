import Layout from '@/layout'

const finance = {
  path: '/finance',
  component: Layout,
  redirect: '/finance/info',
  children: [{
      path: '/finance/info',
      name: 'financeInfo',
      component: () => import('@/views/admin/finance/index'),
      meta: {
        title: '财务管理',
        icon: 'finance',
        node: 'finance_detail',
        activeClass: 'finance'
      }
    },
    {
      path: '/finance/platform/:id',
      name: 'financePlatform',
      component: () => import('@/views/admin/finance/platform'),
      hidden: true,
      meta: {
        title: '实验室财务详情',
        node: 'platform_finance_detail',
        activeMenu: '/finance/info',
        preName: '财务管理',
        activeClass: 'finance'
      }
    }
  ]
}

export default finance
