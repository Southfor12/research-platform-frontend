<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-card class="finance">
      <div slot="header" class="clearfix">
        <el-form :inline="true">
          <el-form-item label="课题组名称" style="margin-bottom: 0 !important">{{
            researchGroup.name
          }}</el-form-item>
          <el-form-item
            label="余额"
            style="float: right; margin-bottom: 0 !important; color: #ff0000"
            >{{ financeInfo.total }}元</el-form-item
          >
        </el-form>
      </div>
      <el-row :gutter="15" style="margin-top: 10px; margin-bottom: 20px">
        <el-col class="edl-detail-col bottom-10" :xs="12" :sm="12" :lg="6">
          累计充值金额：<el-link :underline="false" type="primary" @click="resetQuery(1)"
            >{{ typeAmount(1) }}元</el-link
          >
        </el-col>
        <el-col class="edl-detail-col bottom-10" :xs="12" :sm="12" :lg="6">
          预约使用金额：<el-link :underline="false" type="primary" @click="resetQuery(2)"
            >{{ typeAmount(2) }}元</el-link
          >
        </el-col>
        <el-col class="edl-detail-col bottom-10" :xs="12" :sm="12" :lg="6">
          入室使用金额：<el-link :underline="false" type="primary" @click="resetQuery(5)"
            >{{ typeAmount(5) }}元</el-link
          >
        </el-col>
        <el-col class="edl-detail-col bottom-10" :xs="12" :sm="12" :lg="6">
          危化品申领金额：<el-link :underline="false" type="primary" @click="resetQuery(7)"
            >{{ typeAmount(7) }}元</el-link
          >
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col class="edl-detail-col bottom-10" :xs="12" :sm="12" :lg="6">
          试剂申领金额：<el-link :underline="false" type="primary" @click="resetQuery(6)"
            >{{ typeAmount(6) }}元</el-link
          >
        </el-col>
        <el-col class="edl-detail-col bottom-10" :xs="12" :sm="12" :lg="6">
          报名培训金额：<el-link :underline="false" type="primary" @click="resetQuery(3)"
            >{{ typeAmount(3) }}元</el-link
          >
        </el-col>
        <el-col class="edl-detail-col bottom-10" :xs="12" :sm="12" :lg="6">
          申请培训金额：<el-link :underline="false" type="primary" @click="resetQuery(4)"
            >{{ typeAmount(4) }}元</el-link
          >
        </el-col>
      </el-row>
    </el-card>
    <!-- <el-form :inline="true">
            <el-form-item label="课题组名称">{{ researchGroup.name }}</el-form-item>
            <el-form-item label="总额" style="float: right;">{{ financeInfo.total }}元</el-form-item>
        </el-form>
        <el-form :inline="true" label-width="118px">
            <el-form-item label="充值金额"><el-link :underline="false" type="primary" @click="resetQuery(1)">{{ typeAmount(1) }}元</el-link></el-form-item>
            <el-form-item label="预约金额"><el-link :underline="false" type="primary" @click="resetQuery(2)">{{ typeAmount(2) }}元</el-link></el-form-item>
            <el-form-item label="入室金额"><el-link :underline="false" type="primary" @click="resetQuery(5)">{{ typeAmount(5) }}元</el-link></el-form-item>
        </el-form>
        <el-form :inline="true" label-width="118px">
            <el-form-item label="报名培训金额"><el-link :underline="false" type="primary" @click="resetQuery(3)">{{ typeAmount(3) }}元</el-link></el-form-item>
            <el-form-item label="申请培训金额"><el-link :underline="false" type="primary" @click="resetQuery(4)">{{ typeAmount(4) }}元</el-link></el-form-item>
        </el-form>
        <el-form :inline="true" label-width="118px">
            <el-form-item label="试剂申领金额"><el-link :underline="false" type="primary" @click="resetQuery(6)">{{ typeAmount(6) }}元</el-link></el-form-item>
            <el-form-item label="危化品申领金额"><el-link :underline="false" type="primary" @click="resetQuery(7)">{{ typeAmount(7) }}元</el-link></el-form-item>
        </el-form> -->
    <el-table
      :header-cell-style="{ background: '#fafafa' }"
      :data="list"
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column prop="no" label="订单号" />
      <!-- <el-table-column prop="research_group_account_name" label="课题组账号" />
            <el-table-column prop="research_group_name" label="课题组名称" /> -->
      <el-table-column prop="amount" label="金额" />
      <el-table-column prop="user_name" label="操作人" />
      <el-table-column prop="name" label="类型" />
      <el-table-column prop="created_at" label="操作时间" />
      <el-table-column prop="factory_id" label="单位">
        <template slot-scope="scope">
          {{getFactoryName(scope.row.factory_id)}}
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
      layout="total, prev, pager, next, jumper"
      :total="total"
      :current-page="queryForm.page"
      :page-size="queryForm.size"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import {
  frontResearchGroupList,
  deleteResearchGroup,
  researchGroupInfo,
  applyJoinResearchGroup,
} from '@/api/research';
import { financeStatistics } from '@/api/finance';
import { orderList } from '@/api/order';
import { findIndexByKeyValue } from '@/utils/index';
import { checkNode } from '@/utils/validate';
import { mapGetters } from 'vuex';
import Grade from '@/components/Grade';
import Empty from '@/components/Empty';

