<template>
   <div class="app-container">
      <el-row :gutter="20">
         <el-col :span="6" :xs="24">
            <el-card class="box-card">
               <template v-slot:header>
                 <div class="clearfix">
                   <span>个人信息</span>
                 </div>
               </template>
               <div>
                  <div class="text-center">
                     <userAvatar />
                  </div>
                  <ul class="list-group list-group-striped">
                     <li class="list-group-item">
                        <span class="item-label">用户名称</span>
                        <span class="item-value">{{ state.user.userName }}</span>
                     </li>
                     <li class="list-group-item">
                        <span class="item-label">手机号码</span>
                        <span class="item-value">{{ state.user.phonenumber }}</span>
                     </li>
                     <li class="list-group-item">
                        <span class="item-label">用户邮箱</span>
                        <span class="item-value">{{ state.user.email }}</span>
                     </li>
                     <li class="list-group-item">
                        <span class="item-label">所属部门</span>
                        <span class="item-value" v-if="state.user.dept">{{ state.user.dept.deptName }} / {{ state.postGroup }}</span>
                     </li>
                     <li class="list-group-item">
                        <span class="item-label">所属角色</span>
                        <span class="item-value">{{ state.roleGroup }}</span>
                     </li>
                     <li class="list-group-item">
                        <span class="item-label">创建日期</span>
                        <span class="item-value">{{ state.user.createTime }}</span>
                     </li>
                  </ul>
               </div>
            </el-card>
         </el-col>
         <el-col :span="18" :xs="24">
            <el-card>
               <template v-slot:header>
                 <div class="clearfix">
                   <span>基本资料</span>
                 </div>
               </template>
               <el-tabs v-model="selectedTab">
                  <el-tab-pane label="基本资料" name="userinfo">
                     <userInfo :user="state.user" />
                  </el-tab-pane>
                  <el-tab-pane label="修改密码" name="resetPwd">
                     <resetPwd />
                  </el-tab-pane>
               </el-tabs>
            </el-card>
         </el-col>
      </el-row>
   </div>
</template>

<script setup name="Profile">
import userAvatar from "./userAvatar.vue"
import userInfo from "./userInfo.vue"
import resetPwd from "./resetPwd.vue"
import { getUserProfile } from "@/api/system/user"
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const selectedTab = ref("userinfo")
const state = reactive({
  user: {},
  roleGroup: {},
  postGroup: {}
})

function getUser() {
  getUserProfile().then(response => {
    state.user = response.data
    state.roleGroup = response.roleGroup
    state.postGroup = response.postGroup
  })
}

onMounted(() => {
  const activeTab = route.params && route.params.activeTab
  if (activeTab) {
    selectedTab.value = activeTab
  }
  getUser()
})
</script>

<style lang="scss" scoped>
.app-container {
  padding: 0;
}

.text-center {
  text-align: center;
  margin-bottom: 20px;
}

.list-group {
  padding-left: 0;
  list-style: none;
  margin: 0;
}

.list-group-striped > .list-group-item {
  border-left: 0;
  border-right: 0;
  border-radius: 0;
  padding: 14px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.list-group-striped > .list-group-item:first-child {
  border-top: 1px solid var(--el-border-color-lighter);
}

.item-label {
  display: flex;
  align-items: center;
  color: var(--el-text-color-primary);
  font-size: 14px;
  
  .svg-icon {
    margin-right: 10px;
    font-size: 16px;
    color: var(--el-text-color-secondary);
  }
}

.item-value {
  color: var(--el-text-color-secondary);
  font-size: 14px;
  text-align: right;
  flex-shrink: 0;
  max-width: 60%;
  word-break: break-all;
}
</style>

