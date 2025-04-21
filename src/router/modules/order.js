import Layout from '@/layout'

const order = {
    path: '/admin/order',
    component: Layout,
    redirect: '/admin/order/animal-purchase',
    meta: {
        title: '订单管理',
        icon: 'security',
        node: 'apparatus',
        activeClass: 'apparatus'
    },
    alwaysShow: true,
    children: [
    {
        path: 'animal-purchase',
        name: '动物订购',
        component: () => import('@/views/admin/order/animal-purchase/index'),
        meta: {
            title: '动物订购',
            node: 'apparatus',
            activeClass: 'apparatus'
        }
    },
    {
        path: 'animal-feeding',
        name: '动物饲养',
        component: () => import('@/views/admin/order/animal-feeding/index'),
        meta: {
            title: '动物饲养',
            node: 'apparatus',
            activeClass: 'apparatus'
        }
    },
    {
        path: 'item-purchase',
        name: '物品订购',
        component: () => import('@/views/admin/order/item-purchase/index'),
        meta: {
            title: '物品订购',
            node: 'apparatus',
            activeClass: 'apparatus'
        }
    },
    {
        path: 'tech-purchase',
        name: '技术订购',
        component: () => import('@/views/admin/order/tech-purchase/index'),
        meta: {
            title: '技术订购',
            node: 'apparatus',
            activeClass: 'apparatus'
        }
    }]
}

export default order 