import Layout from '@/layout'

const product = {
        path: '/admin/product',
        component: Layout,
        redirect: '/admin/product/list',
        name: 'adminProduct',
        meta: {
                title: '产品管理',
                //icon: 'product',
                icon: 'security',
                node: 'platform',
                activeClass: 'platform'
        },
        alwaysShow: true,
        children: [
                {
                        path: '/admin/product/animal',
                        name: 'adminAnimal',
                        component: () => import('@/views/admin/product/animal'),
                        meta: {
                                title: '动物管理',
                                node: 'platform',
                                activeClass: 'platform'
                        },
                },
                {
                        path: '/admin/product/animal-add',
                        name: 'adminAnimalAdd',
                        component: () => import('@/views/admin/product/animal_add'),
                        hidden: true,
                        meta: {
                                title: '添加动物',
                                node: 'platform',
                                activeClass: 'platform'
                        },
                },

                {
                        path: '/admin/product/animal-add/:id',
                        name: 'adminAnimalEdit',
                        component: () => import('@/views/admin/product/animal_add'),
                        hidden: true,
                        meta: {
                                title: '动物修改',
                                node: 'platform',
                                activeClass: 'platform'
                        },
                },



                {
                        path: '/admin/product/item',
                        name: 'adminItem',
                        component: () => import('@/views/admin/product/item'),
                        meta: {
                                title: '物品管理',
                                node: 'platform',
                                activeClass: 'platform'
                        },
                },
                {
                        path: '/admin/product/item-add',
                        name: 'adminItemAdd',
                        component: () => import('@/views/admin/product/item_add'),
                        hidden: true,
                        meta: {
                                title: '添加物品',
                                node: 'platform',
                                activeClass: 'platform'
                        },
                },

                {
                        path: '/admin/product/item-add/:id',
                        name: 'adminItemEdit',
                        component: () => import('@/views/admin/product/item_add'),
                        hidden: true,
                        meta: {
                                title: '物品修改',
                                node: 'platform',
                                activeClass: 'platform'
                        },
                },

                {
                        path: '/admin/product/feed',
                        name: 'adminFeed',
                        component: () => import('@/views/admin/product/feed_service'),
                        meta: {
                                title: '饲养服务',
                                node: 'platform',
                                activeClass: 'platform'
                        },
                },
                {
                        path: '/admin/product/feed-add',
                        name: 'adminFeedAdd',
                        component: () => import('@/views/admin/product/feed_service_add'),
                        hidden: true,
                        meta: {
                                title: '添加服务',
                                node: 'platform',
                                activeClass: 'platform'
                        },
                },

                {
                        path: '/admin/product/feed-add/:id',
                        name: 'adminFeedEdit',
                        component: () => import('@/views/admin/product/feed_service_add'),
                        hidden: true,
                        meta: {
                                title: '修改服务',
                                node: 'platform',
                                activeClass: 'platform'
                        },
                },
                {
                        path: '/admin/product/technical',
                        name: 'adminTechnical',
                        component: () => import('@/views/admin/product/technical_service'),
                        meta: {
                                title: '技术服务',
                                node: 'platform',
                                activeClass: 'platform'
                        },
                },
                {
                        path: '/admin/product/technical-add',
                        name: 'adminTechnicalAdd',
                        component: () => import('@/views/admin/product/technical_service_add'),
                        hidden: true,
                        meta: {
                                title: '添加服务',
                                node: 'platform',
                                activeClass: 'platform'
                        },
                },

                {
                        path: '/admin/product/technical-add/:id',
                        name: 'adminTechnicalEdit',
                        component: () => import('@/views/admin/product/technical_service_add'),
                        hidden: true,
                        meta: {
                                title: '修改服务',
                                node: 'platform',
                                activeClass: 'platform'
                        },
                },


        ]
}

export default product
