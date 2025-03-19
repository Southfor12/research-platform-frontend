<template>
  <div class="app-container">
    <el-form
      v-for="(item, index) in types"
      :key="index"
      :inline="true"
      class="demo-form-inline"
      label-width="300px"
    >
      <el-form-item :label="item.name">
        <el-input
          size="small"
          v-model="item.value"
          class="max-width-100"
          :placeholder="'请输入' + item.name"
        ></el-input>
        {{ item.type === 'recovery_time' ? '天' : '分' }}
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" @click="submit(item.type)">修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { settingInfo, settingUpdate } from '@/api/system';

export default {
  data() {
    return {
      types: [
        {
          name: '取消预约扣除信用分',
          type: 'cancel_booking_score',
          value: '',
        },
        {
          name: '低于该分不可预约或报名培训',
          type: 'min_score',
          value: '',
        },
        {
          name: '准时做实验加分',
          type: 'complete_booking_score',
          value: '',
        },
        { name: '取消培训扣分', type: 'train_cancel_score', value: '' },
        {
          name: '成功参加培训加分',
          type: 'train_complete_score',
          value: '',
        },
        {
          name: '信用分过低恢复到最低分的惩罚时间',
          type: 'recovery_time',
          value: '',
        },
        {
          name: '每超时10分钟扣',
          type: 'booking_delay_score',
          value: '',
        },
      ],
    };
  },
  created() {
    this.types.forEach((item) => {
      this.getInfo(item.type);
    });
    var that = this;
  },
  methods: {
    getInfo(type) {
      settingInfo({ type }).then((res) => {
        if (res.status === 200) {
          this.types.forEach((item, index) => {
            if (item.type === type) {
              this.types[index].value = res.data.value;
              if (type === 'recovery_time') {
                this.types[index].value = res.data.value / 86400;
              }
            }
          });
        }
      });
    },
    submit(type) {
      this.types.forEach((item, index) => {
        var value = item.value;
        if (item.type === type) {
          if (!item.value) {
            this.$message.error('请填写' + item.name);
            return false;
          }
          if (isNaN(item.value) || !Number.isInteger(Number(item.value)) || item.value < 0) {
            this.$message.error(item.name + '必须是非负整数');
            return false;
          }
          if (type === 'recovery_time') {
            value *= 86400;
            value = String(value);
          }
          settingUpdate({ type, value }).then((res) => {});
        }
      });
    },
  },
};
</script>
