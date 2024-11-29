import request from '@/utils/request'

// 上传图片
export function handleAvatarSuccess(data) {
  return request({
    // url: '/sys/sysCtr/uploadPic',
    url: '/user/userCtr/updatePicture',
    method: 'post',
    data
  })
}
