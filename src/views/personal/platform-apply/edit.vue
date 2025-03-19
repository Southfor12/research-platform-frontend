<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据处理中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-form-item label="实验室">
        {{ form.platform_name }}
      </el-form-item>
      <el-form-item label="申请人">
        {{ form.user_name }}
      </el-form-item>
      <el-form-item label="申请类型" prop="checkList">
        <el-checkbox-group v-model="form.checkList">
          <el-checkbox label="危化品"></el-checkbox>
          <el-checkbox label="修改有效截止日期"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item
        v-if="
          (form.checkList.length > 0 && form.checkList[0] === '危化品') ||
          (form.checkList.length === 2 && form.checkList[1] === '危化品')
        "
        label="危化品"
        prop="hcs_names_arr"
      >
        <el-select
          v-model="form.hcs_names_arr"
          size="small"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="请输入文字然后回车添加危化品"
        >
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="
          (form.checkList.length > 0 && form.checkList[0] === '修改有效截止日期') ||
          (form.checkList.length === 2 && form.checkList[1] === '修改有效截止日期')
        "
        label="有效截止日期(含)"
        prop="expired_at"
      >
        <el-date-picker
          size="small"
          v-model="form.expired_at"
          type="date"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd"
          placeholder="选择有效截止日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          type="textarea"
          v-model="form.note"
          size="small"
          :rows="3"
          class="width-50-percent"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="submit('form')">保 存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { platformList, applyPlatformInfo, editApplyPlatform } from '@/api/platform';

export default {
  data() {
    return {
      loading: false,
      form: {
        id: '',
        expired_at: '',
        platform_name: '',
        user_name: '',
        hcs_names_arr: [],
        hcs_names: '',
        note: '',
        checkList: [],
      },
      rules: {
        expired_at: [
          {
            required: true,
            trigger: 'change',
            message: '请选择有效截止日期',
          },
        ],
        hcs_names_arr: [
          {
            required: true,
            trigger: 'change',
            message: '请输入危化品',
          },
        ],
        checkList: [
          {
            required: true,
            trigger: 'change',
            message: '至少选一项申请项',
          },
        ],
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        },
      },
      hcsOptions: [],
    };
  },
  created() {
    if (this.$route.params.id) {
      this.getInfo();
    } else {
      this.returnToList();
    }
  },
  methods: {
    getInfo() {
      this.form.id = this.$route.params.id;
      if (this.form.id) {
        applyPlatformInfo({ id: this.form.id }).then((response) => {
          if (response.status !== 200) {
            this.returnToList();
          } else {
            const data = response.data;
            this.form.expired_at = data.expired_at;
            this.form.hcs_names = data.hcs_names;
            this.form.note = data.note;
            this.form.platform_name = data.platform_name;
            this.form.user_name = data.user_name;
            this.form.hcs_names_arr = [];
            this.form.expired_at = '';
            if (data.expired_at !== '0000-00-00 00:00:00') {
              this.form.expired_at = data.expired_at;
              this.form.checkList.push('修改有效截止日期');
            }
            if (data.hcs_names !== '') {
              this.form.hcs_names_arr = data.hcs_names.split(',');
              data.hcs_names.split(',').forEach((element) => {
                this.hcsOptions.push({
                  lable: element,
                  value: element,
                });
              });
              this.form.checkList.push('危化品');
            }
          }
        });
      } else {
        this.returnToList();
      }
    },
    submit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.form.hcs_names = this.form.hcs_names_arr.join(',');
          this.loading = true;
          if (this.form.id) {
            this.form.expired_at = this.form.expired_at.substring(0, 11) + ' 23:59:59';
            editApplyPlatform(this.form)
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
        }
      });
    },
    returnToList() {
      this.$router.push({
        path: '/personal/info-center/my-platform-append-apply/list',
      });
    },
  },
};
</script>
