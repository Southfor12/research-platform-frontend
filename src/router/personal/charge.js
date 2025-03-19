import Layout from '@/layout-personal'

const charge = {
  path: '/personal/apparatus-charge-rule',
  component: Layout,
  redirect: '/personal/apparatus-charge-rule/list',
  name: 'personalCharge',
  meta: {
    title: '仪器费用管理',
    icon: 'charge',
    node: 'apparatus',
    activeClass: 'charge'
  },
  alwaysShow: true,
  children: [
    {
      path: '/personal/apparatus-charge-rule/list',
      name: 'personalApparatusChargeRuleList',
      component: () => import('@/views/personal/apparatus-charge-rule/list'),
      meta: {
        title: '计费规则列表',
        node: 'apparatus',
        activeClass: 'charge'
      }
    },
    {
      path: '/personal/apparatus-charge-rule/edit/:id',
      name: 'personalApparatusChargeRuleEdit',
      component: () => import('@/views/personal/apparatus-charge-rule/add'),
      hidden: true,
      meta: {
        title: '修改计费规则',
        node: 'apparatus',
        activeMenu: '/personal/apparatus-charge-rule/list',
        preName: '计费规则列表',
        activeClass: 'charge'
      }
    }
  ]
}

export default charge
