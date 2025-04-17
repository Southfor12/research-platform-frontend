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
        component: () => import('@/views/admin/feed/feed-apply/apply'),
        meta: {
            title: '饲养申请',
            node: 'apparatus',
            activeClass: 'apparatus'
          }
    },
    {
        path: '/admin/feed/feed_rack',
        name:'饲养笼架',
        component: () => import('@/views/admin/feed/feed-rack/rack'),
        meta: {
            title: '饲养笼架',
            node: 'apparatus',
            activeClass: 'apparatus'
          }
    },
    {
        path: '/admin/feed/import_animal',
        name:'动物导入',
        component: () => import('@/views/admin/feed/import_animal'),
        meta: {
            title: '动物导入',
            node: 'apparatus',
            activeClass: 'apparatus'
          }
    },
    {
        path: '/admin/feed/animal_manage',
        name:'动物管理',
        component: () => import('@/views/admin/feed/animal-manage/index'),
        meta: {
            title: '动物管理',
            node: 'apparatus',
            activeClass: 'apparatus'
          }
    },
    {
        path: '/admin/feed/measure_data',
        name: '测量数据',
        component: () => import('@/views/admin/feed/measure-data/index'),
        meta: {
            title: '测量数据',
            node: 'apparatus',
            activeClass: 'apparatus'
        }
    },
    {
        path: '/admin/feed/feed_abnormal',
        name: '饲养异常',
        component: () => import('@/views/admin/feed/feed-abnormal/index'),
        meta: {
            title: '饲养异常',
            node: 'apparatus',
            activeClass: 'apparatus'
        }
    },
    {
        path : '/admin/feed/animal_strain_manage',
        name : '品系管理',
        component : ()=> import('@/views/admin/feed/animal_strain_manage/animal_strain_manage'),
        meta : {
            title : '品系管理',
            node : 'apparatus',
            activeClass : 'apparatus'
        }
    },
    {
        path : '/admin/feed/set_animal',
        name : '应用设置',
        component : ()=> import('@/views/admin/feed/ani-setting/set_animal'),
        meta : {
            title : '应用设置',
            node : 'apparatus',
            activeClass : 'apparatus'
        }
    },
    {
        path: '/admin/feed/cadaver_manage',
        name: '尸体处理',
        component: () => import('@/views/admin/feed/cadaver-manage/index'),
        meta: {
            title: '尸体处理',
            node: 'apparatus',
            activeClass: 'apparatus'
        }
    },
    {
        path: '/admin/feed/sperm_manage',
        name: '精子管理',
        component: () => import('@/views/admin/feed/sperm-manage/index'),
        meta: {
            title: '精子管理',
            node: 'apparatus',
            activeClass: 'apparatus'
        }
    },
    {
        path: '/admin/feed/feed_statistics',
        name: '饲养统计',
        component: () => import('@/views/admin/feed/feed-statistics/index'),
        meta: {
            title: '饲养统计',
            node: 'apparatus',
            activeClass: 'apparatus'
        }
    },
    ]
}

export default feed