<template>
  <div
    v-loading="loading"
    element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="审核状态">
        <el-select
          v-model="queryForm.status"
          :clearable="true"
          size="small"
          class="max-width-150"
          placeholder="审核状态"
        >
          <el-option label="待审核" value="0"></el-option>
          <el-option label="已通过" value="1"></el-option>
          <el-option label="未通过" value="2"></el-option>
          <el-option label="已取消" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button round size="small" @click="resetQuery">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :header-cell-style="{ background: '#fafafa' }" :data="list" style="width: 100%">
      <el-table-column type="index" :index="indexDdMethod" label="序号" width="50" />
      <el-table-column prop="user_name" label="预约人" />
      <el-table-column label="设备名称">
        <template slot-scope="scope">
          <a href="#" @click="navOpen('/appointment/detail/' + scope.row.apparatus_id)">{{
            scope.row.apparatus_name
          }}</a>
        </template>
      </el-table-column>
      <el-table-column prop="booking_time" label="预约时间段">
        <template slot-scope="scope">
          {{ scope.row.booking_time ? scope.row.booking_time : '' }}
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="提交时间">
        <template slot-scope="scope">
          {{ scope.row.created_at.split(' ')[0] }}
          <br />
          {{ scope.row.created_at.split(' ')[1] }}
        </template>
      </el-table-column>
      <el-table-column label="审核状态" width="150">
        <template slot-scope="scope">
          <div v-if="scope.row.hcses.length > 0 && scope.row.status !== 3">
            <div class="hcs-status">
              <el-tag type="info" v-if="scope.row.auditor_status === 0">设备管理员待审核</el-tag>
              <el-tag type="success" v-if="scope.row.auditor_status === 1">设备管理员已通过</el-tag>
              <el-tag type="danger" v-if="scope.row.auditor_status === 2">设备管理员未通过</el-tag>
            </div>
            <div class="hcs-status">
              <el-tag type="info" v-if="scope.row.admin1_status === 0">负责人1待审核</el-tag>
              <el-tag type="success" v-if="scope.row.admin1_status === 1">负责人1已通过</el-tag>
              <el-tag type="danger" v-if="scope.row.admin1_status === 2">负责人1未通过</el-tag>
            </div>
            <div class="hcs-status">
              <el-tag type="info" v-if="scope.row.admin2_status === 0">负责人2待审核</el-tag>
              <el-tag type="success" v-if="scope.row.admin2_status === 1">负责人2已通过</el-tag>
              <el-tag type="danger" v-if="scope.row.admin2_status === 2">负责人2未通过</el-tag>
            </div>
          </div>
          <div v-else>
            <el-tag type="info" v-if="scope.row.status === 0">待审核</el-tag>
            <el-tag type="success" v-if="scope.row.status === 1">已通过</el-tag>
            <el-tag type="danger" v-if="scope.row.status === 2">未通过</el-tag>
            <el-tag type="info" v-if="scope.row.status === 3">已取消</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="管理员">
        <template slot-scope="scope">
          <div v-if="scope.row.hcses.length > 0">
            <div class="hcs-status">
              {{ scope.row.apparatus_admin_name }}
            </div>
            <div class="hcs-status">
              {{ scope.row.admin1_name }}
            </div>
            <div class="hcs-status">
              {{ scope.row.admin2_name }}
            </div>
          </div>
          <div v-else>
            {{ scope.row.apparatus_admin_name }}
          </div>
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
import { bookingList } from '@/api/apparatus';
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
        from: 'frontend',
        status: '',
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
      bookingList(this.queryForm)
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
      const text = status === 1 ? '通过' : '拒绝';
      this.$confirm('确定要' + text + '预约吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        bookableUpdate({ id: row.id, status: status }).then((response) => {
          if (response.status === 1) {
            this.queryList();
          }
        });
      });
    },
    toAdd(id = '') {
      if (!id) {
        this.$router.push({ path: '/apparatus/add' });
      } else {
        this.$router.push({ path: '/apparatus/edit/' + id });
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
    indexDdMethod(index) {
      return index + (this.queryForm.page - 1) * this.queryForm.size + 1;
    },
  },
};
</script>
<style lang="scss" scoped>
.hcs-status {
  margin-bottom: 10px;
}
.hcs-status:last-child {
  margin-bottom: 0;
}
</style>
