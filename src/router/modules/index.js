import LayoutIndex from '@/layout-index'

const index = {
  path: '/',
  component: LayoutIndex,
  hidden: true,
  children: [{
    path: '/',
    name: 'Index',
    component: () => import('@/views/index/index/index'),
    meta: {
      title: '首页',
      tagName: 'index',
    }
  },
  {
    path: '/buy-animal',
    name: 'personalBuyAnimal',

    component: () => import('@/views/index/order/buy_animal'),
    meta: {
      title: '动物订购',
      node: 'platform',
      tagName: 'buy_animal',
      activeClass: 'platform'
    }
  },

  {
    path: '/buy-instrument',
    name: 'personalBuyInstrument',

    component: () => import('@/views/index/order/buy_instrument'),
    meta: {
      title: '物品订购',
      node: 'platform',
      tagName: 'buy_instrument',
      activeClass: 'platform'
    }
  },
  {
    path: '/buy-tech',
    name: 'personalBuyTech',

    component: () => import('@/views/index/order/buy_tech'),
    meta: {
      title: '技术订购',
      node: 'platform',
      tagName: 'buy_tech',
      activeClass: 'platform'
    }
  },
  {
    path: '/buy-feed',
    name: 'personalBuyFeed',

    component: () => import('@/views/index/order/buy_feed'),
    meta: {
      title: '饲养订购',
      node: 'platform',
      tagName: 'buy_feed',
      activeClass: 'platform'
    }
  },
  {
    path: '/buy-rack',
    name: 'personalBuyRack',

    component: () => import('@/views/index/order/buy_rack'),
    meta: {
      title: '笼位订购',
      node: 'platform',
      tagName: 'buy_rack',
      activeClass: 'platform'
    }
  },
  {
    path: '/buy-feed-add/:id',
    name: 'personalBuyFeedAdd',

    component: () => import('@/views/index/order/buy_feed_add'),
    meta: {
      title: '饲养申请',
      node: 'platform',
      activeClass: 'platform'
    }
  },

  {
    path: '/buy-tech-cold/:id',
    name: 'personalBuyTechCold',

    component: () => import('@/views/index/order/buy_tech_cold'),
    meta: {
      title: '冻存申请',
      node: 'platform',
      activeClass: 'platform'
    }
  },

  {
    path: '/buy-tech-revive/:id',
    name: 'personalBuyTechRevive',

    component: () => import('@/views/index/order/buy_tech_revive'),
    meta: {
      title: '复苏申请',
      node: 'platform',
      activeClass: 'platform'
    }
  },

  {
    path: '/buy-tech-purify/:id',
    name: 'personalBuyTechPurify',

    component: () => import('@/views/index/order/buy_tech_purify'),
    meta: {
      title: '净化申请',
      node: 'platform',
      activeClass: 'platform'
    }
  },

  {
    path: '/intro',
    name: 'Intro',
    component: () => import('@/views/index/intro/index'),
    meta: {
      title: '平台简介',
      tagName: 'intro',
      permission: true
    }
  },
  {
    path: '/zhongxinshiyanshi',
    name: 'zhongxinshiyanshi',
    component: () => import('@/views/index/intro/index'),
    meta: {
      title: '中心实验室',
      tagName: 'zhongxinshiyanshi',
      permission: true
    }
  },
  {
    path: '/shiyandongwuzhongxin',
    name: 'shiyandongwuzhongxin',
    component: () => import('@/views/index/intro/index'),
    meta: {
      title: '实验动物研究中心',
      tagName: 'shiyandongwuzhongxin',
      permission: true
    }
  },
  {
    path: '/shengwuziyuanzhongxin',
    name: 'shengwuziyuanzhongxin',
    component: () => import('@/views/index/intro/index'),
    meta: {
      title: '生物资源中心',
      tagName: 'shengwuziyuanzhongxin',
      permission: true
    }
  },
  {
    path: '/gmpxibaozhongxin',
    name: 'gmpxibaozhongxin',
    component: () => import('@/views/index/intro/index'),
    meta: {
      title: 'GMP细胞中心',
      tagName: 'gmpxibaozhongxin',
      permission: true
    }
  },
  {
    path: '/shujufenxizhongxin',
    name: 'shujufenxizhongxin',
    component: () => import('@/views/index/intro/index'),
    meta: {
      title: '数据分析中心',
      tagName: 'shujufenxizhongxin',
      permission: true
    }
  },
  {
    path: '/privacy-agreement',
    name: 'privacyAgreement',
    component: () => import('@/views/index/intro/index'),
    meta: {
      title: '隐私协议',
      tagName: 'privacy_agreement',
      permission: true
    }
  },
  {
    path: '/regulations',
    name: 'Regulations',
    component: () => import('@/views/index/news/index'),
    meta: {
      title: '规章制度',
      tagName: 'regulations',
      permission: true
    }
  },
  {
    path: '/appointment',
    name: 'Appointment',
    component: () => import('@/views/index/appointment/index'),
    meta: {
      title: '仪器预约',
      tagName: 'appointment',
      permission: true
    }
  },
  {
    path: '/apparatus-maintenance',
    name: 'ApparatusMaintenance',
    component: () => import('@/views/index/apparatus-maintenance/index'),
    meta: {
      title: '仪器维修',
      tagName: 'apparatus_maintenance',
      permission: true
    }
  },
  {
    path: '/apparatus-datas',
    name: 'ApparatusDatas',
    component: () => import('@/views/index/apparatus-datas/index'),
    meta: {
      title: '仪器资料',
      tagName: 'apparatus_datas',
      permission: true
    }
  },
  {
    path: '/doc-download',
    name: 'DocDownload',
    component: () => import('@/views/index/news/index'),
    meta: {
      title: '文档下载',
      tagName: 'doc-download',
      permission: true
    }
  },
  {
    path: '/security',
    name: 'Security',
    component: () => import('@/views/index/security/index'),
    meta: {
      title: '安全准入',
      tagName: 'security',
      permission: true
    }
  },
  {
    path: '/communication',
    name: 'Communication',
    component: () => import('@/views/index/news/index'),
    meta: {
      title: '经验交流',
      tagName: 'communication',
      permission: true
    }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('@/views/index/contact/index'),
    meta: {
      title: '联系我们',
      tagName: 'contact',
      permission: true
    }
  },
  {
    path: '/doc-download/detail/:id',
    name: 'docDownloadnotesDetail',
    component: () => import('@/views/index/news/detail'),
    meta: {
      title: '文档下载详情',
      tagName: 'doc-download',
      activeMenu: '/doc-download',
      preName: '文档下载',
      permission: true
    }
  },
  {
    path: '/communication/detail/:id',
    name: 'communicationDetail',
    component: () => import('@/views/index/news/detail'),
    meta: {
      title: '经验交流详情',
      tagName: 'communication',
      activeMenu: '/communication',
      preName: '经验交流',
      permission: true
    }
  },
  {
    path: '/regulations/detail/:id',
    name: 'regulationsDetail',
    component: () => import('@/views/index/news/detail'),
    meta: {
      title: '规章制度详情',
      tagName: 'regulations',
      activeMenu: '/regulations',
      preName: '规章制度',
      permission: true
    }
  },
  {
    path: '/learning',
    name: 'Learning',
    component: () => import('@/views/index/learning/list'),
    meta: {
      title: '学习资料',
      tagName: '',
      permission: true
    }
  },
  {
    path: '/learning/detail/:id',
    name: 'learningDetail',
    component: () => import('@/views/index/learning/detail'),
    meta: {
      title: '学习资料详情',
      tagName: '',
      activeMenu: '/learning',
      preName: '学习资料',
      permission: true
    }
  },
  {
    path: '/news-search',
    name: 'newsSearch',
    component: () => import('@/views/index/news/index'),
    meta: {
      title: '全站搜索',
      tagName: '',
      permission: true
    }
  },
  {
    path: '/appointment/detail/:id',
    name: 'appointmentDetail',
    component: () => import('@/views/index/appointment/detail'),
    meta: {
      title: '设备详情',
      tagName: 'appointment',
      permission: true,
    }
  },
  {
    path: '/platform-intro',
    name: 'platformIntro',
    component: () => import('@/views/index/platform-intro/index'),
    meta: {
      title: '实验平台',
      tagName: 'platform_intro',
      permission: true
    }
  },
  {
    path: '/reagent-list',
    name: 'indexReagentList',
    component: () => import('@/views/index/reagent/index'),
    meta: {
      title: '试剂耗材',
      tagName: '',
      permission: true
    }
  },
  {
    path: '/appointment-list',
    name: 'indexAppointmentList',
    component: () => import('@/views/index/appointment-list/index'),
    meta: {
      title: '预约审批',
      tagName: '',
      permission: true
    }
  },
  {
    path: '/instrument-training',
    name: 'instrumentTraining',
    component: () => import('@/views/index/instrument-training/index'),
    meta: {
      title: '仪器培训',
      tagName: 'instrument_training',
      permission: true
    }
  },
  {
    path: '/instrument-training/detail/:id',
    name: 'instrumentTrainingDetail',
    component: () => import('@/views/index/instrument-training/detail'),
    meta: {
      title: '集中培训详情',
      tagName: '',
      activeMenu: '/instrument-training',
      preName: '仪器培训',
      permission: true
    }
  },
  {
    path: '/apply-training',
    name: ' applyTraining',
    component: () => import('@/views/index/apply-training/index'),
    meta: {
      title: '申请培训',
      tagName: 'apply_training',
      permission: true
    }
  },
  {
    path: '/apply-training/detail/:id',
    name: 'applyTrainingDetail',
    component: () => import('@/views/index/apply-training/detail'),
    meta: {
      title: '申请培训详情',
      tagName: '',
      activeMenu: '/apply-training',
      preName: '仪器培训',
      permission: true
    }
  },
  {
    path: '/apply-platform',
    name: 'applyPlatform',
    component: () => import('@/views/index/apply-platform/index'),
    meta: {
      title: '入室申请',
      tagName: '',
      permission: true
    }
  },
  {
    path: '/real-time',
    name: 'realTime',
    component: () => import('@/views/index/real-time/index'),
    meta: {
      title: '实时实验',
      tagName: '',
      permission: true
    }
  },
  {
    path: '/apparatus-month-sort',
    name: 'apparatusMonthSort',
    component: () => import('@/views/index/apparatus-sort/index'),
    meta: {
      title: '设备使用月度排行',
      tagName: '',
      sortType: 'month',
      permission: true
    }
  },
  {
    path: '/apparatus-year-sort',
    name: 'apparatusYearSort',
    component: () => import('@/views/index/apparatus-sort/index'),
    meta: {
      title: '设备使用年度排行',
      tagName: '',
      sortType: 'year',
      permission: true
    }
  },
  {
    path: '/score-list',
    name: 'scoreList',
    component: () => import('@/views/index/score-list/index'),
    meta: {
      title: '违规记录',
      tagName: '',
      permission: true
    }
  },
  //新闻
  {
    path: '/news',
    name: 'indexNewsList',
    component: () => import('@/views/index/news/index'),
    meta: {
      title: '新闻动态',
      tagName: 'news',
      permission: true
    }
  },
  {
    path: '/news/detail/:id',
    name: 'newsDetail',
    component: () => import('@/views/index/news/detail'),
    meta: {
      title: '新闻详情',
      tagName: 'news',
      activeMenu: '/news',
      preName: '新闻动态',
      permission: true
    }
  },
  {
    path: '/notes',
    name: 'notesList',
    component: () => import('@/views/index/news/index'),
    meta: {
      title: '通知公告',
      tagName: 'notes',
      permission: true
    }
  },
  {
    path: '/notes/detail/:id',
    name: 'notesDetail',
    component: () => import('@/views/index/news/detail'),
    meta: {
      title: '公告详情',
      tagName: 'notes',
      activeMenu: '/notes',
      preName: '通知公告',
      permission: true
    }
  },
  {
    path: '/science',
    name: 'scienceList',
    component: () => import('@/views/index/news/index'),
    meta: {
      title: '科学研究',
      tagName: 'science',
      permission: true
    }
  },
  {
    path: '/science/detail/:id',
    name: 'scienceDetail',
    component: () => import('@/views/index/news/detail'),
    meta: {
      title: '科学研究详情',
      tagName: 'science',
      activeMenu: '/science',
      preName: '科学研究',
      permission: true
    }
  },
  {
    path: '/education',
    name: 'educationList',
    component: () => import('@/views/index/news/index'),
    meta: {
      title: '教育教学',
      tagName: 'education',
      permission: true
    }
  },
  {
    path: '/education/detail/:id',
    name: 'educationDetail',
    component: () => import('@/views/index/news/detail'),
    meta: {
      title: '教育教学详情',
      tagName: 'education',
      activeMenu: '/education',
      preName: '教育教学',
      permission: true
    }
  },
  {
    path: '/organisms',
    name: 'organismsList',
    component: () => import('@/views/index/news/index'),
    meta: {
      title: '生物资源中心',
      tagName: 'organisms',
      permission: true
    }
  },
  {
    path: '/organisms/detail/:id',
    name: 'organismsDetail',
    component: () => import('@/views/index/news/detail'),
    meta: {
      title: '生物资源中心详情',
      tagName: 'organisms',
      activeMenu: '/organisms',
      preName: '生物资源中心',
      permission: true
    }
  },
  {
    path: '/animal',
    name: 'animalList',
    component: () => import('@/views/index/news/index'),
    meta: {
      title: '实验动物研究中心',
      tagName: 'animal',
      permission: true
    }
  },
  {
    path: '/animal/detail/:id',
    name: 'animalDetail',
    component: () => import('@/views/index/news/detail'),
    meta: {
      title: '实验动物研究中心详情',
      tagName: 'animal',
      activeMenu: '/animal',
      preName: '实验动物研究中心',
      permission: true
    }
  },
  {
    path: '/sharing',
    name: 'sharingList',
    component: () => import('@/views/index/news/index'),
    meta: {
      title: '中心实验室',
      tagName: 'sharing',
      permission: true
    }
  },
  {
    path: '/sharing/detail/:id',
    name: 'sharingDetail',
    component: () => import('@/views/index/news/detail'),
    meta: {
      title: '中心实验室详情',
      tagName: 'sharing',
      activeMenu: '/sharing',
      preName: '中心实验室',
      permission: true
    }
  },
  {
    path: '/gmp',
    name: 'gmpList',
    component: () => import('@/views/index/news/index'),
    meta: {
      title: 'GMP细胞技术中心',
      tagName: 'gmp',
      permission: true
    }
  },
  {
    path: '/gmp/detail/:id',
    name: 'gmpDetail',
    component: () => import('@/views/index/news/detail'),
    meta: {
      title: 'GMP细胞技术中心详情',
      tagName: 'gmp',
      activeMenu: '/gmp',
      preName: 'GMP细胞技术中心',
      permission: true
    }
  },
  {
    path: '/publab',
    name: 'publabList',
    component: () => import('@/views/index/news/index'),
    meta: {
      title: '仪器共享和技术服务中心',
      tagName: 'publab',
      permission: true
    }
  },
  {
    path: '/publab/detail/:id',
    name: 'publabDetail',
    component: () => import('@/views/index/news/detail'),
    meta: {
      title: '仪器共享和技术服务中心详情',
      tagName: 'publab',
      activeMenu: '/publab',
      preName: '仪器共享和技术服务中心',
      permission: true
    }
  },
  {
    path: '/hcsmng',
    name: 'hcsmngList',
    component: () => import('@/views/index/news/index'),
    meta: {
      title: '危化品管理',
      tagName: 'hcsmng',
      permission: true
    }
  },
  {
    path: '/hcsmng/detail/:id',
    name: 'hcsmngDetail',
    component: () => import('@/views/index/news/detail'),
    meta: {
      title: '危化品管理详情',
      tagName: 'hcsmng',
      activeMenu: '/hcsmng',
      preName: '危化品管理',
      permission: true
    }
  },
  {
    path: '/securityedu',
    name: 'securityeduList',
    component: () => import('@/views/index/news/index'),
    meta: {
      title: '安全教育',
      tagName: 'securityedu',
      permission: true
    }
  },
  {
    path: '/securityedu/detail/:id',
    name: 'securityeduDetail',
    component: () => import('@/views/index/news/detail'),
    meta: {
      title: '安全教育详情',
      tagName: 'securityedu',
      activeMenu: '/securityedu',
      preName: '安全教育',
      permission: true
    }
  },
  {
    path: '/inrules',
    name: 'inrulesList',
    component: () => import('@/views/index/news/index'),
    meta: {
      title: '入室制度',
      tagName: 'inrules',
      permission: true
    }
  },
  {
    path: '/inrules/detail/:id',
    name: 'inrulesDetail',
    component: () => import('@/views/index/news/detail'),
    meta: {
      title: '入室制度详情',
      tagName: 'inrules',
      activeMenu: '/inrules',
      preName: '入室制度',
      permission: true
    }
  },
  {
    path: '/apparatusrules',
    name: 'apparatusRulesList',
    component: () => import('@/views/index/news/index'),
    meta: {
      title: '仪器制度',
      tagName: 'apparatusrules',
      permission: true
    }
  },
  {
    path: '/apparatusrules/detail/:id',
    name: 'apparatusRulesDetail',
    component: () => import('@/views/index/news/detail'),
    meta: {
      title: '仪器制度详情',
      tagName: 'apparatusrules',
      activeMenu: '/apparatusrules',
      preName: '仪器制度',
      permission: true
    }
  },
  {
    path: '/inprocess',
    name: 'inprocessList',
    component: () => import('@/views/index/news/index'),
    meta: {
      title: '入室流程',
      tagName: 'inprocess',
      permission: true
    }
  },
  {
    path: '/inprocess/detail/:id',
    name: 'inprocessDetail',
    component: () => import('@/views/index/news/detail'),
    meta: {
      title: '入室流程详情',
      tagName: 'inprocess',
      activeMenu: '/inprocess',
      preName: '入室流程',
      permission: true
    }
  },
  {
    path: '/apparatustrain',
    name: 'apparatustrainList',
    component: () => import('@/views/index/news/index'),
    meta: {
      title: '仪器培训',
      tagName: 'apparatustrain',
      permission: true
    }
  },
  {
    path: '/apparatustrain/detail/:id',
    name: 'apparatustrainDetail',
    component: () => import('@/views/index/news/detail'),
    meta: {
      title: '仪器培训详情',
      tagName: 'apparatustrain',
      activeMenu: '/apparatustrain',
      preName: '仪器培训',
      permission: true
    }
  },
  {
    path: '/techtrain',
    name: 'techtrainList',
    component: () => import('@/views/index/news/index'),
    meta: {
      title: '技术培训',
      tagName: 'techtrain',
      permission: true
    }
  },
  {
    path: '/techtrain/detail/:id',
    name: 'techtrainDetail',
    component: () => import('@/views/index/news/detail'),
    meta: {
      title: '技术培训详情',
      tagName: 'techtrain',
      activeMenu: '/techtrain',
      preName: '技术培训',
      permission: true
    }
  },
  {
    path: '/rechargeinfo',
    name: 'rechargeinfoList',
    component: () => import('@/views/index/news/index'),
    meta: {
      title: '收费标准',
      tagName: 'rechargeinfo',
      permission: true
    }
  },
  {
    path: '/rechargeinfo/detail/:id',
    name: 'rechargeinfoDetail',
    component: () => import('@/views/index/news/detail'),
    meta: {
      title: '收费标准详情',
      tagName: 'rechargeinfo',
      activeMenu: '/rechargeinfo',
      preName: '收费标准',
      permission: true
    }
  }
  ]
}

export default index
