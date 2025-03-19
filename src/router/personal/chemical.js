import Layout from '@/layout-personal'

const chemical = {
  path: '/personal/chemical-order',
  component: Layout,
  redirect: '/personal/chemical-order/list',
  name: '',
  meta: {
    title: '申购管理',
    icon: 'chemical-in',
    node: 'apparatus',
    activeClass: 'chemical-in'
  },
  alwaysShow: true,
  children: [{
      path: '/personal/chemical-order/add',
      name: 'personalChemicalOrderAdd',
      component: () => import('@/views/personal/chemical-order/add'),
      hidden: true,
      meta: {
        title: '试剂耗材申购',
        node: 'apparatus',
        activeMenu: '/personal/chemical-order/list',
        preName: '试剂耗材申购列表',
        activeClass: 'chemical-in'
      }
    },
    // {
    //     path: '/personal/chemical-order/edit/:id',
    //     name: 'personalChemicalOrderEdit',
    //     component: () => import('@/views/personal/chemical-order/add'),
    //     hidden: true,
    //     meta: { title: '修改申购', node: 'apparatus', activeMenu: '/personal/chemical-order/list', preName: '试剂耗材申购', activeClass: 'chemical-in' }
    // },
    {
      path: '/personal/hcs-order/list',
      name: 'personalHcsOrderList',
      component: () => import('@/views/personal/hcs-order/index'),
      meta: {
        title: '危化品申购列表',
        node: 'apparatus',
        activeClass: 'chemical-in'
      }
    },
    {
      path: '/personal/hcs-order/add',
      name: 'personalHcsOrderAdd',
      component: () => import('@/views/personal/hcs-order/add'),
      hidden: true,
      meta: {
        title: '危化品申购',
        node: 'apparatus',
        activeMenu: '/personal/hcs-order/list',
        preName: '危化品申购列表',
        activeClass: 'chemical-in'
      }
    }
  ]
}

export default chemical
