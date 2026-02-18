import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'virtual:uno.css'
import './style.scss'
import App from './App.vue'
import router from './router'
import store from './store'
import './permission' 


// 全局组件注册
import Pagination from '@/components/Pagination/index.vue'
import RightToolbar from '@/components/RightToolbar/index.vue'
import DictTag from '@/components/DictTag/index.vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
import 'virtual:svg-icons-register'

const app = createApp(App)

app.component('Pagination', Pagination)
app.component('RightToolbar', RightToolbar)
app.component('DictTag', DictTag)
app.component('svg-icon', SvgIcon)

import directive from './directive' // directive
directive(app)

import plugins from './plugins' // plugins
app.use(plugins)

// 富文本组件
import Editor from "@/components/Editor/index.vue"
app.component('Editor', Editor)

import { download } from '@/utils/request'
app.config.globalProperties.download = download

import { parseTime, resetForm, addDateRange, handleTree, selectDictLabel, selectDictLabels } from '@/utils/ruoyi'

app.config.globalProperties.parseTime = parseTime
app.config.globalProperties.resetForm = resetForm
app.config.globalProperties.handleTree = handleTree
app.config.globalProperties.addDateRange = addDateRange
app.config.globalProperties.selectDictLabel = selectDictLabel
app.config.globalProperties.selectDictLabel = selectDictLabel
app.config.globalProperties.selectDictLabels = selectDictLabels

import { useDict } from '@/utils/dict'
app.config.globalProperties.useDict = useDict

// 获取保存的尺寸配置
const savedSize = localStorage.getItem('size') || 'default'

app.use(ElementPlus, { size: savedSize })
app.use(router)
app.use(store)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 初始化主题
import { useAppStore } from './store/modules/app'
const appStore = useAppStore()
appStore.initTheme()

app.mount('#app')
