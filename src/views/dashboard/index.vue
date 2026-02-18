<template>
  <div class="dashboard-container">
    <!-- 顶部统计卡片区域 -->
    <div class="stat-cards">
      <!-- 总收入卡片 (蓝色主题) -->
      <div class="stat-card stat-card--primary">
        <div class="stat-card__header">
          <span class="stat-card__title">总收入</span>
        </div>
        <div class="stat-card__body">
          <div class="stat-card__value">¥ {{ formatNumber(stats.totalIncome) }}</div>
          <div class="stat-card__chart" ref="incomeChartRef"></div>
        </div>
        <div class="stat-card__footer">
          <span class="stat-card__label">自从上周以来</span>
          <span class="stat-card__change stat-card__change--up">
            <el-icon><Top /></el-icon> {{ stats.incomeChange }}%
          </span>
          <!-- <el-icon class="stat-card__arrow"><ArrowRight /></el-icon> -->
        </div>
      </div>

      <!-- 总退款卡片 -->
      <div class="stat-card">
        <div class="stat-card__header">
          <span class="stat-card__title stat-card__title--green">总退款</span>
        </div>
        <div class="stat-card__body">
          <div class="stat-card__value">¥ {{ formatNumber(stats.totalRefund) }}</div>
          <div class="stat-card__chart" ref="refundChartRef"></div>
        </div>
        <div class="stat-card__footer">
          <span class="stat-card__label">自从上周以来</span>
          <span class="stat-card__change stat-card__change--down">
            <el-icon><Bottom /></el-icon> {{ stats.refundChange }}%
          </span>
          <!-- <el-icon class="stat-card__arrow"><ArrowRight /></el-icon> -->
        </div>
      </div>

      <!-- 活跃用户卡片 -->
      <div class="stat-card">
        <div class="stat-card__header">
          <span class="stat-card__title stat-card__title--cyan">活跃用户（个）</span>
        </div>
        <div class="stat-card__body">
          <div class="stat-card__value">{{ stats.activeUsers }}</div>
          <div class="stat-card__icon stat-card__icon--cyan">
            <el-icon :size="28"><User /></el-icon>
          </div>
        </div>
        <div class="stat-card__footer">
          <span class="stat-card__label">自从上周以来</span>
          <span class="stat-card__change stat-card__change--down">
            <el-icon><Bottom /></el-icon> {{ stats.usersChange }}%
          </span>
          <!-- <el-icon class="stat-card__arrow"><ArrowRight /></el-icon> -->
        </div>
      </div>

      <!-- 产生订单卡片 -->
      <div class="stat-card">
        <div class="stat-card__header">
          <span class="stat-card__title">产生订单（个）</span>
        </div>
        <div class="stat-card__body">
          <div class="stat-card__value">{{ stats.totalOrders }}</div>
          <div class="stat-card__icon stat-card__icon--blue">
            <el-icon :size="28"><Document /></el-icon>
          </div>
        </div>
        <div class="stat-card__footer">
          <span class="stat-card__label">自从上周以来</span>
          <span class="stat-card__change stat-card__change--down">
            <el-icon><Bottom /></el-icon> {{ stats.ordersChange }}%
          </span>
          <!-- <el-icon class="stat-card__arrow"><ArrowRight /></el-icon> -->
        </div>
      </div>
    </div>

    <!-- 底部图表区域 -->
    <div class="charts-section">
      <!-- 左侧折线图 -->
      <div class="chart-card chart-card--line">
        <div class="chart-card__header">
          <div class="chart-card__title-section">
            <h3 class="chart-card__title">统计数据</h3>
            <span class="chart-card__subtitle">2026-2</span>
          </div>
          <div class="chart-card__date-picker">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
              size="small"
              :clearable="false"
            />
          </div>
        </div>
        <div class="chart-card__body" ref="lineChartRef"></div>
      </div>

      <!-- 右侧饼图 -->
      <div class="chart-card chart-card--pie">
        <div class="chart-card__header">
          <div class="chart-card__title-section">
            <h3 class="chart-card__title">销售渠道</h3>
            <span class="chart-card__subtitle">2026-2</span>
          </div>
        </div>
        <div class="chart-card__body" ref="pieChartRef"></div>
      </div>
    </div>

    <!-- 表格区域 -->
    <div class="tables-section">
      <!-- 左侧客户排名表格 -->
      <div class="table-card">
        <div class="table-card__header">
          <h3 class="table-card__title">销售订单排名</h3>
          <div class="table-card__tabs">
            <button 
              :class="['table-card__tab', { 'table-card__tab--active': customerTab === 'week' }]"
              @click="customerTab = 'week'"
            >本周</button>
            <button 
              :class="['table-card__tab', { 'table-card__tab--active': customerTab === 'quarter' }]"
              @click="customerTab = 'quarter'"
            >近三月</button>
          </div>
        </div>
        <div class="table-card__body">
          <table class="ranking-table">
            <thead>
              <tr>
                <th>排名</th>
                <th>客户名称</th>
                <th>较上周</th>
                <th>订单量</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in customerRankings" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ item.name }}</td>
                <td>
                  <span :class="['rank-change', item.change > 0 ? 'rank-change--up' : 'rank-change--down']">
                    <el-icon v-if="item.change > 0"><Top /></el-icon>
                    <el-icon v-else><Bottom /></el-icon>
                    {{ Math.abs(item.change) }}
                  </span>
                </td>
                <td>{{ item.orders }}</td>
                <td><a href="javascript:;" class="detail-link">详情</a></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 右侧供应商排名表格 -->
      <div class="table-card">
        <div class="table-card__header">
          <h3 class="table-card__title">销售订单排名</h3>
          <div class="table-card__tabs">
            <button 
              :class="['table-card__tab', { 'table-card__tab--active': supplierTab === 'week' }]"
              @click="supplierTab = 'week'"
            >本周</button>
            <button 
              :class="['table-card__tab', { 'table-card__tab--active': supplierTab === 'quarter' }]"
              @click="supplierTab = 'quarter'"
            >近三月</button>
          </div>
        </div>
        <div class="table-card__body">
          <table class="ranking-table">
            <thead>
              <tr>
                <th>排名</th>
                <th>供应商名称</th>
                <th>较上周</th>
                <th>订单量</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in supplierRankings" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ item.name }}</td>
                <td>
                  <span :class="['rank-change', item.change > 0 ? 'rank-change--up' : 'rank-change--down']">
                    <el-icon v-if="item.change > 0"><Top /></el-icon>
                    <el-icon v-else><Bottom /></el-icon>
                    {{ Math.abs(item.change) }}
                  </span>
                </td>
                <td>{{ item.orders }}</td>
                <td><a href="javascript:;" class="detail-link">详情</a></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import * as echarts from 'echarts'
