import {
  findRoleList,
  updateRole,
  fuzzySearchOfRole
} from '@/api/roleManage'

export default {
  namespaced: true,
  state: {
    roleList: [],
    goupdate: 0,
    goreset: 0,
    godelete: 0,
    godisabled: 0
  },
  mutations: {
    set_roleList(state, val) {
      state.roleList = val
    },
    set_goupdate(state) {
      state.goupdate = state.goupdate == 0 ? 1 : 0
    },
    set_goreset(state) {
      state.goreset = state.goreset == 0 ? 1 : 0
    },
    set_godelete(state) {
      state.godelete = state.godelete == 0 ? 1 : 0
    },
    set_isDisabled(state, val) {
      if (val[0]) {
        state.godisabled = false
      } else {
        state.godisabled = true
      }
    }
  },
  actions: {
    getRoleListAction({ commit }) {
      return new Promise((resolve, reject) => {
        findRoleList().then((res) => {
          console.log(res)
          if (res.code === 0) {
            commit('set_roleList', res.data.rows)
            resolve(res)
          } else {
            reject(res.msg)
          }
        })
      })
    },

    // 模糊查询
    searchRoleManageAction({ commit }, val) {
      return new Promise((resolve, reject) => {
        fuzzySearchOfRole(val).then((res) => {
          if (res.code === 0 && res.data[0]) {
            commit('set_roleList', res.data)
            commit('set_goupdate')
            resolve(res.data)
          } else if (res.code === 0 && !res.data[0]) {
            commit('set_roleList', res.data)
            commit('set_goupdate')
            resolve(res.data)
          } else {
            reject(res.msg)
          }
        })
      })
    },

    // 更新内容
    updateRoleManageAction(context, val) {
      return new Promise((resolve) => {
        updateRole(val).then((res) => {
          resolve(res)
        })
      })
    }
  },
  getters: {
    getRoleList(state) {
      return state.roleList
    }
  }
}
