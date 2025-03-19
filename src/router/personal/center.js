import Layout from '@/layout-personal'

const center = {
  path: '/info-center',
  component: Layout,
  redirect: '/info-center/my-booking',
  meta: {
    title: '个人中心',
    node: 'info_center',
    icon: 'home',
    activeClass: 'home'
  },
  name: 'infoCenter',
  alwaysShow: true,
  children: [{
      path: '/info-center/my-booking',
      name: 'infoCenterBooking',
      component: () => import('@/views/personal/info-center/my-booking'),
      meta: {
        title: '我的预约记录',
        node: 'info_center',
        activeClass: 'home'
      }
    },
    {
      path: '/info-center/my-projects-audit',
      name: 'info_center_my_projects_audit',
      component: () => import('@/views/personal/info-center/my-projects-audit'),
      meta: {
        title: '项目审批',
        node: 'info_center',
        activeClass: 'home'
      }
    },
    {
      path: '/info-center/my-platform-apply',
      name: 'infoCenterPlatformApply',
      redirect: '/info-center/my-platform-apply/list',
      component: () => import('@/views/personal/info-center/my-platform-apply/index'),
      meta: {
        title: '入室申请',
        node: 'info_center',
        activeClass: 'home'
      },
      children: [{
          path: '/info-center/my-platform-apply/list',
          name: 'infoCenterPlatformApplyList',
          component: () => import('@/views/personal/info-center/my-platform-apply/list'),
          meta: {
            title: '入室申请记录',
            node: 'info_center',
            activeClass: 'home'
          }
        }
        // {
        //     path: '/info-center/my-platform-append-apply/list',
        //     name: 'infoCenterPlatformAppendApplyList',
        //     component: () => import('@/views/personal/info-center/my-platform-apply/append-list'),
        //     meta: { title: '补充入室申请列表', node: 'info_center', activeClass: 'home' }
        // }
      ]
    },
    {
      path: '/info-center/my-train',
      name: 'infoCenterTrain',
      component: () => import('@/views/personal/info-center/my-train'),
      meta: {
        title: '我的培训',
        node: 'info_center',
        activeClass: 'home'
      }
    },
    {
      path: '/info-center/my-score-record',
      name: 'infoCenterScoreRecord',
      component: () => import('@/views/personal/info-center/my-score-record'),
      meta: {
        title: '我的评分',
        node: 'info_center',
        activeClass: 'home'
      }
    },
    {
      path: '/info-center/my-score',
      name: 'infoCenterScore',
      component: () => import('@/views/personal/info-center/my-score'),
      meta: {
        title: '我的信用分',
        node: 'info_center',
        activeClass: 'home'
      }
    },
    {
      path: '/info-center/my-platform',
      name: 'infoCenterPlatform',
      component: () => import('@/views/personal/info-center/my-platform'),
      meta: {
        title: '我的实验室',
        node: 'info_center',
        activeClass: 'home'
      }
    },
    {
      path: '/info-center/research-group',
      // name: 'infoCenterResearchGroup',
      name: 'infoCenterMyResearchGroup',
      // redirect: '/info-center/research-group/list',
      // component: () => import('@/views/personal/info-center/research-group/index'),
      component: () => import('@/views/personal/info-center/research-group/my-list'),
      meta: {
        title: '我的课题组',
        node: 'info_center',
        activeClass: 'home'
      },
      // children: [
      //     {
      //         path: '/info-center/research-group/list',
      //         name: 'infoCenterPlatformApplyList',
      //         component: () => import('@/views/personal/info-center/research-group/list'),
      //         meta: { title: '课题组列表', node: 'info_center', activeClass: 'home' }
      //     },
      //     {
      //         path: '/info-center/my-research-group',
      //         name: 'infoCenterMyResearchGroup',
      //         component: () => import('@/views/personal/info-center/research-group/my-list'),
      //         meta: { title: '个人课题组列表', node: 'info_center', activeClass: 'home' }
      //     },
      // ]
    },
    {
      path: '/info-center/my-research-group-account',
      name: 'infoCenterResearchGroupAccount',
      component: () => import('@/views/personal/info-center/my-research-group-account'),
      meta: {
        title: '我的课题账号',
        node: 'info_center',
        activeClass: 'home'
      }
    },
    {
      path: '/info-center/my-apparatus',
      name: 'infoCenterApparatus',
      component: () => import('@/views/personal/info-center/my-apparatus'),
      meta: {
        title: '我的可约仪器',
        node: 'info_center',
        activeClass: 'home'
      }
    },
    {
      path: '/info-center/paper-list',
      name: 'personalPaperList',
      component: () => import('@/views/personal/info-center/scientific-research/paper-list'),
      meta: {
        title: '我的科研论文',
        node: 'info_center',
        activeClass: 'home'
      }
    },
    {
      path: '/info-center/paper/add',
      name: 'personalPaperAdd',
      component: () => import('@/views/personal/info-center/scientific-research/paper-edit'),
      hidden: true,
      meta: {
        title: '添加科研论文',
        node: 'info_center',
        activeMenu: '/info-center/paper-list',
        preName: '科研论文列表',
        activeClass: 'home'
      }
    },
    {
      path: '/info-center/paper/edit/:id',
      name: 'personalPaperEdit',
      component: () => import('@/views/personal/info-center/scientific-research/paper-edit'),
      hidden: true,
      meta: {
        title: '修改科研论文',
        node: 'info_center',
        activeMenu: '/info-center/paper-list',
        preName: '科研论文列表',
        activeClass: 'home'
      }
    },
    {
      path: '/info-center/award-list',
      name: 'personalAwardList',
      component: () => import('@/views/personal/info-center/scientific-research/award-list'),
      meta: {
        title: '我的科研奖项',
        node: 'info_center',
        activeClass: 'home'
      }
    },
    {
      path: '/info-center/award/add',
      name: 'personalAwardAdd',
      component: () => import('@/views/personal/info-center/scientific-research/award-edit'),
      hidden: true,
      meta: {
        title: '添加科研奖项',
        node: 'info_center',
        activeMenu: '/info-center/award-list',
        preName: '科研奖项列表',
        activeClass: 'home'
      }
    },
    {
      path: '/info-center/award/edit/:id',
      name: 'personalAwardEdit',
      component: () => import('@/views/personal/info-center/scientific-research/award-edit'),
      hidden: true,
      meta: {
        title: '修改科研奖项',
        node: 'info_center',
        activeMenu: '/info-center/award-list',
        preName: '科研奖项列表',
        activeClass: 'home'
      }
    },
    {
      path: '/info-center/project-list',
      name: 'personalProjectList',
      component: () => import('@/views/personal/info-center/scientific-research/project-list'),
      meta: {
        title: '我的科研项目',
        node: 'info_center',
        activeClass: 'home'
      }
    },
    {
      path: '/info-center/project/add',
      name: 'personalProjectAdd',
      component: () => import('@/views/personal/info-center/scientific-research/project-edit'),
      hidden: true,
      meta: {
        title: '添加科研项目',
        node: 'info_center',
        activeMenu: '/info-center/project-list',
        preName: '科研项目列表',
        activeClass: 'home'
      }
    },
    {
      path: '/info-center/project/edit/:id',
      name: 'personalProjectEdit',
      component: () => import('@/views/personal/info-center/scientific-research/project-edit'),
      hidden: true,
      meta: {
        title: '修改科研项目',
        node: 'info_center',
        activeMenu: '/info-center/project-list',
        preName: '科研项目列表',
        activeClass: 'home'
      }
    },
    {
      path: '/info-center/honour-list',
      name: 'personalHonourList',
      component: () => import('@/views/personal/info-center/scientific-research/honour-list'),
      meta: {
        title: '我的科研荣誉',
        node: 'info_center',
        activeClass: 'home'
      }
    },
    {
      path: '/info-center/honour/add',
      name: 'personalHonourAdd',
      component: () => import('@/views/personal/info-center/scientific-research/honour-edit'),
      hidden: true,
      meta: {
        title: '添加科研荣誉',
        node: 'info_center',
        activeMenu: '/info-center/honour-list',
        preName: '科研荣誉列表',
        activeClass: 'home'
      }
    },
    {
      path: '/info-center/honour/edit/:id',
      name: 'personalHonourEdit',
      component: () => import('@/views/personal/info-center/scientific-research/honour-edit'),
      hidden: true,
      meta: {
        title: '修改科研荣誉',
        node: 'info_center',
        activeMenu: '/info-center/honour-list',
        preName: '科研荣誉列表',
        activeClass: 'home'
      }
    },
    {
      path: '/info-center/my-exam',
      name: 'infoCenterExam',
      component: () => import('@/views/personal/info-center/my-exam'),
      meta: {
        title: '我的考试记录',
        node: 'info_center',
        activeClass: 'home'
      }
    },
    {
      path: '/info-center/reset-password',
      name: 'resetPassword',
      component: () => import('@/views/personal/home/index'),
      meta: {
        title: '修改密码',
        node: 'info_center',
        activeClass: 'home'
      }
    }
  ]
}

export default center
