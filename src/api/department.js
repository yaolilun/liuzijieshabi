import request from '@/utils/request'

// 获取部门列表
export function getDepartments() {
  return request({
    url: '/company/department'
  })
}

// 新增部门
export function addDepartment(data) {
  return request({
    url: '/company/department',
    method: 'post',
    data
  })
}

// 根据 id 获取部门详情
export function getDeptDetail(id) {
  return request({
    url: `/company/department/${id}`
  })
}

// 修改部门详情
export function updateDept(data) {
  return request({
    method: 'put',
    url: `/company/department/${data.id}`,
    data
  })
}

// 根据 id 删除部门
export function delDept(id) {
  return request({
    method: 'delete',
    url: `/company/department/${id}`
  })
}
