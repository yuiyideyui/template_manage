import request from '@/utils/request'
 

// 获取评分周期接口
export function findPeriodCtrList(data){
    return request({
        url:"/party/periodCtr/list",
        method:'post',
        data
    })
}

export function searchUserDataList(data){
    return request({
        url:"/party/sourceDataCtr/list",
        method:"post",
        data
    })
}

