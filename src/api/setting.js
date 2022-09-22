import request from '@/utils/request'

// 获取公司信息
export function getCompanyInfo(id) {
  return request({
    url: `/company/${id}`
  })
}

// 获取角色列表
export function getRoleList(params) {
  return request({
    url: '/sys/role',
    params
  })
}

// 新增角色
export function addRole(data) {
  return request({
    url: '/sys/role',
    method: 'post',
    data
  })
}

// 根据 id 获取角色详情
export function getRoleDetailById(id) {
  return request({
    url: `/sys/role/${id}`
  })
}

// 根据 id 更新角色
export function editRole(data) {
  return request({
    // 这里拿到的表单其实是经过数据回显拿到详情的,
    // 所以本身就具有 id
    url: `/sys/role/${data.id}`,
    method: 'put',
    data
  })
}

// 根据id删除角色
export function delRole(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}

// 设置角色权限
export function assignPerm(data) {
  return request({
    url: '/sys/role/assignPrem',
    method: 'put',
    data
  })
}
