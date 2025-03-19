import Layout from '@/layout'

const hcs = {
  path: '/hcs',
  component: Layout,
  redirect: '/hcs/list',
  name: 'hcs',
  meta: {
    title: '危化品管理',
    icon: 'hcs',
    node: 'hcs_management',
    activeClass: 'hcs'
  },
  alwaysShow: true,
  children: [{
      path: '/hcs/list',
      name: 'hcsList',
      component: () => import('@/views/admin/hcs/list'),
      meta: {
        title: '危化品列表',
        node: 'hcs_list',
        activeClass: 'hcs'
      }
    },
    {
      path: '/hcs/add',
      name: 'hcsAdd',
      component: () => import('@/views/admin/hcs/add'),
      hidden: true,
      meta: {
        title: '添加危化品',
        node: 'add_hcs',
        activeMenu: '/hcs/list',
        preName: '危化品列表',
        activeClass: 'hcs'
      }
    },
    {
      path: '/hcs/edit/:id',
      name: 'hcsEdit',
      component: () => import('@/views/admin/hcs/add'),
      hidden: true,
      meta: {
        title: '修改危化品',
        node: 'edit_hcs',
        activeMenu: '/hcs/list',
        preName: '危化品列表',
        activeClass: 'hcs'
      }
    },
    {
      path: '/hcs-order/list',
      name: 'hcsOrderList',
      component: () => import('@/views/admin/hcs-order/index'),
      meta: {
        title: '危化品申购列表',
        node: 'hcs_order_list',
        activeClass: 'hcs'
      }
    },
    {
      path: '/hcs-apply/list',
      name: 'hcsApplyList',
      component: () => import('@/views/admin/hcs-apply/index'),
      meta: {
        title: '危化品申领列表',
        node: 'hcs_apply_list',
        activeClass: 'hcs'
      }
    },
    {
      path: '/hcs-order/add',
      name: 'hcsOrderAdd',
      component: () => import('@/views/admin/hcs-order/add'),
      hidden: true,
      meta: {
        title: '试剂耗材申购',
        node: 'add_hcs_order',
        activeMenu: '/hcs-order/list',
        preName: '危化品申购列表',
        activeClass: 'hcs'
      }
    },
    {
      path: '/hcs-order/hcs-flow',
      name: 'hcsFlow',
      component: () => import('@/views/admin/hcs-order/hcs-flow'),
      meta: {
        title: '危化品变动列表',
        node: 'hcs_flow',
        activeClass: 'hcs'
      }
    }
  ]
}

export default hcs
