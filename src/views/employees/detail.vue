<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">

            <!-- 放置表单 -->
            <el-form label-width="120px" style="margin-left: 120px; margin-top:30px">
              <el-form-item label="姓名:">
                <el-input v-model="formData.username" style="width:300px" />
              </el-form-item>
              <el-form-item label="密码:">
                <el-input v-model="formData.newPassword" style="width:300px" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submit">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <UserInfo />
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <JobInfo />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserDetailById } from '@/api/user'
import { saveUserDetailById } from '@/api/employee'

import UserInfo from './components/user-info.vue'
import JobInfo from './components/job-info.vue'
export default {
  components: {
    UserInfo,
    JobInfo
  },
  data() {
    return {
      userId: this.$route.params.id,
      formData: {}
    }
  },
  async created() {
    // 我们进入页面就获取用户的基本数据进行回显
    // 但是里面的密码是用不了的
    const res = await getUserDetailById(this.userId)
    this.formData = {
      ...res,
      newPassword: ''
    }
    console.log(this.formData)
  },
  methods: {
    async submit() {
      await saveUserDetailById({
        ...this.formData,
        password: this.formData.newPassword || this.formData.password
      })
      this.$message.success('修改成功')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