export default {
  components: {
    Empty,
    Grade,
  },
  computed: {
    ...mapGetters(['member']),
  },
  data() {
    return {
      loading: false,
      dialogScoreVisible: false,
      researchGroup: {},
      financeInfo: {},
      queryForm: {
        page: 1,
        size: 10,
        sort: 'created_at',
        sort_type: 'desc',
        id: '',
        type: '',
        search_type: 1,
        is_deleted: '0',
      },
      queryScoreForm: {
        user_id: '',
        group_id: '',
        group_name: '',
        user_name: '',
        platform_id: '',
      },
      list: [],
      total: 0,
    };
  },
  created() {
    if (this.$route.params.id) {
      this.getInfo();
    } else {
      this.returnToList();
    }
    // this.queryList()
  },
  methods: {
    getInfo() {
      researchGroupInfo({ id: this.$route.params.id }).then((response) => {
        if (response.status !== 200) {
          this.returnToList();
        } else {
          this.researchGroup = response.data;
          this.queryForm.id = this.researchGroup.id;
          financeStatistics({
            type: 1,
            id: this.researchGroup.id,
          }).then((res) => {
            if (res.status === 200) {
              this.financeInfo = res.data;
            }
          });
        }
      });
    },
    queryList() {
      this.loading = true;
      orderList(this.queryForm)
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
    resetQuery(type) {
      this.queryForm.type = type;
      this.queryForm.page = 1;
      this.queryList();
    },
    handleDelete(row, status) {
      const text = status === 0 ? '恢复' : '删除';
      this.$confirm('确定要' + text + '课题组"' + row.name + '"吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deleteResearchGroup({ id: row.id, is_deleted: status }).then((response) => {
          if (response.status === 1) {
            this.queryList();
          }
        });
      });
    },
    getType(type) {
      switch (type) {
        case 1:
          return '科研组室';
        case 2:
          return '课题组';
        case 3:
          return '科研个人账户';
      }
    },
    toJoin(id) {
      applyJoinResearchGroup({ research_group_id: id });
    },
    toAdd(id = '') {
      if (!id) {
        this.$router.push({ path: '/personal/research-group/add' });
      } else {
        this.$router.push({
          path: '/personal/research-group/edit/' + id,
        });
      }
    },
    toFinance(id) {
      this.$router.push({ path: '/personal/research-group/finance' });
    },
    toScoreList(row) {
      this.scoreList = [];
      this.queryScoreForm.group_id = row.id;
      this.queryScoreForm.group_name = row.name;
      this.queryScoreForm.platform_id = row.platform_id;
      this.dialogScoreVisible = true;
    },
    typeAmount(type) {
      if (!this.financeInfo.detail) return 0;
      var index = findIndexByKeyValue(this.financeInfo.detail, 'type', type);
      if (index > -1) {
        return this.financeInfo.detail[index].amount;
      }
      return 0;
    },
    handleSizeChange(val) {
      this.queryForm.size = val;
      this.queryList();
    },
    handleCurrentChange(val) {
      this.queryForm.page = val;
      this.queryList();
    },
    returnToList() {
      this.$router.push({ path: '/personal/research-group/finance-list' });
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
