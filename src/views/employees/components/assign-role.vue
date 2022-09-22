<template>
  <el-dialog title="设置员工角色" :visible="showDialog" @close="btnCancel">
    <!-- 外层容器 -->
    <el-checkbox-group v-model="checkedList">
      <!-- 遍历选择框 -->
      <el-checkbox
        v-for="item in totalRoleList"
        :key="item.id"
        :label="item.id"
      >
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <el-row type="flex" justify="end">
      <el-button size="small" type="primary" @click="btnOK">确定</el-button>
      <el-button size="small" @click="btnCancel">取消</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
// 获取所有角色的接口
import { getRoleList } from '@/api/setting'
import { assignRole } from '@/api/employee'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      userId: '',
      checkedList: [],
      totalRoleList: []
    }
  },
  async created() {
    const res = await getRoleList()
    this.totalRoleList = res.rows
  },
  methods: {
    async btnOK() {
      // 发请求
      await assignRole({
        id: this.userId,
        roleIds: this.checkedList
      })
      // 提示用户
      this.$message.success('修改成功')
      // 关闭弹窗
      this.$emit('update:showDialog', false)
    },
    btnCancel() {
      // 清理数据
      this.checkedList = []
      // 关闭弹窗
      this.$emit('update:showDialog', false)
    }
  }
}
</script>

<style>

</style>
