export default {
  methods: {
    checkPerm(name) {
      // 可以通过一个输入的按钮名, 判断是否可以执行操作
      // 在个人权限数据中取出 第二层权限 points
      // 如果传入的name存在于这个人的权限数据中, 就可以点击
      // 否则不可以
      const points = this.$store.state.user.userInfo.roles.points
      return points.indexOf(name) !== -1
    }
  }
}
