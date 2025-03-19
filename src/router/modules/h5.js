import LayoutH5 from '@/layout-h5'

const h5 = {
  path: '/h5',
  hidden: true,
  component: LayoutH5,
  redirect: '/h5/login',
  children: [
    {
      path: '/h5/login',
      name: 'h5Login',
      component: () => import('@/views/h5/login/index'),
      meta: {
        title: '登录',
        permission: true
      }
    },
    {
      path: '/h5/register',
      name: 'h5Register',
      component: () => import('@/views/h5/register/index'),
      meta: {
        title: '注册',
        permission: true
      }
    },
    {
      path: '/h5/reset-password',
      name: 'h5ResetPassword',
      component: () => import('@/views/h5/reset-password/index'),
      meta: {
        title: '找回密码',
        permission: true
      }
    },
    {
      path: '/h5/apparatus/list',
      name: 'h5ApparatusList',
      component: () => import('@/views/h5/apparatus/index'),
      meta: {
        title: '预约',
        node: 'booking_list',
        tabItem: 0
      }
    },
    {
      path: '/h5/appointment/list',
      name: 'h5AppointmentList',
      component: () => import('@/views/h5/appointment/index'),
      meta: {
        title: '预约审批',
        node: 'apparatus',
        tabItem: 1
      }
    },
    {
      path: '/h5/info-center',
      name: 'h5InfoCenter',
      component: () => import('@/views/h5/info-center/index'),
      meta: {
        title: '我的',
        node: 'booking_list',
        tabItem: 2
      }
    },
    {
      path: '/h5/appointment/do/:id',
      name: 'h5AppointmentDo',
      component: () => import('@/views/h5/appointment/do'),
      meta: {
        title: '设备预约',
        node: 'booking_list'
      }
    },
    {
      path: '/h5/my-appointment',
      name: 'h5MyAppointment',
      component: () => import('@/views/h5/appointment/my'),
      meta: {
        title: '我的预约',
        node: 'booking_list'
      }
    },
    {
      path: '/h5/my-train',
      name: 'h5MyTrain',
      component: () => import('@/views/h5/train/index'),
      meta: {
        title: '我的培训',
        node: 'booking_list'
      }
    },
    {
      path: '/h5/my-exam',
      name: 'h5MyExam',
      component: () => import('@/views/h5/exam/index'),
      meta: {
        title: '我的考试',
        node: 'booking_list'
      }
    },
    {
      path: '/h5/my-score',
      name: 'h5MyScore',
      component: () => import('@/views/h5/score/index'),
      meta: {
        title: '我的信用分',
        node: 'booking_list'
      }
    },
    {
      path: '/h5/my-platform',
      name: 'h5MyPlatform',
      component: () => import('@/views/h5/platform/index'),
      meta: {
        title: '我的实验室',
        node: 'booking_list'
      }
    },
    {
      path: '/h5/my-research-group',
      name: 'h5MyResearchGroup',
      component: () => import('@/views/h5/research-group/index'),
      meta: {
        title: '我的课题组',
        node: 'booking_list'
      }
    },
    {
      path: '/h5/my-account',
      name: 'h5MyAccount',
      component: () => import('@/views/h5/account/index'),
      meta: {
        title: '可使用账号',
        node: 'booking_list'
      }
    },
    {
      path: '/h5/my-apparatus',
      name: 'h5MyApparatus',
      component: () => import('@/views/h5/my-apparatus/index'),
      meta: {
        title: '可预约仪器',
        node: 'booking_list'
      }
    },
    {
      path: '/h5/leader-audit-apply-list',
      name: 'h5LeaderAuditApplyList',
      component: () => import('@/views/h5/platform/leader-audit-apply-list'),
      meta: {
        title: '学生入室审核',
        node: 'research_group'
      }
    },
    {
      path: '/h5/leader-audit-exit-list',
      name: 'h5LeaderAuditExitList',
      component: () => import('@/views/h5/platform/leader-audit-exit-list'),
      meta: {
        title: '学生离室审核',
        node: 'research_group'
      }
    },
    {
      path: '/h5/platform-audit-apply-list',
      name: 'h5PlatformAuditApplyList',
      component: () => import('@/views/h5/platform/platform-audit-apply-list'),
      meta: {
        title: '入室审核',
        node: 'platform'
      }
    },
    {
      path: '/h5/platform-audit-exit-list',
      name: 'h5PlatformAuditExitList',
      component: () => import('@/views/h5/platform/platform-audit-exit-list'),
      meta: {
        title: '离室审核',
        node: 'platform'
      }
    },
    {
      path: '/h5/audit-reagent-apply-list',
      name: 'h5AuditReagentApplyList',
      component: () => import('@/views/h5/chemical/audit-reagent-apply-list'),
      meta: {
        title: '试剂耗材申领审核',
        node: 'research_group'
      }
    },
    {
      path: '/h5/audit-hcs-apply-list',
      name: 'h5AuditHcsApplyList',
      component: () => import('@/views/h5/chemical/audit-hcs-apply-list'),
      meta: {
        title: '危化品申领审核',
        node: 'research_group'
      }
    },
    {
      path: '/h5/audit-order-list',
      name: 'h5AuditOrderList',
      component: () => import('@/views/h5/chemical/audit-order-list'),
      meta: {
        title: '试剂耗材申购审核',
        node: 'platform'
      }
    }
  ]
}

export default h5
