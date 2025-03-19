import Layout from '@/layout-personal'

const scientific = {
  path: '/personal/scientific-research',
  component: Layout,
  redirect: '/personal/scientific-research/paper/list',
  meta: {
    title: '科研考核',
    node: 'research_group',
    icon: 'scientific',
    activeClass: 'scientific'
  },
  name: 'personalScientificResearch',
  alwaysShow: true,
  children: [{
      path: '/personal/scientific-research/paper/list',
      name: 'personalScientificResearchPaperList',
      component: () => import('@/views/personal/scientific-research/paper-list'),
      meta: {
        title: '科研论文列表',
        node: 'research_group',
        activeClass: 'scientific'
      }
    },
    {
      path: '/personal/scientific-research/award/list',
      name: 'personalScientificResearchAwardList',
      component: () => import('@/views/personal/scientific-research/award-list'),
      meta: {
        title: '科研奖项列表',
        node: 'research_group',
        activeClass: 'scientific'
      }
    },
    {
      path: '/personal/scientific-research/project/list',
      name: 'personalScientificResearchProjectList',
      component: () => import('@/views/personal/scientific-research/project-list'),
      meta: {
        title: '科研项目列表',
        node: 'research_group',
        activeClass: 'scientific'
      }
    },
    {
      path: '/personal/scientific-research/honour/list',
      name: 'personalScientificResearchHonourList',
      component: () => import('@/views/personal/scientific-research/honour-list'),
      meta: {
        title: '科研荣誉列表',
        node: 'research_group',
        activeClass: 'scientific'
      }
    }
  ]
}

export default scientific
