<template>
  <div class="page">
    <el-card>
      <el-row type="flex" justify="end">
        <el-button type="primary" size="small" @click="addPerm('0', 1)">添加权限</el-button>
      </el-row>

      <el-table :data="permList" border row-key="id" default-expand-all>
        <el-table-column label="菜单名称" prop="name" />
        <el-table-column label="权限标记" prop="code" />
        <el-table-column label="权限描述" prop="description" />
        <el-table-column label="操作按钮">
          <template v-slot="scope">
            <el-button v-if="scope.row.type === 1" type="text" @click="addPerm(scope.row.id, 2)">添加权限</el-button>
            <el-button type="text" @click="editPerm(scope.row.id)">修改权限</el-button>
            <el-button type="text" @click="delPerm(scope.row.id)">删除权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog :title="formData.id?'编辑':'新增'" :visible="showDialog" @close="btnCancel">
      <!-- 表单 -->
      <el-form ref="perForm" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="formData.description" style="width:90%" />
        </el-form-item>
        <el-form-item label="开启">
          <el-switch
            v-model="formData.enVisible"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
          <el-button size="small" @click="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getPermList, delPerm, getPermissionDetail, updatePermission, addPermission } from '@/api/permission'
import { listToTreeData } from '@/utils/index'
export default {
  data() {
    return {
      permList: [],
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        enVisible: '1', // 激活与否的选项, 在项目中并没有实际应用
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了, 被点击的那个就是父节点
        type: '' // 层级, 如果是顶级节点就是1, 如果是2级节点就是2, 对于我们现在的权限来说, 只有两级
      },
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      },
      showDialog: false
    }
  },
  created() {
    this.loadPage()
  },
  methods: {
    async loadPage() {
      // 因为权限也是分上下级关系
      // (重看员工页是第一级, 新增员工删除员工编辑员工则是第二级, 他们的关系之间是靠 pid 说明, 我们需要转换)
      const list = await getPermList()
      this.permList = listToTreeData(list, '0')
    },
    async btnOK() {
      // 校验表单
      this.$refs.perForm.validate()
      // 发送请求
      if (this.formData.id) {
        // 编辑
        await updatePermission(this.formData)
      } else {
        // 新增
        await addPermission(this.formData)
      }
      // 关闭弹窗
      this.showDialog = false
      // 提醒用户
      this.$message.success('操作成功')
      // 更新页面
      this.loadPage()
    },
    btnCancel() {
      // 清理数据
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        enVisible: '1', // 激活与否的选项, 在项目中并没有实际应用
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了, 被点击的那个就是父节点
        type: '' // 层级, 如果是顶级节点就是1, 如果是2级节点就是2, 对于我们现在的权限来说, 只有两级
      }
      // 清理报错
      this.$refs.perForm.resetFields()
      // 关闭弹窗
      this.showDialog = false
    },
    async delPerm(id) {
      // 二次询问
      await this.$confirm('是否确认删除')
      // 发送请求
      await delPerm(id)
      // 提示用户
      this.$message.success('删除成功')
      // 更新页面
      this.loadPage()
    },
    addPerm(id, type) {
      // 新增虽然不需要回显数据, 但是要根据点击的节点决定 pid
      this.formData.pid = id
      // 还有决定当前的层数(这个数据只是后端要求的而已)
      this.formData.type = type

      this.showDialog = true
    },
    async editPerm(id) {
      // 获取数据
      this.formData = await getPermissionDetail(id)
      // 打开弹窗
      this.showDialog = true
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  padding: 20px;
}
</style>
