<template>
  <el-icon v-if="isElIcon" :class="svgClass" aria-hidden="true">
    <component :is="iconClass" />
  </el-icon>
  <el-icon v-else :class="svgClass" aria-hidden="true">
    <svg style="width: 1em; height: 1em; vertical-align: middle; overflow: hidden;" aria-hidden="true">
      <use :xlink:href="iconName" :fill="color" />
    </svg>
  </el-icon>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  iconClass: {
    type: String,
    required: true
  },
  className: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: ''
  },
})

const isElIcon = computed(() => {
  // Simple heuristic: Element Plus icons are usually PascalCase, SVGs are usually kebab-case
  // Or check if it exists in global components if strictly needed, but regex is faster for now.
  // We assume valid EP icon names like 'User', 'Setting'.
  return /^[A-Z]/.test(props.iconClass)
})

const iconName = computed(() => `#icon-${props.iconClass}`)
const svgClass = computed(() => {
  if (props.className) {
    return 'svg-icon ' + props.className
  } else {
    return 'svg-icon'
  }
})
</script>

<style scope>
.svg-icon {
  width: 1em;
  height: 1em;
  position: relative;
  fill: currentColor;
  vertical-align: -2px;
}

</style>
