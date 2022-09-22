<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 放置页签 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="height: 60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="showDialog = true"
              >新增角色</el-button>
            </el-row>
            <!-- 表格 -->
            <el-table border="" :data="roleList">
              <el-table-column label="角色名称" prop="name" width="240" />
              <el-table-column label="描述" prop="description" />
              <el-table-column label="操作">
                <template v-slot="scope">
                  <!-- 这里scope是我们自己起的一个形参变量, 又来接收element子组件内部遍历后回传的各种数据 -->
                  <!-- 回传回来的字段则不由我们决定, 而是组件封装者声明, 这里 element 给出一个 row 是当前行的数据对象 -->

                  <el-button size="small" type="success" @click="assignPerm(scope.row.id)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="showEditDialog(scope.row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="delRole(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row
              type="flex"
              justify="center"
              align="middle"
              style="height: 60px"
            >
              <!-- 分页组件 -->
              <el-pagination
                layout="prev,pager,next"
                :page-size="pageSetting.pagesize"
                :total="total"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <el-form label-width="120px" style="margin-top: 50px">
              <el-form-item label="公司名称">
                <el-input v-model="companyInfo.name" disabled style="width: 400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="companyInfo.companyAddress" disabled style="width: 400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="companyInfo.mailbox" disabled style="width: 400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  v-model="companyInfo.remarks"
                  type="textarea"
                  :rows="3"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>

      <!-- 添加弹窗 -->
      <el-dialog :title="formData.id?'编辑角色':'新增角色'" :visible.sync="showDialog" @close="btnCancel">
        <el-form ref="addRoleForm" :model="formData" :rules="rules">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="formData.name" />
          </el-form-item>
          <el-form-item label="角色描述" prop="description">
            <el-input v-model="formData.description" />
          </el-form-item>
        </el-form>

        <template #footer>
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
          <el-button size="small" @click="btnCancel">取消</el-button>
        </template>
      </el-dialog>

      <!-- 编辑角色权限 -->
      <el-dialog title="编辑角色权限" :visible="showDialogPerm" @close="btnCancelPerm">
        <el-checkbox-group v-model="checkedPermList">
          <!-- 虽然我们要多选框组,但是不能再自己遍历生成多选框了, 而是应该用属性组件 -->
          <!-- <el-checkbox
            v-for="item in totalPermList"
            :key="item.id"
            :label="item.id"
          >
            {{ item.name }}
          </el-checkbox> -->
          <el-tree
            :data="totalPermList"
            default-expand-all
            :expand-on-click-node="false"
          >
            <template v-slot="scope">
              <el-checkbox
                :label="scope.data.id"
              >
                {{ scope.data.name }}
              </el-checkbox>
            </template>
          </el-tree>
        </el-checkbox-group>
        <template #footer>
          <el-button size="small" type="primary" @click="btnOKPerm">确定</el-button>
          <el-button size="small" @click="btnCancelPerm">取消</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getCompanyInfo, getRoleList, addRole, getRoleDetailById, editRole, delRole, assignPerm } from '@/api/setting'
import { getPermList } from '@/api/permission'
import { listToTreeData } from '@/utils'
export default {
  data() {
    return {
      // 编辑角色权限
      showDialogPerm: false,
      // 总权限对象数组
      totalPermList: [],
      // 当前已选中权限id数组
      checkedPermList: [],
      // 储存当前正在编辑的角色id
      roleId: '',

      companyInfo: {},
      roleList: [],
      pageSetting: {
        page: 1,
        pagesize: 3
      },
      total: 0,

      // 添加相关数据
      showDialog: false,
      formData: {
        name: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '该项不能为空', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '该项不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  async created() {
    // 获取公司信息
    this.companyInfo = await getCompanyInfo(this.$store.state.user.userInfo.companyId)

    this.loadRoleList()

    this.totalPermList = listToTreeData(await getPermList(), '0')
    console.log('角色页显示所有的权限列表', this.totalPermList)
  },
  methods: {
    async assignPerm(id) {
      const res = await getRoleDetailById(id)
      this.checkedPermList = res.permIds
      this.roleId = id
      this.showDialogPerm = true
    },
    async delRole(id) {
      try {
        // 二次询问
        await this.$confirm('确定删除吗')
        // 发请求
        await delRole(id)
        // 更新页面
        this.loadRoleList()
        // 提醒用户
        this.$message.success('删除成功')
      } catch (err) {
        console.log(err)
        this.$message.error('已取消删除')
      }
    },
    async showEditDialog(id) {
      console.log('正在编辑的角色是', id)
      // 每当点击按钮的时候, 都会带上点击的 id 触发函数
      // 获取数据进行回显
      this.formData = await getRoleDetailById(id)
      // 显示弹窗
      this.showDialog = true
    },
    async changePage(newPage) {
      this.pageSetting.page = newPage
      this.loadRoleList()
    },
    async loadRoleList() {
      // 获取角色列表
      const res = await getRoleList(this.pageSetting)
      console.log(res)
      this.roleList = res.rows
      this.total = res.total
    },
    async btnOK() {
      // 校验表单
      await this.$refs.addRoleForm.validate()
      // 发请求
      // 不一定新增 有可能编辑
      if (this.formData.id) {
        // 编辑
        await editRole(this.formData)
      } else {
        // 新增
        await addRole(this.formData)
      }
      // 提示用户
      this.$message.success('操作成功')
      // 关闭弹窗
      this.showDialog = false
      // 清空表单
      this.formData = {
        name: '',
        description: ''
      }
      // 更新数据
      this.loadRoleList()

      // 如果想要写成.then可以参考下面代码
      // this.$refs.addRoleForm.validate().then(() => {
      //   addRole(this.formData).then(() => {
      //     // 提示用户
      //     this.$message.success('操作成功')
      //     // 关闭弹窗
      //     this.showDialog = false
      //     // 清空表单
      //     this.formData = {
      //       name: '',
      //       description: ''
      //     }
      //     // 更新数据
      //     this.loadRoleList()
      //   })
      // })
    },
    btnCancel() {
      // 关闭弹窗
      this.showDialog = false
      // 清理数据, 移除校验结果(这个函数会将所有绑定的字段值重置为初始值)
      this.$refs.addRoleForm.resetFields()
      // 由于编辑可能会追加一些原来没有绑定的数据, 这个自动清理不行
      // 需要手动进行处理
      this.formData = {
        name: '',
        description: ''
      }
    },
    async btnOKPerm() {
      // 发请求
      await assignPerm({
        permIds: this.checkedPermList,
        id: this.roleId
      })
      // 提示用户
      this.$message.success('操作成功')
      // 关闭弹窗
      this.showDialogPerm = false
    },
    btnCancelPerm() {
      // 清理数据
      this.checkedPermList = []
      // 关闭弹窗
      this.showDialogPerm = false
    }
  }
}
</script>

<style>

</style>
