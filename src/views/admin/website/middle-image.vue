<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据处理中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="LOGO图片" prop="value">
        <el-card shadow="never" class="edl-upload-card">
          <el-upload
            class="img-uploader"
            name="edianlaiImg"
            accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PNG,.GIF,.BMP"
            list-type="picture"
            :action="uploadUrl"
            :headers="authHeader"
            :show-file-list="false"
            :on-success="handleUploadSuccess"
            :before-upload="beforeUpload"
          >
            <img v-if="form.data.img_url" :src="domain + form.data.img_url" class="uploader-img" />
            <i v-else class="el-icon-plus img-uploader-icon"></i>
          </el-upload>
          <div v-if="form.data.img_url" class="edl-icon-container">
            <i class="el-icon-zoom-in edl-icon" @click="showBigImg(domain + form.data.img_url)"></i>
            <i class="el-icon-delete edl-icon" @click="form.data.img_url = ''"></i>
          </div>
        </el-card>
        <span class="tips">说明：建议图片大小为980:120</span>
      </el-form-item>
      <el-form-item label="链接" prop="link">
        <el-input
          v-model="form.data.link"
          size="small"
          class="max-width-500"
          clearable
          placeholder="请填写点击后跳转链接"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="submit('form')">保 存</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
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
        type: 'middle_image',
        data: { img_url: '', link: '' },
        value: '',
      },
    };
  },
  created() {
    settingInfo(this.form).then((res) => {
      if (res.status === 200) {
        this.form.data = JSON.parse(res.data.value);
      }
    });
  },
  methods: {
    submit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          // if (!this.form.data.img_url) {
          //     this.$message.error('请上传LOGO图片')
          //     return false
          // }
          this.form.value = JSON.stringify(this.form.data);
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
