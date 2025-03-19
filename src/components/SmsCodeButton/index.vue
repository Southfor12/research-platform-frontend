<template>
  <el-button :loading="loading" :disabled="showLeft" @click="getCode">
    <template v-if="!showLeft">获取验证码</template>
    <template v-else>{{ second }} s</template>
  </el-button>
</template>
<script>
import { setTimeout } from 'timers';
import { mobileCaptcha } from '@/api/public';

export default {
  name: 'SmsCodeButton',
  props: {
    type: {
      type: String,
      default: '',
    },
    mobile: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      loading: false,
      showLeft: false,
      second: 60,
    };
  },
  methods: {
    getCode() {
      if (!this.mobile) {
        this.$message.info({
          type: 'error',
          message: '请填写手机号',
        });
        return false;
      }
      if (/^1[3|4|5|7|8][0-9]\d{8}$/.test(this.mobile)) {
        this.loading = true;
        mobileCaptcha({ mobile: this.mobile, type: this.type })
          .then((response) => {
            this.loading = false;
            if (response.status !== -1) {
              if (response.status == 1000 && response.data.ttl) {
                this.second = response.data.ttl;
              }
              this.showLeft = true;
              this.timeDown();
            }
          })
          .catch((error) => {
            this.loading = false;
          });
        // this.showLeft = true
        // this.timeDown()
      } else {
        this.$message.info({
          type: 'error',
          message: '手机号格式错误',
        });
      }
    },
    timeDown() {
      const result = setInterval(() => {
        --this.second;
        if (this.second < 0) {
          clearInterval(result);
          this.showLeft = false;
          this.second = 60;
        }
      }, 1000);
    },
  },
};
</script>
