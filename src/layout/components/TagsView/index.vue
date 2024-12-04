<template>
  <div id="tags-view-container" ref="containerRef" class="tags-view-container">
    <scroll-pane ref="scrollPaneRef" class="tags-view-wrapper" @scroll="handleScroll" :tag="tag" >
      
      <router-link
        v-for="tag in visitedViews"
        ref="tag"
        :key="tag.path"
        :class="isActive(tag)?'active':''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        tag="span"
        class="tags-view-item"
        @click.middle.native="!isAffix(tag)?closeSelectedTag(tag):''"
        @contextmenu.prevent.native="openMenu(tag,$event)"
      >
        {{ tag.title }}
        
        <el-icon  v-if="!isAffix(tag)"   class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)"><CircleClose /></el-icon>
      </router-link>
    </scroll-pane>
    <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">刷新</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">关闭</li>
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags(selectedTag)">关闭所有</li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import {ref,computed,watch,nextTick,onMounted,toRef,provide  } from "vue"
import ScrollPane from './ScrollPane.vue'
import {useRoute,useRouter} from "vue-router"
import { useStore } from 'vuex'
import urlJoin from 'url-join';
const router = useRouter(); 
const store = useStore() 
const route = useRoute()

const visible = ref(false)
const top = ref(0)
const left = ref(0)
const selectedTag = ref({})
const affixTags = ref([])
const tag = ref(null)
const scrollPaneRef = ref(null)
const containerRef = ref(null)

provide('tag',tag.value)

const visitedViews = computed(()=>{
  return store.state.tagsView.visitedViews
})

const routes = computed(()=>{
  return store.state.permission.routes
})

watch(()=>route.path,()=>{
  addTags()
  moveToCurrentTag()
})
watch(visible,(value)=>{
  if (value) {
        document.body.addEventListener('click', closeMenu)
      } else {
        document.body.removeEventListener('click', closeMenu)
  }
})
const addTags=function() {
  const { name } = route
  if (name) {
    store.dispatch('tagsView/addView', route)
  }
  return false
}

const moveToCurrentTag=function() {
  const tags = tag.value
  nextTick(() => {
    for (const tag of tags) {
      if (tag.to.path === route.path) {
        // console.log(scrollPaneRef.value);
       
        scrollPaneRef.value.moveToTarget(tag)
        // when query is different then update
        if (tag.to.fullPath !== route.fullPath) {
          store.dispatch('tagsView/updateVisitedView', route)
        }
        break
      }
    }
  })
}

const closeMenu=function() {
  visible.value = false
}

onMounted(()=>{
  initTags()
  addTags()
})

const initTags=function() {
   affixTags.value = filterAffixTags(routes)
  for (const tag of affixTags.value) {
    // Must have tag name
    if (tag.name) {
      store.dispatch('tagsView/addVisitedView', tag)
    }
  }
}

const isActive = function(routeCustom){
  return routeCustom.path === route.path
}

const isAffix= function(tag) {
      // console.log(tag);
      
      return tag.meta && tag.meta.affix
}

const filterAffixTags=function(routes, basePath = '/') {
      let tags = []
      // console.log(routes.value);
      
      routes.value.forEach(route => {
        // console.log(route.meta);
        
        if (route.meta && route.meta.affix) {
          const tagPath = urlJoin(basePath, route.path)
          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: route.name,
            meta: { ...route.meta }
          })
        }
        if (route.children) {
          // console.log(route.children,11);
          
          const tempTags = filterAffixTags(toRef(route.children), route.path)
          if (tempTags.length >= 1) {
            tags = [...tags, ...tempTags]
          }
        }
      })
      // console.log(tags);
      
      return tags
}

const refreshSelectedTag=function(view) {
      store.dispatch('tagsView/delCachedView', view).then(() => {
      const { fullPath } = view
        nextTick(() => {
          route.replace({
            path: '/redirect' + fullPath
          })
        })
      })
}

const closeSelectedTag=function(view) {
   store.dispatch('tagsView/delView', view).then(({ visitedViews }) => {
        if (isActive(view)) {
          toLastView(visitedViews, view)
        }
   })
}

const closeOthersTags=function() {
      router.push(selectedTag.value)
      store.dispatch('tagsView/delOthersViews', selectedTag.value).then(() => {
        moveToCurrentTag()
      })
}

const closeAllTags=function(view) {
      store.dispatch('tagsView/delAllViews').then(({ visitedViews }) => {
        if (affixTags.value.some(tag => tag.path === view.path)) {
          return
        }
        toLastView(visitedViews, view)
      })
}

const  toLastView=function(visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0]
      if (latestView) {
        // console.log(route);
        
        router.push(latestView.fullPath)
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === 'Dashboard') {
          // to reload home page
          router.replace({ path: '/redirect' + view.fullPath })
        } else {
          router.push('/')
        }
      }
}

const openMenu=function(tag, e) {
      const menuMinWidth = 105
      const offsetLeft = containerRef.value.getBoundingClientRect().left // container margin left
      const offsetWidth = containerRef.value.offsetWidth // container width
      const maxLeft = offsetWidth - menuMinWidth // left boundary
      const left = e.clientX - offsetLeft + 15 // 15: margin right

      if (left > maxLeft) {
        left.value = maxLeft
      } else {
        left.value = left
      }

      top.value = e.clientY
      visible.value = true
      selectedTag.value = tag
}

const handleScroll = ()=>{
  closeMenu()
}
 
</script>

<style lang="less" scoped>
.tags-view-container {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      &:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        background-color: #42b983;
        color: #fff;
        border-color: #42b983;
        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style lang="less">
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: -1px;
      border-radius: 50%;
      text-align: center;
      transition: all .3s cubic-bezier(.645, .045, .355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(.6);
        display: inline-block;
        vertical-align: -3px;
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>
