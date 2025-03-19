import Layout from '@/layout-personal'

const train = {
  path: '/personal/train',
  component: Layout,
  redirect: '/personal/train/list',
  name: 'personalTrain',
  meta: {
    title: '培训管理',
    icon: 'train',
    node: 'apparatus',
    activeClass: 'train'
  },
  alwaysShow: true,
  children: [{
      path: '/personal/train/list',
      name: 'personalTrainContentList',
      component: () => import('@/views/personal/train/index'),
      meta: {
        title: '集中培训列表',
        node: 'apparatus',
        activeClass: 'train'
      }
    },
    {
      path: '/personal/train/add',
      name: 'personalTrainContentAdd',
      component: () => import('@/views/personal/train/add'),
      hidden: true,
      meta: {
        title: '添加集中培训',
        node: 'apparatus',
        activeMenu: '/personal/train/list',
        preName: '集中培训列表',
        activeClass: 'train'
      }
    },
    {
      path: '/personal/train/edit/:id',
      name: 'personalTrainContentEdit',
      component: () => import('@/views/personal/train/add'),
      hidden: true,
      meta: {
        title: '修改集中培训',
        node: 'apparatus',
        activeMenu: '/personal/train/list',
        preName: '集中培训列表',
        activeClass: 'train'
      }
    },
    {
      path: '/personal/train-enroll/list',
      name: 'personalTrainEnrollList',
      component: () => import('@/views/personal/train/enroll'),
      meta: {
        title: '集中培训报名列表',
        node: 'apparatus',
        activeClass: 'train'
      }
    },
    {
      path: '/personal/apply-train/list',
      name: 'personalApplyTrainList',
      component: () => import('@/views/personal/train/apply-train/index'),
      meta: {
        title: '申请培训列表',
        node: 'apparatus',
        activeClass: 'train'
      }
    },
    {
      path: '/personal/apply-train/add',
      name: 'personalApplyTrainContentAdd',
      component: () => import('@/views/personal/train/apply-train/edit'),
      hidden: true,
      meta: {
        title: '添加申请培训',
        node: 'apparatus',
        activeMenu: '/personal/apply-train/list',
        preName: '申请培训列表',
        activeClass: 'train'
      }
    },
    {
      path: '/personal/apply-train/edit/:id',
      name: 'personalApplyTrainContentEdit',
      component: () => import('@/views/personal/train/apply-train/edit'),
      hidden: true,
      meta: {
        title: '修改申请培训',
        node: 'apparatus',
        activeMenu: '/personal/apply-train/list',
        preName: '申请培训列表',
        activeClass: 'train'
      }
    },
    {
      path: '/personal/apply-train/apply-list',
      name: 'personalApplyTrainApplyList',
      component: () => import('@/views/personal/train/apply-train/apply'),
      meta: {
        title: '申请培训报名列表',
        node: 'apparatus',
        activeClass: 'train'
      }
    }
  ]
}

export default train
