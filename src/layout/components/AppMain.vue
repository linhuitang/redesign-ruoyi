<template>
  <section class="app-main">
    <div class="breadcrumb-container">
      <Breadcrumb />
    </div>
    <router-view v-slot="{ Component, route }">
      <transition name="fade-transform" mode="out-in">
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>
  </section>
</template>

<script setup>
import Breadcrumb from './Breadcrumb/index.vue'
</script>

<style lang="scss" scoped>
.app-main {
  /* 64=navbar */
  min-height: calc(100vh - 64px);
  width: 100%;
  position: relative;
  overflow: hidden;
  background-color: var(--td-bg-color-page);
  padding: 24px;
  box-sizing: border-box;
  padding-top: 10px;
}

.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.5s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
