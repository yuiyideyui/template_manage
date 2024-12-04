<template>
  <div class="course-lib">
    <Search  />
    <Emendation   />
    <!-- <Table /> -->
    <!-- <tableIndex/> -->
  </div>
</template>

<script setup lang="ts">
import Search from "./infoComponents/Search.vue"
import Emendation from "./infoComponents/Emendation.vue"
import Table from "./infoComponents/Table.vue"
// import tableIndex from "./infoComponents/test/tableIndex.vue"

</script>

<style lang="less" scoped>
  .course-lib{
    margin: 5px;
  }
</style>
