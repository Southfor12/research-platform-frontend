<template>
  <div>
    <el-table :header-cell-style="{ background: '#fafafa' }" :data="appointments" style="width: 100%">
      <el-table-column prop="user_name" label="预约人" />
      <el-table-column label="预约时间">
        <template slot-scope="scope">
          <div v-html="scope.row.booking_time"></div>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="提交时间">
        <template slot-scope="scope">
          {{ getDate(scope.row.created_at) }}
        </template>
      </el-table-column>
      <el-table-column label="审核状态" width="150">
        <template slot-scope="scope">
          <div v-if="scope.row.hcses && scope.row.hcses.length > 0">
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
          </div>
        </template>
      </el-table-column>
      <el-table-column label="管理员">
        <template slot-scope="scope">
          <div v-if="scope.row.hcses && scope.row.hcses.length > 0">
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
    <el-pagination class="dl-pagination" :hide-on-single-page="true" background
      layout="total, prev, pager, next, jumper" :total="appointmentTotal" :current-page="queryAppointmentForm.page"
      :page-size="queryAppointmentForm.size" @current-change="handleAppointmentChange" />
  </div>
</template>

<script>
  import Empty from '@/components/Empty';
  import {
    bookingIndexFrontList
  } from '@/api/apparatus';

  export default {
    name: 'ApparatusUseRecord',
    components: {
      Empty,
    },
    props: {
      apparatusId: {
        required: true,
        type: Number,
      },
    },
    data() {
      return {
        appointments: [],
        appointmentTotal: 0,
        queryAppointmentForm: {
          page: 1,
          size: 10,
          sort: 'created_at',
          sort_type: 'desc',
          from: 'frontend',
          apparatus_id: 0,
        },
      };
    },
    created() {
      this.queryAppointmentForm.apparatus_id = this.apparatusId;
      this.queryBookingList();
    },
    methods: {
      queryBookingList() {
        bookingIndexFrontList(this.queryAppointmentForm).then((res) => {
          if (res.status === 200) {
            this.appointments = res.data.data;
            this.appointmentTotal = res.data.total;
          }
        });
      },
      handleAppointmentChange(val) {
        this.queryAppointmentForm.page = val;
        this.queryBookingList();
      },
    },
  };
</script>

<style></style>
