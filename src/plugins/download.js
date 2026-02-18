import { saveAs } from '@/utils/ruoyi'
import { getToken } from '@/utils/auth'
import errorCode from '@/utils/errorCode'
import { blobValidate } from '@/utils/ruoyi'
import { ElMessage, ElLoading } from 'element-plus'

const baseURL = import.meta.env.VITE_APP_BASE_API
let downloadLoadingInstance

export default {
  name(name, isDelete = true) {
    var url = baseURL + "/common/download?fileName=" + encodeURIComponent(name) + "&delete=" + isDelete
    fetch(url, {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + getToken() }
    }).then(async (res) => {
      if (!res.ok) throw new Error(res.statusText)
      const blob = await res.blob()
      const isBlob = blobValidate(blob)
      if (isBlob) {
        // Fetch headers are case-insensitive.
        const filename = res.headers.get('download-filename') 
        this.saveAs(blob, decodeURIComponent(filename || name))
      } else {
        this.printErrMsg(blob)
      }
    }).catch((r) => {
      console.error(r)
      ElMessage.error('下载文件出现错误，请联系管理员！')
    })
  },
  resource(resource) {
    var url = baseURL + "/common/download/resource?resource=" + encodeURIComponent(resource)
    fetch(url, {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + getToken() }
    }).then(async (res) => {
      if (!res.ok) throw new Error(res.statusText)
      const blob = await res.blob()
      const isBlob = blobValidate(blob)
      if (isBlob) {
        const filename = res.headers.get('download-filename')
        this.saveAs(blob, decodeURIComponent(filename || resource))
      } else {
        this.printErrMsg(blob)
      }
    }).catch((r) => {
      console.error(r)
      ElMessage.error('下载文件出现错误，请联系管理员！')
    })
  },
  zip(url, name) {
    var url = baseURL + url
    downloadLoadingInstance = ElLoading.service({ text: "正在下载数据，请稍候", background: "rgba(0, 0, 0, 0.7)", })
    fetch(url, {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + getToken() }
    }).then(async (res) => {
      if (!res.ok) throw new Error(res.statusText)
      const blob = await res.blob()
      const isBlob = blobValidate(blob)
      if (isBlob) {
        this.saveAs(blob, name)
      } else {
        this.printErrMsg(blob)
      }
      downloadLoadingInstance.close()
    }).catch((r) => {
      console.error(r)
      ElMessage.error('下载文件出现错误，请联系管理员！')
      downloadLoadingInstance.close()
    })
  },
  saveAs(text, name, opts) {
    saveAs(text, name, opts)
  },
  async printErrMsg(data) {
    const resText = await data.text()
    const rspObj = JSON.parse(resText)
    const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
    ElMessage.error(errMsg)
  }
}
