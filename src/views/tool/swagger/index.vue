<template>
   <i-frame v-model:src="url"></i-frame>
</template>

<script setup>
import iFrame from '@/components/iFrame/index.vue'
import { ref } from 'vue';

const url = ref("/swagger-api/doc.html")
</script>
