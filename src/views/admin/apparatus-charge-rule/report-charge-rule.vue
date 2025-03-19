<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据处理中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form label-width="0">
      <el-table :data="rule" border style="width: 100%">
        <el-table-column label="类型">
          <template slot-scope="scope">
            {{ scope.row.type === 1 ? '中文' : scope.row.type === 2 ? '英文' : '中英文' }}报告
          </template>
        </el-table-column>
        <el-table-column label="最低费用/元">
          <template slot-scope="scope">
            <el-input-number
              size="small"
              :min="0"
              :step="1"
              v-model="rule[scope.$index].min"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="最高费用/元">
          <template slot-scope="scope">
            <el-input-number
              size="small"
              :min="0"
              :step="1"
              v-model="rule[scope.$index].max"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="占基础费比例/%">
          <template slot-scope="scope">
            <el-slider v-model="rule[scope.$index].percent"></el-slider>
          </template>
        </el-table-column>
      </el-table>
      <el-form-item>
        <el-button type="primary" size="small" @click="submit">保 存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { settingInfo, settingUpdate } from '@/api/system';

export default {
  data() {
    return {
      loading: false,
      form: {
        type: 'report_charge_rule',
        value: '',
      },
      rule: [
        { type: 1, min: 0, max: 0, percent: 0 },
        { type: 2, min: 0, max: 0, percent: 0 },
        { type: 3, min: 0, max: 0, percent: 0 },
      ],
    };
  },
  created() {
    settingInfo(this.form).then((res) => {
      if (res.status === 200) {
        this.rule = JSON.parse(res.data.value);
      }
    });
  },
  methods: {
    submit(form) {
      if (
        this.rule[0].min === undefined ||
        this.rule[0].max === undefined ||
        this.rule[1].min === undefined ||
        this.rule[1].max === undefined ||
        this.rule[2].min === undefined ||
        this.rule[2].max === undefined
      ) {
        this.$message.error('有未填写的项，请填写完整再提交');
        return false;
      }
      this.form.value = JSON.stringify(this.rule);
      this.loading = true;
      settingUpdate(this.form)
        .then((response) => {
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
  },
};
</script>
