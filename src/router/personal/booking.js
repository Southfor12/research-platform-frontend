import Layout from '@/layout-personal'

const booking = {
  path: '/personal/apparatus-booking',
  component: Layout,
  redirect: '/personal/apparatus-booking/list',
  name: 'personalBooking',
  meta: {
    title: '仪器预约管理',
    icon: 'booking',
    node: 'apparatus',
    activeClass: 'booking'
  },
  alwaysShow: true,
  children: [{
      path: '/personal/apparatus-booking/list',
      name: 'personalApparatusBookingList',
      component: () => import('@/views/personal/apparatus-booking/list'),
      meta: {
        title: '预约列表',
        node: 'apparatus',
        activeClass: 'booking'
      }
    },
    {
      path: '/personal/apparatus-booking/edit/:id',
      name: 'personalApparatusBookingEdit',
      component: () => import('@/views/personal/apparatus-booking/add'),
      hidden: true,
      meta: {
        title: '修改预约',
        node: 'apparatus',
        activeMenu: '/personal/apparatus-booking/list',
        preName: '预约管理',
        activeClass: 'booking'
      }
    },
    {
      path: '/personal/common-apparatus-time/list',
      name: 'personalCommonApparatusTimeList',
      component: () => import('@/views/personal/common-apparatus-time/index'),
      meta: {
        title: '通用可预约时间列表',
        node: 'apparatus',
        activeClass: 'booking'
      }
    },
    {
      path: '/personal/common-apparatus-time/add',
      name: 'personalCommonApparatusTimeAdd',
      component: () => import('@/views/personal/common-apparatus-time/add'),
      hidden: true,
      meta: {
        title: '添加通用可预约时间',
        node: 'apparatus',
        activeMenu: '/personal/common-apparatus-time/list',
        preName: '通用可预约时间列表',
        activeClass: 'booking'
      }
    },
    {
      path: '/personal/common-apparatus-time/edit/:id',
      name: 'personalCommonApparatusTimeEdit',
      component: () => import('@/views/personal/common-apparatus-time/add'),
      hidden: true,
      meta: {
        title: '修改通用可预约时间',
        node: 'apparatus',
        activeMenu: '/personal/common-apparatus-time/list',
        preName: '通用可预约时间列表',
        activeClass: 'booking'
      }
    },
    {
      path: '/personal/special-apparatus-time/list',
      name: 'personalSpecialApparatusTimeList',
      component: () => import('@/views/personal/special-apparatus-time/index'),
      meta: {
        title: '特殊可预约时间列表',
        node: 'apparatus',
        activeClass: 'booking'
      }
    },
    {
      path: '/personal/special-apparatus-time/add',
      name: 'personalSpecialApparatusTimeAdd',
      component: () => import('@/views/personal/special-apparatus-time/add'),
      hidden: true,
      meta: {
        title: '添加特殊可预约时间',
        node: 'apparatus',
        activeMenu: '/personal/special-apparatus-time/list',
        preName: '特殊可预约时间列表',
        activeClass: 'booking'
      }
    },
    {
      path: '/personal/special-apparatus-time/edit/:id',
      name: 'personalSpecialApparatusTimeEdit',
      component: () => import('@/views/personal/special-apparatus-time/add'),
      hidden: true,
      meta: {
        title: '修改特殊可预约时间',
        node: 'apparatus',
        activeMenu: '/personal/special-apparatus-time/list',
        preName: '特殊可预约时间列表',
        activeClass: 'booking'
      }
    }
  ]
}

export default booking
