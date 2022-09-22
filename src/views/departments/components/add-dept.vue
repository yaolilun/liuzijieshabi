<template>
  <!-- 新增部门的弹层 -->
  <el-dialog :destroy-on-close="true" title="新增部门" :visible="showDialog" @close="btnCancel">
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form ref="addForm" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="formData.manager" style="width:80%" placeholder="请选择">
          <el-option
            v-for="user in employeeList"
            :key="user.id"
            :value="user.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getEmployeeSimple } from '@/api/employee'
import { addDepartment, updateDept, getDepartments } from '@/api/department'

export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    nodeId: {
      type: String,
      default: ''
    }
  },
  data() {
    const checkCode = async(rule, value, callback) => {
      // 根据自己的逻辑判断对错
      // 如果对就 callback()
      // 错 callback(new Error('错误信息'))
      const { depts } = await getDepartments()
      let isRepeat

      if (this.formData.id) {
        // 编辑
        // 先将自己排除掉
        const newDept = depts.filter(el => el.id !== this.formData.id)
        // 看看剩下的有没有跟自己同名
        isRepeat = newDept.some(el => el.code === value)
      } else {
        // 新增
        isRepeat = depts.some(el => el.code === value)
      }

      if (isRepeat) {
        callback(new Error('code 全公司唯一'))
      } else {
        callback()
      }
    }
    const checkName = async(rule, value, callback) => {
      // 判断逻辑
      // 如果是code需要拿到全公司的部门, 现在名字的话, 还要在全公司数据中筛选出同一个父部门的数据
      const { depts } = await getDepartments()

      let isRepeat
      if (this.formData.id) {
        // 编辑
        // 编辑时用自己的 pid 筛选出同级兄弟部门做重名校验(不能把自己算上去)
        // 1. 找到所有跟自己同一级, 也就是pid跟自己相同的
        const arr1 = depts.filter(el => el.pid === this.formData.pid)
        // 2. 在列表中把自己排除在外
        const arr2 = arr1.filter(el => el.id !== this.formData.id)

        isRepeat = arr2.some(el => el.name === value)
      } else {
        // 新增
        // 新增是以被点击的 id 筛选出子部门做同名校验
        const newDept = depts.filter(el => el.pid === this.nodeId)
        // 同一父部门的数据筛选出来以后, 就看看, 有没有名字跟当前输入值相同
        isRepeat = newDept.some(el => el.name === value)
      }

      if (isRepeat) {
        callback(new Error('同一部门下不能重名'))
      } else {
        callback()
      }
    }
    return {
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      // 定义校验规则
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur' },
          { trigger: 'blur', validator: checkName }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' },
          { trigger: 'blur', validator: checkCode }
        ],
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { trigger: 'blur', min: 1, max: 300, message: '部门介绍要求1-50个字符' }]
      },
      employeeList: []
    }
  },
  async created() {
    this.employeeList = await getEmployeeSimple()
    console.log('员工简单列表', this.employeeList)
  },
  methods: {
    async btnOK() {
      // 表单验证
      await this.$refs.addForm.validate()
      // 发请求

      if (this.formData.id) {
        // 编辑
        await updateDept(this.formData)
      } else {
        // 新增
        this.formData.pid = this.nodeId
        await addDepartment(this.formData)
        // 新增流程也能写成下面的写法
        // await addDepartment({
        //   ...this.formData,
        //   pid: this.nodeId
        // })
      }
      // 提示用户
      this.$message.success('操作成功')
      // 清空数据
      this.formData = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      }
      // 更新页面
      this.$emit('reloadPage')
      // 关闭弹窗
      // this.showDialog = false
      // this.$emit('closeDialog')
      this.$emit('update:showDialog', false)
    },
    btnCancel() {
      // 清理报错
      this.$refs.addForm.resetFields()
      // 清理数据
      this.formData = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      }
      // 关闭弹窗
      this.$emit('update:showDialog', false)
    }
  }
}
</script>

<style>

</style>