import { Top, Bottom, ArrowRight, User, Document } from '@element-plus/icons-vue'
import { useAppStore } from '@/store/modules/app'

const appStore = useAppStore()

// 统计数据
const stats = ref({
  totalIncome: 28425.00,
  incomeChange: 20.5,
  totalRefund: 768.00,
  refundChange: 20.5,
  activeUsers: 1126,
  usersChange: 20.5,
  totalOrders: 527,
  ordersChange: 20.5
})

// 日期范围
const dateRange = ref(['2026-01-25', '2026-01-31'])

// 表格切换标签
const customerTab = ref('week')
const supplierTab = ref('week')

// 客户排名数据
const customerRankings = ref([
  { name: '国家电网有限公司', change: 1, orders: 7059 },
  { name: '深圳燃气集团股份有限公司', change: -1, orders: 6437 },
  { name: '国家烟草专卖局', change: 4, orders: 4221 },
  { name: '中国电信集团有限公司', change: -3, orders: 3317 },
  { name: '中国移动通信集团有限公司', change: -3, orders: 3015 },
  { name: '新余市办公用户采购项目', change: -3, orders: 2015 }
])

// 供应商排名数据
const supplierRankings = ref([
  { name: '腾讯科技（深圳）有限公司', change: 1, orders: 3015 },
  { name: '大润发有限公司', change: -1, orders: 2015 },
  { name: '四川海底捞股份有限公司', change: -6, orders: 1815 },
  { name: '索尼（中国）有限公司', change: -3, orders: 1015 },
  { name: '松下电器（中国）有限公司', change: -4, orders: 445 },
  { name: '新余市办公用户采购项目', change: -3, orders: 2015 }
])

