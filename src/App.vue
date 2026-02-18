<script setup>
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import { computed } from 'vue';
import { useAppStore } from '@/store/modules/app';

const appStore = useAppStore();
const size = computed(() => appStore.size);
</script>

<template>
  <el-config-provider :locale="zhCn" :size="size">
    <router-view />
  </el-config-provider>
</template>

<style scoped>
</style>

