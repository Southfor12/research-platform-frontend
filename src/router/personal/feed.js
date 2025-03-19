import Layout from '@/layout-personal'

const feed = {
    path: '/personal/feed',
    component : Layout,
    redirect : '/personal/feed/feed_apply',
    meta:{
        title:'饲养繁育',
        icon: 'apparatus',
        node : 'apparatus' ,
        activeClass: 'apparatus'
    },
    alwaysShow: true,
    children:[{
        path: '/personal/feed/feed_apply',
        name:'饲养申请',
        component: () => import('@/views/personal/feed/apply'),
        meta: {
            title: '饲养申请',
            node: 'apparatus',
            activeClass: 'apparatus'
          }
    },
    {
        path: '/personal/feed/feed_rack',
        name:'饲养笼架',
        component: () => import('@/views/personal/feed/rack'),
        meta: {
            title: '饲养笼架',
            node: 'apparatus',
            activeClass: 'apparatus'
          }
    }

    ]
}
export default feed