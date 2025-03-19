import Layout from '@/layout'

const website = {
  path: '/website',
  component: Layout,
  redirect: '/website/platform-intro',
  name: 'website',
  meta: {
    title: '网站管理',
    icon: 'website',
    node: 'website',
    activeClass: 'website'
  },
  alwaysShow: true,
  children: [{
      path: '/website/platform-intro',
      name: 'website_platform_intro',
      component: () => import('@/views/admin/website/platform-intro'),
      meta: {
        title: '平台简介',
        node: 'platform_intro',
        activeClass: 'website'
      }
    },
    {
      path: '/website/zhongxinshiyanshi',
      name: 'website_zhongxinshiyanshi',
      component: () => import('@/views/admin/website/zhongxinshiyanshi'),
      meta: {
        title: '中心实验室',
        node: 'zhongxinshiyanshi',
        activeClass: 'website'
      }
    },
    {
      path: '/website/shiyandongwuzhongxin',
      name: 'website_shiyandongwuzhongxin',
      component: () => import('@/views/admin/website/shiyandongwuzhongxin'),
      meta: {
        title: '实验动物研究中心',
        node: 'shiyandongwuzhongxin',
        activeClass: 'website'
      }
    },
    {
      path: '/website/shengwuziyuanzhongxin',
      name: 'website_shengwuziyuanzhongxin',
      component: () => import('@/views/admin/website/shengwuziyuanzhongxin'),
      meta: {
        title: '生物资源中心',
        node: 'shengwuziyuanzhongxin',
        activeClass: 'website'
      }
    },
    {
      path: '/website/gmpxibaozhongxin',
      name: 'website_gmpxibaozhongxin',
      component: () => import('@/views/admin/website/gmpxibaozhongxin'),
      meta: {
        title: 'GMP细胞中心',
        node: 'gmpxibaozhongxin',
        activeClass: 'website'
      }
    },
    {
      path: '/website/shujufenxizhongxin',
      name: 'website_shujufenxizhongxin',
      component: () => import('@/views/admin/website/shujufenxizhongxin'),
      meta: {
        title: '数据分析中心',
        node: 'shujufenxizhongxin',
        activeClass: 'website'
      }
    },
    {
      path: '/website/logo-image',
      name: 'logoImage',
      component: () => import('@/views/admin/website/logo-image'),
      meta: {
        title: '首页LOGO图',
        node: 'logo_image',
        activeClass: 'website'
      }
    },
    {
      path: '/website/middle-image',
      name: 'middleImage',
      component: () => import('@/views/admin/website/middle-image'),
      meta: {
        title: '首页中间广告',
        node: 'middle_image',
        activeClass: 'website'
      }
    },
    {
      path: '/website/horse-lamp',
      name: 'horseLamp',
      component: () => import('@/views/admin/website/horse-lamp'),
      meta: {
        title: '首页轮播图',
        node: 'horse_lamp',
        activeClass: 'website'
      }
    },
    {
      path: '/website/contact-us',
      name: 'contactUs',
      component: () => import('@/views/admin/website/contact-us'),
      meta: {
        title: '联系我们',
        node: 'contact_us',
        activeClass: 'website'
      }
    },
    {
      path: '/related-links/list',
      name: 'relatedLinksList',
      component: () => import('@/views/admin/website/related-links/index'),
      meta: {
        title: '相关链接',
        node: 'related_links_list',
        activeClass: 'website'
      }
    },
    {
      path: '/related-links/add',
      name: 'relatedLinksAdd',
      component: () => import('@/views/admin/website/related-links/edit'),
      hidden: true,
      meta: {
        title: '添加相关链接',
        node: 'add_related_links',
        activeMenu: '/related-links/list',
        preName: '相关链接',
        activeClass: 'website'
      }
    },
    {
      path: '/related-links/edit/:id',
      name: 'relatedLinksEdit',
      component: () => import('@/views/admin/website/related-links/edit'),
      hidden: true,
      meta: {
        title: '修改相关链接',
        node: 'edit_related_links',
        activeMenu: '/related-links/list',
        preName: '相关链接',
        activeClass: 'website'
      }
    },
    {
      path: '/website/admin-ips',
      name: 'adminIps',
      component: () => import('@/views/admin/website/admin-ips'),
      meta: {
        title: 'IP白名单',
        node: 'admin_ips',
        activeClass: 'website'
      }
    },
    {
      path: '/website/privacy-agreement',
      name: 'website_privacyAgreement',
      component: () => import('@/views/admin/website/privacy-agreement'),
      meta: {
        title: '隐私协议',
        node: 'privacy_agreement',
        activeClass: 'website'
      }
    },
  ]
}

export default website
