<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>{{ title }}</span>
    </div>
    <div class="text item">
      <span class="num">
        <countTo :start-val="0" :decimals="decimals" :end-val="endVal" :duration="duration" />
      </span>
      <span>{{ unit }}</span>
    </div>
  </el-card>
</template>
<script>
import countTo from 'vue-count-to';

export default {
  name: 'TopViewCard',
  components: {
    countTo,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    unit: {
      type: String,
      default: '元',
    },
    decimals: {
      type: Number,
      default: 0,
    },
    startVal: {
      type: Number,
      default: 0,
    },
    endVal: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      default: 500,
    },
  },
};
</script>
