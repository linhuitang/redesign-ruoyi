<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="24" class="card-box">
        <el-card shadow="hover" class="box-card">
          <template #header>
            <div class="card-header">
              <span><el-icon><Monitor /></el-icon> 基本信息</span>
            </div>
          </template>
          <el-descriptions border :column="3">
            <el-descriptions-item label="Redis版本" v-if="cache.info">{{ cache.info.redis_version }}</el-descriptions-item>
            <el-descriptions-item label="运行模式" v-if="cache.info">{{ cache.info.redis_mode == "standalone" ? "单机" : "集群" }}</el-descriptions-item>
            <el-descriptions-item label="端口" v-if="cache.info">{{ cache.info.tcp_port }}</el-descriptions-item>
            <el-descriptions-item label="客户端数" v-if="cache.info">{{ cache.info.connected_clients }}</el-descriptions-item>
            <el-descriptions-item label="运行时间(天)" v-if="cache.info">{{ cache.info.uptime_in_days }}</el-descriptions-item>
            <el-descriptions-item label="使用内存" v-if="cache.info">{{ cache.info.used_memory_human }}</el-descriptions-item>
            <el-descriptions-item label="使用CPU" v-if="cache.info">{{ parseFloat(cache.info.used_cpu_user_children).toFixed(2) }}</el-descriptions-item>
            <el-descriptions-item label="内存配置" v-if="cache.info">{{ cache.info.maxmemory_human }}</el-descriptions-item>
            <el-descriptions-item label="AOF是否开启" v-if="cache.info">{{ cache.info.aof_enabled == "0" ? "否" : "是" }}</el-descriptions-item>
            <el-descriptions-item label="RDB是否成功" v-if="cache.info">{{ cache.info.rdb_last_bgsave_status }}</el-descriptions-item>
            <el-descriptions-item label="Key数量" v-if="cache.dbSize">{{ cache.dbSize }}</el-descriptions-item>
            <el-descriptions-item label="网络入口/出口" v-if="cache.info">{{ cache.info.instantaneous_input_kbps }}kps/{{cache.info.instantaneous_output_kbps}}kps</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>

      <el-col :span="12" class="mt10">
        <el-card shadow="hover" class="box-card">
          <template #header>
            <div class="card-header">
              <span><el-icon><DataLine /></el-icon> 命令统计</span>
            </div>
          </template>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <div ref="commandstats" style="height: 420px" />
          </div>
        </el-card>
      </el-col>

      <el-col :span="12" class="mt10">
        <el-card shadow="hover" class="box-card">
          <template #header>
            <div class="card-header">
              <span><el-icon><Odometer /></el-icon> 内存信息</span>
            </div>
          </template>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <div ref="usedmemory" style="height: 420px" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="Cache">
import { getCache } from '@/api/monitor/cache'
import * as echarts from 'echarts'
import { ref, getCurrentInstance } from 'vue'

const cache = ref([])
const commandstats = ref(null)
const usedmemory = ref(null)
const { proxy } = getCurrentInstance()

function getList() {
  proxy.$modal.loading("正在加载缓存监控数据，请稍候！")
  getCache().then(response => {
    proxy.$modal.closeLoading()
    cache.value = response.data

    const commandstatsIntance = echarts.init(commandstats.value, "macarons")
    commandstatsIntance.setOption({
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      series: [
        {
          name: "命令",
          type: "pie",
          radius: ["50%", "75%"],
          center: ["50%", "50%"],
          data: response.data.commandStats,
          animationEasing: "cubicInOut",
          animationDuration: 1000,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            formatter: '{b}: {c} ({d}%)'
          }
        }
      ],
      color: ['#00D8A5', '#007BFF', '#FFA500', '#F95C5C', '#8A2BE2', '#FF6347', '#1E90FF', '#32CD32']
    })
    const usedmemoryInstance = echarts.init(usedmemory.value, "macarons")
    usedmemoryInstance.setOption({
      tooltip: {
        formatter: "{b} <br/>{a} : " + cache.value.info.used_memory_human
      },
      series: [
        {
          name: "峰值",
          type: "gauge",
          min: 0,
          max: 1000,
          radius: '85%', // Explicit radius to control size
          detail: {
            formatter: cache.value.info.used_memory_human,
            fontSize: 20
          },
          data: [
            {
              value: parseFloat(cache.value.info.used_memory_human),
              name: "内存消耗"
            }
          ]
        }
      ]
    })
    window.addEventListener("resize", () => {
      commandstatsIntance.resize()
      usedmemoryInstance.resize()
    })
  })
}

getList()
</script>

<style scoped>
.box-card {
  margin-bottom: 10px;
}
.mt10 {
  margin-top: 10px;
}
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
:deep(.el-descriptions__label) {
  width: 140px;
  text-align: right;
  font-weight: bold;
}
:deep(.el-descriptions__content) {
  font-weight: bold;
}
</style>
