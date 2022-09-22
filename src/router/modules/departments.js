import Layout from '@/layout'
export default {
  // 页面路径
  path: '/departments',
  name: 'departments',
  // 默认第一层路由组件布局框架
  component: Layout,
  children: [
    {
      // 空的 path 代表默认子路由, 自动回嵌套到父路由中间
      path: '',
      // 页面中间主要显示内容指定的组件
      component: () => import('@/views/departments/index'),
      // 指定菜单中标题和图标
      meta: { title: '部门', icon: 'tree' }
    }
  ]
}
