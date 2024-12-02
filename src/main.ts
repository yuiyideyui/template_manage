// import './assets/main.css'

import { createApp } from 'vue'
 

import App from './App.vue'
import router from './router'
import '@/styles/element-variables.less'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import '@/styles/index.less' // global css
import store from '@/store/index.js'
import './permission'
//  console.log(store);
 
const app = createApp(App)
 
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
 
app.use(router)

app.use(store)

app.mount('#app')
