<template>
  <div class="role-manage">
    <Search @setLoading="setLoading" />
    <Table :loading="loading" />
  </div>
</template>

<script>
import Search from './components/Search'
import Table from './components/Table'

export default {
  name: 'RoleManage',
  components: { Search, Table },
  data() {
    return {
      loading: 1
    }
  },
  methods: {
    // 设置表格加载状态
    setLoading() {
      this.loading = this.loading === 0 ? 1 : 0
    }
  }
}
</script>

<style>
</style>
