import Layout from '@/layout'

const scientific = {
  path: '/scientific-research',
  component: Layout,
  redirect: '/scientific-research/paper/list',
  meta: {
    title: '科研考核',
    node: 'sci_examine',
    icon: 'scientific',
    activeClass: 'scientific'
  },
  name: 'scientificResearch',
  alwaysShow: true,
  children: [{
      path: '/scientific-research/paper/list',
      name: 'scientificResearchPaperList',
      component: () => import('@/views/admin/scientific-research/paper-list'),
      meta: {
        title: '科研论文列表',
        node: 'sci_paper_list',
        activeClass: 'scientific'
      }
    },
    {
      path: '/scientific-research/award/list',
      name: 'scientificResearchAwardList',
      component: () => import('@/views/admin/scientific-research/award-list'),
      meta: {
        title: '科研奖项列表',
        node: 'sci_award_list',
        activeClass: 'scientific'
      }
    },
    {
      path: '/scientific-research/project/list',
      name: 'scientificResearchProjectList',
      component: () => import('@/views/admin/scientific-research/project-list'),
      meta: {
        title: '科研项目列表',
        node: 'sci_project_list',
        activeClass: 'scientific'
      }
    },
    {
      path: '/scientific-research/honour/list',
      name: 'scientificResearchHonourList',
      component: () => import('@/views/admin/scientific-research/honour-list'),
      meta: {
        title: '科研荣誉列表',
        node: 'sci_honour_list',
        activeClass: 'scientific'
      }
    },
    {
      path: '/scientific-research/rule',
      name: 'scientificResearchRule',
      component: () => import('@/views/admin/scientific-research/rule'),
      meta: {
        title: '科研考核规则',
        node: 'sci_examine_rule',
        activeClass: 'scientific'
      }
    }
  ]
}

export default scientific
