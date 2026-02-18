import request from '@/utils/request'

// 查询角色列表
export function listRole(query) {
  return request('/system/role/list', {
    method: 'get',
    params: query
  })
}

// 查询角色详细
export function getRole(roleId) {
  return request('/system/role/' + roleId, {
    method: 'get'
  })
}

// 新增角色
export function addRole(data) {
  return request('/system/role', {
    method: 'post',
    body: JSON.stringify(data)
  })
}

// 修改角色
export function updateRole(data) {
  return request('/system/role', {
    method: 'put',
    body: JSON.stringify(data)
  })
}

// 角色数据权限
export function dataScope(data) {
  return request('/system/role/dataScope', {
    method: 'put',
    body: JSON.stringify(data)
  })
}

// 角色状态修改
export function changeRoleStatus(roleId, status) {
  const data = {
    roleId,
    status
  }
  return request('/system/role/changeStatus', {
    method: 'put',
    body: JSON.stringify(data)
  })
}

// 删除角色
export function delRole(roleId) {
  return request('/system/role/' + roleId, {
    method: 'delete'
  })
}

// 查询角色已授权用户列表
export function allocatedUserList(query) {
  return request('/system/role/authUser/allocatedList', {
    method: 'get',
    params: query
  })
}

// 查询角色未授权用户列表
export function unallocatedUserList(query) {
  return request('/system/role/authUser/unallocatedList', {
    method: 'get',
    params: query
  })
}

// 取消用户授权角色
export function authUserCancel(data) {
  return request('/system/role/authUser/cancel', {
    method: 'put',
    body: JSON.stringify(data)
  })
}

// 批量取消用户授权角色
export function authUserCancelAll(data) {
  return request('/system/role/authUser/cancelAll', {
    method: 'put',
    params: data
  })
}

// 授权用户选择
export function authUserSelectAll(data) {
  return request('/system/role/authUser/selectAll', {
    method: 'put',
    params: data
  })
}

// 查询部门树结构
export function deptTreeSelect(roleId) {
  return request('/system/role/deptTree/' + roleId, {
    method: 'get'
  })
}
