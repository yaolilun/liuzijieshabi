<template>
  <div>
    <!-- 年份选择框 -->
    <el-select v-model="currentYear" @change="dateChange">
      <el-option
        v-for="item in yearList"
        :key="item"
        :value="item"
        :label="item+'年'"
      />
    </el-select>
    <!-- 月份选择框 -->
    <el-select v-model="currentMonth" @change="dateChange">
      <el-option
        v-for="item in 12"
        :key="item"
        :label="item + '月'"
        :value="item"
      />
    </el-select>
    <!-- 日历 -->
    <el-calendar v-model="currentDate">
      <template #dateCell="scope">
        <!-- {{ scope.date }} 日期对象 -->
        <!-- {{ scope.data.day }} 格式化后的年月日 -->
        <div class="date-content">
          <span class="text"> {{ scope.data.day | getDay }}</span>
          <span v-if="isWeek(scope.date)" class="rest">休</span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  filters: {
    getDay(oldVal) {
      return oldVal.split('-')[2]
    }
  },
  data() {
    const currentDate = new Date()
    // 因为getMonth从0开始算, 所有月份要加一
    const currentMonth = currentDate.getMonth() + 1
    const currentYear = currentDate.getFullYear()
    const yearList = []
    for (let i = 0; i < 11; i++) {
      // 以当前的年份为中心, 向前五年向后五年
      yearList.push(currentYear - 5 + i)
    }
    return {
      currentDate,
      currentMonth,
      currentYear,
      yearList
    }
  },
  methods: {
    dateChange() {
      console.log('日期发生了变化')
      // 拼接日期字符串
      const str = this.currentYear + '/' + this.currentMonth
      console.log('新日期字符串为', str)
      // 填入日历 v-model 双向绑定的数据当中, 自动回更新日历渲染
      this.currentDate = new Date(str)
    },
    isWeek(date) {
      return date.getDay() === 0 || date.getDay() === 6
    }
  }
}
</script>

<style lang="scss"  scoped>
 ::v-deep .el-calendar-day {
  height:  auto;
 }
 ::v-deep .el-calendar-table__row td,::v-deep .el-calendar-table tr td:first-child,  ::v-deep .el-calendar-table__row td.prev{
  border:none;
 }
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text{
  width: 20px;
  height: 20px;
  line-height: 20px;
 display: inline-block;

}
 ::v-deep .el-calendar-table td.is-selected .text{
   background: #409eff;
   color: #fff;
   border-radius: 50%;
 }
 ::v-deep .el-calendar__header {
   display: none
 }
</style>
