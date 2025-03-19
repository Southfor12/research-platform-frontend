import Layout from '@/layout-personal'

const platformapply = {
  path: '/personal/platform-apply',
  component: Layout,
  redirect: '/personal/platform-apply/list',
  name: 'personalPlatformApply',
  meta: {
    title: '入室管理',
    icon: 'platform-apply',
    node: 'platform',
    activeClass: 'platform-apply'
  },
  alwaysShow: true,
  children: [{
      path: '/personal/platform-apply/leader-check',
      name: 'leaderCheckList',
      component: () => import('@/views/personal/platform-apply/leader-check'),
      meta: {
        title: '导师审核',
        node: 'research_group',
        activeClass: 'platform-apply'
      }
    },
    {
      path: '/personal/platform-apply/list',
      name: 'personalPlatformApplyList',
      component: () => import('@/views/personal/platform-apply/index'),
      meta: {
        title: '实验室审核',
        node: 'platform',
        activeClass: 'platform-apply'
      }
    }
    // {
    //     path: '/personal/platform-apply/edit/:id',
    //     name: 'personalPlatformApplyEdit',
    //     component: () => import('@/views/index/apply-platform/index'),
    //     hidden: true,
    //     meta: { title: '修改入室申请', node: 'platform', activeMenu: '/personal/platform-apply/list', preName: '入室申请列表', activeClass: 'platform-apply' }
    // },
    // {
    //     path: '/personal/platform-append-apply/list',
    //     name: 'personalPlatformApplyHcsList',
    //     component: () => import('@/views/personal/platform-apply/append-list'),
    //     meta: { title: '补充申请审核', node: 'platform', activeClass: 'platform-apply' }
    // }
    // {
    //     path: '/personal/platform-append-apply/edit/:id',
    //     name: 'personalPlatformApplyHcsEdit',
    //     component: () => import('@/views/personal/platform-apply/edit'),
    //     hidden: true,
    //     meta: { title: '修改补充申请', node: 'platform', activeMenu: '/personal/platform-append-apply/list', preName: '补充申请列表', activeClass: 'platform-apply' }
    // }
  ]
}

export default platformapply
