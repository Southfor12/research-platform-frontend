import Layout from '@/layout'

const platform = {
  path: '/platform',
  component: Layout,
  redirect: '/platform/list',
  name: 'platform',
  meta: {
    title: '科研组室管理',
    icon: 'platform',
    node: 'platform',
    activeClass: 'platform'
  },
  alwaysShow: true,
  children: [{
      path: '/platform/list',
      name: 'platformList',
      component: () => import('@/views/admin/platform/list'),
      meta: {
        title: '科研组室列表',
        node: 'platform_list',
        activeClass: 'platform'
      }
    },
    {
      path: '/platform/add',
      name: 'platformAdd',
      component: () => import('@/views/admin/platform/add'),
      hidden: true,
      meta: {
        title: '新建科研组室',
        node: 'add_platform',
        activeMenu: '/platform/list',
        preName: '科研组室列表',
        activeClass: 'platform'
      }
    },
    {
      path: '/platform/edit/:id',
      name: 'platformEdit',
      component: () => import('@/views/admin/platform/add'),
      hidden: true,
      meta: {
        title: '修改科研组室',
        node: 'edit_platform',
        activeMenu: '/platform/list',
        preName: '科研组室列表',
        activeClass: 'platform'
      }
    },
    {
      path: '/platform-user/list',
      name: 'platformUserList',
      component: () => import('@/views/admin/platform-user/list'),
      meta: {
        title: '科研组室成员列表',
        node: 'platform_user_list',
        activeClass: 'platform'
      }
    },
    {
      path: '/platform-user/add',
      name: 'platformUserAdd',
      component: () => import('@/views/admin/platform-user/add'),
      hidden: true,
      meta: {
        title: '添加科研组室成员',
        node: 'add_platform_user',
        activeMenu: '/platform-user/list',
        preName: '科研组室成员列表',
        activeClass: 'platform'
      }
    },
    {
      path: '/platform-user/edit/:id',
      name: 'platformUserEdit',
      component: () => import('@/views/admin/platform-user/add'),
      hidden: true,
      meta: {
        title: '修改科研组室成员',
        node: 'edit_platform_user',
        activeMenu: '/platform-user/list',
        preName: '科研组室成员列表',
        activeClass: 'platform'
      }
    },
    // {
    //   path: '/platform-score-record/list/:platform_user_id',
    //   name: 'platformScoreRecordList',
    //   component: () => import('@/views/admin/platform-user/score-list'),
    //   hidden: true,
    //   meta: { title: '评分列表', node: 'platform_score_record_list', activeMenu: '/platform-user/list', preName: '子平台/实验室成员列表', activeClass: 'platform' }
    // },
    // {
    //   path: '/platform-score-record/add/:platform_user_id',
    //   name: 'platformScoreRecordAdd',
    //   component: () => import('@/views/admin/platform-user/add-score'),
    //   hidden: true,
    //   meta: { title: '添加评分', node: 'add_platform_score_record', activeMenu: '/platform-user/list', preName: '子平台/实验室成员列表', activeClass: 'platform' }
    // },
    // {
    //   path: '/platform-score-record/edit/:id',
    //   name: 'platformScoreRecordEdit',
    //   component: () => import('@/views/admin/platform-user/add-score'),
    //   hidden: true,
    //   meta: { title: '修改评分', node: 'edit_platform_score_record', activeMenu: '/platform-user/list', preName: '子平台/实验室成员列表', activeClass: 'platform' }
    // },
    // {
    //   path: '/platform/ranking',
    //   name: 'platformRanking',
    //   component: () => import('@/views/admin/platform/ranking'),
    //   meta: { title: '实验室月度评分', node: 'platform_ranking', activeClass: 'platform' }
    // },
    // {
    //   path: '/platform-score-item/list',
    //   name: 'platformScoreItemList',
    //   component: () => import('@/views/admin/platform-apply/platform-score-item/index'),
    //   meta: { title: '实验室评分项列表', node: 'platform_score_item_list', activeClass: 'platform' }
    // },
    // {
    //     path: '/group-score-item/list',
    //     name: 'groupScoreItemList',
    //     component: () => import('@/views/admin/platform-apply/group-score-item/index'),
    //     meta: { title: '课题组评分项列表', node: 'group_score_item_list', activeClass: 'platform' }
    // },
    // {
    //     path: '/personal-score-item/list',
    //     name: 'personalScoreItemList',
    //     component: () => import('@/views/admin/platform-apply/personal-score-item/index'),
    //     meta: { title: '个人评分项列表', node: 'personal_score_item_list', activeClass: 'platform' }
    // }
    // {
    //   path: '/platform-room/list',
    //   name: 'platformRoomList',
    //   component: () => import('@/views/admin/platform-room/list'),
    //   meta: { title: '门禁管理', node: 'platform_room_list', activeClass: 'platform' }
    // },
    // {
    //   path: '/platform-room/add',
    //   name: 'platformRoomAdd',
    //   component: () => import('@/views/admin/platform-room/add'),
    //   hidden: true,
    //   meta: { title: '新建实验室房间', node: 'add_platform_room', activeMenu: '/platform-room/list', preName: '门禁管理', activeClass: 'platform' }
    // },
    // {
    //   path: '/platform-room/edit/:id',
    //   name: 'platformRoomEdit',
    //   component: () => import('@/views/admin/platform-room/add'),
    //   hidden: true,
    //   meta: { title: '修改实验室房间', node: 'edit_platform_room', activeMenu: '/platform-room/list', preName: '门禁管理', activeClass: 'platform' }
    // }
  ]
}

export default platform
