import request from '@/utils/request'

// 登录方法
export function login(username, password, code, uuid) {
  const data = {
    username,
    password,
    code,
    uuid
  }
  return request('/login', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

// 获取用户详细信息
export function getInfo() {
  return request('/getInfo', {
    method: 'GET'
  })
}

// 退出方法
export function logout() {
  return request('/logout', {
    method: 'POST'
  })
}

// 获取验证码
export function getCodeImg() {
  return request('/captchaImage', {
    method: 'GET'
  })
}
