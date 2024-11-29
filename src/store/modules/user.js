import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import { getHeader } from '@/utils/getHeader' // 获取上传文件时需要的header

const state = {
  token: getToken(),
  name: '',
  mobile: null,
  avatar: '',
  agencyId: null,
  introduction: '',
  roles: [],
  email: '',
  loginCode: '',
  myHeader: '',
  userId: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => { // '/manager/prod-api' +
    state.avatar = avatar
  },
  SET_AGENCYID: (state, agencyId) => {
    state.agencyId = agencyId
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_MOBILE: (state, mobile) => {
    state.mobile = mobile
  },
  SET_SROLEID: (state, sRoleId) => {
    state.sRoleId = sRoleId
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  },
  SET_LOGINCODE: (state, loginCode) => {
    state.loginCode = loginCode
  },
  SET_MYHEADER: (state, myHeader) => {
    state.myHeader = myHeader
  },
  SET_USER_ID: (state, userId) => {
    state.userId = userId
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      // 测试服用户名key值为loginCode
      login({ loginCode: username.trim(), password: password }).then(response => {
        const { data } = response

        // 存入data
        commit('SET_TOKEN', data.token)
        console.log('执行到这里');
        
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
        console.log('error')
      })
    })
  },

  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        console.log(response)
        const { data } = response
        if (!data) {
          reject('获取用户信息失败，请重新登录')
          alert('登录已过期，请重新登录')
        }

        const { roleName, agencyId, name, avatar, mobile, sRoleId, email, login_code, userId } = data
        // 获取上传文件时所需的请求头
        const my_header = getHeader('Admin-Token')
        // roles must be a non-empty array
        if (!roleName || roleName.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }
        // console.log(roleName, name)
        commit('SET_ROLES', roleName)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_AGENCYID', agencyId)
        commit('SET_MOBILE', mobile)
        commit('SET_SROLEID', sRoleId)
        commit('SET_EMAIL', email)
        commit('SET_LOGINCODE', login_code)
        commit('SET_MYHEADER', my_header)
        commit('SET_USER_ID', userId)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // remove Token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },
  // 传回来的图像重新放到store中
  resetAvatar({ commit }, avatar) {
    return new Promise(resolve => {
      commit('SET_AVATAR', avatar)
      resolve()
    })
  },
  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
