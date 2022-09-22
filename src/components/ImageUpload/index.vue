<template>
  <div>
    <!--
      必填
        action 指向上传地址, 我们没有给一个 #
        file-list 管理图片数据

      样式相关
        list-type 指定上传组件显示样式
        :class 动态类名, 根据图片竖向控制上传按钮

      钩子
        on-remove 每当删除的时候自动触发, 需要手动更新一下图片数组
        on-change 每当添加图片时触发的函数, 需要手动更新图片数组

      上传相关
        before-upload 上传前校验, 大小和文件类型
        http-request 替代真正上传, 可以自定义上传逻辑(后面要用来对象腾讯云)
     -->
    <el-upload
      action="#"
      :file-list="fileList"

      list-type="picture-card"
      :class="{disable: fileList.length>0}"

      :on-remove="onRemove"
      :on-change="onChange"

      :before-upload="beforeUpload"
      :http-request="httpRequest"
    >
      <i class="el-icon-plus" />
    </el-upload>
  </div>
</template>

<script>
// 引入腾讯云开发工具包
import COS from 'cos-js-sdk-v5'
// 用自己账号生成的 key+id 初始化实例
const cos = new COS({
  SecretId: 'AKIDWszA4lvCCNJA8Gsi5FBrKe9WdS5bP61k',
  SecretKey: 'mIXZMbaNhV3asxLQFrXx6ze9VZPKyKgm'
})
export default {
  data() {
    return {
      fileList: []
    }
  },
  methods: {
    onRemove(file, newFileList) {
      // 文件列表的修改时单项的, 如果想要同步更新数据
      // 需要手动复制
      this.fileList = newFileList
    },
    onChange(file, newFileList) {
      this.fileList = newFileList
    },
    beforeUpload(file) {
      console.log('上传前校验')
      console.log(file)
      // 大小校验
      const maxSize = 1 * 1024 * 1024
      if (file.size > maxSize) {
        this.$message.error('上传图片不能大于 1M ')
        return false
      }

      // 类型校验
      const whiteList = ['image/jpeg', 'image/png']
      if (whiteList.indexOf(file.type) === -1) {
        this.$message.error('目前只支持 jpeg / png 格式')
        return false
      }
    },
    httpRequest(params) {
      // 自定义上传函数
      console.log('开始上传')
      console.log('文件名', params.file.name)
      console.log('文件本体', params.file)

      // 上传直接复制示例代码, 对照要求填上数据即可
      cos.putObject({
        Bucket: 'hr76-1300310660', /* 填入您自己的存储桶，必须字段 */
        Region: 'ap-nanjing', /* 存储桶所在地域，例如ap-beijing，必须字段 */
        Key: params.file.name, /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
        StorageClass: 'STANDARD',
        Body: params.file, // 上传文件对象
        onProgress: function(progressData) {
          console.log(JSON.stringify(progressData))
        }
      }, (err, data) => {
        // 这个是一个异步请求, 不一定什么时候完毕
        // 而且完毕的时候element ui 又没有办法得到消息,
        // 需要手动进行改变
        console.log('上传完毕')
        console.log(err || data)
        if (!err) {
          // 每当腾讯云上传成功, 将element ui 绑定的数据状态和url改掉
          this.fileList[0].status = 'success'
          this.fileList[0].url = 'http://' + data.Location
        }
      })
    }
  }
}
</script>

<style lang="scss">
img {
  object-fit: cover;
}
.disable {
  .el-upload--picture-card {
    display: none;
  }
}
</style>
