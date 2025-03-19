import Layout from '@/layout-personal'

const reagent = {
  path: '/personal/reagent',
  component: Layout,
  redirect: '/personal/reagent/list',
  name: 'personalReagent',
  meta: {
    title: '试剂耗材管理',
    icon: 'reagent',
    node: 'reagent_platform',
    activeClass: 'reagent'
  },
  alwaysShow: true,
  children: [{
      path: '/personal/reagent/list',
      name: 'personalReagentList',
      component: () => import('@/views/personal/reagent/list'),
      meta: {
        title: '试剂耗材列表',
        node: 'reagent',
        activeClass: 'reagent'
      }
    },
    {
      path: '/personal/reagent/add',
      name: 'personalReagentAdd',
      component: () => import('@/views/personal/reagent/add'),
      hidden: true,
      meta: {
        title: '添加试剂耗材',
        node: 'reagent',
        activeMenu: '/personal/reagent/list',
        preName: '试剂耗材管理',
        activeClass: 'reagent'
      }
    },
    {
      path: '/personal/reagent/edit/:id',
      name: 'personalReagentEdit',
      component: () => import('@/views/personal/reagent/add'),
      hidden: true,
      meta: {
        title: '修改试剂耗材',
        node: 'reagent',
        activeMenu: '/personal/reagent/list',
        preName: '试剂耗材管理',
        activeClass: 'reagent'
      }
    },
    {
      path: '/personal/chemical-order/list',
      name: 'personalChemicalOrderList',
      component: () => import('@/views/personal/chemical-order/index'),
      meta: {
        title: '试剂耗材申购列表',
        node: 'reagent',
        activeClass: 'reagent'
      }
    },
    {
      path: '/personal/chemical-order/add',
      name: 'personalChemicalOrderAdd',
      component: () => import('@/views/personal/chemical-order/add'),
      hidden: true,
      meta: {
        title: '试剂耗材申购',
        node: 'reagent',
        activeMenu: '/personal/chemical-order/list',
        preName: '试剂耗材申购列表',
        activeClass: 'reagent'
      }
    },
    {
      path: '/personal/chemical-order/audit',
      name: 'personalChemicalOrderAudit',
      component: () => import('@/views/personal/chemical-order/audit'),
      meta: {
        title: '试剂耗材申购审核',
        node: 'platform',
        activeClass: 'reagent'
      }
    }
  ]
}

export default reagent