// 图表引用
const incomeChartRef = ref(null)
const refundChartRef = ref(null)
const lineChartRef = ref(null)
const pieChartRef = ref(null)

// 图表实例
let incomeChart = null
let refundChart = null
let lineChart = null
let pieChart = null

// 格式化数字
const formatNumber = (num) => {
  return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// 初始化收入迷你图
const initIncomeChart = () => {
  if (!incomeChartRef.value) return
  incomeChart = echarts.init(incomeChartRef.value)
  const option = {
    grid: {
      top: 5,
      right: 5,
      bottom: 5,
      left: 5
    },
    xAxis: {
      type: 'category',
      show: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value',
      show: false
    },
    series: [{
      data: [20, 60, 40, 80, 50, 70, 90],
      type: 'line',
      smooth: true,
      symbol: 'none',
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.8)',
        width: 2
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(255, 255, 255, 0.3)' },
          { offset: 1, color: 'rgba(255, 255, 255, 0.05)' }
        ])
      }
    }]
  }
  incomeChart.setOption(option)
}

// 初始化退款迷你图（条形图）
const initRefundChart = () => {
  if (!refundChartRef.value) return
  refundChart = echarts.init(refundChartRef.value)
  const option = {
    grid: {
      top: 5,
      right: 5,
      bottom: 5,
      left: 5
    },
    xAxis: {
      type: 'category',
      show: false,
      data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
    },
    yAxis: {
      type: 'value',
      show: false
    },
    series: [{
      data: [40, 60, 50, 80, 45, 70, 55, 85, 60, 75],
      type: 'bar',
      barWidth: 4,
      itemStyle: {
        color: '#0052d9',
        borderRadius: [2, 2, 0, 0]
      }
    }]
  }
  refundChart.setOption(option)
}

// 初始化折线图
const initLineChart = () => {
  if (!lineChartRef.value) return
  lineChart = echarts.init(lineChartRef.value)
  
  const dates = ['01-22', '01-23', '01-24', '01-25', '01-26', '01-27', '01-28', '01-29', '01-30', '01-31']
  const thisMonth = [20, 75, 100, 65, 25, 90, 55, 90, 45, 10, 85]
  const lastMonth = [80, 75, 80, 75, 75, 75, 75, 55, 85, 75, 70]
  
  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e7e7e7',
      borderWidth: 1,
      textStyle: {
        color: '#333'
      }
    },
    legend: {
      data: ['本月', '上月'],
      bottom: 10,
      icon: 'circle',
      itemWidth: 8,
      itemHeight: 8,
      textStyle: {
        color: '#666'
      }
    },
    grid: {
      top: 20,
      right: 20,
      bottom: 50,
      left: 40
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisLine: {
        lineStyle: {
          color: '#e7e7e7'
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#999'
      }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      splitLine: {
        lineStyle: {
          color: '#f0f0f0',
          type: 'dashed'
        }
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#999'
      }
    },
    series: [
      {
        name: '本月',
        type: 'line',
        data: thisMonth,
        smooth: false,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          color: '#0052d9',
          width: 2
        },
        itemStyle: {
          color: '#0052d9',
          borderColor: '#fff',
          borderWidth: 2
        }
      },
      {
        name: '上月',
        type: 'line',
        data: lastMonth,
        smooth: false,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          color: '#2ba471',
          width: 2
        },
        itemStyle: {
          color: '#2ba471',
          borderColor: '#fff',
          borderWidth: 2
        }
      }
    ]
  }
  lineChart.setOption(option)
}

