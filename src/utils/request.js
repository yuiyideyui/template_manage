import axios from 'axios'
// import { ElMessageBox , ElMessage } from 'element-plus'
import store from '@/store'
import { getToken } from '@/utils/auth.js'

// create an axios instance
const service = axios.create({
    // http://124.220.167.161:3005  http://192.168.0.84:3003 
    baseURL:" http://124.220.167.161:3005", // url = base url + request url
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 120000 // request timeout
})

// request interceptor
service.interceptors.request.use(
    config => {
        // do something before request is sent

        if (store.getters.token) {
            // let each request carry token
            // ['X-Token'] is a custom headers key
            // please modify it according to the actual situation
            config.headers['authorization'] = 'Bearer ' + getToken()
        }
        return config
    },
    error => {
        // do something with request error
        console.log(error) // for debug
        return Promise.reject(error)
    }
)

// response interceptor
service.interceptors.response.use(
    /**
       * If you want to get http information such as headers or status
       * Please return  response => response
      */

    /**
       * Determine the request status by custom code
       * Here is just an example
       * You can also judge the status by HTTP Status Code
       */
    response => {
        const res = response.data
        if (res.code === 4003) {
            ElMessageBox.confirm('登录已失效', '确认', {
                confirmButtonText: '重新登录',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                store.dispatch('user/resetToken').then(() => {
                    location.reload()
                })
            })
        }
        // if the custom code is not 20000, it is judged as an error.
        // 测试服正常code为0
        /* if (res.code === 4000000) {
              // 在编辑或新增时，会出现权限不够的情况，此时系统判定为not error
              // if (res.msg === '权限不够') {
              //   Message({
              //     message: res.msg || 'Error',
              //     type: 'error',
              //     duration: 5 * 1000
              //   })
              //   return
              // } else
              // {
              Message({
                message: res.msg || 'Error',
                type: 'error',
                duration: 5 * 1000
              })
              return Promise.reject(new Error(res.message || 'Error'))
              // }
            } else { */
        return res
        // }
    },
    error => {
        if (!error.response) {
            return
        }
        // 对错误进行自定义
        const statusCode = error.response.code
        const res = error.response.data
        if (statusCode === 4003) {
            ElMessageBox .confirm('登录已失效', '确认', {
                confirmButtonText: '重新登录',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                store.dispatch('user/resetToken').then(() => {
                    location.reload()
                })
            })
        } else if (statusCode === 4000000) {
            ElMessage.error('账号或者密码错误')
        } else if (statusCode === 422) {
            const errDetail = Object.values(res.errors)
            Notification({
                title: '错误通知',
                dangerouslyUseHTMLString: true,
                duration: 0,
                message: `
          <div>${res.message}</div>
          <div>错误详情</div>
          <div>${errDetail}</div>
        `,
                type: 'error'
            })
        } else if (statusCode === 403) {
            Notification({
                title: '警告',
                dangerouslyUseHTMLString: true,
                duration: 0,
                message: `
        <div>${res.message}</div>
        `,
                type: 'warning'
            })
        }
    }
)

export default service
