import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'

// 创建一个 axios 实例 特性是跟原来的用法一模一样, 但是对他的修改, 不影响原来的库
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// 请求拦截器
// 这里拦截到的形参其实是当前请求的配置, 一般起名为 config
service.interceptors.request.use(config => {
  // 如果我已经登录, 就要将token 待在请求头上
  if (store.getters.token) {
    // 注入token之前可以检查是否超时
    // 拿出之前记录的时间, 拿出现在的时间, 相减, 如果超过固定长度, 就是超时
    // const timeout = 5000
    const timeout = 1000 * 60 * 30
    const time = localStorage.getItem('time')
    const now = Date.now()
    if (now - time > timeout) {
      // 退出, 阻止当前请求
      store.commit('user/logout')
      router.push('/login')
      return Promise.reject('token超时(主动)')
    } else {
      // 可选, 如果希望是在没有操作的时间才算超时, 可以再每次操作后重新刷新时间
      localStorage.setItem('time', now)
    }

    // 这个 token 严格按照 Bearer JWT 标准声明
    config.headers.Authorization = `Bearer ${store.getters.token}`
  }

  return config
})

// 响应拦截器
// 响应拦截器的 use 函数, 可以接收两个参数
// 咱们一直用的都是第一个, 用来拦截成功获取响应的结果(无论对还是错)
// 如果直接报红色的错误(响应码不为200) 可以用第二个参数进行拦截
service.interceptors.response.use(res => {
  console.log('响应拦截器')
  console.log(res)
  const { success, data, message } = res.data
  if (success) {
    // 全部成功
    return data
  } else {
    // 失败
    // 提示用户
    Message.error(message)
    // 阻止接下来的操作
    // 响应拦截器其实是在一个 Promise 操作的中间执行
    // 这时候如果想要打断当前的操作, 可以用原生 Promise 对象里面的 reject 方法
    return Promise.reject(new Error(message))
  }
}, err => {
  // 处理错误的部分, 响应码为 200 以外
  // 这里要进行token失效的处理, 但是由于报错的可能性太多, 需要接受错误信息
  // 进行分辨, 只对token有问题的情况特殊处理
  console.dir(err)
  if (err.response && err.response.data.code === 10002) {
    // 清理数据
    store.commit('user/logout')
    // 跳转登录页
    // this.$router.push
    router.push('/login')
  }
  Message.error('系统错误')
  return Promise.reject('系统错误')
})

export default service
