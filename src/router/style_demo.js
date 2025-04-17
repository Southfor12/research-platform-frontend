import Layout from '@/layout-personal'

const style_demo ={
    path:'/personal/hello',
    component: Layout,
    children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/demo/demo_home.vue'),
          meta: { title: '测试用的' }
        }
      ]
}
export default style_demo