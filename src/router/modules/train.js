import Layout from '@/layout'

const train = {
  path: '/train',
  component: Layout,
  redirect: '/train/list',
  name: 'train',
  meta: {
    title: '培训管理',
    icon: 'train',
    node: 'train_management',
    activeClass: 'train'
  },
  alwaysShow: true,
  children: [{
      path: '/train/list',
      name: 'trainContentList',
      component: () => import('@/views/admin/train/index'),
      meta: {
        title: '集中培训列表',
        node: 'train_content_list',
        activeClass: 'train'
      }
    },
    {
      path: '/train/add',
      name: 'trainContentAdd',
      component: () => import('@/views/admin/train/add'),
      hidden: true,
      meta: {
        title: '添加集中培训',
        node: 'add_train_content',
        activeMenu: '/train/list',
        preName: '集中培训列表',
        activeClass: 'train'
      }
    },
    {
      path: '/train/edit/:id',
      name: 'trainContentEdit',
      component: () => import('@/views/admin/train/add'),
      hidden: true,
      meta: {
        title: '修改集中培训',
        node: 'edit_train_content',
        activeMenu: '/train/list',
        preName: '集中培训列表',
        activeClass: 'train'
      }
    },
    {
      path: '/train-enroll/list',
      name: 'trainEnrollList',
      component: () => import('@/views/admin/train/apply-list'),
      meta: {
        title: '集中培训报名列表',
        node: 'train_enroll_list',
        activeClass: 'train'
      }
    },
    {
      path: '/apply-train/list',
      name: 'applyTrainList',
      component: () => import('@/views/admin/train/apply-train/index'),
      meta: {
        title: '申请培训列表',
        node: 'apply_train_content_list',
        activeClass: 'train'
      }
    },
    {
      path: '/apply-train/add',
      name: 'applyTrainContentAdd',
      component: () => import('@/views/admin/train/apply-train/edit'),
      hidden: true,
      meta: {
        title: '添加申请培训',
        node: 'add_apply_train_content',
        activeMenu: '/apply-train/list',
        preName: '申请培训列表',
        activeClass: 'train'
      }
    },
    {
      path: '/apply-train/edit/:id',
      name: 'applyTrainContentEdit',
      component: () => import('@/views/admin/train/apply-train/edit'),
      hidden: true,
      meta: {
        title: '修改申请培训',
        node: 'edit_apply_train_content',
        activeMenu: '/apply-train/list',
        preName: '申请培训列表',
        activeClass: 'train'
      }
    },
    {
      path: '/apply-train/apply-list',
      name: 'applyTrainApplyList',
      component: () => import('@/views/admin/train/apply-train/apply-list'),
      meta: {
        title: '申请培训报名列表',
        node: 'apply_train_list',
        activeClass: 'train'
      }
    }
  ]
}

export default train
