<template>
  <div>
    <!-- 这个组件的使用方法, 往里传一个 on-success 即可 -->
    <UploadExcel :on-success="onSuccess" />
  </div>
</template>

<script>
import { importEmployee } from '@/api/employee'
export default {
  methods: {
    async onSuccess(res) {
      console.log('onSuccess', res.results)

      // 组件获取到的数据结构如下
      // res.results = [
      //   {姓名: '高大山', 手机号: 13224433333, 工号: 10001},
      //   {姓名: '高大山', 手机号: 13224433333, 工号: 10001},
      //   {姓名: '高大山', 手机号: 13224433333, 工号: 10001},
      // ]

      // 后端接口要求批量导入员工时, 用数组套员工数据对象
      // data = [
      //   {username: '高大山', mobile: 13224433333, workNumber: 10001},
      //   {username: '高大山', mobile: 13224433333, workNumber: 10001},
      //   {username: '高大山', mobile: 13224433333, workNumber: 10001},
      // ]

      const newData = res.results.map(user => {
        const newUser = {}
        newUser.username = user['姓名']
        newUser.workNumber = user['工号']
        newUser.mobile = user['手机号']

        newUser.timeOfEntry = new Date(this.formatExcelTime(user['入职日期']))
        newUser.correction = new Date(this.formatExcelTime(user['转正日期']))
        return newUser
      })

      console.log(newData)

      await importEmployee(newData)
      this.$message.success('导入成功')
      this.$router.back()
    },
    // 线上拿到的将 excel 读取的日期转成字符串的方式(注意使用时外部还要包  new Date 才能转成日期对象)
    formatExcelTime(num, format = '-') {
      num = Number(num)	// 强制类型转化，以防传来的值是字符串
      let millisecond = 0	// 转化后的毫秒数
      if (num > 60) {
        millisecond = (num - 25569) * 60 * 60 * 24 * 1000
      } else {
        millisecond = (num - 25568) * 60 * 60 * 24 * 1000
      }
      const date = new Date(millisecond)	// 根据转化后的毫秒数获取对应的时间
      const yy = date.getFullYear()
      const mm = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      const dd = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      return yy + format + mm + format + dd	// 返回格式化后的日期
    }
  }
}
</script>

<style>

</style>
