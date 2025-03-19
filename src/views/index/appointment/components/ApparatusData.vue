<template>
  <div>
    <el-table
      :header-cell-style="{ background: '#fafafa' }"
      :data="appointments"
      style="width: 100%"
    >
      <el-table-column prop="id" label="序号" />
      <el-table-column label="资料名称">
        <template slot-scope="scope">
          <div v-html="scope.row.name"></div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="startDownLoad(scope.row.id)"
            >下载</el-button
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
      layout="total, prev, pager, next, jumper"
      :total="appointmentTotal"
      :current-page="queryAppointmentForm.page"
      :page-size="queryAppointmentForm.size"
      @current-change="handleAppointmentChange"
    />
  </div>
</template>

<script>

import Empty from '@/components/Empty';
import { listApparatusData } from '@/api/apparatusdata';

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
      listApparatusData(this.queryAppointmentForm).then((res) => {
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
    startDownLoad(apparatusDataId)
    {
       window.open(process.env.VUE_APP_DOMAIN + "api/download-apparatus-data?id="+apparatusDataId)
    },
  },
};
</script>

<style></style>
