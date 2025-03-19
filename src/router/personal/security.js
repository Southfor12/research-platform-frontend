import Layout from '@/layout-personal'

const security = {
  path: '/personal/security',
  component: Layout,
  redirect: '/personal/train-doc/list',
  name: 'personalSecurity',
  meta: {
    title: '考试(安全教育)管理',
    icon: 'security',
    node: 'apparatus',
    activeClass: 'security'
  },
  alwaysShow: true,
  children: [{
      path: '/personal/train-doc/list',
      name: 'personalTrainDocList',
      component: () => import('@/views/personal/security/train-doc/list'),
      meta: {
        title: '学习资料列表',
        node: 'platform',
        activeClass: 'security'
      }
    },
    {
      path: '/personal/train-doc/add',
      name: 'personalTrainDocAdd',
      component: () => import('@/views/personal/security/train-doc/add'),
      hidden: true,
      meta: {
        title: '添加学习资料',
        node: 'platform',
        activeMenu: '/personal/train-doc/list',
        preName: '学习资料列表',
        activeClass: 'security'
      }
    },
    {
      path: '/personal/train-doc/edit/:id',
      name: 'personalTrainDocEdit',
      component: () => import('@/views/personal/security/train-doc/add'),
      hidden: true,
      meta: {
        title: '修改学习资料',
        node: 'platform',
        activeMenu: '/personal/train-doc/list',
        preName: '学习资料列表',
        activeClass: 'security'
      }
    },
    {
      path: '/personal/rules-info/list',
      name: 'personalRulesInfoList',
      component: () => import('@/views/personal/security/rules-info/list'),
      meta: {
        title: '规章制度列表',
        node: 'platform',
        activeClass: 'security'
      }
    },
    {
      path: '/personal/rules-info/add',
      name: 'personalRulesInfoAdd',
      component: () => import('@/views/personal/security/rules-info/edit'),
      hidden: true,
      meta: {
        title: '添加规章制度',
        node: 'platform',
        activeMenu: '/personal/rules-info/list',
        preName: '规章制度列表',
        activeClass: 'security'
      }
    },
    {
      path: '/personal/rules-info/edit/:id',
      name: 'personalRulesInfoEdit',
      component: () => import('@/views/personal/security/rules-info/edit'),
      hidden: true,
      meta: {
        title: '修改规章制度',
        node: 'platform',
        activeMenu: '/personal/rules-info/list',
        preName: '规章制度列表',
        activeClass: 'security'
      }
    },
    {
      path: '/personal/exam-question/list',
      name: 'personalExamQuestionList',
      component: () => import('@/views/personal/security/exam-question/list'),
      meta: {
        title: '入室考试题目列表',
        node: 'platform',
        activeClass: 'security'
      }
    },
    {
      path: '/personal/exam-question/add',
      name: 'personalExamQuestionAdd',
      component: () => import('@/views/personal/security/exam-question/add'),
      hidden: true,
      meta: {
        title: '添加入室考试题目',
        node: 'platform',
        activeMenu: '/personal/exam-question/list',
        preName: '入室考试题目列表',
        activeClass: 'security'
      }
    },
    {
      path: '/personal/exam-question/edit/:id',
      name: 'personalExamQuestionEdit',
      component: () => import('@/views/personal/security/exam-question/add'),
      hidden: true,
      meta: {
        title: '修改入室考试题目',
        node: 'platform',
        activeMenu: '/personal/exam-question/list',
        preName: '入室考试题目列表',
        activeClass: 'security'
      }
    },
    {
      path: '/personal/apparatus-exam-question/list',
      name: 'personalApparatusExamQuestionList',
      component: () => import('@/views/personal/security/apparatus-exam-question/list'),
      meta: {
        title: '仪器考试题目列表',
        node: 'apparatus',
        activeClass: 'security'
      }
    },
    {
      path: '/personal/apparatus-exam-question/add',
      name: 'personalApparatusExamQuestionAdd',
      component: () => import('@/views/personal/security/apparatus-exam-question/add'),
      hidden: true,
      meta: {
        title: '添加仪器考试题目',
        node: 'apparatus',
        activeMenu: '/personal/apparatus-exam-question/list',
        preName: '仪器考试题目列表',
        activeClass: 'security'
      }
    },
    {
      path: '/personal/apparatus-exam-question/edit/:id',
      name: 'personalApparatusExamQuestionEdit',
      component: () => import('@/views/personal/security/apparatus-exam-question/add'),
      hidden: true,
      meta: {
        title: '修改仪器考试题目',
        node: 'apparatus',
        activeMenu: '/personal/apparatus-exam-question/list',
        preName: '仪器考试题目列表',
        activeClass: 'security'
      }
    },
    {
      path: '/personal/platform-exam-rule/list',
      name: 'personalPlatformExamRuleList',
      component: () => import('@/views/personal/security/platform-exam-rule/index'),
      meta: {
        title: '入室考试规则列表',
        node: 'platform',
        activeClass: 'security'
      }
    },
    {
      path: '/personal/platform-exam-rule/edit/:id',
      name: 'personalPlatformExamRuleEdit',
      component: () => import('@/views/personal/security/platform-exam-rule/edit'),
      hidden: true,
      meta: {
        title: '修改入室考试规则',
        node: 'platform',
        activeMenu: '/personal/platform-exam-rule/list',
        preName: '入室考试规则列表',
        activeClass: 'security'
      }
    },
    {
      path: '/personal/apparatus-exam-rule/list',
      name: 'personalApparatusExamRuleList',
      component: () => import('@/views/personal/security/apparatus-exam-rule/index'),
      meta: {
        title: '仪器考试规则列表',
        node: 'apparatus',
        activeClass: 'security'
      }
    },
    {
      path: '/personal/apparatus-exam-rule/edit/:id',
      name: 'personalApparatusxamRuleEdit',
      component: () => import('@/views/personal/security/apparatus-exam-rule/edit'),
      hidden: true,
      meta: {
        title: '修改仪器考试规则',
        node: 'apparatus',
        activeMenu: '/personal/apparatus-exam-rule/list',
        preName: '仪器考试规则列表',
        activeClass: 'security'
      }
    }
    // {
    //     path: '/personal/exam/list',
    //     name: 'personalExamList',
    //     component: () => import('@/views/personal/security/exam/list'),
    //     meta: { title: '考试题组列表', node: 'apparatus', activeClass: 'security' }
    // },
    // {
    //     path: '/personal/exam/add',
    //     name: 'personalExamAdd',
    //     component: () => import('@/views/personal/security/exam/add'),
    //     hidden: true,
    //     meta: { title: '添加考试题目组', node: 'apparatus', activeMenu: '/personal/exam/list', preName: '考试题组列表', activeClass: 'security' }
    // },
    // {
    //     path: '/personal/exam/edit/:id',
    //     name: 'personalExamEdit',
    //     component: () => import('@/views/personal/security/exam/add'),
    //     hidden: true,
    //     meta: { title: '修改考试题目组', node: 'apparatus', activeMenu: '/personal/exam/list', preName: '考试题组列表', activeClass: 'security' }
    // }
  ]
}

export default security
