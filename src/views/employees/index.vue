<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <span slot="before">共166条记录</span>
        <template slot="after">
          <el-button size="small" type="warning" @click="$router.push('/employees/import')">导入</el-button>
          <el-button size="small" type="danger" @click="export2excel">导出</el-button>
          <el-button v-if="checkPerm('addEmployee')" size="small" type="primary" @click="showDialog = true">新增员工</el-button>
        </template>
      </page-tools>
      <!-- 放置表格和分页 -->
      <el-card>
        <el-table border :data="employeeList">
          <el-table-column label="序号" sortable="" type="index" />
          <el-table-column label="姓名" sortable="" prop="username" />
          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column label="聘用形式" sortable="" prop="formOfEmployment" :formatter="formatEmployee" />
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <!-- 入职时间我们希望用作用域插槽进行自定义, 并且用过滤器进行格式化 -->
          <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
            <template v-slot="scope">
              {{ scope.row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" sortable="" prop="enableState">
            <template v-slot="scope">
              <el-switch
                v-model="scope.row.enableState"
                :active-value="1"
                :inactive-value="2"
                disabled
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template v-slot="scope">
              <el-button type="text" size="small" @click="$router.push('/employees/detail/' + scope.row.id)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="showPerm(scope.row.id)">角色</el-button>
              <el-button type="text" size="small" @click="delEmployee(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination
            layout="prev, pager, next"
            :total="total"
            :page-size="pageSetting.size"
            @current-change="currentChange"
          />
        </el-row>
      </el-card>

      <AddEmployee :show-dialog="showDialog" />
      <AssignRole ref="assignRole" :show-dialog.sync="showDialogPerm" />
    </div>
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employee'
import EmployeeEnum from '@/constant/employees'
import { export_json_to_excel } from '@/utils/Export2Excel'
// js 当中没法用管道符号, 可以直接引入过滤器要用的函数即可
import { formatDate } from '@/filters'
import AddEmployee from './components/add-employee.vue'

import AssignRole from './components/assign-role.vue'
import { getUserDetailById } from '@/api/user'
export default {
  components: { AddEmployee, AssignRole },
  data() {
    return {
      total: 0,
      pageSetting: {
        page: 1,
        size: 5
      },
      employeeList: [],
      // 添加弹窗
      showDialog: false,
      showDialogPerm: false
    }
  },
  created() {
    this.loadPage()
  },
  methods: {
    // checkPerm(name) {
    //   // 可以通过一个输入的按钮名, 判断是否可以执行操作
    //   // 在个人权限数据中取出 第二层权限 points
    //   // 如果传入的name存在于这个人的权限数据中, 就可以点击
    //   // 否则不可以
    //   const points = this.$store.state.user.userInfo.roles.points
    //   return points.indexOf(name) !== -1
    // },
    async showPerm(id) {
      // 点击编辑角色的时候,弹窗前,先拿到当前被点击得人原始数据
      const res = await getUserDetailById(id)
      console.log('个人数据', res.roleIds)
      this.$refs.assignRole.checkedList = res.roleIds
      this.$refs.assignRole.userId = id
      this.showDialogPerm = true
    },
    async delEmployee(id) {
      // 二次询问
      await this.$confirm(this.$t('delConfirm'))
      // 发送请求
      await delEmployee(id)
      // 提示用户
      this.$message.success('删除完毕')
      // 更新页面
      this.loadPage()
    },
    async export2excel() {
      // 加载数据
      const res = await getEmployeeList({
        page: 1,
        size: this.total
      })
      console.log('源数据', res.rows)

      // 演示 excel 生成的方法
      // export_json_to_excel({
      //   header: ['姓名', '年龄', '性别'],
      //   data: [
      //     ['小红', 13, '女'],
      //     ['小明', 12, '男']
      //   ]
      // })
      const header = ['姓名', '手机号', '工号', '聘用形式', '入职时间']
      const data = res.rows.map(el => {
        const arr = []
        arr.push(el.username)
        arr.push(el.mobile)
        arr.push(el.workNumber)

        const obj = EmployeeEnum.hireType.find(item => Number(item.id) === Number(el.formOfEmployment))
        arr.push(obj ? obj.value : '')

        arr.push(formatDate(el.timeOfEntry))
        return arr
      })
      console.log('新数据', data)

      export_json_to_excel({
        header,
        data
      })
    },
    async loadPage() {
      const res = await getEmployeeList(this.pageSetting)
      console.log(res)
      this.employeeList = res.rows
      this.total = res.total
    },
    currentChange(newPage) {
      // 用户点击的页码设置到当前数据中
      this.pageSetting.page = newPage
      // 用这个数据发请求
      this.loadPage()
    },
    formatEmployee(row, col, cellValue) {
      // 这是绑在列上的格式化函数, 每一行渲染到这个格子, 不会马上显示数据而是调用这个函数
      // 由这个函数的返回值决定到底显示什么
      // if (cellValue === 1) {
      //   return '正式'
      // }
      // if (cellValue === 2) {
      //   return '非正式'
      // }
      let res = ''

      EmployeeEnum.hireType.forEach(element => {
        // if (element.id === cellValue) {
        if (Number(element.id) === Number(cellValue)) {
          res = element.value
        }
      })

      return res

      // 也可以写成下面的样子
      // const resObj = EmployeeEnum.hireType.find(el => el.id === cellValue) || {}
      // return resObj.value
    }
  }
}
</script>

<style>

</style>
