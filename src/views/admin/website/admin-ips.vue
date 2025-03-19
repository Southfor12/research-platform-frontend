<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据处理中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="IP白名单" prop="value">
        <el-input
          v-model="form.value"
          type="textarea"
          rows="3"
          size="small"
          clearable
          placeholder="请填写IP地址, 例如192.168.1.201;192.168.1.202;...，每个IP地址使用;隔开"
        />
      </el-form-item>
          <p style="color:#bbb;padding-left: 100px;font-size: 14px;">请填写IP地址, 例如192.168.1.201;192.168.1.202;...，每个IP地址使用;隔开</p>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" size="small" @click="submit('form')">保 存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { settingInfo, settingUpdate } from '@/api/system';
import Tinymce from '@/components/Tinymce';

export default {
  components: {
    Tinymce,
  },
  data() {
    return {
      loading: false,
      form: {
        type: 'admin_ips',
        value: '',
      },
      rules: {
        value: [
          {
            required: true,
            message: '请填写白名单IP地址',
            trigger: 'blur',
          },
        ],
      },
    };
  },
  created() {
    settingInfo(this.form).then((res) => {
      if (res.status === 200) {
        this.form.value = res.data.value;
      }
    });
  },
  methods: {
    submit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.loading = true;
          settingUpdate(this.form)
            .then((response) => {
              this.loading = false;
            })
            .catch((error) => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
  },
};
</script>
