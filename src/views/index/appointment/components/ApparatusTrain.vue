<template>
  <div>
    <el-card class="search-box">
      <div slot="header" class="search-box-header">
        <span>培训公告</span>
      </div>
      <el-table :data="trains" border style="width: 100%">
        <el-table-column prop="name" label="名称">
          <template slot-scope="scope">
            <a
              v-if="scope.row.permanent === 0"
              href="#"
              @click="navOpen('/instrument-training/detail/' + scope.row.id)"
              >{{ scope.row.name }}</a
            >
            <a
              v-if="scope.row.permanent === 1"
              href="#"
              @click="navOpen('/apply-training/detail/' + scope.row.id)"
              >{{ scope.row.name }}</a
            >
          </template>
        </el-table-column>
        <el-table-column label="培训形式">
          <template slot-scope="scope">
            <span v-if="scope.row.permanent === 1">申请培训</span>
            <span v-else>集中培训</span>
          </template>
        </el-table-column>
        <el-table-column label="培训时间" width="180">
          <template slot-scope="scope">
            <span v-if="scope.row.permanent === 0">
              {{ scope.row.start_time }} 至 <br />
              {{ scope.row.end_time }}
            </span>
            <span v-else>长期</span>
          </template>
        </el-table-column>
        <el-table-column prop="platform_name" label="子平台/实验室" />
        <el-table-column prop="leader_name" label="负责人" />
        <el-table-column label="发布时间" width="180">
          <template slot-scope="scope">{{ getDate(scope.row.created_at) }}</template>
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
        :total="trainTotal"
        :current-page="trainForm.page"
        :page-size="trainForm.size"
        @current-change="handleTrainChange"
      />
    </el-card>
    <el-card class="search-box">
      <div slot="header" class="search-box-header">
        <span>报名记录</span>
      </div>
      <el-table
        :header-cell-style="{ background: '#fafafa' }"
        :data="trainEnrolls"
        style="width: 100%"
      >
        <el-table-column label="培训名称">
          <template slot-scope="scope">
            <a
              v-if="scope.row.config"
              href="#"
              @click="navOpen('/apply-training/detail/' + scope.row.train_id)"
              >{{ scope.row.train_name }}</a
            >
            <a
              v-else
              href="#"
              @click="navOpen('/instrument-training/detail/' + scope.row.train_id)"
              >{{ scope.row.train_name }}</a
            >
          </template>
        </el-table-column>
        <el-table-column prop="user_name" label="姓名" />
        <el-table-column label="培训形式">
          <template slot-scope="scope">
            <span v-if="scope.row.config">申请培训</span>
            <span v-else>集中培训</span>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.is_passed === 0">已申请</el-tag>
            <el-tag v-if="scope.row.is_passed === 1" type="success">已通过</el-tag>
            <el-tag v-if="scope.row.is_passed === -1" type="danger">未通过</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="报名时间" width="180" />
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
        :total="trainEnrollTotal"
        :current-page="trainEnrollForm.page"
        :page-size="trainEnrollForm.size"
        @current-change="handleTrainEnrollChange"
      />
    </el-card>
  </div>
</template>

<script>
import { trainList, trainEnrollList } from '@/api/train';
import Empty from '@/components/Empty';

export default {
  name: 'ApparatusTrain',
  props: {
    apparatusId: {
      required: true,
      type: Number,
    },
  },
  components: {
    Empty,
  },
  data() {
    return {
      trains: [],
      trainTotal: 0,
      trainForm: {
        page: 1,
        size: 10,
        sort: 'created_at',
        sort_type: 'desc',
        is_published: 1,
        apparatus_ids: 0,
      },

      trainEnrolls: [],
      trainEnrollTotal: 0,
      trainEnrollForm: {
        page: 1,
        size: 10,
        sort: 'created_at',
        sort_type: 'desc',
        is_deleted: 0,
        apparatus_id: 0,
      },
    };
  },
  created() {
    this.trainForm.apparatus_ids = this.apparatusId;
    this.trainEnrollForm.apparatus_id = this.apparatusId;
    this.queryTrainEnrollList();
    this.queryTrainList();
  },
  methods: {
    queryTrainList() {
      trainList(this.trainForm).then((res) => {
        if (res.status === 200) {
          this.trains = res.data.data;
          this.trainTotal = res.data.total;
        }
      });
    },
    queryTrainEnrollList() {
      trainEnrollList(this.trainEnrollForm).then((res) => {
        if (res.status === 200) {
          this.trainEnrolls = res.data.data;
          this.trainEnrollTotal = res.data.total;
        }
      });
    },
    handleTrainChange(val) {
      this.trainForm.page = val;
      this.queryTrainList();
    },
    handleTrainEnrollChange(val) {
      this.trainEnrollForm.page = val;
      this.queryTrainEnrollList();
    },
  },
};
</script>

<style></style>
