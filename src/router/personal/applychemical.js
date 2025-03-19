import Layout from '@/layout-personal'

const applychemical = {
  path: '/personal/chemical-apply',
  component: Layout,
  redirect: '/personal/chemical-apply/list',
  name: '',
  meta: {
    title: '申领管理',
    icon: 'chemical-out',
    node: 'info_center',
    activeClass: 'chemical-out'
  },
  alwaysShow: true,
  children: [{
      path: '/personal/chemical-apply/list',
      name: 'personalChemicalApplyList',
      component: () => import('@/views/personal/chemical-apply/index'),
      meta: {
        title: '试剂耗材申领列表',
        node: 'info_center',
        activeClass: 'chemical-out'
      }
    },
    {
      path: '/personal/chemical-apply/add',
      name: 'personalChemicalApplyAdd',
      component: () => import('@/views/personal/chemical-apply/add'),
      hidden: true,
      meta: {
        title: '试剂耗材申领',
        node: 'info_center',
        activeMenu: '/personal/chemical-apply/list',
        preName: '试剂耗材申领列表',
        activeClass: 'chemical-out'
      }
    },
    {
      path: '/personal/hcs-apply/list',
      name: 'personalHcsApplyList',
      component: () => import('@/views/personal/hcs-apply/index'),
      meta: {
        title: '危化品申领列表',
        node: 'info_center',
        activeClass: 'chemical-out'
      }
    },
    {
      path: '/personal/hcs-apply/add',
      name: 'personalHcsApplyAdd',
      component: () => import('@/views/personal/hcs-apply/add'),
      hidden: true,
      meta: {
        title: '危化品申领',
        node: 'info_center',
        activeMenu: '/personal/hcs-apply/list',
        preName: '危化品申领列表',
        activeClass: 'chemical-out'
      }
    },
    {
      path: '/personal/chemical-apply/audit',
      name: 'personalChemicalApplyAudit',
      component: () => import('@/views/personal/chemical-apply/audit'),
      meta: {
        title: '试剂耗材申领审核',
        node: 'research_group',
        activeClass: 'chemical-out'
      }
    },
    {
      path: '/personal/hcs-apply/audit',
      name: 'personalHcsApplyAudit',
      component: () => import('@/views/personal/hcs-apply/audit'),
      meta: {
        title: '危化品申领审核',
        node: 'research_group',
        activeClass: 'chemical-out'
      }
    }
  ]
}

export default applychemical
