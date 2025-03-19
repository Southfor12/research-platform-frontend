import Layout from '@/layout'

const score = {
  path: '/score',
  component: Layout,
  redirect: '/score/list',
  name: 'adminScore',
  meta: {
    title: '信用分管理',
    icon: 'score',
    node: 'score_management',
    activeClass: 'score'
  },
  alwaysShow: true,
  children: [{
      path: '/score/list',
      name: 'adminScoreList',
      component: () => import('@/views/admin/score/index'),
      meta: {
        title: '信用分记录',
        node: 'score_list',
        activeClass: 'score'
      }
    },
    {
      path: '/user-score/list',
      name: 'userScoreList',
      component: () => import('@/views/admin/score/user-score-list'),
      meta: {
        title: '人员信用分列表',
        node: 'user_score_list',
        activeClass: 'score'
      }
    },
    {
      path: '/score/setting',
      name: 'adminScoreSetting',
      component: () => import('@/views/admin/score/setting'),
      meta: {
        title: '奖罚规则设置',
        node: 'score_setting',
        activeClass: 'score'
      }
    }
  ]
}

export default score
