import request from '@/utils/request'

// 查询部门列表
export function listDept(query) {
  return request('/system/dept/list', {
    method: 'get',
    params: query
  })
}

// 查询部门列表（排除节点）
export function listDeptExcludeChild(deptId) {
  return request('/system/dept/list/exclude/' + deptId, {
    method: 'get'
  })
}

// 查询部门详细
export function getDept(deptId) {
  return request('/system/dept/' + deptId, {
    method: 'get'
  })
}

// 新增部门
export function addDept(data) {
  return request('/system/dept', {
    method: 'post',
    body: JSON.stringify(data)
  })
}

// 修改部门
export function updateDept(data) {
  return request('/system/dept', {
    method: 'put',
    body: JSON.stringify(data)
  })
}

// 删除部门
export function delDept(deptId) {
  return request('/system/dept/' + deptId, {
    method: 'delete'
  })
}
