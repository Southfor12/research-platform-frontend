<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="仪器名称">
        <el-input v-model="queryForm.name" class="max-width-150" size="small" clearable />
      </el-form-item>
      <el-form-item>
        <el-button round size="small" @click="resetQuery">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :header-cell-style="{ background: '#fafafa' }" :data="list" style="width: 100%">
      <el-table-column width="100px" type="index" :index="indexMethod" label="序号" />
      <!-- <el-table-column
            prop="no"
            label="编号"
        /> -->
      <!-- <el-table-column label="图片">
            <template slot-scope="scope">
                <img :src="domain + scope.row.picture" style="height: 50px; vertical-align: middle;" />
            </template>
        </el-table-column> -->
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="factory_id" label="单位">
        <template slot-scope="scope">
          {{getFactoryName(scope.row.factory_id)}}
        </template>
      </el-table-column>
      <el-table-column fixed="right" width="180" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="toAdd(scope.row.id)"
            >修改仪器考试规则</el-button
          >
        </template>
      </el-table-column>
      <div slot="empty">
        <empty />
      </div>
    </el-table>
    <el-pagination
      class="dl-pagination"
      :hide-on-single-page="true"
      background
      :page-sizes="[10, 30, 50]"
      layout="total, prev, pager, next, sizes, jumper"
      :total="total"
      :current-page="queryForm.page"
      :page-size="queryForm.size"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
import { frontApparatusList, deleteApparatus } from '@/api/apparatus';
import { checkNode } from '@/utils/validate';
import Empty from '@/components/Empty';

export default {
  components: {
    Empty,
  },
  data() {
    return {
      loading: false,
      queryForm: {
        page: 1,
        size: 10,
        sort: 'created_at',
        sort_type: 'desc',
        is_admin: 1,
        name: '',
      },
      domain: process.env.VUE_APP_DOMAIN,
      list: [],
      total: 0,
    };
  },
  created() {
    this.queryList();
  },
  methods: {
    queryList() {
      this.loading = true;
      frontApparatusList(this.queryForm)
        .then((res) => {
          this.loading = false;
          if (res.status === 200) {
            this.list = res.data.data;
            this.total = res.data.total;
          }
        })
        .catch((_) => {
          this.loading = false;
        });
    },
    resetQuery() {
      this.queryForm.page = 1;
      this.queryList();
    },
    handleDelete(row, status) {
      const text = status === 0 ? '恢复' : '删除';
      this.$confirm('确定要' + text + '"' + row.name + '"吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deleteApparatus({ id: row.id, is_deleted: status }).then((response) => {
          if (response.status === 1) {
            this.queryList();
          }
        });
      });
    },
    getImportance(importance) {
      switch (importance) {
        case 1:
          return '一般';
        case 2:
          return '特殊';
        case 3:
          return '贵重';
      }
    },
    getShareTypes(type) {
      var text = '';
      type = type.split(',');
      type.forEach((element) => {
        if (element == '1') {
          text += '自主测样';
        }
        if (element == '2') {
          text += '<br />送样检测';
        }
      });
      return text;
    },
    toAdd(id) {
      this.$router.push({
        path: '/personal/apparatus-exam-rule/edit/' + id,
      });
    },
    handleSizeChange(val) {
      this.queryForm.size = val;
      this.queryList();
    },
    handleCurrentChange(val) {
      this.queryForm.page = val;
      this.queryList();
    },
    indexMethod(index) {
      return index + (this.queryForm.page - 1) * this.queryForm.size + 1;
    },
    checkNode(node) {
      return checkNode(node);
    },
  },
};
</script>
