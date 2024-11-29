<template>
  <div class="cropper-content">
    <div class="cropper-box">
      <div class="cropper">
        <vue-cropper
          ref="cropper"
          :img="option.img"
          :output-size="option.outputSize"
          :output-type="option.outputType"
          :info="option.info"
          :can-scale="option.canScale"
          :auto-crop="option.autoCrop"
          :auto-crop-width="option.autoCropWidth"
          :auto-crop-height="option.autoCropHeight"
          :fixed="option.fixed"
          :fixed-number="option.fixedNumber"
          :full="option.full"
          :fixed-box="option.fixedBox"
          :can-move="option.canMove"
          :can-move-box="option.canMoveBox"
          :original="option.original"
          :center-box="option.centerBox"
          :height="option.height"
          :info-true="option.infoTrue"
          :max-img-size="option.maxImgSize"
          :enlarge="option.enlarge"
          :mode="option.mode"
          @realTime="realTime"
          @imgLoad="imgLoad"
        />
      </div>
      <!--底部操作工具按钮-->
      <div class="footer-btn">
        <div class="scope-btn">
          <label class="btn" for="uploads">选择封面</label>
          <input
            id="uploads"
            type="file"
            style="position: absolute; clip: rect(0 0 0 0)"
            accept="image/png, image/jpeg, image/gif, image/jpg"
            @change="selectImg($event)"
          >
          <el-button
            size="mini"
            plain
            icon="el-icon-zoom-in"
            @click="changeScale(1)"
          >
            放大
          </el-button>
          <el-button
            size="mini"
            plain
            icon="el-icon-zoom-out"
            @click="changeScale(-1)"
          >
            缩小
          </el-button>
          <el-button size="mini" plain @click="rotateLeft">
            ↺ 左旋转
          </el-button>
          <el-button size="mini" plain @click="rotateRight">
            ↻ 右旋转
          </el-button>
        </div>
        <!-- <div class="upload-btn">
          <el-button size="mini" type="success" @click="uploadImg('blob')">
            上传封面 <i class="el-icon-upload" />
          </el-button>
        </div> -->
      </div>
    </div>
    <!--预览效果图-->
    <div style="margin-left: 20px">
      <div
        class="show-preview"
        :style="{
          width: '150px',
          height: '155px',
          overflow: 'hidden',
          margin: '5px',
        }"
      >
        <div :style="previews.div" class="preview1">
          <img :src="previews.url" :style="previews.img">
        </div>
        <!-- <div :style="previews.div" class="preview2">
          <img :src="previews.url" :style="previews.img" />
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { VueCropper } from 'vue-cropper'
import { updateUser } from '@/api/user'
import { mapActions } from 'vuex'
// import { pathToBase64, base64ToPath } from "image-tools";
import { base64ImgtoFile } from '@/utils'
import { handleAvatarSuccess } from '@/api/fileUpload'
export default {
  name: 'CropperImage',
  components: {
    VueCropper
  },
  // props: {
  //   Name: {
  //     type: String,
  //   },
  //   user: {
  //     type: Object,
  //     required: true,
  //   },
  // },
  data() {
    return {
      // userInfos: {},
      // name: this.Name,
      previews: {},
      option: {
        img: '', // 裁剪图片的地址
        outputSize: 1, // 裁剪生成图片的质量(可选0.1 - 1)
        outputType: 'jpeg', // 裁剪生成图片的格式（jpeg || png || webp）
        info: true, // 图片大小信息
        canScale: true, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 150, // 默认生成截图框宽度
        autoCropHeight: 150, // 默认生成截图框高度
        fixed: true, // 是否开启截图框宽高固定比例
        fixedNumber: [1, 1], // 截图框的宽高比例
        full: true, // false按原比例裁切图片，不失真
        fixedBox: true, // 固定截图框大小，不允许改变
        canMove: false, // 上传图片是否可以移动
        canMoveBox: true, // 截图框能否拖动
        original: true, // 上传图片按照原始比例渲染
        centerBox: true, // 截图框是否被限制在图片里面
        height: true, // 是否按照设备的dpr 输出等比例图片
        infoTrue: false, // true为展示真实输出图片宽高，false展示看到的截图框宽高
        maxImgSize: 2000, // 限制图片最大宽度和高度
        enlarge: 1, // 图片根据截图框输出比例倍数
        mode: '100px' // 图片默认渲染方式
      }
    }
  },
  created() {
    this.getInfo().then((res) => {
      this.userInfos = res
      console.log('res', this.userInfos)
    })
    // this.option.img = this.user.avatar;
  },
  methods: {
    ...mapActions('user', ['getInfo']),
    // 实时预览函数
    realTime(data) {
      this.previews = data
    },
    // 初始化函数
    imgLoad(msg) {
      console.log('工具初始化函数=====' + msg)
    },
    // 图片缩放
    changeScale(num) {
      num = num || 1
      this.$refs.cropper.changeScale(num)
    },
    // 向左旋转
    rotateLeft() {
      this.$refs.cropper.rotateLeft()
    },
    // 向右旋转
    rotateRight() {
      this.$refs.cropper.rotateRight()
    },

    // 选择图片
    selectImg(e) {
      const file = e.target.files[0]
      if (!/\.(jpg|jpeg|png|JPG|PNG)$/.test(e.target.value)) {
        this.$message({
          message: '图片类型要求：jpeg、jpg、png',
          type: 'error'
        })
        return false
      }
      // 转化为blob
      const reader = new FileReader()
      reader.onload = (e) => {
        let data
        if (typeof e.target.result === 'object') {
          data = window.URL.createObjectURL(new Blob([e.target.result]))
        } else {
          data = e.target.result
        }
        this.option.img = data
      }
      // 转化为base64
      reader.readAsDataURL(file)
    },
    // 上传图片
    async uploadImg(type) {
      if (type === 'blob') {
        // 获取截图的blob数据
        this.$refs.cropper.getCropData(async(data) => {
          const formData = new FormData()
          const user = this.userInfos
          // 调用axios上传
          const path = await base64ImgtoFile(data)
          console.log('上传到服务器', path)
          formData.append('file', path)
          formData.append('name', 'avatar')
          const res = await handleAvatarSuccess(formData)
          console.log(res)
          const fileUrl = res.data.url
          this.option.img = fileUrl
          await updateUser({
            avatar: res.data.url,
            s_role_id: user.sRoleId
          })
          this.$message.success('修改头像成功！')
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.cropper-content {
  display: flex;
  display: -webkit-flex;
  justify-content: flex-end;

  .cropper-box {
    flex: 1;
    width: 100%;

    .cropper {
      width: auto;
      height: 300px;
    }
  }

  .show-preview {
    flex: 1;
    -webkit-flex: 1;
    display: flex;
    flex-direction: column;
    display: -webkit-flex;
    justify-content: center;

    .preview1 {
      // width: 250px !important;
      // height: 250px !important;
      // overflow: hidden;
      width: 150px;
      height: 150px;
      border: 1px solid #67c23a;
      background: #cccccc;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .preview2 {
      margin-top: 15px;
      width: 100px;
      height: 100px;
      overflow: hidden;
      border: 1px solid #67c23a;
      background: #cccccc;
    }
  }
}

.footer-btn {
  margin-top: 10px;
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;

  .scope-btn {
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
    padding-right: 10px;
  }

  .upload-btn {
    flex: 1;
    -webkit-flex: 1;
    display: flex;
    display: -webkit-flex;
    justify-content: center;
  }

  .btn {
    outline: none;
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    -webkit-appearance: none;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: 0;
    -webkit-transition: 0.1s;
    transition: 0.1s;
    font-weight: 500;
    padding: 8px 15px;
    font-size: 12px;
    border-radius: 3px;
    color: #fff;
    background-color: #409eff;
    border-color: #409eff;
    margin-right: 10px;
  }
}
</style>
