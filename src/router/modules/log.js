import Layout from '@/layout'

const log = {
  path: '/log',
  component: Layout,
  redirect: '/system-log',
  name: 'log',
  meta: {
    title: '日志管理',
    icon: 'log',
    node: 'log_management',
    activeClass: 'log'
  },
  alwaysShow: true,
  children: [{
      path: '/system-log',
      name: 'systemLog',
      component: () => import('@/views/admin/log/system'),
      meta: {
        title: '系统日志',
        node: 'system_log',
        activeClass: 'log'
      }
    },
    {
      path: '/door-log',
      name: 'doorLog',
      component: () => import('@/views/admin/log/door'),
      meta: {
        title: '门禁日志',
        node: 'door_log',
        activeClass: 'log'
      }
    }
  ]
}

export default log
