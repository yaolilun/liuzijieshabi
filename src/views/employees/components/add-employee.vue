<template>
  <el-dialog title="新增员工" :visible="showDialog" @close="btnCancel">
    <!-- 表单 -->
    <el-form ref="addForm" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width:90%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width:90%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width:90%" placeholder="请选择入职时间" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width:90%" placeholder="请选择">
          <el-option
            v-for="item in EmployeeEnum.hireType"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width:90%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input :value="formData.departmentName" style="width:90%" placeholder="请选择部门" @focus="showTree = true" />
        <el-tree
          v-if="showTree"
          :data="depts"
          :props="{label: 'name'}"
          default-expand-all
          :expand-on-click-node="false"
          @node-click="nodeClick"
        />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width:90%" placeholder="请选择转正时间" />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import EmployeeEnum from '@/constant/employees'
// 获取部门接口
import { getDepartments } from '@/api/department'
// 转换树形函数
import { listToTreeData } from '@/utils/index'
import { addEmployee } from '@/api/employee'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showTree: false,
      EmployeeEnum,
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      rules: {
        username: [{ required: true, message: '用户姓名不能为空', trigger: 'blur' }, {
          min: 1, max: 4, message: '用户姓名为1-4位'
        }],
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' }, {
          pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur'
        }],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'blur' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }],
        timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }]
      },
      depts: []
    }
  },
  async created() {
    const res = await getDepartments()
    this.depts = listToTreeData(res.depts, '')
    console.log(this.depts)
  },
  methods: {
    nodeClick(data) {
      console.log(data)
      // 点击的部门对象名字赋值给输入框绑定的表单项
      this.formData.departmentName = data.name
      // 树形关掉
      this.showTree = false
    },
    async btnOK() {
      // 校验表单
      await this.$refs.addForm.validate()
      // 发送请求
      await addEmployee(this.formData)
      // 提示用户
      this.$message.success('操作成功')
      // 更新页面
      this.$parent.loadPage()
      // 关闭弹窗
      this.$parent.showDialog = false
    },
    btnCancel() {
      // 清理数据
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      // 清理报错
      this.$refs.addForm.resetFields()
      // 关闭弹窗
      this.$parent.showDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
.el-tree {
  position: absolute;
  z-index: 9;
  border: 1px solid #ccc;
  width: 90%;
  height: 200px;
  overflow: auto;
}
</style>
