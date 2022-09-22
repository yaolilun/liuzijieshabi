import router from '@/router'
import store from '@/store'

router.beforeEach(async(to, from, next) => {
  // 根据用户有登陆还是没有登录进行访问控制
  console.log('导航守卫', store.getters.token)
  console.log(to)
  if (store.getters.token) {
    // 登陆了, 本来直接放行就行, 但是我们的项目要求如果已经登陆过,不能重复再次登录
    if (to.path === '/login') {
      // 1.1. 已登录去登录页 => 跳首页
      // next() 如果不加任何参数, 就是直接放行, 如果加上新的路径, 就是跳转页面
      next('/')
    } else {
      // 1.2. 已登录,去其他正常页面 => 放行
      // 其他非登录页直接放行
      // 这里是有token, 不是去登录页, 一切正常, 希望能够在页面胶乳前获取到个人数据进行渲染
      // 另外如果已经拿过数据再次跳转别的页面就可以不再拿了
      if (!store.state.user.userInfo.username) {
        await store.dispatch('user/getUserInfo')
        // 这里应该进行路由的筛选
        // 因为筛选结果会有两个地方共用, 所以封装在 vuex 里面
        // 调用一个叫 permission 的模块里面叫做 filterRoutes action 进行筛选
        // dispatch(action名, 额外参数)
        const menus = store.state.user.userInfo.roles.menus
        const res = await store.dispatch('permission/filterRoutes', menus)
        // console.log(res)
        // router 本身有一个函数 addRoutes
        router.addRoutes([
          ...res,
          { path: '*', redirect: '/404', hidden: true }
        ])
        // 这里追加的时候已经有点晚了, 之前 next 如果什么都没找到, 会变成空白页
        // 这个时候,数据都准备好了, 如果再次触发跳转, 就没问题了
        next(to.path)
      }

      next()
    }
  } else {
    // 未登录
    // next(路径)其实是跳转页面, 跳转过后再次执行导航守卫
    // next('/login') 不能只放这个, 因为每次跳转都会重新出发导航守卫
    // 于是死循环 没token => 跳 login => 没token => 跳 login => 没token => 跳 login
    // if (to.path === '/login' || to.path === '/404' || to.path === '/test') {
    // 上面写法太烦人, 用白名单即可
    const whiteList = ['/login', '/404', '/test']
    if (whiteList.indexOf(to.path) > -1) {
      // 2.1. 未登录 目的地在白名单 => 放行
      // 如果存在于可以随便进入的白名单, 放行
      next()
    } else {
      // 2.2. 未登录 目的地不再白名单 => 登录页
      // 如果不是可以随便进入的白名单, 跳转到登录页
      next('/login')
    }
  }
})
