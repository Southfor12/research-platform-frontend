<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据处理中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-form-item label="单位">
        <el-select v-model="form.factory_id" :clearable="false" size="small" class="width-200" placeholder="选择单位">
          <el-option :label="factory.name" :value="factory.id" :key="idx" v-for="(factory,idx) in getSelectableFactories()"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" size="small" class="width-200" clearable />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select
          v-model="form.type"
          :clearable="true"
          size="small"
          class="width-200"
          placeholder="类型"
        >
          <el-option label="科学研究" value="6"></el-option>
          <el-option label="教育教学" value="7"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.type == 3" label="封面图片" prop="image_url">
        <el-card shadow="never" class="edl-upload-card">
          <el-upload
            class="img-uploader"
            list-type="picture"
            accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PNG,.GIF,.BMP"
            :headers="authHeader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleImgUploadSuccess"
            :before-upload="beforeUpload"
          >
            <img v-if="form.image_url" :src="domain + form.image_url" class="uploader-img" />
            <i v-else class="el-icon-plus img-uploader-icon"></i>
          </el-upload>
          <div v-if="form.image_url" class="edl-icon-container">
            <i class="el-icon-zoom-in edl-icon" @click="showBigImg(domain + form.image_url)"></i>
            <i class="el-icon-delete edl-icon" @click="form.image_url = ''"></i>
          </div>
        </el-card>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <tinymce v-model="form.content" :height="500" width="80%" />
      </el-form-item>
      <el-form-item label="子平台/实验室">
        <el-select
          v-model="form.platform_id"
          size="small"
          clearable
          class="width-200"
          filterable
          remote
          reserve-keyword
          :remote-method="getPlatforms"
          placeholder="输入名称搜索选择"
        >
          <el-option v-for="item in platforms" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="附件名称">
                <el-input v-model="form.source_name" size="small" class="max-width-200" clearable />
            </el-form-item> -->
      <el-form-item label="附件">
        <el-upload
          v-show="percent === 0"
          :headers="authHeader"
          accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PNG,.GIF,.BMP,.PDF,.rar,.zip,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
          :action="uploadUrl"
          :on-remove="removeFile"
          :before-upload="beforeFileUpload"
          :on-progress="handleUploadProgress"
          :on-success="handleUploadSuccess"
          :file-list="fileList"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
        <!-- <el-upload
                    v-show="percent === 0"
                    :action="uploadUrl"
                    :headers="authHeader"
                    :show-file-list="false"
                    :on-progress="handleUploadProgress"
                    :on-success="handleUploadSuccess">
                    <el-button size="small">点击上传</el-button>
                    <div v-for="(index, item) in form.source_url_arr" :key="index">{{ item }}</div>
                </el-upload>
                <i v-if="form.source_url && percent === 0" @click="form.source_url = ''" class="el-icon-delete common-icon"></i> -->
        <span v-if="percent > 0" class="bottom-30">附件上传中</span>
        <el-progress
          v-if="percent > 0"
          :text-inside="true"
          :stroke-width="26"
          :percentage="percent"
        ></el-progress>
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
import { newsInfo, addNews, editNews } from '@/api/news';
import { platformList, platformInfo } from '@/api/platform';
import { uploadUrl } from '@/api/public';
import Tinymce from '@/components/Tinymce';
import { checkImgFile, checkAttachFile } from '@/utils/index';

export default {
  components: {
    Tinymce,
  },
  data() {
    return {
      loading: false,
      uploadUrl: uploadUrl,
      percent: 0,
      dialogVisible: false,
      dialogImageUrl: '',
      fileList: [],
      form: {
        id: '',
        name: '',
        type: '',
        content: '',
        platform_id: '',
        source_name: '',
        source_url: '',
        source_url_arr: [],
        image_url: '',
        factory_id: '',
      },
      searchPlatformForm: {
        page: 1,
        size: 100,
        is_deleted: 0,
        name: '',
      },
      domain: process.env.VUE_APP_DOMAIN,
      platforms: [],
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        image_url: [{ required: true, message: '请上传封面', trigger: 'blur' }],
        content: [{ required: true, message: '请填写内容', trigger: 'blur' }],
        type: [
          {
            required: true,
            message: '请选择类型',
            trigger: 'change',
          },
        ],
      },
    };
  },
  created() {
    this.form.factory_id = this.currentFactoryId;
    if (this.$route.params.id) {
      this.getInfo();
    } else {
      this.getPlatforms();
    }
  },
  methods: {
    getInfo() {
      this.form.id = this.$route.params.id;
      if (this.form.id) {
        newsInfo({ id: this.form.id }).then((response) => {
          if (response.status !== 200) {
            this.returnToList();
          } else {
            const data = response.data;
            this.form.name = data.name;
            this.form.type = String(data.type);
            this.form.platform_id = data.platform_id;
            this.form.content = data.content;
            this.form.source_name = data.source_name;
            this.form.source_url_arr = data.source_url_arr;
            this.form.source_url = data.source_url;
            this.form.image_url = data.image_url;
            this.form.factory_id = data.factory_id;

            this.fileList = data.source_url_arr;
            if (this.form.platform_id) {
              platformInfo({
                platform_id: this.form.platform_id,
              }).then((res) => {
                if (res.status === 200) {
                  this.platforms.push(res.data);
                }
              });
            } else {
              this.form.platform_id = '';
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
          // if (this.form.source_url && !this.form.source_name) {
          //     this.$message.error('请填写附件名称')
          //     return false
          // }
          if (!this.form.platform_id) this.form.platform_id = 0;
          this.loading = true;
          if (this.form.id) {
            editNews(this.form)
              .then((response) => {
                this.loading = false;
                // if (this.form.platform_id === 0) this.form.platform_id = ''
                if (response.status === 1) {
                  this.returnToList();
                }
              })
              .catch((error) => {
                this.loading = false;
              });
          } else {
            addNews(this.form)
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
        } else {
          return false;
        }
      });
    },
    handleUploadSuccess(res, file) {
      res = this.decrypt(res);
      if (res.status === 200) {
        this.form.source_url_arr.push({
          name: file.name,
          url: res.data.url,
        });
        // this.form.source_url = res.data.url
      }
    },
    handleImgUploadSuccess(res, file) {
      if (res.status === 200) {
        this.form.image_url = res.data.url;
      }
    },
    removeFile(file, fileList) {
      this.form.source_url_arr = [];
      fileList.forEach((element) => {
        this.form.source_url_arr.push({
          name: element.name,
          url: element.url,
        });
      });
      console.log(this.form.source_url_arr);
    },
    beforeUpload(file) {
      return checkImgFile(file, 2, this.$message);
    },
    beforeFileUpload(file) {
      return checkAttachFile(file, 100, this.$message);
    },
    handleUploadProgress(event, file, fileList) {
      if (event.percent < 100) {
        this.percent = parseInt(event.percent);
      } else {
        this.percent = 0;
      }
    },
    getPlatforms(query = '') {
      this.searchPlatformForm.name = query;
      platformList(this.searchPlatformForm).then((res) => {
        if (res.status === 200) {
          this.platforms = res.data.data;
        }
      });
    },
    returnToList() {
      this.$router.push({ path: '/education/list' });
    },
  },
};
</script>
