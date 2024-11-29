<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MenuItem',
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    return { props };
  }
});
</script>

<template>
  <div>
    <!-- 渲染图标 -->
    <!-- <i v-if="icon && icon.includes('el-icon')" :class="[icon, 'sub-el-icon']" /> -->
    <!-- <svg-icon v-else-if="icon" :icon-class="icon" /> -->
    
    <el-icon class="sub-el-icon"><component :is="icon" /></el-icon>
    <!-- 渲染标题 -->
    <span v-if="title">{{ title }}</span>

 
  </div>
</template>

<style scoped>
.sub-el-icon {
   
  /* width: 1em;
  height: 1em; */
  margin-right: 17px;
    margin-left: -2px;

}

  
</style>
