<template>
  <section class="app-main">
    <!-- <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
     
      </keep-alive>
    </transition> -->
     <router-view :key="key" />
  </section>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {useStore} from "vuex"
const store = useStore()
const route = useRoute()

// 缓存视图
const cachedViews = computed(() => store.state.tagsView.cachedViews)

// 当前路由路径
const key = computed(() => {
  console.log('path', route.path)
  return route.path
})
</script>


<style lang="less" scoped>
.app-main {
  
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative !important;
  overflow: hidden;
}

.fixed-header+.app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header+.app-main {
    // padding-top: 84px;
    padding-top: 100px;
   
  }
}
</style>

<style lang="less">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
