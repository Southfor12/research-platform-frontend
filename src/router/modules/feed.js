import Layout from '@/layout'

const feed = {
    path: '/admin/feed',
    component : Layout,
    redirect : '/admin/feed/feed_apply',
    meta:{
        title:'饲养繁育',
        icon: 'apparatus',
        node : 'platform' ,
        activeClass: 'apparatus'
    },
    alwaysShow: true,
    children:[{
        path: '/admin/feed/feed_apply',
        name:'饲养申请',
        component: () => import('@/views/admin/feed/apply'),
        meta: {
            title: '饲养申请',
            node: 'apparatus',
            activeClass: 'apparatus'
          }
    },
    {
        path: '/admin/feed/feed_rack',
        name:'饲养笼架',
        component: () => import('@/views/admin/feed/rack'),
        meta: {
            title: '饲养笼架',
            node: 'apparatus',
            activeClass: 'apparatus'
          }
    },,
    {
        path: '/admin/feed/import_anmial',
        name:'动物导入',
        component: () => import('@/views/admin/feed/import_anmial'),
        meta: {
            title: '动物导入',
            node: 'apparatus',
            activeClass: 'apparatus'
          }
    }

    ]
}
export default feed