// 初始化饼图
const initPieChart = () => {
  if (!pieChartRef.value) return
  pieChart = echarts.init(pieChartRef.value)
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {d}%'
    },
    legend: {
      bottom: 10,
      icon: 'circle',
      itemWidth: 8,
      itemHeight: 8,
      data: ['线上', '门店'],
      textStyle: {
        color: '#666'
      }
    },
    graphic: [
      {
        type: 'text',
        left: 'center',
        top: '40%',
        style: {
          text: '78.09%',
          textAlign: 'center',
          fill: '#333',
          fontSize: 24,
          fontWeight: 'bold'
        }
      },
      {
        type: 'text',
        left: 'center',
        top: '50%',
        style: {
          text: '线上',
          textAlign: 'center',
          fill: '#999',
          fontSize: 12
        }
      }
    ],
    series: [
      {
        type: 'pie',
        radius: ['55%', '75%'],
        center: ['50%', '45%'],
        avoidLabelOverlap: false,
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: false
          }
        },
        labelLine: {
          show: false
        },
        data: [
          {
            value: 78.09,
            name: '线上',
            itemStyle: {
              color: '#0052d9'
            }
          },
          {
            value: 21.91,
            name: '门店',
            itemStyle: {
              color: '#ff69b4'
            }
          }
        ]
      }
    ]
  }
  pieChart.setOption(option)
}

// 窗口大小变化处理
const handleResize = () => {
  incomeChart?.resize()
  refundChart?.resize()
  lineChart?.resize()
  pieChart?.resize()
}

// 监听侧边栏状态变化
watch(() => appStore.sidebar.opened, () => {
  // 等待侧边栏动画完成后再 resize
  setTimeout(() => {
    handleResize()
  }, 300)
})

onMounted(() => {
  nextTick(() => {
    initIncomeChart()
    initRefundChart()
    initLineChart()
    initPieChart()
  })
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  incomeChart?.dispose()
  refundChart?.dispose()
  lineChart?.dispose()
  pieChart?.dispose()
})
</script>

<style lang="scss" scoped>
.dashboard-container {
  background-color: var(--td-bg-color-page);
  min-height: 100%;
}

// 统计卡片区域
.stat-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.stat-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  position: relative;
  transition: box-shadow 0.3s;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
  
  &--primary {
    background: linear-gradient(135deg, #0052d9 0%, #2b7dff 100%);
    color: #fff;
    
    .stat-card__title,
    .stat-card__value,
    .stat-card__label,
    .stat-card__change,
    .stat-card__arrow {
      color: #fff;
    }
    
    .stat-card__change--up {
      color: rgba(255, 255, 255, 0.9);
    }
  }
  
  &__header {
    margin-bottom: 8px;
  }
  
  &__title {
    font-size: 14px;
    color: #0052d9;
    font-weight: 500;
    
    &--green {
      color: #2ba471;
    }
    
    &--cyan {
      color: #00b8a9;
    }
  }
  
  &__body {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }
  
  &__value {
    font-size: 28px;
    font-weight: 600;
    color: #1d1d1f;
    white-space: nowrap;
  }
  
  &__chart {
    width: 80px;
    height: 40px;
  }
  
  &__icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &--cyan {
      background: #e6f7f5;
      color: #00b8a9;
    }
    
    &--blue {
      background: #e6f0fd;
      color: #0052d9;
    }
  }
  
  &__footer {
    display: flex;
    align-items: center;
    font-size: 12px;
    color: #999;
    gap: 6px;
  }
  
  &__label {
    color: #999;
  }
  
  &__change {
    display: flex;
    align-items: center;
    gap: 2px;
    
    &--up {
      color: #2ba471;
    }
    
    &--down {
      color: #d54941;
    }
  }
  
  &__arrow {
    margin-left: auto;
    color: #ccc;
    cursor: pointer;
    
    &:hover {
      color: #0052d9;
    }
  }
}

