import Layout from '@/layout'

const booking = {
  path: '/apparatus-booking',
  component: Layout,
  redirect: '/apparatus-booking/list',
  name: 'booking',
  meta: {
    title: '仪器预约管理',
    icon: 'booking',
    node: 'booking_management',
    activeClass: 'booking'
  },
  alwaysShow: true,
  children: [{
      path: '/apparatus-booking/list',
      name: 'apparatusBookingList',
      component: () => import('@/views/admin/apparatus-booking/list'),
      meta: {
        title: '预约列表',
        node: 'booking_list',
        activeClass: 'booking'
      }
    },
    {
      path: '/apparatus-booking/edit/:id',
      name: 'apparatusBookingEdit',
      component: () => import('@/views/admin/apparatus-booking/add'),
      hidden: true,
      meta: {
        title: '修改预约',
        node: 'edit_booking',
        activeMenu: '/apparatus-booking/list',
        preName: '预约管理',
        activeClass: 'booking'
      }
    },
    {
      path: '/common-apparatus-time/list',
      name: 'commonApparatusTimeList',
      component: () => import('@/views/admin/common-apparatus-time/index'),
      meta: {
        title: '通用可预约时间列表',
        node: 'common_apparatus_time_list',
        activeClass: 'booking'
      }
    },
    {
      path: '/common-apparatus-time/add',
      name: 'commonApparatusTimeAdd',
      component: () => import('@/views/admin/common-apparatus-time/add'),
      hidden: true,
      meta: {
        title: '添加通用可预约时间',
        node: 'add_common_apparatus_time',
        activeMenu: '/common-apparatus-time/list',
        preName: '通用可预约时间列表',
        activeClass: 'booking'
      }
    },
    {
      path: '/common-apparatus-time/edit/:id',
      name: 'commonApparatusTimeEdit',
      component: () => import('@/views/admin/common-apparatus-time/add'),
      hidden: true,
      meta: {
        title: '修改通用可预约时间',
        node: 'edit_common_apparatus_time',
        activeMenu: '/common-apparatus-time/list',
        preName: '通用可预约时间列表',
        activeClass: 'booking'
      }
    },
    {
      path: '/special-apparatus-time/list',
      name: 'specialApparatusTimeList',
      component: () => import('@/views/admin/special-apparatus-time/index'),
      meta: {
        title: '特殊可预约时间列表',
        node: 'special_apparatus_time_list',
        activeClass: 'booking'
      }
    },
    {
      path: '/special-apparatus-time/add',
      name: 'specialApparatusTimeAdd',
      component: () => import('@/views/admin/special-apparatus-time/add'),
      hidden: true,
      meta: {
        title: '添加特殊可预约时间',
        node: 'add_special_apparatus_time',
        activeMenu: '/special-apparatus-time/list',
        preName: '特殊可预约时间列表',
        activeClass: 'booking'
      }
    },
    {
      path: '/special-apparatus-time/edit/:id',
      name: 'specialApparatusTimeEdit',
      component: () => import('@/views/admin/special-apparatus-time/add'),
      hidden: true,
      meta: {
        title: '修改特殊可预约时间',
        node: 'edit_special_apparatus_time',
        activeMenu: '/special-apparatus-time/list',
        preName: '特殊可预约时间列表',
        activeClass: 'booking'
      }
    }
  ]
}

export default booking
