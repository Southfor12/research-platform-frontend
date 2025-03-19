import Layout from '@/layout'

const room = {
  path: '/room',
  component: Layout,
  redirect: '/platform-room/list',
  children: [{
      path: '/platform-room/list',
      name: 'platformRoomList',
      component: () => import('@/views/admin/platform-room/list'),
      meta: {
        title: '门禁管理',
        icon: 'room',
        node: 'platform_room_list',
        activeClass: 'platform'
      }
    },
    {
      path: '/platform-room/add',
      name: 'platformRoomAdd',
      component: () => import('@/views/admin/platform-room/add'),
      hidden: true,
      meta: {
        title: '新建门禁信息',
        node: 'add_platform_room',
        activeMenu: '/platform-room/list',
        preName: '门禁管理',
        activeClass: 'platform'
      }
    },
    {
      path: '/platform-room/edit/:id',
      name: 'platformRoomEdit',
      component: () => import('@/views/admin/platform-room/add'),
      hidden: true,
      meta: {
        title: '修改门禁信息',
        node: 'edit_platform_room',
        activeMenu: '/platform-room/list',
        preName: '门禁管理',
        activeClass: 'platform'
      }
    }
  ]
}

export default room
