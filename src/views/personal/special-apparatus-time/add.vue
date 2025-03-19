<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据处理中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="仪器" prop="apparatus_id">
        <el-select
          v-if="!form.apparatus_name"
          v-model="form.apparatus_id"
          size="small"
          clearable
          class="max-width-300"
          filterable
          remote
          reserve-keyword
          :remote-method="getApparatus"
          placeholder="输入名称搜索选择"
        >
          <el-option v-for="item in apparatus" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <span v-else>{{ form.apparatus_name }}</span>
      </el-form-item>
      <el-form-item label="日期" prop="date_arr">
        <el-date-picker
          v-model="form.date_arr"
          size="small"
          type="daterange"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="是否可约">
        <el-switch v-model="canBooking" active-text="是" inactive-text="否"> </el-switch>
      </el-form-item>
      <el-form-item v-if="canBooking" label="时间段">
        <full-calendar
          id="selectCalendar"
          ref="selectCalendar"
          :events="events"
          :config="config"
        ></full-calendar>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="submit('form')">保 存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { frontApparatusList } from '@/api/apparatus';
import {
  specialApparatusTimeInfo,
  addSpecialApparatusTime,
  editSpecialApparatusTime,
} from '@/api/booking';
import { FullCalendar } from 'vue-full-calendar';
import 'fullcalendar/dist/fullcalendar.css';

export default {
  components: {
    FullCalendar,
  },
  data() {
    var that = this;
    return {
      loading: false,
      canBooking: true,
      form: {
        id: '',
        apparatus_id: '',
        apparatus_name: '',
        date: '',
        book_time: [],
        date_arr: [],
      },
      events: [],
      config: {
        locale: 'zh-cn',
        defaultView: 'agendaDay',
        defaultDate: '2019-09-01',
        allDaySlot: false,
        timezone: 'Asia/Shanghai',
        header: { left: '', center: '', right: '' },
        selectAllow: function (clickInfo) {
          var start = clickInfo.start.unix() - 28800;
          var end = clickInfo.end.unix() - 28800;
          var start_temp, end_temp;
          var canSelect = true;
          if (that.events.length > 0) {
            that.events.forEach((item) => {
              if (typeof item.start === 'string') {
                start_temp = new Date(item.start).getTime() / 1000;
                end_temp = new Date(item.end).getTime() / 1000;
              } else {
                start_temp = item.start.unix() - 28800;
                end_temp = item.end.unix() - 28800;
              }
              if (
                (start >= start_temp && start <= end_temp) ||
                (end >= start_temp && end <= end_temp) ||
                (start < start_temp && end > end_temp)
              ) {
                canSelect = false;
              }
            });
          }
          return canSelect;
        },
        select: function (startDate, endDate, allDay, jsEvent, view) {
          if (jsEvent.type === 'agendaDay') {
            that.events.push({
              resourceId: new Date().getTime(),
              title: '已选择(点击删除)',
              start: startDate,
              end: endDate,
              color: 'blue',
              textColor: 'black',
              editable: false,
              selectable: false,
            });
          }
        },
        eventClick(event, jsEvent, view) {
          that.events.forEach((item, index) => {
            if (item.resourceId === event.resourceId) {
              that.events.splice(index, 1);
            }
          });
        },
      },
      apparatus: [],
      rules: {
        apparatus_id: [
          {
            required: true,
            message: '请选择仪器',
            trigger: 'change',
          },
        ],
        date_arr: [
          {
            required: true,
            message: '请选择时间段',
            trigger: 'change',
          },
        ],
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      searchApparatusForm: {
        page: 1,
        size: 30,
        is_deleted: 0,
        is_admin: 1,
        name: '',
      },
    };
  },
  created() {
    if (this.$route.params.id) {
      this.getInfo();
    } else {
      this.getApparatus();
    }
  },
  methods: {
    getInfo() {
      this.form.id = this.$route.params.id;
      if (this.form.id) {
        specialApparatusTimeInfo({ id: this.form.id }).then((response) => {
          if (response.status !== 200) {
            this.returnToList();
          } else {
            const data = response.data;
            this.form.apparatus_id = data.apparatus_id;
            this.form.apparatus_name = data.apparatus_name;
            this.form.date_arr = [data.start_date, data.end_date];
            JSON.parse(data.book_time).forEach((item, index) => {
              this.events.push({
                resourceId: index,
                title: '已选择(点击删除)',
                start:
                  '2019-09-01 ' +
                  item.start_at.slice(0, 2) +
                  ':' +
                  item.start_at.slice(2, 4) +
                  ':00',
                end:
                  '2019-09-01 ' + item.end_at.slice(0, 2) + ':' + item.end_at.slice(2, 4) + ':00',
                color: 'blue',
                textColor: 'black',
                editable: false,
                selectable: false,
              });
            });
            if (JSON.parse(data.book_time).length === 0) this.canBooking = false;
          }
        });
      } else {
        this.returnToList();
      }
    },
    getApparatus(query = '') {
      this.searchApparatusForm.name = query;
      frontApparatusList(this.searchApparatusForm).then((res) => {
        if (res.status === 200) {
          this.apparatus = res.data.data;
        }
      });
    },
    submit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          if (this.canBooking && this.events.length === 0) {
            this.$message.error('请选择可预约时间段');
            return false;
          }
          if (this.canBooking) {
            this.events.forEach((item) => {
              if (typeof item.start === 'string') {
                this.form.book_time.push({
                  start_at: '' + item.start.slice(11, 13) + item.start.slice(14, 16),
                  end_at: '' + item.end.slice(11, 13) + item.end.slice(14, 16),
                });
              } else {
                var start_hour =
                  item.start.get('hours') < 10
                    ? '0' + item.start.get('hours')
                    : item.start.get('hours');
                var start_minite =
                  item.start.get('minutes') < 10
                    ? '0' + item.start.get('minutes')
                    : item.start.get('minutes');
                var end_hour =
                  item.end.get('hours') < 10 ? '0' + item.end.get('hours') : item.end.get('hours');
                var end_minite =
                  item.end.get('minutes') < 10
                    ? '0' + item.end.get('minutes')
                    : item.end.get('minutes');
                this.form.book_time.push({
                  start_at: '' + start_hour + start_minite,
                  end_at: '' + end_hour + end_minite,
                });
              }
            });
          } else {
            this.form.book_time = [];
          }
          this.form.start_date = this.form.date_arr[0];
          this.form.end_date = this.form.date_arr[1];
          this.form.book_time = JSON.stringify(this.form.book_time);
          this.loading = true;
          if (this.form.id) {
            editSpecialApparatusTime(this.form)
              .then((response) => {
                this.loading = false;
                if (response.status === 1) {
                  this.returnToList();
                }
              })
              .catch((error) => {
                this.loading = false;
              });
          } else {
            addSpecialApparatusTime(this.form)
              .then((response) => {
                this.loading = false;
                if (response.status === 1) {
                  this.returnToList();
                }
              })
              .catch((error) => {
                this.loading = false;
              });
          }
        } else {
          return false;
        }
      });
    },
    returnToList() {
      this.$router.push({ path: '/personal/special-apparatus-time/list' });
    },
  },
};
</script>
<style lang="scss">
#selectCalendar {
  width: 300px;

  .fc-time-grid-container {
    height: 500px !important;
  }
  .fc-header-toolbar {
    display: none !important;
  }
  .fc-widget-header {
    display: none !important;
  }
}
</style>
