<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>任务详情</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="goBack">返回</el-button>
      </div>
      
      <el-descriptions :column="1" border>
        <el-descriptions-item label="任务名称">{{ taskInfo.name }}</el-descriptions-item>
        <el-descriptions-item label="任务描述">{{ taskInfo.description }}</el-descriptions-item>
        <el-descriptions-item label="优先级">{{ taskInfo.priority }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ taskInfo.createTime }}</el-descriptions-item>
        <el-descriptions-item label="状态">{{ taskInfo.status }}</el-descriptions-item>
      </el-descriptions>

      <div class="operation-container" style="margin-top: 20px;">
        <el-button type="primary" @click="handleEdit">编辑</el-button>
        <el-button type="danger" @click="handleDelete">删除</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'TaskDetail',
  data() {
    return {
      taskInfo: {
        name: '',
        description: '',
        priority: '',
        createTime: '',
        status: ''
      }
    }
  },
  created() {
    this.getTaskInfo()
  },
  methods: {
    getTaskInfo() {
      const id = this.$route.params.id
      // TODO: 调用API获取任务详情
    },
    handleEdit() {
      // TODO: 实现编辑功能
    },
    handleDelete() {
      this.$confirm('确认删除该任务吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // TODO: 调用API删除任务
        this.$message.success('删除成功')
        this.goBack()
      })
    },
    goBack() {
      this.$router.push('/admin/task/list')
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px;
}
.operation-container {
  text-align: center;
}
</style> 