import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { setToken, getToken, removeToken } from '@/utils/auth'
const state = {
  // 存数据
  // token: localStorage.getItem('token') || ''
  token: getToken() || '',
  userInfo: {}
}
const mutations = {
  // 改数据
  setToken(state, data) {
    state.token = data
    setToken(data)
    // localStorage.setItem('token', data)
  },
  setUserInfo(state, data) {
    state.userInfo = data
  },
  logout(state) {
    // 注意登出时, 除了当前使用的vuex数据还要讲本地储存清空,
    // 避免下次刷新恢复旧数据
    state.token = ''
    // localStorage.removeItem('token')
    removeToken()
    state.userInfo = {}
  }
}
const actions = {
  // 异步请求
  async login(store, data) {
    // login(data).then(res => {
    //   console.log('vuex发请求')
    //   console.log(res)
    // })

    const res = await login(data)
    console.log('vuex发请求')
    console.log(res)
    // store.commit('setToken', res.data.data)
    // 本来要写 res.data.data, 但是由于响应拦截器里面已经
    // 解开了这个嵌套, 返回的 res 就是原来 res.data.data
    store.commit('setToken', res)

    // Date.now() 可以获取当前时间戳
    // 每当登录就记录时间
    localStorage.setItem('time', Date.now())
  },
  async getUserInfo(store) {
    const res = await getUserInfo()
    // 数据不够, 缺了头像, 于是再次发送请求, 拿到详情
    const detail = await getUserDetailById(res.userId)
    store.commit('setUserInfo', {
      ...res,
      ...detail
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

