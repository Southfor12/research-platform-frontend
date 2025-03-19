<template>
  <div class="card-panel bottom-10" @click="ToUrl">
    <div class="card-panel-icon-wrapper icon-money">
      <svg-icon :icon-class="iconClass" class-name="card-panel-icon" />
    </div>
    <div class="card-panel-description">
      <div class="card-panel-text">
        {{ title }}
      </div>
      <count-to
        :start-val="startVal"
        :end-val="endVal"
        :duration="duration"
        :decimals="decimals"
        class="card-panel-num"
      />
    </div>
  </div>
</template>
<script>
import CountTo from 'vue-count-to';

export default {
  name: 'CardPanel',
  components: {
    CountTo,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    url: {
      type: String,
      default: '',
    },
    iconClass: {
      type: String,
      default: '',
    },
    duration: {
      type: Number,
      default: 500,
    },
    startVal: {
      type: Number,
      default: 0,
    },
    endVal: {
      type: Number,
      default: 0,
    },
    decimals: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    ToUrl: function () {
      if (this.url != '') {
        this.navTo(this.url);
      } else {
        console.log('url not set');
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.card-panel {
  height: 108px;
  font-size: 12px;
  position: relative;
  overflow: hidden;
  color: #666;
  background: #fff;
  // box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-color: rgba(0, 0, 0, 0.05);
  .icon-people {
    color: #40c9c6;
  }
  .icon-message {
    color: #36a3f7;
  }
  .icon-money {
    color: #f4516c;
  }
  .icon-shopping {
    color: #34bfa3;
  }
  .card-panel-icon-wrapper {
    float: left;
    margin: 14px 0 0 14px;
    padding: 16px;
    transition: all 0.38s ease-out;
    border-radius: 6px;
  }
  .card-panel-icon {
    float: left;
    font-size: 48px;
  }
  .card-panel-description {
    float: right;
    font-weight: bold;
    margin: 26px;
    margin-left: 0px;
    .card-panel-text {
      line-height: 18px;
      color: rgba(0, 0, 0, 0.45);
      font-size: 16px;
      margin-bottom: 12px;
      text-align: right;
    }
    .card-panel-num {
      font-size: 20px;
      float: inherit;
    }
  }
}
</style>
