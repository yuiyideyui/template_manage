<template>
  <div v-if="!item.hidden">
    <!-- 仅有一个可见子项时，渲染单个菜单项 -->
    <template
      v-if="
        hasOneShowingChild(item.children, item) &&
        (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
        !item.alwaysShow
      "
    >
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item
          :index="resolvePath(onlyOneChild.path)"
          :class="{ 'submenu-title-noDropdown': !isNest }"
        >
          <item
            :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
            :title="onlyOneChild.meta.title"
          />
        </el-menu-item>
      </app-link>
    </template>

    <!-- 多个子项，渲染子菜单 -->
    <el-sub-menu v-else :index="resolvePath(item.path)" popper-append-to-body>
      <template #title>
        <item
          v-if="item.meta"
          :icon="item.meta && item.meta.icon"
          :title="item.meta.title"
        />
      </template>

      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-sub-menu>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
import Item from "./Item.vue";
import AppLink from "./Link.vue";
import FixiOSBug from "./FixiOSBug.js";
import { isExternal } from "@/utils/validate.js";
import urlJoin from 'url-join';
import path from 'path'
export default defineComponent({
  name: "SidebarItem",
  components: { Item, AppLink },
  props: {
    item: {
      type: Object,
      required: true,
    },
    isNest: {
      type: Boolean,
      default: false,
    },
    basePath: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const onlyOneChild = ref(null);

    // 判断是否只有一个显示的子项
    const hasOneShowingChild = (children = [], parent) => {
      const showingChildren = children.filter((item) => {
        if (item.hidden) {
          return false;
        } else {
          onlyOneChild.value = item;
          return true;
        }
      });

      // 如果只有一个子项，则默认显示该子项
      if (showingChildren.length === 1) {
        return true;
      }

      // 如果没有显示的子项，则显示父项
      if (showingChildren.length === 0) {
        onlyOneChild.value = { ...parent, path: "", noShowingChildren: true };
        return true;
      }

      return false;
    };

    // 处理路径解析
   const resolvePath=function(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
 
      
      return urlJoin(this.basePath+"/",routePath)
     
      
    }
    return {
      hasOneShowingChild,
      onlyOneChild,
      resolvePath,
    };
  },
});
</script>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
