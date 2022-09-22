import request from '@/utils/request'

// 登录
export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

// 获取当前账号基本信息
export function getUserInfo() {
  return request({
    method: 'post',
    url: '/sys/profile'
  })
}

// 根据 id 获取员工信息
export function getUserDetailById(id) {
  return request({
    // method: 'get', get 请求可以不写 method
    url: `/sys/user/${id}`
  })
}
