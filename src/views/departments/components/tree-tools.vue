<template>
  <el-row type="flex" justify="space-between" align="middle" style="height: 40px; width: 100%">
    <el-col>
      <strong v-if="isCompany">{{ nodeData.name }}</strong>
      <span v-else>{{ nodeData.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <!-- 两个内容 -->
        <el-col>{{ nodeData.manager }}</el-col>
        <el-col>
          <!-- 下拉菜单 element -->
          <el-dropdown>
            <span>
              操作<i class="el-icon-arrow-down" />
            </span>
            <!-- 下拉菜单 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="addDept">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isCompany" @click.native="editDept">查看部门</el-dropdown-item>
              <el-dropdown-item v-if="!isCompany" @click.native="delDept">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>

  </el-row>
</template>

<script>
import { delDept } from '@/api/department'
export default {
  props: {
    nodeData: {
      type: Object,
      required: true
    },
    isCompany: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    addDept() {
      console.log('点击了新增')
      this.$emit('showAddDialog', this.nodeData.id)
    },
    editDept() {
      this.$emit('showEditDialog', this.nodeData.id)
    },
    async delDept() {
      // 二次询问
      await this.$confirm('是否确认删除')
      // 发请求
      await delDept(this.nodeData.id)
      // 更新页面
      this.$emit('reloadPage')
      // 提醒用户
      this.$message.success('删除成功')
    }
  }
}
</script>

<style>

</style>
