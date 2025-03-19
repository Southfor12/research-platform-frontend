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
          v-model="queryForm.apparatus_id"
          :clearable="true"
          size="small"
          class="max-width-150"
          placeholder="查询仪器"
          filterable
        >
          <el-option
            :label="apparatus.name"
            :value="apparatus.id"
            v-for="(apparatus, apparatusIndex) in allApparatues"
            :key="apparatusIndex"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="仪器负责人">
        <el-select
          :filterable="true"
          v-model="queryForm.admin_id"
          :clearable="true"
          size="small"
          class="max-width-150"
          placeholder="仪器负责人"
        >
          <el-option
            v-for="(user, userIndex) in allUsers"
            :key="userIndex"
            :label="user.name"
            :value="user.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker
          v-model="queryForm.daterange"
          type="daterange"
          size="small"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
      <!-- <el-form-item>
        <el-switch
          v-model="queryForm.is_month"
          active-text="按月"
          inactive-text="按年">
        </el-switch>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-if="queryForm.is_month"
          v-model="queryForm.month"
          size="small"
          type="month"
          value-format="yyyy-MM"
          :picker-options="pickerOptions"
          placeholder="选择月">
        </el-date-picker>
        <el-date-picker
          v-else
          v-model="queryForm.year"
          size="small"
          type="year"
          value-format="yyyy"
          :picker-options="pickerOptions"
          placeholder="选择年">
        </el-date-picker>
      </el-form-item> -->
      <el-form-item label="单位">
        <el-select
          v-model="queryForm.factory_id"
          :clearable="false"
          size="small"
          class="max-width-150"
          placeholder="单位"
        >
          <el-option :label="factory.name" :value="factory.id" :key="idx" v-for="(factory,idx) in getSelectableFactories()"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button round size="small" @click="resetQuery">查询</el-button>
        <!-- <el-button round size="small" @click="exportData">导出</el-button> -->
      </el-form-item>
    </el-form>
    <el-table :header-cell-style="{ background: '#fafafa' }" :data="list" style="width: 100%">
      <el-table-column width="100px" type="index" :index="indexMethod" label="序号" />
      <el-table-column prop="no" label="编号" />
      <el-table-column label="图片">
        <template slot-scope="scope">
          <img :src="domain + scope.row.picture" style="height: 50px; vertical-align: middle" />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="admin" label="负责人" width="100" />
      <el-table-column prop="booking_count" label="累计预约次数" />
      <el-table-column prop="booking_time_desc" label="累计预约时长" />
      <el-table-column prop="factory_id" label="单位">
        <template slot-scope="scope">
          {{getFactoryName(scope.row.factory_id)}}
        </template>
      </el-table-column>
      <!-- <el-table-column fixed="right" v-if="checkNode('edit_apparatus') || checkNode('delete_apparatus_type')" width="180"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="checkNode('edit_apparatus')" size="mini" type="primary" @click="toAdd(scope.row.id)">修改</el-button>
          <el-button v-if="checkNode('delete_apparatus_type') && scope.row.is_deleted === 0" size="mini" type="danger"
            @click="handleDelete(scope.row, 1)">删除</el-button>
          <el-button v-if="checkNode('delete_apparatus_type') && scope.row.is_deleted === 1" size="mini" type="info"
            @click="handleDelete(scope.row, 0)">恢复</el-button>
        </template>
      </el-table-column> -->
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
import { apparatusUseList, deleteApparatus, apparatusAll } from '@/api/apparatus';
import { allApparatusAdmins } from '@/api/user.js';
import { checkNode } from '@/utils/validate';
import { objToQuery } from '@/utils/index';
import Empty from '@/components/Empty';

export default {
  components: {
    Empty,
  },
  data() {
    return {
      allUsers: [],
      allApparatues: [],
      loading: false,
      queryForm: {
        page: 1,
        size: 10,
        sort: 'booking_count',
        sort_type: 'desc',
        daterange: [],
        apparatus_id: '',
        admin_id: '',
        is_month: true,
        month: '',
        year: '',
        factory_id: '',
      },
      pickerOptions: {
        disabledDate(time) {
          let curDate = new Date().getTime();
          let three = 90 * 24 * 3600 * 1000;
          let threeMonths = curDate + three;
          return time.getTime() > threeMonths;
        },
      },
      domain: process.env.VUE_APP_DOMAIN,
      list: [],
      total: 0,
    };
  },
  created() {
    this.queryForm.factory_id = this.currentFactoryId;
    this.init();
  },
  methods: {
    init() {
      allApparatusAdmins().then((res) => {
        if (res.status == 200) {
          this.allUsers = res.data.users;
        }
      });
      apparatusAll().then((res) => {
        if (res.status == 200) {
          this.allApparatues = res.data.apparatuses;
          console.log(this.allApparatues);
        }
      });
      this.queryList();
    },
    queryList() {
      this.loading = true;
      apparatusUseList(this.queryForm)
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
    //导出数据为excel
    exportData() {
      window.open(
        process.env.VUE_APP_BASE_API + '/apparatus/export-use-list' + objToQuery(this.queryForm),
      );
    },
    handleDelete(row, status) {
      const text = status === 0 ? '恢复' : '删除';
      this.$confirm('确定要' + text + '"' + row.name + '"吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deleteApparatus({
          id: row.id,
          is_deleted: status,
        }).then((response) => {
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
