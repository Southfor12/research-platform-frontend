<template>
    <div class="tabs-container">
        <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane label="基础设置" name="basicsetting">
            <div>这里是基础设置</div>
        </el-tab-pane>
        <el-tab-pane label="饲养笼盒管理" name="feed_case">
            <div>这里是饲养笼盒管理</div>
        </el-tab-pane>
        <el-tab-pane label="动物类型管理" name="animal_type">
            <animal_type/>
        </el-tab-pane>
        <el-tab-pane label="疾病类型" name="animal_disease_type">
          <animal_disease_type/>
        </el-tab-pane>
        <el-tab-pane label="处死原因管理" name="animal_die_reason">
          <animal_die_reason/>
        </el-tab-pane>
        <el-tab-pane label="动物治疗方案" name="animal_cure">
          <animal_cure/>
        </el-tab-pane>
        <el-tab-pane label="动物状态管理" name="animal_kind">
          <animal_status/>
        </el-tab-pane>
        <el-tab-pane label="笼卡颜色管理" name="cage_color">
          <div>这是笼卡颜色管理的内容。</div>
        </el-tab-pane>
        <el-tab-pane label="动物毛色管理" name="animal_pur_color">
          <div>这是动物毛色管理的内容。</div>
        </el-tab-pane>
        <el-tab-pane label="动物状态管理" name="animal_status">
          <div>这是动物状态管理的内容。</div>
        </el-tab-pane>
        <el-tab-pane label="笼架显示管理" name="animal_cage_management">
          <div>这是笼架显示管理管理的内容。</div>
        </el-tab-pane>
        
      </el-tabs>
    </div>
</template>

<script>
import animal_type from './setting_application/animal_type'
import animal_disease_type from './setting_application/animal_disease_type'
import animal_die_reason from './setting_application/animal_die_reason'
import animal_cure from './setting_application/animal_cure.vue' 
import animal_status from './setting_application/animal_status.vue'
export default {

    components: {
      animal_type,
      animal_disease_type,
      animal_die_reason,
      animal_cure,
      animal_status
    },
    data() {
    return {
      activeTab: 'basicsetting'
    }
  },
  methods: {
    handleTabClick(tab) {
      console.log(tab.name);
    }
  }
}
</script>






















<style scoped>
.tabs-container {
  padding: 20px;
}
</style>