<template>
  <div  >
    <logo v-if="true" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper"  >
      
      <el-menu
        :default-active="$route.path"
        :collapse="isCollapse"
        background-color="#304156"
        text-color="#bfcbd9"
        :unique-opened="false"
        active-text-color="#f4f4f5"
        :collapse-transition="false"
        mode="vertical"
      
      >
      
        <sidebar-item
          v-for="route in permission_routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
        <!-- {{permission_routes}} -->
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo.vue'
import SidebarItem from './SidebarItem.vue'
// import  variables from '@/styles/variables.less'
// console.log(variables);
import {useRouter} from "vue-router"
export default {
  components: { SidebarItem,Logo },
  computed: {
    ...mapGetters(['permission_routes', 'sidebar']),
    activeMenu() {
      // console.log(this.permission_routes,'this.per');
      // console.log('执行了');
     
      const route = useRouter()
      // console.log(route,'21');
      
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      // console.log(this.sidebar);
      
      return path
    },
    // showLogo() {
    //   return this.$store.state.settings.sidebarLogo
    // },
    variables() {
      // return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>

