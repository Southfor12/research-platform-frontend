<template>
  <span>{{
    hour ? hourString + ':' + minuteString + ':' + secondString : minuteString + ':' + secondString
  }}</span>
</template>

<script>
import { setInterval } from 'timers';
export default {
  name: 'remain-time',
  data() {
    return {
      hour: '',
      minute: '',
      second: '',
      promiseTimer: '',
      updateTimer: '',
    };
  },
  props: {
    time: {
      // 倒计时间总秒数
      default: '',
    },
    update_time: {
      type: Number,
      default: 0,
    },
  },
  mounted() {
    if (this.time > 0) {
      this.hour = Math.floor((this.time / 3600) % 24);
      this.minute = Math.floor((this.time / 60) % 60);
      this.second = Math.floor(this.time % 60);
      this.countDowm();
    }
    if (this.update_time > 0) {
      var that = this;
      this.updateTimer = setInterval((_) => {
        if (that.update_time === 0) {
          clearInterval(that.updateTimer);
        } else {
          that.$emit('update:update_time', that.update_time - 1);
        }
      }, 1000);
    }
  },
  methods: {
    countDowm() {
      var self = this;
      clearInterval(this.promiseTimer);
      this.promiseTimer = setInterval(function () {
        if (self.hour === 0) {
          if (self.minute !== 0 && self.second === 0) {
            self.second = 59;
            self.minute -= 1;
          } else if (self.minute === 0 && self.second === 0) {
            self.second = 0;
            self.$emit('countDowmEnd', true);
            clearInterval(self.promiseTimer);
          } else {
            self.second -= 1;
          }
        } else {
          if (self.minute !== 0 && self.second === 0) {
            self.second = 59;
            self.minute -= 1;
          } else if (self.minute === 0 && self.second === 0) {
            self.hour -= 1;
            self.minute = 59;
            self.second = 59;
          } else {
            self.second -= 1;
          }
        }
      }, 1000);
    },
    formatNum(num) {
      return num < 10 ? '0' + num : '' + num;
    },
  },
  computed: {
    hourString() {
      return this.formatNum(this.hour);
    },
    minuteString() {
      return this.formatNum(this.minute);
    },
    secondString() {
      return this.formatNum(this.second);
    },
  },
};
</script>
