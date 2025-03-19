<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据处理中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="180px">
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
      <el-form-item label="月" prop="months_arr">
        <el-select
          v-model="form.months_arr"
          size="small"
          multiple
          default-first-option
          placeholder="请选择月份"
        >
          <el-option
            v-for="item in months"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="周" prop="weeks_arr">
        <el-select
          v-model="form.weeks_arr"
          size="small"
          multiple
          default-first-option
          placeholder="请选择周"
        >
          <el-option
            v-for="item in weeks"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="至少提前预约时间" prop="advance_book_time_num">
        <el-input-number
          v-model="form.advance_book_time_num"
          :min="0"
          :step="0.5"
        ></el-input-number>
        小时
      </el-form-item>
      <el-form-item label="可提前取消时间" prop="cancel_time_num">
        <el-input-number v-model="form.cancel_time_num" :min="0" :step="0.5"></el-input-number>
        小时
      </el-form-item>
      <el-form-item label="最长可以预约时间" prop="max_time_num">
        <el-input-number v-model="form.max_time_num" :min="0" :step="0.5"></el-input-number>
        小时
      </el-form-item>
      <el-form-item label="可预约范围" prop="max_time_num">
        <el-input-number
          v-model="form.max_day"
          :min="1"
          :max="90"
          :step="1"
          class="width-200"
        ></el-input-number>
        天内
      </el-form-item>
      <el-form-item label="时间段">
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
  commonApparatusTimeInfo,
  addCommonApparatusTime,
  editCommonApparatusTime,
} from '@/api/booking';
import { FullCalendar } from 'vue-full-calendar';
import { checkGtEtZero } from '@/utils/validate';
import 'fullcalendar/dist/fullcalendar.css';

export default {
  components: {
    FullCalendar,
  },
  data() {
    var that = this;
    return {
      loading: false,
      form: {
        id: '',
        apparatus_id: '',
        apparatus_name: '',
        months: '',
        months_arr: [],
        current_month: '',
        advance_book_time_num: 0,
        max_time_num: 0,
        max_day: 0,
        cancel_time_num: 0,
        weeks: '',
        weeks_arr: [],
        book_time: [],
      },
      months: [
        { label: '一月', value: '1' },
        { label: '二月', value: '2' },
        { label: '三月', value: '3' },
        { label: '四月', value: '4' },
        { label: '五月', value: '5' },
        { label: '六月', value: '6' },
        { label: '七月', value: '7' },
        { label: '八月', value: '8' },
        { label: '九月', value: '9' },
        { label: '十月', value: '10' },
        { label: '十一月', value: '11' },
        { label: '十二月', value: '12' },
      ],
      events: [],
      weeks: [
        { label: '周一', value: '1' },
        { label: '周二', value: '2' },
        { label: '周三', value: '3' },
        { label: '周四', value: '4' },
        { label: '周五', value: '5' },
        { label: '周六', value: '6' },
        { label: '周日', value: '7' },
      ],
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
        months_arr: [{ required: true, message: '请选择月', trigger: 'change' }],
        weeks_arr: [{ required: true, message: '请选择周', trigger: 'change' }],
        advance_book_time_num: [
          {
            required: true,
            trigger: 'blur',
            validator: checkGtEtZero,
          },
        ],
        max_time_num: [
          {
            required: true,
            trigger: 'blur',
            validator: checkGtEtZero,
          },
        ],
        cancel_time_num: [
          {
            required: true,
            trigger: 'blur',
            validator: checkGtEtZero,
          },
        ],
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
        commonApparatusTimeInfo({ id: this.form.id }).then((response) => {
          if (response.status !== 200) {
            this.returnToList();
          } else {
            const data = response.data;
            this.form.apparatus_id = data.apparatus_id;
            this.form.apparatus_name = data.apparatus_name;
            this.form.advance_book_time_num = data.advance_book_time / 3600;
            this.form.max_time_num = data.max_time / 3600;
            this.form.cancel_time_num = data.cancel_time / 3600;
            this.form.months_arr = data.months.split(',');
            this.form.weeks_arr = data.weeks.split(',');
            this.form.max_day = data.max_day;
            data.book_time.forEach((item, index) => {
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
    setMonths() {
      var now = new Date();
      var year = now.getFullYear();
      var month = now.getMonth() + 1;
      for (var i = 1; i <= 12; i++) {
        if (month === 13) {
          month = 1;
          year++;
        }
        this.months.push({
          label: '' + year + '年' + (month < 10 ? '0' + month : month) + '月',
          value: '' + year + (month < 10 ? '0' + month : month),
        });
        month++;
      }
    },
    submit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          if (this.events.length === 0) {
            this.$message.error('请选择可预约时间段');
            return false;
          }
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
          this.form.advance_book_time_num = this.form.advance_book_time_num * 3600;
          this.form.cancel_time = this.form.cancel_time_num * 3600;
          this.form.max_time = this.form.max_time_num * 3600;
          this.form.book_time = JSON.stringify(this.form.book_time);
          this.form.months = this.form.months_arr.sort(sortNumber).join(',');
          this.form.weeks = this.form.weeks_arr.join(',');
          this.loading = true;
          if (this.form.id) {
            editCommonApparatusTime(this.form)
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
            this.form.months = this.form.months_arr.join(',');
            addCommonApparatusTime(this.form)
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
      this.$router.push({ path: '/personal/common-apparatus-time/list' });
    },
  },
};

function sortNumber(a, b) {
  return Number(a) - Number(b);
}
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
