import Layout from '@/layout'

const examine = {
  path: '/examine',
  component: Layout,
  redirect: '/examine',
  name: 'examineManage',
  meta: {
    title: '考核管理',
    icon: 'examine',
    node: 'examine',
    activeClass: 'examine'
  },
  alwaysShow: true,
  children: [{
      path: '/examine/platform-list',
      name: 'platformExamineList',
      component: () => import('@/views/admin/examine/platform-list'),
      meta: {
        title: '科研组室考核列表',
        node: 'platform_grade_list',
        activeClass: 'examine'
      }
    },
    {
      path: '/examine/research-group-list',
      name: 'researchGroupExamineList',
      component: () => import('@/views/admin/examine/research-group-list'),
      meta: {
        title: '课题组考核列表',
        node: 'research_group_list',
        activeClass: 'examine'
      }
    },
    {
      path: '/platform-score-record/add/:platform_user_id',
      name: 'platformScoreRecordAdd',
      component: () => import('@/views/admin/platform-user/add-score'),
      hidden: true,
      meta: {
        title: '添加评分',
        node: 'add_platform_score_record',
        activeMenu: '/platform-user/list',
        preName: '子平台/实验室成员列表',
        activeClass: 'examine'
      }
    },
    {
      path: '/platform-score-record/edit/:id',
      name: 'platformScoreRecordEdit',
      component: () => import('@/views/admin/platform-user/add-score'),
      hidden: true,
      meta: {
        title: '修改评分',
        node: 'edit_platform_score_record',
        activeMenu: '/platform-user/list',
        preName: '子平台/实验室成员列表',
        activeClass: 'examine'
      }
    },
    {
      path: '/platform/ranking',
      name: 'platformRanking',
      component: () => import('@/views/admin/platform/ranking'),
      meta: {
        title: '实验室月度评分',
        node: 'platform_ranking',
        activeClass: 'examine'
      }
    },
    {
      path: '/examine/apparatus-admin',
      name: 'apparatusAdminExamine',
      component: () => import('@/views/admin/examine/apparatus-admin'),
      meta: {
        title: '仪器管理员考核',
        node: 'apparatus_admin_examine',
        activeClass: 'examine'
      }
    },
    {
      path: '/platform-score-item/list',
      name: 'platformScoreItemList',
      component: () => import('@/views/admin/platform-apply/platform-score-item/index'),
      meta: {
        title: '实验室评分项列表',
        node: 'platform_score_item_list',
        activeClass: 'examine'
      }
    },
    {
      path: '/group-score-item/list',
      name: 'groupScoreItemList',
      component: () => import('@/views/admin/platform-apply/group-score-item/index'),
      meta: {
        title: '课题组评分项列表',
        node: 'group_score_item_list',
        activeClass: 'examine'
      }
    },
    {
      path: '/personal-score-item/list',
      name: 'personalScoreItemList',
      component: () => import('@/views/admin/platform-apply/personal-score-item/index'),
      meta: {
        title: '个人评分项列表',
        node: 'personal_score_item_list',
        activeClass: 'examine'
      }
    }
  ]
}

export default examine
