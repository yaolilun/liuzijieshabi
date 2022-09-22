import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
// 引入菜单翻译语言包
import menuZh from '@/lang/zh'
import menuEn from '@/lang/en'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

// 引入库
import VueI18n from 'vue-i18n'
// 安装库
Vue.use(VueI18n)
// 创建实例
const i18n = new VueI18n({
  // 当前语言标记
  locale: 'en',
  // 各个语言标记对应的字典包
  messages: {
    // 给每个对应的语言设定字典对象
    zh: {
      // 键值对的形式指定标记和对应翻译字符串
      hello: '你好世界',
      delConfirm: '确认删除吗?',
      ...zhLocale,
      ...menuZh
    },
    en: {
      hello: 'Hello world',
      delConfirm: 'Are you sure?',
      ...enLocale,
      ...menuEn
    }
  }
})

import '@/icons' // icon
import '@/permission' // permission control

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})

import defaultImg from '@/assets/common/head.jpg'
// 自定义指令创建
// Vue.directive(名字, 配置对象(生命周期))
Vue.directive('fiximg', {
  // 这个配置对象中, 根据文档, 定义各种钩子即可
  // 所谓的钩子指的是使用这个指令的元素的不同生命周期
  // inserted 插入页面时的钩子
  inserted(el) {
    console.log('元素被插入页面', el)
    // 担心图片报错, 可以监听图片错误事件
    el.addEventListener('error', () => {
      // 报错的回调
      // 如果在 js 当中直接用 @ 符号放入字符串中
      // 脚手架不知道是一个文件路径, 以为是普通的字符串而已
      // 原封不动交给浏览器
      // el.src = '@/assets/common/head.jpg'
      el.src = defaultImg
    })
    // 以上监听只能处理报错事件
    // 如果连字段都不存在, 也就是没有加载过不会报错, 上面的监听就失效
    // 需要另外处理为空的状态
    el.src = el.src || defaultImg
  }
})

// 全局组件注册
// import PageTools from '@/components/PageTools'
// Vue.component('PageTools', PageTools)

// Vue.use 是 vue 插件(plugin)机制, 只要往里传一个对象
// 对象的 install 方法就会自动被执行, 并且传入 当前 Vue 构造函数
import myPlugins from '@/components/myPlugins'
Vue.use(myPlugins)

// 过滤器的用法
// import { formatDate } from '@/filters'
// Vue.filter('formatDate', formatDate)
// 大量注册过滤器的说明
// 1. 引入所有要用到的函数
import * as MyFilters from '@/filters/'
// console.log('MyFilters', MyFilters)
// Vue.filter('checkCode', MyFilters['checkCode'])
// Vue.filter('checkEmail', MyFilters.checkEmail)

for (const key in MyFilters) {
  Vue.filter(key, MyFilters[key])
}

// 混入写法说明
// 给出一个对象,按照vue配置的方式来写
// const mixinObj = {
//   methods: {
//     checkPerm(name) {
//       // 可以通过一个输入的按钮名, 判断是否可以执行操作
//       // 在个人权限数据中取出 第二层权限 points
//       // 如果传入的name存在于这个人的权限数据中, 就可以点击
//       // 否则不可以
//       const points = this.$store.state.user.userInfo.roles.points
//       return points.indexOf(name) !== -1
//     }
//   }
// }
import mixinObj from '@/mixin'
// 然后调用 Vue.mixin(对象) 注入到所有的组件中
Vue.mixin(mixinObj)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  // 挂载国际化实例
  i18n,
  render: h => h(App)
})
