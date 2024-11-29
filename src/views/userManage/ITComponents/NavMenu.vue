<template>
  <div
    class="NavMenu"
    :style="{ height: sectionHeight + 'px', width: 15 + '%' }"
  >
    <div style="display: flex; margin-top: 10px; justify-content: center">
      <el-autocomplete
        v-model.trim="organizName"
        class="inline-input"
        value-key="name"
        :fetch-suggestions="querySearch"
        placeholder="请输入机构名称"
        :trigger-on-focus="false"
        clearable
        size="mini"
        @select="handleSelect"
        @change="changeNav"
      />
    </div>
    <div
      class="my_table"
      style="height: 100vh"
    >
      <el-scrollbar style="height: 100%">
        <el-table
          ref="organizNav"
          v-loading="isLoading"
          :data="organizNav"
          style="width: 100%; margin-bottom: 20px; font-size: 10px"
          row-key="id"
          :row-style="{ cursor: 'pointer' }"
          :tree-props="{ children: 'subArr', hasChildren: 'hasChildren' }"
          default-expand-all
          highlight-current-row
          @row-click="showTable"
        >
          <el-table-column
            prop="name"
            :show-overflow-tooltip="true"
          />
        </el-table>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
export default {
    name: 'NavMenu',
    props: ['sectionHeight', 'refreshTabel'],
    data() {
        return {
            isLoading: true,
            organizNav: [], // 展现的机构列表
            organizs: [], // 搜索时提示的机构列表
            organizName: ''
        }
    },
    watch: {
        // 使导航栏学院行默认高亮
        organizNav: {
            handler: function() {
                this.$nextTick(function() {
                    this.$refs.organizNav.setCurrentRow(this.organizNav[0])
                })
            }
        }
    },
    mounted() {
        this.getOrganizNav()
        this.getTipList()
    },
    methods: {
        // 获取左侧导航栏列表
        getOrganizNav() {
            this.$store.dispatch('organizManage/getOrganizListAction').then(() => {
                const newOrganizList =
                    this.$store.getters['organizManage/getOrganizList']
                this.organizNav = newOrganizList
                // 修改班级名称
                for (let i = 0, len = this.organizNav.length; i < len; i++) {
                    if (this.organizNav[i].subArr[0]) {
                        const major = this.organizNav[i].subArr
                        for (let j = 0, mlen = major.length; j < mlen; j++) {
                            if (major[j].subArr[0]) {
                                const subClass = major[j].subArr
                                for (let k = 0, clen = subClass.length; k < clen; k++) {
                                    subClass[k].name =
                                        subClass[k].grade + '级' + subClass[k].name
                                }
                            }
                        }
                    }
                }
                this.isLoading = false
                this.$emit('setAgencyId', this.organizNav[0]) // 打开页面时的agency_id
            })
        },

        // 搜索输入时返回提示
        querySearch(queryString, cb) {
            var organizs = this.organizs
            var results = queryString
                ? organizs.filter(this.createFilter(queryString))
                : organizs
            // 调用 callback 返回建议列表的数据
            cb(results)
        },

        // 过滤
        createFilter(queryString) {
            return (organiz) => {
                // return organiz.name.indexOf(queryString) === 0;
                return organiz.name.includes(queryString)
            }
        },

        handleSelect(item) {
            this.isLoading = true
            console.log(item)
            this.changeNav()
        },

        // 获取搜索时所属机构提示列表
        getTipList() {
            this.$store
                .dispatch('organizManage/getOrganizLinearListAction')
                .then(() => {
                    const organizList =
                        this.$store.getters['organizManage/getOrganizLinearList']
                    for (let i = organizList.length - 1, counter = 0; i >= 0; i--) {
                        if (organizList[i].type === 2) {
                            this.organizs[counter] = {
                                name: organizList[i].grade + '级' + organizList[i].name
                            }
                            counter++
                        } else if (organizList[i].type > 0 || organizList[i].type === 0) {
                            this.organizs[counter] = {
                                name: organizList[i].name
                            }
                            counter++
                        } else {
                            continue
                        }
                    }
                })
        },

        // 根据输入框结果改变导航列表
        changeNav() {
            // 搜索框内无内容时恢复全部列表
            if (!this.organizName) {
                this.getOrganizNav()
                // this.isLoading = false;
                return
            }
            let val = {}
            if (this.organizName.includes('级')) {
                const theOrganiz = this.organizName.split('级')
                val = {
                    name: theOrganiz[1],
                    grade: theOrganiz[0]
                }
            } else {
                val = {
                    name: this.organizName
                }
            }
            this.$store
                .dispatch(`organizManage/searchOrganizListAction`, val)
                .then((res) => {
                    this.organizNav = res
                    console.log('res', res)
                    // 修改班级名称
                    for (let i = 0, len = this.organizNav.length; i < len; i++) {
                        if (this.organizNav[i].subArr[0]) {
                            const secondLayer = this.organizNav[i].subArr
                            for (let j = 0, mlen = secondLayer.length; j < mlen; j++) {
                                if (secondLayer[j].subArr[0]) {
                                    const thirdLayer = secondLayer[j].subArr
                                    for (let k = 0, clen = thirdLayer.length; k < clen; k++) {
                                        thirdLayer[k].name =
                                            thirdLayer[k].grade + '级' + thirdLayer[k].name
                                    }
                                } else if (secondLayer[j].grade) {
                                    secondLayer[j].name =
                                        secondLayer[j].grade + '级' + secondLayer[j].name
                                }
                            }
                        } else if (this.organizNav[i].grade) {
                            // 当搜索的是专业时
                            for (let k = 0, clen = this.organizNav.length; k < clen; k++) {
                                this.organizNav[i].name =
                                    this.organizNav[i].grade + '级' + this.organizNav[i].name
                            }
                        }
                    }
                    this.isLoading = false
                })
        },

        // 点击行时显示相对应的用户列表
        showTable(row) {
            // console.log(EventBus,'点击了table');
            this.$EventBus.$emit('clearSearchInput')
            const val = { agency_id: row.id, currentPage: 1, roleIdList: [3, 4, 5] }
            this.refreshTabel(val)
            this.$emit('setCurrentPage', 1) // 初始化当前页
            this.$emit('setLoading') // 表格进入加载状态
            this.$emit('setAgencyId', row) // 更改新增时的agency_id
        }
    }
}
</script>

<style lang="scss" scoped>
.NavMenu {
    display: inline-block;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);

    .my_table {
        width: 100%;

        ::v-deep {
            .el-table__expand-icon {
                .el-icon-arrow-right:before {
                    content: "\e791";
                }
            }

            .el-table__row>td {
                /* 去除表格线 */
                border: none;
            }

            .el-table th.is-leaf {
                /* 去除上边框 */
                border: none;
            }

            .el-table::before {
                /* 去除下边框 */
                height: 0;
            }

            // 改变行高
            .el-table__body tr,
            .el-table__body td {
                padding: 0;
                height: 30px;
            }

            // 加粗
            .el-table__row--level-0 {
                font-size: 14px;
                font-weight: bolder;
            }

            .el-table__row--level-1 {
                font-weight: bold;
            }
        }
    }

    ::v-deep .el-scrollbar__wrap {
        overflow-x: hidden;
        width: 110%; //隐藏侧边默认滚动条
    }
}
</style>
