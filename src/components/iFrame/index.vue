<template>
  <div v-loading="loading" :style="'height:' + height">
    <iframe
      :src="url"
      frameborder="no"
      style="width: 100%; height: 100%"
      scrolling="auto"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  src: {
    type: String,
    required: true
  }
})

const height = ref(document.documentElement.clientHeight - 155 + "px")
const loading = ref(true)
const url = computed(() => props.src)

const resizeHeight = () => {
  height.value = document.documentElement.clientHeight - 155 + "px"
}

onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, 300);
  window.addEventListener('resize', resizeHeight)
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeHeight)
})
</script>
