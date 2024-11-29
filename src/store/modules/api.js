// const baseUrl = 'http://192.168.0.228:3003'
// const baseUrl = 'http://172.25.14.149:22458'
// const baseUrl = 'http://192.168.0.67:3003'
// const baseUrl = 'http://81.71.71.63:7788'

let baseUrl = ''

if (process.env.NODE_ENV === 'development') {
    // baseUrl = 'http://192.168.0.83:3003'
    // baseUrl = 'http://192.168.0.18:22457'
    /** 测试服 */
    baseUrl = 'http://192.168.0.84:22457'
    // baseUrl = 'http://192.168.0.83:22457/manager/prod-api'
} else if (process.env.NODE_ENV === 'production') {
    // baseUrl = 'http://172.25.14.149:22457'
    // baseUrl = 'http://192.168.0.83:22457'
    // baseUrl = 'http://192.168.0.84:22457'
    // baseUrl = 'http://172.25.72.168:22457'
    baseUrl = 'http://172.25.73.23:22457'
} else {
    // BASE_URL = ''
}

// 获取路径不需加 /manager/prod-api
// 上传头像需加

const state = {
    baseUrl: baseUrl,
    fileUpload: baseUrl + '/sys/sysCtr/uploadPic'
}

export default { state, baseUrl }
