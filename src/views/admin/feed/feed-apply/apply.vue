<!-- 这个是饲养繁育的饲养申请模块 -->
<template>
    <div class="tabs-container">
      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane label="饲养订单" name="order">
          <Feed_order />
        </el-tab-pane>
        <el-tab-pane label="笼位预约" name="reservation">
          <Rack_order />
        </el-tab-pane>
        <el-tab-pane label="动物接受" name="acceptance">
          <Ani_accept />
        </el-tab-pane>
        <!-- <el-tab-pane label="转出申请" name="transfer">
          <div>这是转出申请的内容。</div>
        </el-tab-pane> -->
      </el-tabs>
    </div>
  </template>
  
  <script>
  import Feed_order from './feed_order.vue';
  import Rack_order from './rack_order.vue';
  import Ani_accept from './ani_accept.vue';
  
  export default {
    components: {
      Feed_order,
      Rack_order,
      Ani_accept
    },
    data() {
      return {
        activeTab: 'order', // 默认选中的 tab
      };
    },
    methods: {
      handleTabClick(tab) {
        console.log(`当前选中的tab是: ${tab.label}`);
      }
    }
  };
  </script>
  
  <style scoped>
  .tabs-container {
    padding: 20px;
  }
  </style>
  