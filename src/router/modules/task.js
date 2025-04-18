import Layout from '@/layout'

const task = {
    path: '/admin/task',
    component: Layout,
    redirect: '/admin/task/my-task',
    meta: {
        title: '任务工单',
        icon: 'news',
        node: 'apparatus',
        activeClass: 'apparatus'
    },
    alwaysShow: true,
    children: [
        {
            path: 'my-task',
            name: '我的任务',
            component: () => import('@/views/admin/task/my-task/index'),
            meta: {
                title: '我的任务',
                node: 'apparatus',
                activeClass: 'apparatus'
            }
        },
        {
            path: 'completed-task',
            name: '我已完成的任务',
            component: () => import('@/views/admin/task/completed-task/index'),
            meta: {
                title: '我已完成的任务',
                node: 'apparatus',
                activeClass: 'apparatus'
            }
        },
        {
            path: 'group-task',
            name: '小组任务',
            component: () => import('@/views/admin/task/group-task/index'),
            meta: {
                title: '小组任务',
                node: 'apparatus',
                activeClass: 'apparatus'
            }
        },
        {
            path: 'all-task',
            name: '所有任务',
            component: () => import('@/views/admin/task/all-task/index'),
            meta: {
                title: '所有任务',
                node: 'apparatus',
                activeClass: 'apparatus'
            }
        },
        {
            path: 'service-order',
            name: '服务工单',
            component: () => import('@/views/admin/task/service-order/index'),
            meta: {
                title: '服务工单',
                node: 'apparatus',
                activeClass: 'apparatus'
            }
        },
        {
            path: 'planned-task',
            name: '计划任务',
            component: () => import('@/views/admin/task/planned-task/index'),
            meta: {
                title: '计划任务',
                node: 'apparatus',
                activeClass: 'apparatus'
            }
        },
        {
            path: 'staff-management',
            name: '人员管理',
            component: () => import('@/views/admin/task/staff-management/index'),
            meta: {
                title: '人员管理',
                node: 'apparatus',
                activeClass: 'apparatus'
            }
        },
        {
            path: 'settings',
            name: '应用设置',
            component: () => import('@/views/admin/task/settings/index'),
            meta: {
                title: '应用设置',
                node: 'apparatus',
                activeClass: 'apparatus'
            }
        }
    ]
}

export default task 