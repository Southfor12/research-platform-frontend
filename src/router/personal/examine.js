import Layout from '@/layout-personal'

const examine = {
  path: '/personal/examine',
  component: Layout,
  redirect: '/personal/examine/research-group-user-list',
  name: 'personal_platform',
  meta: {
    title: '考核管理',
    icon: 'examine',
    node: 'research_group',
    activeClass: 'examine'
  },
  alwaysShow: true,
  children: [{
      path: '/personal/examine/research-group-user-list',
      name: 'personalExamineResearchGroupUserList',
      component: () => import('@/views/personal/research-group/user/examine'),
      meta: {
        title: '课题组成员考核',
        node: 'research_group',
        activeClass: 'examine'
      }
    },
    {
      path: '/personal/examine/research-group-list',
      name: 'personalResearchGroupExamineList',
      component: () => import('@/views/personal/research-group/examine'),
      meta: {
        title: '课题组考核',
        node: 'platform',
        activeClass: 'examine'
      }
    },
    {
      path: '/personal/examine/platform-user-list',
      name: 'personalPlatformUserList',
      component: () => import('@/views/personal/platform-user/examine'),
      meta: {
        title: '实验室成员考核',
        node: 'platform',
        activeClass: 'examine'
      }
    }
  ]
}

export default examine
