import {
  findMenuList,
  fuzzySearchOfMenu
} from '@/api/menuManage'

export default {
  namespaced: true,
  state: {
    menuList: [],
    goupdate: 0,
    goreset: 0,
    godelete: 0
  },

  mutations: {
    set_menuList(state, val) {
      state.menuList = val
    },
    set_goupdate(state) {
      state.goupdate = state.goupdate == 0 ? 1 : 0
    },
    set_goreset(state) {
      state.goreset = state.goreset == 0 ? 1 : 0
    },
    set_godelete(state) {
      state.godelete = state.godelete == 0 ? 1 : 0
    }
  },

  actions: {
    getMenuListAction({ commit }) {
      return new Promise((resolve, reject) => {
        findMenuList().then((res) => {
          console.log(res)
          if (res.code === 0) {
            commit('set_menuList', res.data)
            resolve(res.data)
          } else {
            reject(res.msg)
          }
        })
      })
    },

    // 模糊查询
    searchMenuManageAction({ commit }, val) {
      return new Promise((resolve, reject) => {
        fuzzySearchOfMenu(val).then((res) => {
          console.log(res)
          if (res.code === 0 && res.data[0]) {
            commit('set_menuList', res.data)
            commit('set_goupdate')
            resolve(res.data)
          } else if (res.code === 0 && !res.data[0]) {
            commit('set_menuList', res.data)
            commit('set_goupdate')
            resolve(res.data)
          } else {
            reject(res.msg)
          }
        })
      })
    }
  },

  getters: {
    getMenuList(state) {
      console.log(state.menuList)
      return state.menuList
    }
  }
}
