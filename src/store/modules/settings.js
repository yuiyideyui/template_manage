// import variables from '@/styles/element-variables.less'
import defaultSettings from '@/settings.js'
console.log(defaultSettings);

const { showSettings, tagsView, fixedHeader, sidebarLogo, supportPinyinSearch } = defaultSettings
console.log(tagsView);

const state = {
  theme: "#1890ff",
  showSettings,
  tagsView:tagsView,
  fixedHeader,
  sidebarLogo,
  supportPinyinSearch
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

