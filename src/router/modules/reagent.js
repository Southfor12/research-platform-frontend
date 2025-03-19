import Layout from '@/layout'

const reagent = {
  path: '/reagent',
  component: Layout,
  redirect: '/chemical-order/list',
  name: 'reagent',
  meta: {
    title: '试剂耗材管理',
    icon: 'reagent',
    node: 'reagent_management',
    activeClass: 'reagent'
  },
  alwaysShow: true,
  children: [{
      path: '/reagent/list',
      name: 'reagentList',
      component: () => import('@/views/admin/reagent/list'),
      meta: {
        title: '试剂耗材列表',
        node: 'reagent_list',
        activeClass: 'reagent'
      }
    },
    {
      path: '/reagent/add',
      name: 'reagentAdd',
      component: () => import('@/views/admin/reagent/add'),
      hidden: true,
      meta: {
        title: '添加试剂耗材',
        node: 'add_reagent',
        activeMenu: '/reagent/list',
        preName: '试剂耗材管理',
        activeClass: 'reagent'
      }
    },
    {
      path: '/reagent/edit/:id',
      name: 'reagentEdit',
      component: () => import('@/views/admin/reagent/add'),
      hidden: true,
      meta: {
        title: '修改试剂耗材',
        node: 'edit_reagent',
        activeMenu: '/reagent/list',
        preName: '试剂耗材管理',
        activeClass: 'reagent'
      }
    },
    {
      path: '/chemical-order/list',
      name: 'chemicalOrderList',
      component: () => import('@/views/admin/chemical-order/index'),
      meta: {
        title: '试剂耗材申购列表',
        node: 'chemical_order_list',
        activeClass: 'reagent'
      }
    },
    {
      path: '/chemical-apply/list',
      name: 'chemicalApplyList',
      component: () => import('@/views/admin/chemical-apply/index'),
      meta: {
        title: '试剂耗材申领列表',
        node: 'chemical_apply_list',
        activeClass: 'reagent'
      }
    },
    {
      path: '/chemical-order/add',
      name: 'chemicalOrderAdd',
      component: () => import('@/views/admin/chemical-order/add'),
      hidden: true,
      meta: {
        title: '试剂耗材申购',
        node: 'add_chemical_order',
        activeMenu: '/chemical-order/list',
        preName: '试剂耗材申购列表',
        activeClass: 'reagent'
      }
    },
    // {
    //   path: '/chemical-order/edit/:id',
    //   name: 'chemicalOrderEdit',
    //   component: () => import('@/views/admin/chemical-order/add'),
    //   hidden: true,
    //   meta: { title: '修改采购', node: 'edit_chemical_order', activeMenu: '/chemical-order/list', preName: '采购列表', activeClass: 'reagent' }
    // },
    {
      path: '/chemical-order/chemical-flow',
      name: 'chemicalFlow',
      component: () => import('@/views/admin/chemical-order/chemical-flow'),
      meta: {
        title: '试剂耗材变动列表',
        node: 'chemical_flow',
        activeClass: 'reagent'
      }
    }
    // {
    //   path: '/hcs/list',
    //   name: 'hcsList',
    //   component: () => import('@/views/admin/hcs/list'),
    //   meta: { title: '危化品列表', node: 'hcs_list', activeClass: 'reagent' }
    // },
    // {
    //   path: '/hcs/add',
    //   name: 'hcsAdd',
    //   component: () => import('@/views/admin/hcs/add'),
    //   hidden: true,
    //   meta: { title: '添加危化品', node: 'add_hcs', activeMenu: '/hcs/list', preName: '危化品列表', activeClass: 'reagent' }
    // },
    // {
    //   path: '/hcs/edit/:id',
    //   name: 'hcsEdit',
    //   component: () => import('@/views/admin/hcs/add'),
    //   hidden: true,
    //   meta: { title: '修改危化品', node: 'edit_hcs', activeMenu: '/hcs/list', preName: '危化品列表', activeClass: 'reagent' }
    // }
    // {
    //   path: '/reagent-level/list',
    //   name: 'reagentLevelList',
    //   component: () => import('@/views/admin/reagent-level/list'),
    //   meta: { title: '危化等级管理', node: 'query_admin_list', activeClass: 'reagent' }
    // },
    // {
    //   path: '/reagent-level/add',
    //   name: 'reagentLevelAdd',
    //   component: () => import('@/views/admin/reagent-level/add'),
    //   hidden: true,
    //   meta: { title: '添加危化等级', node: 'add_reagent_level', activeMenu: '/reagent-level/list', preName: '危化等级管理', activeClass: 'reagent' }
    // },
    // {
    //   path: '/reagent-level/edit/:id',
    //   name: 'reagentLevelEdit',
    //   component: () => import('@/views/admin/reagent-level/add'),
    //   hidden: true,
    //   meta: { title: '修改危化等级', node: 'edit_reagent_level', activeMenu: '/reagent-level/list', preName: '危化等级管理', activeClass: 'reagent' }
    // }
  ]
}

export default reagent
