<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据处理中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" size="small" class="max-width-200" clearable />
      </el-form-item>
      <el-form-item label="内容">
        <tinymce v-model="form.content" :height="500" width="90%" />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select
          v-model="form.type"
          :clearable="true"
          size="small"
          class="max-width-150"
          @change="typeChange"
          placeholder="类型"
        >
          <el-option label="在线文档资料" value="1"></el-option>
          <el-option label="视频资料" value="2"></el-option>
          <el-option label="下载资料" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="子平台/实验室">
        <el-select
          v-if="!form.id"
          v-model="form.platform_id"
          size="small"
          clearable
          class="max-width-300"
          filterable
          reserve-keyword
          placeholder="请选择子平台/实验室"
        >
          <el-option v-for="item in platforms" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <span v-if="!form.id" class="tips">(不选默认为平台级)</span>
        <span v-else>{{ form.platform_name }}</span>
      </el-form-item>
      <el-form-item label="附件" v-if="form.type == 2 || form.type == 3">
        <el-card v-if="form.type == 2" shadow="never" class="edl-upload-card">
          <el-upload
            class="img-uploader"
            name="edianlaiImg"
            accept=".mp4"
            list-type="picture"
            :action="uploadUrl"
            :headers="authHeader"
            :show-file-list="false"
            :on-success="handleUploadSuccess"
            :before-upload="beforeUpload"
          >
            <!-- <img v-if="form.picture" :src="domain + form.picture" class="uploader-img"> -->
            <video v-if="form.url" class="width-100-percent height-100-percent" controls>
              <source :src="domain + form.url" type="video/mp4" />
              您的浏览器不支持 video 标签
            </video>
            <i v-else class="el-icon-plus img-uploader-icon"></i>
          </el-upload>
        </el-card>
        <el-upload
          v-if="form.type == 3"
          :action="uploadUrl"
          accept=".mp4"
          :headers="authHeader"
          :show-file-list="false"
          :on-success="handleUploadSuccess"
          :before-upload="beforeUpload"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <span>{{ form.url }}</span>
        </el-upload>
      </el-form-item>
      <el-form-item label="是否开放学习" prop="is_published">
        <el-select
          v-model="form.is_published"
          :clearable="true"
          size="small"
          class="max-width-150"
          placeholder="是否开放学习"
        >
          <el-option label="是" value="1"></el-option>
          <el-option label="否" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="submit('form')">保 存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { trainDocInfo, addTrainDoc, editTrainDoc } from '@/api/security';
import { frontPlatformList } from '@/api/platform';
import { uploadUrl } from '@/api/public';
import Tinymce from '@/components/Tinymce';
import { checkImgFile } from '@/utils/index';

export default {
  components: {
    Tinymce,
  },
  data() {
    return {
      loading: false,
      uploadUrl: uploadUrl,
      form: {
        id: '',
        name: '',
        type: '',
        is_published: '',
        platform_id: '',
        platform_name: '',
        url: '',
        content: '',
      },
      preUrl: '',
      platforms: [],
      domain: process.env.VUE_APP_DOMAIN,
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          // { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        type: [
          {
            required: true,
            message: '请选择类型',
            trigger: 'change',
          },
        ],
        is_published: [
          {
            required: true,
            message: '请选择是否开放学习',
            trigger: 'change',
          },
        ],
      },
    };
  },
  created() {
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
        trainDocInfo({ id: this.form.id }).then((response) => {
          if (response.status !== 200) {
            this.returnToList();
          } else {
            const data = response.data;
            this.form.name = data.name;
            this.form.type = String(data.type);
            this.form.url = data.url;
            this.form.platform_id = data.platform_id;
            this.form.platform_name = data.platform_name;
            this.form.is_published = String(data.is_published);
            this.form.content = data.content;
            this.preUrl = this.form.url;
          }
        });
      } else {
        this.returnToList();
      }
    },
    submit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          if ((form.type == 2 || form.type == 3) && !form.url) {
            if (!this.preUrl) {
              this.$message.error('请上传附件');
              return false;
            } else {
              this.form.url = this.preUrl;
            }
          }
          this.loading = true;
          if (this.form.id) {
            editTrainDoc(this.form)
              .then((response) => {
                this.loading = false;
                if (response.status === 1) {
                  this.returnToList();
                }
              })
              .catch((error) => {
                this.loading = false;
              });
          } else {
            addTrainDoc(this.form)
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
    getPlatforms() {
      frontPlatformList({ page: 1, size: 100, is_deleted: 0 }).then((res) => {
        if (res.status === 200) {
          this.platforms = res.data.data;
        }
      });
    },
    typeChange() {
      this.form.url = '';
    },
    handleUploadSuccess(res, file) {
      res = this.decrypt(res);
      if (res.status === 200) {
        this.form.url = res.data.url;
      }
    },
    beforeUpload(file) {
      if (this.form.type === '2') {
        if (file.type !== 'video/mp4') {
          this.$message.error('视频资料仅支持mp4格式视频');
          return false;
        }
      } else if (this.form.type === '3') {
        return true;
      } else {
        return false;
      }
      return true;
    },
    returnToList() {
      this.$router.push({ path: '/personal/train-doc/list' });
    },
  },
};
</script>
