<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据处理中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form ref="form" :model="form" label-width="180px">
      <el-form-item label="离室提前提示时间" prop="value">
        <el-input-number
          v-model="form.value"
          size="small"
          :min="1"
          :precision="0"
          :step="1"
          label="离室提前提示时间"
        />
        天
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="submit('form')">保 存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { settingInfo, settingUpdate } from '@/api/system';
import { uploadUrl } from '@/api/public';
import { checkImgFile } from '@/utils/index';

export default {
  components: {},
  data() {
    return {
      loading: false,
      dialogImageUrl: '',
      dialogVisible: false,
      uploadUrl: uploadUrl,
      domain: process.env.VUE_APP_DOMAIN,
      form: {
        type: 'expiration_reminder',
        value: '',
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
          if (!this.form.value) {
            this.$message.error('请填写离室提前提示时间');
            return false;
          }
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
    handleUploadSuccess(res, file) {
      res = this.decrypt(res);
      if (res.status === 200) {
        this.form.data.img_url = res.data.url;
      }
    },
    beforeUpload(file) {
      return checkImgFile(file, 2, this.$message);
    },
    showBigImg(url) {
      this.dialogImageUrl = url;
      this.dialogVisible = true;
    },
  },
};
</script>
