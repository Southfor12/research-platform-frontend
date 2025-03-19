import Layout from '@/layout'

const charge = {
  path: '/apparatus-charge-rule',
  component: Layout,
  redirect: '/apparatus-charge-rule/list',
  name: 'charge',
  meta: {
    title: '仪器费用管理',
    icon: 'charge',
    node: 'apparatus_charge_rule',
    activeClass: 'charge'
  },
  alwaysShow: true,
  children: [{
      path: '/apparatus-charge-rule/list',
      name: 'apparatusChargeRuleList',
      component: () => import('@/views/admin/apparatus-charge-rule/list'),
      meta: {
        title: '计费规则列表',
        node: 'sample_deliver_list',
        activeClass: 'charge'
      }
    },
    {
      path: '/apparatus-charge-rule/edit/:id',
      name: 'apparatusChargeRuleEdit',
      component: () => import('@/views/admin/apparatus-charge-rule/add'),
      hidden: true,
      meta: {
        title: '修改计费规则',
        node: 'sample_deliver_list',
        activeMenu: '/apparatus-charge-rule/list',
        preName: '计费规则列表',
        activeClass: 'charge'
      }
    },
    {
      path: '/report-charge-rule',
      name: 'reportChargeRule',
      component: () => import('@/views/admin/apparatus-charge-rule/report-charge-rule'),
      meta: {
        title: '报告计费规则',
        node: 'report_charge_rule',
        activeClass: 'charge'
      }
    }
  ]
}

export default charge
