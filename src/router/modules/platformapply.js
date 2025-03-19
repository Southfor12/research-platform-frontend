import Layout from '@/layout'

const platformapply = {
  path: '/platform-apply',
  component: Layout,
  redirect: '/platform-apply/list',
  name: 'platformApply',
  meta: {
    title: '入室管理',
    icon: 'platform-apply',
    node: 'platform',
    activeClass: 'platform-apply'
  },
  alwaysShow: true,
  children: [{
      path: '/platform-apply/list',
      name: 'platformApplyList',
      component: () => import('@/views/admin/platform-apply/index'),
      meta: {
        title: '入室审核',
        node: 'platform_apply_list',
        activeClass: 'platform-apply'
      }
    },
    // {
    //     path: '/platform-leave-apply/list',
    //     name: 'platformLeaveApplyList',
    //     component: () => import('@/views/admin/platform-leave-apply/index'),
    //     meta: { title: '离室申请审核', node: 'platform_leave_apply_list', activeClass: 'platform-apply' }
    // },
    {
      path: '/expiration-reminder',
      name: 'expirationReminder',
      component: () => import('@/views/admin/website/expiration-reminder'),
      meta: {
        title: '离室提醒时间设置',
        node: 'expiration_reminder',
        activeClass: 'platform-apply'
      }
    },
    {
      path: '/platform-apply/edit/:id',
      name: 'platformApplyEdit',
      component: () => import('@/views/index/apply-platform/index'),
      hidden: true,
      meta: {
        title: '修改入室申请',
        node: 'edit_platform_apply',
        activeMenu: '/platform-apply/list',
        preName: '入室申请列表',
        activeClass: 'platform-apply'
      }
    },
    // {
    //     path: '/platform-append-apply/list',
    //     name: 'platformApplyHcsList',
    //     component: () => import('@/views/admin/platform-apply/append-list'),
    //     meta: { title: '补充申请审核', node: 'platform_apply_append_list', activeClass: 'platform-apply' }
    // },
    {
      path: '/platform-append-apply/edit/:id',
      name: 'platformApplyHcsEdit',
      component: () => import('@/views/admin/platform-apply/edit'),
      hidden: true,
      meta: {
        title: '修改补充申请',
        node: 'edit_platform_apply_append',
        activeMenu: '/platform-append-apply/list',
        preName: '补充申请列表',
        activeClass: 'platform-apply'
      }
    }
    // {
    //     path: '/platform-score-item/add',
    //     name: 'platformScoreItemAdd',
    //     component: () => import('@/views/admin/platform-score-item/add'),
    //     hidden: true,
    //     meta: { title: '添加实验室评分项', node: 'add_platform_score_item', activeMenu: '/platform-score-item/list', preName: '评分项列表', activeClass: 'platform-apply' }
    // },
    // {
    //     path: '/platform-score-item/edit/:id',
    //     name: 'platformScoreItemEdit',
    //     component: () => import('@/views/admin/platform-score-item/add'),
    //     hidden: true,
    //     meta: { title: '修改实验室评分项', node: 'edit_platform_score_item', activeMenu: '/platform-score-item/list', preName: '评分项列表', activeClass: 'platform-apply' }
    // }
  ]
}

export default platformapply
