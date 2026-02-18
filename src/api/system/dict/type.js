import request from '@/utils/request'

// 查询字典类型列表
export function listType(query) {
  return request('/system/dict/type/list', {
    method: 'get',
    params: query
  })
}

// 查询字典类型详细
export function getType(dictId) {
  return request('/system/dict/type/' + dictId, {
    method: 'get'
  })
}

// 新增字典类型
export function addType(data) {
  return request('/system/dict/type', {
    method: 'post',
    body: JSON.stringify(data)
  })
}

// 修改字典类型
export function updateType(data) {
  return request('/system/dict/type', {
    method: 'put',
    body: JSON.stringify(data)
  })
}

// 删除字典类型
export function delType(dictId) {
  return request('/system/dict/type/' + dictId, {
    method: 'delete'
  })
}

// 刷新字典缓存
export function refreshCache() {
  return request('/system/dict/type/refreshCache', {
    method: 'delete'
  })
}

// 获取字典选择框列表
export function optionselect() {
  return request('/system/dict/type/optionselect', {
    method: 'get'
  })
}
