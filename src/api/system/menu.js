import request from '@/utils/request'

// 查询菜单列表
export function listMenu(query) {
  return request('/system/menu/list', {
    method: 'GET',
    params: query
  })
}

// 查询菜单详细
export function getMenu(menuId) {
  return request('/system/menu/' + menuId, {
    method: 'GET'
  })
}

// 查询菜单下拉树结构
export function treeselect() {
  return request('/system/menu/treeselect', {
    method: 'GET'
  })
}

// 根据角色ID查询菜单下拉树结构
export function roleMenuTreeselect(roleId) {
  return request('/system/menu/roleMenuTreeselect/' + roleId, {
    method: 'GET'
  })
}

// 新增菜单
export function addMenu(data) {
  return request('/system/menu', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

// 修改菜单
export function updateMenu(data) {
  return request('/system/menu', {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

// 删除菜单
export function delMenu(menuId) {
  return request('/system/menu/' + menuId, {
    method: 'DELETE'
  })
}
