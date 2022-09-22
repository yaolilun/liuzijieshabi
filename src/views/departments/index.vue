<template>
  <div class="app-container">
    <el-card class="tree-card">
      <!-- 用了一个行列布局 显示公司信息 -->
      <TreeTools :node-data="companyInfo" :is-company="true" @showAddDialog="showAddDialog" />
      <hr>
      <!-- 这里我们传入一个数组, 树形组件进行遍历, 默认显示
      如果想要自定义, 需要作用域插槽, 看文档把element ui封装遍历好的数据取回来自己写模板 -->
      <el-tree
        :data="deptsList"
        default-expand-all
        :expand-on-click-node="false"
      >
        <!-- 插槽的作用是在使用子组件时, 传入模板, 显示在封装是不确定的结构 -->
        <template v-slot="scope">
          <!-- 这里是每一行会单独使用的模板,写一次, 但是数组中有多少个对象就会渲染多少次 -->
          <TreeTools
            :node-data="scope.data"
            :is-company="false"
            @showAddDialog="showAddDialog"
            @showEditDialog="showEditDialog"
            @reloadPage="loadPage"
          />
        </template>
      </el-tree>
    </el-card>
    <AddDept
      ref="addDeptForm"
      :show-dialog.sync="showDialog"
      :node-id="nodeId"
      @reloadPage="loadPage"
    />
  </div>
</template>

<script>
import TreeTools from './components/tree-tools.vue'
import AddDept from './components/add-dept.vue'
import { getDepartments, getDeptDetail } from '@/api/department'
export default {
  components: {
    TreeTools,
    AddDept
  },
  data() {
    return {
      companyInfo: {
        name: '传智博客',
        manager: '负责人'
      },
      // label 当前节点名字
      // children 下级节点的数组
      deptsList: [],
      // 控制弹窗显示
      showDialog: false,
      nodeId: ''
    }
  },
  created() {
    this.loadPage()
  },
  methods: {
    showAddDialog(id) {
      // 每当部门被点击, 都会有一个被点击的id往外传,
      // 我们需要找个地方存放, 传给弹窗
      this.nodeId = id
      this.showDialog = true
    },
    async showEditDialog(id) {
      // 谁被点击记录下来
      this.nodeId = id
      // 回显数据
      this.$refs.addDeptForm.formData = await getDeptDetail(this.nodeId)
      // 显示编辑弹窗
      this.showDialog = true
    },
    async loadPage() {
      const res = await getDepartments()
      console.log(res)
      // this.deptsList = res.depts
      this.deptsList = this.listToTreeData(res.depts, '')
    },
    // 基本逻辑是, 如果你给我一个总部门列表 list,
    // 你给我一个 id
    // 我可以遍历这个表, 哪些部门的 pid === id 就是属于当前的子部门
    listToTreeData(list, id) {
      const res = []
      list.forEach(el => {
        if (el.pid === id) {
          // 如果当前遍历部门的 pid 等于标准 id 就是找到了一个子部门
          // 这个子部门可能有自己下一级
          el.children = this.listToTreeData(list, el.id)
          res.push(el)
        }
      })
      return res
    }
  }
}
</script>

<style scoped>
.tree-card {
  padding: 30px  140px;
  font-size:14px;
}
</style>
