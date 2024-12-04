import {
  findUserList,
  findUserListWithAgency,
  addUser,
  delUser,
  fuzzySearchOfUser,
  updateUser,
  updateUsersAvatar
} from '@/api/userManage'

export default {
  namespaced: true,
  state: {
    userList: [], // 后台管理系统显示的用户列表
    ITUserList: [], // 智能教学平台显示的用户列表
    BMCount: null, // 后台管理系统显示的用户条数
    ITCount: null, // 智能教学平台显示的用户条数
    goupdate: 0,
    goreset: 0,
    goresetIT: 0,
    godelete: 0,
    goabled: 0
  },
  mutations: {
    set_userList(state, val) {
      state.userList = val
    },
    set_ITUserList(state, val) {
      state.ITUserList = val
    },
    set_goupdate(state) {
      state.goupdate = state.goupdate == 0 ? 1 : 0
    },
    set_goreset(state) {
      // console.log(223)
      state.goreset = state.goreset == 0 ? 1 : 0
    },
    set_goresetIT(state) {
      state.goresetIT = state.goresetIT == 0 ? 1 : 0
    },
    set_BMCount(state, val) {
      state.BMCount = val
    },
    set_ITCount(state, val) {
      state.ITCount = val
    },
    set_godelete(state) {
      state.godelete = state.godelete == 0 ? 1 : 0
    },
    set_isDisabled(state, val) {
      if (val[0]) {
        state.goabled = false
      } else {
        state.goabled = true
      }
    }
  },
  actions: {
    // 获取后台管理系统用户列表
    getUserListAction({ commit }, val) {
      return new Promise((resolve, reject) => {
        findUserList(val).then((res) => {
          console.log(res)
          if (res.code === 0 && res.data.dataRes) {
            commit('set_userList', res.data.dataRes)
            commit('set_BMCount', res.data.count)
            resolve(res.data)
          } else if (res.code === 0 && res.data[0]) {
            commit('set_userList', res.data)
            resolve(res.data)
          } else {
            reject(res.msg)
          }
        })
      })
    },

    // 根据机构id获取智能教学平台显示的用户信息
    getITUserListWithAgencyAction({ commit }, val) {
      return new Promise((resolve, reject) => {
        findUserListWithAgency(val).then((res) => {
          console.log(res)
          if (res.code === 0) {
            commit('set_ITUserList', res.data.pageUser)
            commit('set_ITCount', res.data.count)
            resolve(res)
          } else {
            reject(res.msg)
          }
        })
      })
    },

    addUserManageAction(context, val) {
      return new Promise((resolve) => {
        addUser(val).then((res) => {
          console.log(res)
          resolve(res)
        })
      })
    },

    // 删除
    delUserManageAction(context, val) {
      return new Promise((resolve) => {
        delUser(val).then((res) => {
          console.log(res)
          resolve(res)
        })
      })
    },

    // 模糊查询
    searchUserManageAction({ commit }, val) {
      return new Promise((resolve, reject) => {
        fuzzySearchOfUser({
            ...val.form,
            ...val
        }).then((res) => {
          console.log(res)
          if (res.code === 0 && res.data.dataRes) {
            commit('set_userList', res.data.dataRes)
            commit('set_goupdate')
            commit(`set_${val.type}Count`, res.data.count)
            console.log('=================')
            resolve(res.data.dataRes)
          } else if (res.code === 0 && !res.data.dataRes) {
            console.log('=================')
            commit('set_userList', [])
            commit('set_goupdate')
            commit(`set_${val.type}Count`, 0)
            resolve(res.data)
          } else {
            reject(res.msg)
          }
        })
      })
    },

    // 更新内容
    updateUserManageAction(context, val) {
      return new Promise((resolve) => {
        updateUser(val).then((res) => {
          resolve(res)
        })
      })
    },

    updateUsersAvatarAction(context, val) {
      return new Promise((resolve) => {
        updateUsersAvatar(val).then((res) => {
          console.log(res)
          resolve(res)
        })
      })
    }
  },
  getters: {
    getUserList(state) {
      return state.userList
    },

    getITUserList(state) {
      return state.ITUserList
    },

    getITUserCount(state) {
      return state.ITCount
    },

    getBMUserCount(state) {
      return state.BMCount
    }
  }
}
