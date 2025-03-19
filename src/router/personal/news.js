import Layout from '@/layout-personal'

const news = {
  path: '/personal/news',
  component: Layout,
  redirect: '/personal/news/list',
  name: 'personalNews',
  meta: {
    title: '信息发布',
    icon: 'news',
    node: 'platform',
    activeClass: 'news'
  },
  alwaysShow: true,
  children: [{
      path: '/personal/news/list',
      name: 'personalNewsList',
      component: () => import('@/views/personal/news/list'),
      meta: {
        title: '信息列表',
        node: 'platform',
        activeClass: 'news'
      }
    },
    {
      path: '/personal/news/add',
      name: 'personalNewsAdd',
      component: () => import('@/views/personal/news/add'),
      hidden: true,
      meta: {
        title: '新建信息',
        node: 'platform',
        activeMenu: '/personal/news/list',
        preName: '信息列表',
        activeClass: 'news'
      }
    },
    {
      path: '/personal/news/edit/:id',
      name: 'personalNewsEdit',
      component: () => import('@/views/personal/news/add'),
      hidden: true,
      meta: {
        title: '修改信息',
        node: 'platform',
        activeMenu: '/personal/news/list',
        preName: '信息列表',
        activeClass: 'news'
      }
    }
  ]
}

export default news
