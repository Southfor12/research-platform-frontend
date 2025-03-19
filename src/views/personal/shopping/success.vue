<template>
  <div class="order-success">
    <el-card class="success-card">
      <div class="card-header">
        <i class="el-icon-success success-icon"></i>
        <h2 class="success-title">订单提交成功！</h2>
      </div>
      <p class="success-message">
        您的订单已经提交成功。 如果您所在的课题组需要审核，请联系课题组负责人进行审核。
      </p>
      <el-row class="actions">
        <el-button type="primary" @click="viewOrder">查看订单详情</el-button>
        <el-button @click="returnToShop">返回继续购物</el-button>
      </el-row>
      <el-row style="margin-top: 20px; text-align: center">
        <span style="font-size: 15px; cursor: pointer" @click="returnToShopping">返回购物车</span>
      </el-row>
    </el-card>
  </div>
</template>
      
      <script>
export default {
  name: 'OrderSuccess',
  methods: {
    // 查看订单详情
    viewOrder() {
      this.$router.push('/personal/shopping/order'); // 跳转到订单详情页
    },
    // 返回继续购物
    returnToShop() {
      this.$router.push('/buy-animal'); // 跳转到商店页面
    },
    returnToShopping() {
      this.$router.push('/personal/shopping/cart'); // 跳转到商店页面
    },
  },
};
</script>
      
      <style scoped>
.order-success {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f9f9f9;
}
.success-card {
  width: 500px;
  text-align: center;
  padding: 20px;
}
.card-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}
.success-icon {
  font-size: 48px;
  color: #67c23a;
}
.success-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-top: 10px;
}
.success-message {
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;
}
.actions {
  display: flex;
  justify-content: center;
  gap: 20px;
}
</style>
      