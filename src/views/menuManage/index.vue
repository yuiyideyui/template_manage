<template>
  <div class="menu-manage">
    <Search @setLoading="setLoading" />
    <Table :loading="loading" />
  </div>
</template>

<script>
import Search from './components/Search'
import Table from './components/Table'

export default {
  name: 'MenuManage',
  components: { Search, Table },
  data() {
    return {
      loading: 0 // 使表格处于加载状态
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
