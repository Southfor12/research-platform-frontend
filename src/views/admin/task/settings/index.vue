<template>
  <div class="app-container">
    <el-card class="box-card">
      <div class="developing-container">
        <i class="el-icon-time"></i>
        <h3>该模块正在开发中</h3>
        <p>敬请期待...</p>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Settings'
}
</script>

<style lang="scss" scoped>
.box-card {
  margin: 20px;
}

.developing-container {
  text-align: center;
  padding: 50px 0;
  
  i {
    font-size: 48px;
    color: #909399;
    margin-bottom: 20px;
  }
  
  h3 {
    color: #606266;
    margin-bottom: 10px;
  }
  
  p {
    color: #909399;
  }
}
</style> 