import request from '@/utils/request'

// 查询字典数据列表
export function listData(query) {
  return request('/system/dict/data/list', {
    method: 'get',
    params: query
  })
}

// 查询字典数据详细
export function getData(dictCode) {
  return request('/system/dict/data/' + dictCode, {
    method: 'get'
  })
}

// 根据字典类型查询字典数据信息
export function getDicts(dictType) {
  return request('/system/dict/data/type/' + dictType, {
    method: 'get'
  })
}

// 新增字典数据
export function addData(data) {
  return request('/system/dict/data', {
    method: 'post',
    body: JSON.stringify(data)
  })
}

// 修改字典数据
export function updateData(data) {
  return request('/system/dict/data', {
    method: 'put',
    body: JSON.stringify(data)
  })
}

// 删除字典数据
export function delData(dictCode) {
  return request('/system/dict/data/' + dictCode, {
    method: 'delete'
  })
}
