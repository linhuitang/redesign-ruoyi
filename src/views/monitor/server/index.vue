<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!-- CPU -->
      <el-col :span="12" :xs="24">
        <el-card shadow="hover" class="box-card">
          <template #header>
            <div class="card-header">
              <span><el-icon><Cpu /></el-icon> CPU</span>
            </div>
          </template>
          <div class="card-body">
            <div class="progress-wrapper">
               <el-progress type="dashboard" :percentage="parseFloat(server.cpu?.used || 0)" :color="colors" />
               <div class="progress-label">使用率</div>
            </div>
            <el-descriptions column="1" border size="small">
              <el-descriptions-item label="核心数">{{ server.cpu?.cpuNum }} 核心</el-descriptions-item>
              <el-descriptions-item label="系统使用率">{{ server.cpu?.sys }}%</el-descriptions-item>
              <el-descriptions-item label="用户使用率">{{ server.cpu?.used }}%</el-descriptions-item>
              <el-descriptions-item label="当前空闲率">{{ server.cpu?.free }}%</el-descriptions-item>
            </el-descriptions>
          </div>
        </el-card>
      </el-col>

      <!-- 内存 -->
      <el-col :span="12" :xs="24">
        <el-card shadow="hover" class="box-card">
          <template #header>
            <div class="card-header">
              <span><el-icon><Tickets /></el-icon> 内存</span>
            </div>
          </template>
          <div class="card-body">
            <div class="progress-wrapper">
               <el-progress type="dashboard" :percentage="parseFloat(server.mem?.usage || 0)" :color="colors" />
               <div class="progress-label">使用率</div>
            </div>
            <el-descriptions column="1" border size="small">
              <el-descriptions-item label="总内存">{{ server.mem?.total }}G</el-descriptions-item>
              <el-descriptions-item label="已用内存">{{ server.mem?.used }}G</el-descriptions-item>
              <el-descriptions-item label="剩余内存">{{ server.mem?.free }}G</el-descriptions-item>
              <el-descriptions-item label="JVM使用率">{{ server.jvm?.usage }}%</el-descriptions-item>
            </el-descriptions>
          </div>
        </el-card>
      </el-col>

      <!-- 服务器信息 -->
      <el-col :span="24" class="mt4">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span><el-icon><Monitor /></el-icon> 服务器信息</span>
            </div>
          </template>
          <el-descriptions border :column="2">
            <el-descriptions-item label="服务器名称">{{ server.sys?.computerName }}</el-descriptions-item>
            <el-descriptions-item label="操作系统">{{ server.sys?.osName }}</el-descriptions-item>
            <el-descriptions-item label="服务器IP">{{ server.sys?.computerIp }}</el-descriptions-item>
            <el-descriptions-item label="系统架构">{{ server.sys?.osArch }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>

      <!-- Java虚拟机信息 -->
      <el-col :span="24" class="mt4">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span><el-icon><CoffeeCup /></el-icon> Java虚拟机信息</span>
            </div>
          </template>
          <el-descriptions border :column="2">
            <el-descriptions-item label="Java名称">{{ server.jvm?.name }}</el-descriptions-item>
            <el-descriptions-item label="Java版本">{{ server.jvm?.version }}</el-descriptions-item>
            <el-descriptions-item label="启动时间">{{ server.jvm?.startTime }}</el-descriptions-item>
            <el-descriptions-item label="运行时长">{{ server.jvm?.runTime }}</el-descriptions-item>
            <el-descriptions-item label="安装路径" :span="2">{{ server.jvm?.home }}</el-descriptions-item>
            <el-descriptions-item label="项目路径" :span="2">{{ server.sys?.userDir }}</el-descriptions-item>
            <el-descriptions-item label="运行参数" :span="2">{{ server.jvm?.inputArgs }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>

      <!-- 磁盘状态 -->
      <el-col :span="24" class="mt4">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span><el-icon><MessageBox /></el-icon> 磁盘状态</span>
            </div>
          </template>
          <el-table :data="server.sysFiles" style="width: 100%">
            <el-table-column prop="dirName" label="盘符路径" />
            <el-table-column prop="sysTypeName" label="文件系统" />
            <el-table-column prop="typeName" label="盘符类型" />
            <el-table-column prop="total" label="总大小" />
            <el-table-column prop="free" label="可用大小" />
            <el-table-column prop="used" label="已用大小" />
            <el-table-column label="已用百分比" width="180">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                   <el-progress 
                      :percentage="parseFloat(scope.row.usage)" 
                      :color="colors"
                      :text-inside="true" 
                      :stroke-width="18" 
                      style="width: 100%"
                   />
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="Server">
import { getServer } from '@/api/monitor/server'
import { ref, getCurrentInstance } from 'vue'

const server = ref([])
const { proxy } = getCurrentInstance()

const colors = [
  { color: '#5cb87a', percentage: 20 },
  { color: '#1989fa', percentage: 40 },
  { color: '#e6a23c', percentage: 60 },
  { color: '#f56c6c', percentage: 80 }
]

function getList() {
  proxy.$modal.loading("正在加载服务监控数据，请稍候！")
  getServer().then(response => {
    server.value = response.data
    proxy.$modal.closeLoading()
  })
}

getList()
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}
.card-header span {
  display: flex;
  align-items: center;
}
.card-header .el-icon {
  vertical-align: middle;
  margin-right: 5px;
}
.card-body {
  display: flex;
  align-items: center;
  justify-content: center; /* Center content horizontally */
}
.progress-wrapper {
  margin-right: 40px; /* Reduce margin */
  text-align: center;
  position: relative;
  flex-shrink: 0; /* Prevent chart shrinking */
}
.el-descriptions {
  flex: 1; /* Allow descriptions to fill remaining space */
}
</style>
