<template>
    <div class="tabs-container">
        <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane label="饲养笼盒管理" name="feed_case">
            <feed_case/>
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
      </el-tabs>
    </div>
</template>

<script>
import animal_type from './setting_application/animal_type'
import animal_disease_type from './setting_application/animal_disease_type'
import animal_die_reason from './setting_application/animal_die_reason'
import animal_cure from './setting_application/animal_cure.vue' 
import animal_status from './setting_application/animal_status.vue'
import feed_case from './setting_application/feed_case.vue'

export default {
    components: {
      animal_type,
      animal_disease_type,
      animal_die_reason,
      animal_cure,
      animal_status,
      feed_case
    },
    data() {
    return {
      activeTab: 'feed_case'
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