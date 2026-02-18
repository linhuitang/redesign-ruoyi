import request from '@/utils/request'

// 查询岗位列表
export function listPost(query) {
  return request('/system/post/list', {
    method: 'get',
    params: query
  })
}

// 查询岗位详细
export function getPost(postId) {
  return request('/system/post/' + postId, {
    method: 'get'
  })
}

// 新增岗位
export function addPost(data) {
  return request('/system/post', {
    method: 'post',
    body: JSON.stringify(data)
  })
}

// 修改岗位
export function updatePost(data) {
  return request('/system/post', {
    method: 'put',
    body: JSON.stringify(data)
  })
}

// 删除岗位
export function delPost(postId) {
  return request('/system/post/' + postId, {
    method: 'delete'
  })
}
