<template>
   <div class="main-content">
      <div class="content-area">
         <div class="user-info-card">
            <h4 class="form-header">基本信息</h4>
            <el-form :model="form">
               <el-form-item label="用户昵称" prop="nickName">
                  {{ form.nickName }}
               </el-form-item>
               <el-form-item label="登录账号" prop="userName">
                  {{ form.userName }}
               </el-form-item>
            </el-form>
         </div>

         <div class="role-list-card">
            <h4 class="form-header">角色信息</h4>
            <el-table v-loading="loading" :row-key="getRowKey" @row-click="clickRow" ref="tableRef" @selection-change="handleSelectionChange" :data="roles.slice((pageNum - 1) * pageSize, pageNum * pageSize)" :height="tableHeight">
               <el-table-column label="序号" width="55" type="index" align="center">
                  <template #default="scope">
                     <span>{{ (pageNum - 1) * pageSize + scope.$index + 1 }}</span>
                  </template>
               </el-table-column>
               <el-table-column type="selection" :reserve-selection="true" :selectable="checkSelectable" width="55"></el-table-column>
               <el-table-column label="角色编号" align="center" prop="roleId" />
               <el-table-column label="角色名称" align="center" prop="roleName" />
               <el-table-column label="权限字符" align="center" prop="roleKey" />
               <el-table-column label="创建时间" align="center" prop="createTime" width="180">
                  <template #default="scope">
                     <span>{{ parseTime(scope.row.createTime) }}</span>
                  </template>
               </el-table-column>
            </el-table>

            <pagination v-show="total > 0" :total="total" v-model:page="pageNum" v-model:limit="pageSize" />
         </div>
      </div>
      
      <div class="footer-actions">
         <el-button type="primary" @click="submitForm()" class="mr-4">提交</el-button>
         <el-button @click="close()">返回</el-button>
      </div>
   </div>
</template>

<script setup name="AuthRole">
import { getAuthRole, updateAuthRole } from "@/api/system/user"
import { getCurrentInstance, ref, reactive, toRefs, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const { proxy } = getCurrentInstance()

const loading = ref(true)
const total = ref(0)
const pageNum = ref(1)
const pageSize = ref(10)
const roleIds = ref([])
const roles = ref([])
const form = ref({
  nickName: undefined,
  userName: undefined,
  userId: undefined
})
const tableHeight = ref(400)
const tableRef = ref(null)

/** 单击选中行数据 */
function clickRow(row) {
  if (checkSelectable(row)) {
    proxy.$refs["tableRef"].toggleRowSelection(row)
  }
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  roleIds.value = selection.map(item => item.roleId)
}

/** 保存选中的数据编号 */
function getRowKey(row) {
  return row.roleId
}

// 检查角色状态
function checkSelectable(row) {
  return row.status === "0" ? true : false
}

/** 关闭按钮 */
function close() {
  const obj = { path: "/system/user" }
  proxy.$tab.closeOpenPage(obj)
}

/** 提交按钮 */
function submitForm() {
  const userId = form.value.userId
  const rIds = roleIds.value.join(",")
  updateAuthRole({ userId: userId, roleIds: rIds }).then(() => {
    proxy.$modal.msgSuccess("授权成功")
    close()
  })
}

/** 计算表格高度 */
function getAutoHeight() {
  if (tableRef.value && tableRef.value.$el) {
    const windowHeight = window.innerHeight;
    const tableTop = tableRef.value.$el.getBoundingClientRect().top;
    const paddingBottom = 190; // Margin for footer + padding
    tableHeight.value = windowHeight - tableTop - paddingBottom;
  }
}

onMounted(() => {
  const userId = route.params && route.params.userId
  if (userId) {
    loading.value = true
    getAuthRole(userId).then(response => {
      form.value = response.user
      roles.value = response.roles
      total.value = roles.value.length
      nextTick(() => {
        roles.value.forEach(row => {
          if (row.flag) {
            proxy.$refs["tableRef"].toggleRowSelection(row)
          }
        })
        getAutoHeight()
      })
      loading.value = false
    })
  }
  
  window.addEventListener('resize', getAutoHeight);
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', getAutoHeight);
});
</script>

<style scoped>
.main-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.content-area {
  display: flex;
  flex-direction: row;
  overflow: hidden; /* Prevent outer scroll */
}
.user-info-card {
  width: 280px; /* Fixed width */
  height: 100%; /* Full height */
  background-color: var(--el-bg-color-overlay);
  padding: 20px;
  margin-right: 20px; 
  border-radius: 4px;
  padding-bottom: 0px;
}
.role-list-card {
  flex: 1;
  height: 100%; /* Full height */
  background-color: var(--el-bg-color-overlay);
  padding: 20px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
}
.form-header {
  font-size: 15px;
  color: var(--el-text-color-primary);
  font-weight: bold;
  margin: 0 0 20px 0;
}
.footer-actions {
  flex-shrink: 0;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--el-bg-color-overlay);
  margin-top: 20px; /* Separate from cards */
  border-radius: 4px;
  z-index: 100;
}
</style>
