import { getToken } from '@/utils/auth'
import { tansParams, blobValidate, saveAs } from '@/utils/ruoyi'
import { ElMessage, ElLoading } from 'element-plus'

const baseURL = import.meta.env.VITE_APP_BASE_API
let downloadLoadingInstance

export default async function request(url, options = {}) {
  // 兼容 axios 调用方式 request({ url: '...', ... })
  if (typeof url === 'object') {
    options = url
    url = url.url
  }

  // 处理 url
  let finalUrl = url.startsWith('http') ? url : baseURL + (baseURL.endsWith('/') || url.startsWith('/') ? '' : '/') + url
  
  // 处理 params (Query String)
  if (options.params) {
    let queryString = tansParams(options.params)
    if (queryString) {
      finalUrl += (finalUrl.includes('?') ? '&' : '?') + queryString
    }
  }

  // 默认配置
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  }

  // 合并配置
  const newOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  }

  // 注入 token
  const token = getToken()
  if (token) {
    newOptions.headers['Authorization'] = 'Bearer ' + token
  }

  // 兼容 axios 的 data 属性
  if (options.data) {
     if (typeof options.data === 'object' && newOptions.headers['Content-Type']?.includes('application/json')) {
        newOptions.body = JSON.stringify(options.data)
     } else {
        newOptions.body = options.data
     }
  }

  // 如果 body 是 FormData，删除 Content-Type 让浏览器自动设置 multipart/form-data
  if (newOptions.body instanceof FormData) {
    delete newOptions.headers['Content-Type']
  }

  try {
    const response = await fetch(finalUrl, newOptions)
    
    // 处理 HTTP 错误状态
    if (!response.ok) {
      const error = new Error(`HTTP Error: ${response.status}`)
      error.status = response.status
      throw error
    }

    const res = await response.json()

    // 业务状态码处理 (若依默认成功为 200)
    if (res.code === 200) {
      return res
    } else if (res.code === 401) {
      console.error('登录过期', res.msg)
      return Promise.reject(new Error(res.msg || '登录过期'))
    } else {
      console.error('业务错误', res.msg)
      return Promise.reject(new Error(res.msg || '未知错误'))
    }
  } catch (error) {
    console.error('请求失败', error)
    return Promise.reject(error)
  }
}

// 通用下载方法
export function download(url, params, filename, config) {
  downloadLoadingInstance = ElLoading.service({ text: "正在下载数据，请稍候", background: "rgba(0, 0, 0, 0.7)", })
  
  let finalUrl = url.startsWith('http') ? url : baseURL + (baseURL.endsWith('/') || url.startsWith('/') ? '' : '/') + url
  
  // POST request for download usually puts params in body if it's application/x-www-form-urlencoded, or in URL if GET.
  // RuoYi download is usually POST.
  let fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + getToken()
    },
    ...config
  }
  
  if (params) {
    fetchOptions.body = tansParams(params)
  }

  return fetch(finalUrl, fetchOptions).then(async (response) => {
      if (!response.ok) {
         throw new Error(`HTTP Error: ${response.status}`)
      }
      
      const blob = await response.blob()
      const isBlob = blobValidate(blob)
      
      if (isBlob) {
        saveAs(blob, filename)
      } else {
        const resText = await blob.text()
        const rspObj = JSON.parse(resText)
        const errMsg = rspObj.msg || '下载文件出现错误，请联系管理员！'
        ElMessage.error(errMsg)
      }
      downloadLoadingInstance.close()
  }).catch((r) => {
    console.error(r)
    ElMessage.error('下载文件出现错误，请联系管理员！')
    downloadLoadingInstance.close()
  })
}
