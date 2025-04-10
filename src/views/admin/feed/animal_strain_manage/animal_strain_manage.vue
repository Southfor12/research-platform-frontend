<template>
    <div class="tabs-container">
        <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane label="品系管理" name="strain_manage">
         <index/>
        </el-tab-pane>
        <el-tab-pane label="品系类型" name="strain_type">
        </el-tab-pane>
        <el-tab-pane label="基因型" name="strain_genus">
        </el-tab-pane>
        
        
      </el-tabs>
    </div>
</template>

<script>
import index from './index.vue'
export default {
    components:{
        index,
    },
    data() {
        return {
            activeTab: 'strain_manage'
        }
    },
    methods: {
        handleTabClick(tab) {
            // 可以在这里处理标签页切换的逻辑
        }
    }
}
</script>

<style>

</style>