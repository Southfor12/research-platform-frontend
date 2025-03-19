<template>
  <div>
    <div class="" style="text-align: center; line-height: 0.81">
      <div style="margin: 0 auto; width: 1200px; display: flex">
        <div style="width: 900px; max-height: 120px">
          <img :src="domain + headerImg" style="width: 900px; max-height: 120px" />
        </div>
        <div class="room-no">NO. {{ queryForm.id }}</div>
      </div>
      <div style="margin: 15px auto 0; width: 1200px">
        <el-row :gutter="15">
          <el-col class="edl-detail-col" :xs="8" :sm="8" :lg="8">
            <card-panel
              title="仪器数量"
              :endVal="statistics.total"
              iconClass="apparatus-total-icon"
            />
          </el-col>
          <el-col class="edl-detail-col" :xs="8" :sm="8" :lg="8">
            <card-panel title="运行数量" :endVal="statistics.running" iconClass="running-icon" />
          </el-col>
          <el-col class="edl-detail-col" :xs="8" :sm="8" :lg="8">
            <card-panel
              title="预约数量"
              :endVal="statistics.appointment"
              iconClass="appointment-icon"
            />
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col class="edl-detail-col" :xs="8" :sm="8" :lg="8">
            <el-table class="index-common-table" :data="runningDevices" border style="width: 100%">
              <el-table-column label="序号" type="index" width="50" />
              <el-table-column label="名称" prop="name" width="160" />
              <el-table-column label="状态">
                <template slot-scope="scope">
                  <span v-if="scope.row.is_working" class="is-working">正在运行</span>
                  <span v-else class="un-working">已停机</span>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col class="edl-detail-col" :xs="16" :sm="16" :lg="16">
            <el-table class="index-common-table" :data="booking" border style="width: 100%">
              <el-table-column label="序号" type="index" width="50" />
              <el-table-column label="名称" prop="name" width="160" />
              <el-table-column label="预约人" prop="user_name" />
              <el-table-column label="预约时间" prop="booking_time" />
            </el-table>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import { settingInfo } from '@/api/system';
import { apparatusList, roomOverview } from '@/api/apparatus';
import { getByRoomId } from '@/api/booking';
import CardPanel from '@/components/CardPanel';

export default {
  components: {
    CardPanel,
  },
  data() {
    return {
      runningDevices: [],
      booking: [],
      queryForm: {
        id: '',
      },
      statistics: {
        total: 0,
        running: 0,
        appointment: 0,
      },
      headerImg: '',
      domain: process.env.VUE_APP_DOMAIN,
    };
  },
  created() {
    this.queryForm.id = this.$route.params.id;
    settingInfo({
      type: 'logo_image',
    }).then((res) => {
      if (res.status === 200) {
        this.headerImg = res.data.value;
      }
    });
    this.queryApparatusList();
    this.queryStatistics();
    this.queryBookingList();
  },
  methods: {
    queryStatistics() {
      roomOverview(this.queryForm).then((res) => {
        if (res.status === 200) {
          this.statistics = res.data;
        }
      });
    },
    queryApparatusList() {
      apparatusList({
        page: 1,
        size: 10,
        sort: 'created_at',
        sort_type: 'desc',
        is_deleted: '0',
        platform_room_id: this.queryForm.id,
      }).then((res) => {
        if (res.status === 200) {
          this.runningDevices = res.data.data;
        }
      });
    },
    queryBookingList() {
      getByRoomId({
        page: 1,
        size: 10,
        id: this.queryForm.id,
      }).then((res) => {
        if (res.status === 200) {
          this.booking = res.data;
        }
      });
    },
  },
};
</script>
<style scoped>
.room-no {
  width: 300px;
  height: 113px;
  line-height: 113px;
  text-align: center;
  font-weight: bolder;
  font-size: 30px;
}

.is-working {
  padding: 5px;
  color: #efefef;
  background: #397919;
}

.un-working {
  padding: 5px;
  color: #efefef;
  background: #888888;
}
</style>
