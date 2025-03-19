<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="仪器">
        <el-select
          v-model="queryForm.id"
          :clearable="true"
          size="small"
          class="max-width-150"
          placeholder="仪器"
        >
          <el-option
            v-for="item in apparatusList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button round size="small" @click="resetQuery">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :header-cell-style="{ background: '#fafafa' }" :data="list" style="width: 100%">
      <el-table-column width="100px" type="index" :index="indexMethod" label="序号" />
      <el-table-column prop="name" label="仪器名称" />
      <el-table-column label="危化品名称">
        <template slot-scope="scope">
          <span v-for="(item, index) in scope.row.hcses" :key="index">
            {{ item.name }}{{ index === scope.row.hcses.length - 1 ? '' : '、' }}
          </span>
          <span v-if="scope.row.hcses.length === 0">-</span>
        </template>
      </el-table-column>
      <el-table-column prop="factory_id" label="单位">
        <template slot-scope="scope">
          {{getFactoryName(scope.row.factory_id)}}
        </template>
      </el-table-column>
      <el-table-column width="180" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="toAdd(scope.row.id)">修改</el-button>
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
import { frontApparatusList, deleteApparatusHcs } from '@/api/apparatus';
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
        id: '',
        name: '',
      },
      domain: process.env.VUE_APP_DOMAIN,
      list: [],
      apparatusList: [],
      total: 0,
    };
  },
  created() {
    this.queryList();
    this.queryApparatusList();
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
      this.$confirm('确定要删除该危化品吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deleteApparatusHcs({ id: row.id, is_deleted: status }).then((response) => {
          if (response.status === 1) {
            this.queryList();
          }
        });
      });
    },
    queryApparatusList() {
      frontApparatusList({
        page: 1,
        size: 100,
        is_deleted: 0,
        is_admin: 1,
      }).then((res) => {
        if (res.status === 200) {
          this.apparatusList = res.data.data;
        }
      });
    },
    toAdd(id = '') {
      if (!id) {
        this.$router.push({ path: '/personal/apparatus-hcs/add' });
      } else {
        this.$router.push({
          path: '/personal/apparatus-hcs/edit/' + id,
        });
      }
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
