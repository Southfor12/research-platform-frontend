import Layout from '@/layout-personal'

const security = {
  path: '/personal/shopping',
  component: Layout,
  redirect: '/personal/shopping/list',
  name: 'personalShopping',
  meta: {
    title: '订单管理',
    icon: 'security',
    node: 'platform',
    activeClass: 'platform'
  },
  alwaysShow: true,
  children: [
    {
      path: '/personal/shopping/order/animal/:id',
      name: 'personalShoppingOrderAnimal',
      component: () => import('@/views/personal/shopping/shopping_animal'),
      hidden: true,
      meta: {
        title: '动物订单确认',
        node: 'platform',
        activeClass: 'platform'
      }

    },

    {
      path: '/personal/shopping/order/success',
      name: 'personalShoppingOrderSuccess',
      component: () => import('@/views/personal/shopping/success'),
      hidden: true,
      meta: {
        title: '订单提交成功',
        node: 'platform',
        activeClass: 'platform'
      }
    },



    {

      path: '/personal/shopping/cart',
      name: 'personalShoppingCart',
      component: () => import('@/views/personal/shopping/shopping_list'),
      meta: {
        title: '我的购物车',
        node: 'platform',
        activeClass: 'platform'
      }
    },
    {
      path: '/personal/shopping/order',
      name: 'personalShoppingOrder',
      component: () => import('@/views/personal/shopping/order_list'),
      meta: {
        title: '我的订单',
        node: 'platform',
        activeClass: 'platform'
      }
    },


  ]
}

export default security