// 图表区域
.charts-section {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.chart-card--line {
  grid-column: span 3;
}

.chart-card--pie {
  grid-column: span 1;
}

.chart-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
  }
  
  &__title-section {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  &__title {
    font-size: 16px;
    font-weight: 600;
    color: #1d1d1f;
    margin: 0;
  }
  
  &__subtitle {
    font-size: 12px;
    color: #999;
  }
  
  &__date-picker {
    :deep(.el-date-editor) {
      width: 240px;
    }
  }
  
  &__body {
    height: 280px;
    overflow: hidden;
  }
  
  &--pie {
    .chart-card__body {
      height: 260px;
    }
  }
}

// 暗色模式适配
:root.dark {
  .stat-card {
    background: var(--td-bg-color-container);
    
    &--primary {
      background: linear-gradient(135deg, #0052d9 0%, #2b7dff 100%);
    }
    
    &__title {
      color: var(--td-brand-color);
    }
    
    &__value {
      color: var(--td-text-color-primary);
    }
    
    &__label {
      color: var(--td-text-color-secondary);
    }
    
    &__icon {
      &--cyan {
        background: rgba(0, 184, 169, 0.15);
      }
      
      &--blue {
        background: rgba(0, 82, 217, 0.15);
      }
    }
  }
  
  .chart-card {
    background: var(--td-bg-color-container);
    
    &__title {
      color: var(--td-text-color-primary);
    }
    
    &__subtitle {
      color: var(--td-text-color-secondary);
    }
  }
}

// 响应式布局
@media (max-width: 1200px) {
  .stat-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .charts-section {
    grid-template-columns: 1fr;
  }
  
  .tables-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .stat-cards {
    grid-template-columns: 1fr;
  }
}

// 表格区域
.tables-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 16px;
}

.table-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  
  &__title {
    font-size: 16px;
    font-weight: 600;
    color: #1d1d1f;
    margin: 0;
  }
  
  &__tabs {
    display: flex;
    gap: 0;
    background: #f5f5f5;
    border-radius: 0;
    overflow: hidden;
  }
  
  &__tab {
    padding: 6px 16px;
    font-size: 13px;
    border: none;
    border-radius: 0;
    background: transparent;
    color: #666;
    cursor: pointer;
    transition: all 0.2s;
    
    &--active {
      background: #0052d9;
      color: #fff;
      border-radius: 0;
    }
    
    &:hover:not(&--active) {
      background: #e8e8e8;
      border-radius: 0;
    }
  }
  
  &__body {
    overflow-x: auto;
  }
}

.ranking-table {
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 12px 8px;
    text-align: left;
    font-size: 13px;
    border-bottom: 1px solid #f0f0f0;
  }
  
  th {
    color: #999;
    font-weight: normal;
  }
  
  td {
    color: #333;
  }
  
  tbody tr:last-child td {
    border-bottom: none;
  }
  
  tbody tr:hover {
    background: #fafafa;
  }
}

.rank-change {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-size: 12px;
  
  &--up {
    color: #d54941;
  }
  
  &--down {
    color: #2ba471;
  }
}

.detail-link {
  color: #0052d9;
  text-decoration: none;
  font-size: 13px;
  
  &:hover {
    text-decoration: underline;
  }
}

// 暗色模式表格适配
:root.dark {
  .table-card {
    background: var(--td-bg-color-container);
    
    &__title {
      color: var(--td-text-color-primary);
    }
    
    &__tabs {
      background: var(--td-gray-color-1);
    }
    
    &__tab {
      color: var(--td-text-color-secondary);
      
      &--active {
        background: var(--td-brand-color);
        color: #fff;
      }
      
      &:hover:not(&--active) {
        background: var(--td-gray-color-2);
      }
    }
  }
  
  .ranking-table {
    th {
      color: var(--td-text-color-secondary);
    }
    
    td {
      color: var(--td-text-color-primary);
    }
    
    th, td {
      border-bottom-color: var(--td-component-stroke);
    }
    
    tbody tr:hover {
      background: var(--td-gray-color-1);
    }
  }
  
  .detail-link {
    color: var(--td-brand-color);
  }
}
</style>