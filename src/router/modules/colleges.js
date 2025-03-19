import Layout from '@/layout'

const colleges = {
  path: '/admin/colleges',
  component: Layout,
  redirect: '/admin/colleges/list',
  name: 'adminCollege',
  meta: {
    title: '设施管理',
    icon: 'platform',
    node: 'platform',
    activeClass: 'platform'
  },
  alwaysShow: true,
  children: [{
    path: '/admin/colleges/courtyard',
    name: 'adminCourtyard',
    component: () => import('@/views/admin/colleges/courtyards'),
    meta: {
      title: '院区管理',
      node: 'platform',
      activeClass: 'platform'
    }
  },
  {
    path: '/admin/colleges/tenement',
    name: 'adminTenement',
    component: () => import('@/views/admin/colleges/tenement'),
    meta: {
      title: '楼宇管理',
      node: 'platform',
      activeClass: 'platform'
    }
  },
  {
    path: '/admin/colleges/laboratory',
    name: 'adminLaboratory',
    component: () => import('@/views/admin/colleges/laboratory'),
    meta: {
      title: '实验室管理',
      node: 'platform',
      activeClass: 'platform'
    }
  },
  {
    path: '/admin/colleges/courtyards-add',
    name: 'adminCourtyardAdd',
    component: () => import('@/views/admin/colleges/courtyards_add'),
    hidden: true,
    meta: {
      title: '添加院区',
      node: 'platform',
      activeClass: 'platform'
    }
  },
  {
    path: '/admin/colleges/courtyards-add/:id',
    name: 'adminCourtyardEdit',
    component: () => import('@/views/admin/colleges/courtyards_add'),
    hidden: true,
    meta: {
      title: '修改院区',
      node: 'platform',
      activeClass: 'platform'
    }
  }
    ,
  {
    path: '/admin/colleges/tenement-add/',
    name: 'adminCourtyardEdit',
    component: () => import('@/views/admin/colleges/tenement_add'),
    hidden: true,
    meta: {
      title: '添加楼宇',
      node: 'platform',
      activeClass: 'platform'
    }
  }
    ,
  {
    path: '/admin/colleges/tenement-add/:id',
    name: 'adminCourtyardEdit',
    component: () => import('@/views/admin/colleges/tenement_add'),
    hidden: true,
    meta: {
      title: '修改楼宇',
      node: 'platform',
      activeClass: 'platform'
    }
  },

  //实验室
  {
    path: '/admin/colleges/laboratory-add/person/',
    name: 'adminLaboratoryAddPerson',
    component: () => import('@/views/admin/colleges/laboratory_add_person'),
    hidden: true,
    meta: {
      title: '绑定人员',
      node: 'platform',
      activeClass: 'platform'
    }
  },


  {
    path: '/admin/colleges/laboratory-add/person/:id',
    name: 'adminLaboratoryEditPerson',
    component: () => import('@/views/admin/colleges/laboratory_add_person'),
    hidden: true,
    meta: {
      title: '修改绑定人员',
      node: 'platform',
      activeClass: 'platform'
    },
  },



  {
    path: '/admin/colleges/laboratory-add/danger/',
    name: 'adminLaboratoryAddDanger',
    component: () => import('@/views/admin/colleges/laboratory_add_danger'),
    hidden: true,
    meta: {
      title: '编辑危险源',
      node: 'platform',
      activeClass: 'platform'
    }
  },


  {
    path: '/admin/colleges/laboratory-add/danger/:id',
    name: 'adminLaboratoryEditDanger',
    component: () => import('@/views/admin/colleges/laboratory_add_danger'),
    hidden: true,
    meta: {
      title: '编辑危险源',
      node: 'platform',
      activeClass: 'platform'
    },
  },

  {
    path: '/admin/colleges/laboratory-add/',
    name: 'adminLaboratoryAdd',
    component: () => import('@/views/admin/colleges/laboratory_add'),
    hidden: true,
    meta: {
      title: '添加实验室',
      node: 'platform',
      activeClass: 'platform'
    },
  },



  {
    path: '/admin/colleges/laboratory-add/:id',
    name: 'adminLaboratoryEdit',
    component: () => import('@/views/admin/colleges/laboratory_add'),
    hidden: true,
    meta: {
      title: '修改实验室',
      node: 'platform',
      activeClass: 'platform'
    },
  },


  // 笼架管理
  {
    path: '/admin/colleges/rack',
    name: 'adminCage',
    component: () => import('@/views/admin/colleges/cage'),
    meta: {
      title: '笼架管理',
      node: 'platform',
      activeClass: 'platform'
    },
  },
  {
    path: '/admin/colleges/rack-add',
    name: 'adminCageAdd',
    component: () => import('@/views/admin/colleges/cage_add'),
    hidden: true,
    meta: {
      title: '添加笼架',
      node: 'platform',
      activeClass: 'platform'
    },
  },
  {
    path: '/admin/colleges/rack-add/:id',
    name: 'adminCageEdit',
    component: () => import('@/views/admin/colleges/cage_add'),
    hidden: true,
    meta: {
      title: '修改笼架',
      node: 'platform',
      activeClass: 'platform'
    },
  }
  ]
}

export default colleges
