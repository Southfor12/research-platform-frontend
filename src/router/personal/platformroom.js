import Layout from '@/layout-personal'

const platformroom = {
  path: '/personal/platform-room/list',
  component: Layout,
  redirect: '/personal/platform-room/list',
  children: [{
      path: '/personal/platform-room/list',
      name: 'personalPlatformRoomList',
      component: () => import('@/views/personal/platform-room/list'),
      meta: {
        title: '门禁管理',
        icon: 'room',
        node: 'platform',
        activeClass: 'platform'
      }
    },
    {
      path: '/personal/platform-room/add',
      name: 'personalPlatformRoomAdd',
      component: () => import('@/views/personal/platform-room/add'),
      hidden: true,
      meta: {
        title: '新建实验室房间',
        node: 'platform',
        activeMenu: '/personal/platform-room/list',
        preName: '门禁管理',
        activeClass: 'platform'
      }
    },
    {
      path: '/personal/platform-room/edit/:id',
      name: 'personalPlatformRoomEdit',
      component: () => import('@/views/personal/platform-room/add'),
      hidden: true,
      meta: {
        title: '修改实验室房间',
        node: 'platform',
        activeMenu: '/personal/platform-room/list',
        preName: '门禁管理',
        activeClass: 'platform'
      }
    }
  ]
}

export default platformroom
