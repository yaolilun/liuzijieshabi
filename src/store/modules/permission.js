import { constantRoutes, asyncRoutes } from '@/router'
const state = {
  routes: []
}
const mutations = {
  setRoutes(state, data) {
    // 其实菜单应该是静态路由+筛选后的动态路由
    state.routes = [
      ...constantRoutes,
      ...data
    ]
  }
}
const actions = {
  // action 默认可以得到参数有两个
  // 1. 当前仓库示例
  // 2. 额外传的参数
  filterRoutes(store, menus) {
    // menus 就是类似 ['employees', 'salarys']
    const routes = asyncRoutes.filter(item => {
      return menus.indexOf(item.name) !== -1
    })
    console.log('全部路由', asyncRoutes)
    console.log('个人权限数据', menus)
    console.log('这里是vuex模块调用路由筛选')
    console.log(routes)
    store.commit('setRoutes', routes)
    // [{路由配置},{路由配置}]
    return routes
  }
}

export default {
  // 如果带上命名空间锁, 调用时必须写明模块名
  namespaced: true,
  state,
  mutations,
  actions
}
