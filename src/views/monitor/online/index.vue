<template>
   <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
         <el-form-item label="登录地址" prop="ipaddr">
            <el-input
               v-model="queryParams.ipaddr"
               placeholder="请输入登录地址"
               clearable
               style="width: 200px"
               @keyup.enter="handleQuery"
            />
         </el-form-item>
         <el-form-item label="用户名称" prop="userName">
            <el-input
               v-model="queryParams.userName"
               placeholder="请输入用户名称"
               clearable
               style="width: 200px"
               @keyup.enter="handleQuery"
            />
         </el-form-item>
         <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
         </el-form-item>
      </el-form>
      <el-table
         v-loading="loading"
         :data="onlineList.slice((pageNum - 1) * pageSize, pageNum * pageSize)"
         style="width: 100%;"
         :height="tableHeight"
         ref="tableRef"
      >
         <el-table-column label="序号" min-width="50" type="index" align="center">
            <template #default="scope">
               <span>{{ (pageNum - 1) * pageSize + scope.$index + 1 }}</span>
            </template>
         </el-table-column>
         <el-table-column label="会话编号" align="center" prop="tokenId" :show-overflow-tooltip="true" />
         <el-table-column label="登录名称" align="center" prop="userName" :show-overflow-tooltip="true" />
         <el-table-column label="所属部门" align="center" prop="deptName" :show-overflow-tooltip="true" />
         <el-table-column label="主机" align="center" prop="ipaddr" :show-overflow-tooltip="true" />
         <el-table-column label="登录地点" align="center" prop="loginLocation" :show-overflow-tooltip="true" />
         <el-table-column label="操作系统" align="center" prop="os" :show-overflow-tooltip="true" />
         <el-table-column label="浏览器" align="center" prop="browser" :show-overflow-tooltip="true" />
         <el-table-column label="登录时间" align="center" prop="loginTime" width="180">
            <template #default="scope">
               <span>{{ parseTime(scope.row.loginTime) }}</span>
            </template>
         </el-table-column>
         <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template #default="scope">
               <el-button link type="primary" icon="Delete" @click="handleForceLogout(scope.row)" v-hasPermi="['monitor:online:forceLogout']">强退</el-button>
            </template>
         </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="pageNum" v-model:limit="pageSize" />
   </div>
</template>

<script setup name="Online">
import { forceLogout, list as initData } from "@/api/monitor/online"
import { getCurrentInstance, ref, nextTick, onMounted, onBeforeUnmount, watch } from 'vue'

const { proxy } = getCurrentInstance()

const onlineList = ref([])
const loading = ref(true)
const total = ref(0)
const pageNum = ref(1)
const pageSize = ref(10)
const showSearch = ref(true)
const tableRef = ref(null)
const tableHeight = ref(400)

const queryParams = ref({
  ipaddr: undefined,
  userName: undefined
})

/** 查询登录日志列表 */
function getList() {
  loading.value = true
  initData(queryParams.value).then(response => {
    onlineList.value = response.rows
    total.value = response.total
    loading.value = false
  })
}

/** 搜索按钮操作 */
function handleQuery() {
  pageNum.value = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef")
  handleQuery()
}

/** 强退按钮操作 */
function handleForceLogout(row) {
  proxy.$modal.confirm('是否确认强退名称为"' + row.userName + '"的用户?').then(function () {
    return forceLogout(row.tokenId)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 计算表格高度 */
function getAutoHeight() {
  if (tableRef.value && tableRef.value.$el) {
    const windowHeight = window.innerHeight;
    const tableTop = tableRef.value.$el.getBoundingClientRect().top;
    const paddingBottom = 24 + 50 + 20;
    tableHeight.value = windowHeight - tableTop - paddingBottom;
  }
}

onMounted(() => {
  getList();
  nextTick(() => {
    getAutoHeight();
  });
  window.addEventListener('resize', getAutoHeight);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', getAutoHeight);
});

// Watch showSearch to recalculate height (although showSearch is not togglable in UI currently, it's good practice)
watch(showSearch, () => {
    nextTick(() => {
        getAutoHeight();
    });
});

getList()
</script>
