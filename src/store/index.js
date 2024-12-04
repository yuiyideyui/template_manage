import { createStore } from 'vuex'
import getters from './getters.js'
import app from "./modules/app.js"
import api from './modules/api.js'
import  permission  from './modules/permission.js'
import user from './modules/user.js'
import settings from './modules/settings.js'
import errorLog from './modules/errorLog.js'
import tagsView from './modules/tagsView.js'
import dataManage from "./modules/dataManage.js"
// 自动加载 modules 目录下的所有模块
// const modulesFiles = import.meta.glob('./modules/*.js')

// // 动态加载模块
// const modules = Object.keys(modulesFiles).reduce(async (modulesPromise, modulePath) => {
//   const modules = await modulesPromise
//   const moduleName = modulePath.replace(/^\.\/modules\/(.*)\.\w+$/, '$1')
//   const module = await modulesFiles[modulePath]()
//   modules[moduleName] = module.default
//   return modules
// }, Promise.resolve({}))
// console.log(await modules);
// // 创建 Vuex Store
// const store = createStore({
//   modules: await modules,
//   getters,
// })
const store = createStore({
  modules: {
    app,
    api,
    permission,
    user,
    settings,
    errorLog,
    tagsView,
    dataManage,
  },
  getters,
})
export default store
