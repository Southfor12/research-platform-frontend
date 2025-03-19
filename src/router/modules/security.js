import Layout from '@/layout'

const security = {
  path: '/security',
  component: Layout,
  redirect: '/train-doc/list',
  name: 'security',
  meta: {
    title: '考试(安全教育)管理',
    icon: 'security',
    node: 'security',
    activeClass: 'security'
  },
  alwaysShow: true,
  children: [{
      path: '/train-doc/list',
      name: 'trainDocList',
      component: () => import('@/views/admin/security/train-doc/list'),
      meta: {
        title: '学习资料列表',
        node: 'train_doc_list',
        activeClass: 'security'
      }
    },
    {
      path: '/train-doc/add',
      name: 'trainDocAdd',
      component: () => import('@/views/admin/security/train-doc/add'),
      hidden: true,
      meta: {
        title: '添加学习资料',
        node: 'add_train_doc',
        activeMenu: '/train-doc/list',
        preName: '学习资料列表',
        activeClass: 'security'
      }
    },
    {
      path: '/train-doc/edit/:id',
      name: 'trainDocEdit',
      component: () => import('@/views/admin/security/train-doc/add'),
      hidden: true,
      meta: {
        title: '修改学习资料',
        node: 'edit_train_doc',
        activeMenu: '/train-doc/list',
        preName: '学习资料列表',
        activeClass: 'security'
      }
    },
    {
      path: '/exam-question/list',
      name: 'examQuestionList',
      component: () => import('@/views/admin/security/exam-question/list'),
      meta: {
        title: '入室考试题目列表',
        node: 'exam_question_list',
        activeClass: 'security'
      }
    },
    {
      path: '/exam-question/add',
      name: 'examQuestionAdd',
      component: () => import('@/views/admin/security/exam-question/add'),
      hidden: true,
      meta: {
        title: '添加入室考试题目',
        node: 'add_exam_question',
        activeMenu: '/exam-question/list',
        preName: '入室考试题目列表',
        activeClass: 'security'
      }
    },
    {
      path: '/exam-question/edit/:id',
      name: 'examQuestionEdit',
      component: () => import('@/views/admin/security/exam-question/add'),
      hidden: true,
      meta: {
        title: '修改入室考试题目',
        node: 'edit_exam_question',
        activeMenu: '/exam-question/list',
        preName: '入室考试题目列表',
        activeClass: 'security'
      }
    },
    {
      path: '/apparatus-exam-question/list',
      name: 'apparatusExamQuestionList',
      component: () => import('@/views/admin/security/apparatus-exam-question/list'),
      meta: {
        title: '仪器考试题目列表',
        node: 'apparatus_exam_question_list',
        activeClass: 'security'
      }
    },
    {
      path: '/apparatus-exam-question/add',
      name: 'apparatusExamQuestionAdd',
      component: () => import('@/views/admin/security/apparatus-exam-question/add'),
      hidden: true,
      meta: {
        title: '添加仪器考试题目',
        node: 'add_apparatus_exam_question',
        activeMenu: '/apparatus-exam-question/list',
        preName: '仪器考试题目列表',
        activeClass: 'security'
      }
    },
    {
      path: '/apparatus-exam-question/edit/:id',
      name: 'apparatusExamQuestionEdit',
      component: () => import('@/views/admin/security/apparatus-exam-question/add'),
      hidden: true,
      meta: {
        title: '修改仪器考试题目',
        node: 'edit_apparatus_exam_question',
        activeMenu: '/apparatus-exam-question/list',
        preName: '仪器考试题目列表',
        activeClass: 'security'
      }
    },
    {
      path: '/platform-exam-rule/list',
      name: 'platformExamRuleList',
      component: () => import('@/views/admin/security/platform-exam-rule/index'),
      meta: {
        title: '入室考试规则列表',
        node: 'platform_exam_rule_list',
        activeClass: 'security'
      }
    },
    {
      path: '/platform-exam-rule/edit/:id',
      name: 'platformExamRuleEdit',
      component: () => import('@/views/admin/security/platform-exam-rule/edit'),
      hidden: true,
      meta: {
        title: '修改入室考试规则',
        node: 'edit_platform_exam_rule',
        activeMenu: '/platform-exam-rule/list',
        preName: '入室考试规则列表',
        activeClass: 'security'
      }
    },
    {
      path: '/apparatus-exam-rule/list',
      name: 'apparatusExamRuleList',
      component: () => import('@/views/admin/security/apparatus-exam-rule/index'),
      meta: {
        title: '仪器考试规则列表',
        node: 'apparatus_exam_rule_list',
        activeClass: 'security'
      }
    },
    {
      path: '/apparatus-exam-rule/edit/:id',
      name: 'apparatusxamRuleEdit',
      component: () => import('@/views/admin/security/apparatus-exam-rule/edit'),
      hidden: true,
      meta: {
        title: '修改仪器考试规则',
        node: 'edit_apparatus_exam_rule',
        activeMenu: '/apparatus-exam-rule/list',
        preName: '仪器考试规则列表',
        activeClass: 'security'
      }
    },
    {
      path: '/exam/list',
      name: 'examList',
      component: () => import('@/views/admin/security/exam/list'),
      meta: {
        title: '考卷管理',
        node: 'exam_list',
        activeClass: 'security'
      }
    },
    {
      path: '/exam/add',
      name: 'examAdd',
      component: () => import('@/views/admin/security/exam/add'),
      hidden: true,
      meta: {
        title: '组建考卷',
        node: 'add_exam',
        activeMenu: '/exam/list',
        preName: '考卷管理',
        activeClass: 'security'
      }
    },
    {
      path: '/exam/edit/:id',
      name: 'examEdit',
      component: () => import('@/views/admin/security/exam/add'),
      hidden: true,
      meta: {
        title: '修改考卷',
        node: 'edit_exam',
        activeMenu: '/exam/list',
        preName: '考卷管理',
        activeClass: 'security'
      }
    }
  ]
}

export default security
