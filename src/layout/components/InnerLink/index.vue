<template>
  <div :style="'height:' + height">
    <iframe
      :id="iframeId"
      style="width: 100%; height: 100%"
      :src="src"
      frameborder="no"
    ></iframe>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
  src: {
    type: String,
    default: '/'
  },
  iframeId: {
    type: String,
  }
});

const height = ref(document.documentElement.clientHeight - 94.5 + "px");

const route = useRoute();

watch(() => route.path, () => {
    // 重新计算高度
    height.value = document.documentElement.clientHeight - 94.5 + "px";
  }
);

onMounted(() => {
  window.onresize = function temp() {
    height.value = document.documentElement.clientHeight - 94.5 + "px";
  };
});
</script>
