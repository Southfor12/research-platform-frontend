<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据处理中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="单位" prop="factory_id">
            <el-select v-model="form.factory_id" :clearable="false" size="small" class="width-200" placeholder="选择单位">
              <el-option :label="factory.name" :value="factory.id" :key="idx" v-for="(factory,idx) in getSelectableFactories()"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <!-- <el-form-item label="项目来源" prop="source">
            <el-input
              v-model="form.source"
              size="small"
              class="max-width-200"
              clearable
              placeholder="项目来源"
            />
          </el-form-item> -->
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="项目名称" prop="title">
            <el-input
              v-model="form.title"
              size="small"
              class="max-width-200"
              clearable
              placeholder="项目名称"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目来源" prop="source">
            <el-input
              v-model="form.source"
              size="small"
              class="max-width-200"
              clearable
              placeholder="项目来源"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="级别" prop="level">
            <el-select
              v-model="form.level"
              :clearable="true"
              size="small"
              class="max-width-150"
              placeholder="级别"
            >
              <el-option
                v-for="(item, index) in level"
                :key="index"
                :label="item"
                :value="index"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="立项年月" prop="time">
            <el-date-picker
              v-model="form.time"
              type="month"
              size="small"
              value-format="yyyy-MM"
              placeholder="请选择立项年月"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="金额" prop="amount">
            <el-input-number
              v-model="form.amount"
              size="small"
              :min="0"
              :precision="2"
              :step="1"
            ></el-input-number
            >万元
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否结题" prop="is_final">
            <el-select v-model="form.is_final" size="small" placeholder="请选择是否结题">
              <el-option label="是" :value="1" />
              <el-option label="否" :value="0" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="是否致谢平台" prop="is_thank">
            <el-select v-model="form.is_thank" size="small" placeholder="请选择是否致谢平台">
              <el-option label="是" :value="1" />
              <el-option label="否" :value="0" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="本人排名">
            <el-input
              v-model="form.rank"
              size="small"
              class="max-width-200"
              clearable
              placeholder="格式1/100"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="附件" :required="true">
        <el-upload
          v-show="percent === 0"
          :action="uploadUrl"
          :show-file-list="false"
          :on-progress="handleUploadProgress"
          accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PNG,.GIF,.BMP,.PDF,.rar,.zip,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
          :before-upload="beforeFileUpload"
          :headers="authHeader"
          :on-success="handleUploadSuccess"
        >
          <el-button size="small">点击上传</el-button>
        </el-upload>
        <el-alert
          @close="file_urls.splice(index, 1)"
          v-for="(item, index) in file_urls"
          :key="index"
          :title="item"
          type="success"
          style="margin-bottom: 10px"
        />
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
  </div>
</template>
<script>
import { sciProjectInfo, addSciProject, editSciProject } from '@/api/scientific';
import { uploadUrl } from '@/api/public';
import { checkAttachFile } from '@/utils/index';
import scientificMixin from '@/mixins/scientific';

export default {
  mixins: [scientificMixin],
  data() {
    return {
      loading: false,
      uploadUrl: uploadUrl,
      percent: 0,
      file_urls: [],
      form: {
        id: '',
        title: '',
        level: '',
        is_thank: '',
        amount: '',
        source: '',
        sci_count: '',
        rank: '',
        file_urls: '',
        time: '',
        factory_id: '',
      },
      domain: process.env.VUE_APP_DOMAIN,
      rules: {
        title: [
          {
            required: true,
            message: '请输入项目名称',
            trigger: 'blur',
          },
        ],
        source: [
          {
            required: true,
            message: '请填写项目来源',
            trigger: 'blur',
          },
        ],
        amount: [
          {
            required: true,
            message: '请填写金额',
            trigger: 'blur',
          },
        ],
        type: [
          {
            required: true,
            message: '请选择类型',
            trigger: 'change',
          },
        ],
        level: [
          {
            required: true,
            message: '请选择级别',
            trigger: 'change',
          },
        ],
        is_final: [
          {
            required: true,
            message: '请选择是否结题',
            trigger: 'change',
          },
        ],
        is_thank: [
          {
            required: true,
            message: '请选择是否加入平台致谢',
            trigger: 'change',
          },
        ],
        time: [
          {
            required: true,
            message: '请选择立项年月',
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
    }
  },
  methods: {
    getInfo() {
      this.form.id = this.$route.params.id;
      if (this.form.id) {
        sciProjectInfo({
          id: this.form.id,
        }).then((response) => {
          if (response.status !== 200) {
            this.returnToList();
          } else {
            this.form = response.data;
            this.form.level = String(this.form.level);
            this.file_urls = this.form.file_urls;
          }
        });
      } else {
        this.returnToList();
      }
    },
    submit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.form.file_urls = '';
          if (this.file_urls.length > 0) this.form.file_urls = this.file_urls.join(',');
          this.loading = true;
          if (this.form.id) {
            editSciProject(this.form)
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
            addSciProject(this.form)
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
    beforeFileUpload(file) {
      return checkAttachFile(file, 100, this.$message);
    },
    handleUploadSuccess(res, file) {
      res = this.decrypt(res);
      if (res.status === 200) {
        this.file_urls.push(res.data.url);
      }
    },
    handleUploadProgress(event, file, fileList) {
      if (event.percent < 100) {
        this.percent = parseInt(event.percent);
      } else {
        this.percent = 0;
      }
    },
    returnToList() {
      this.$router.push({
        path: '/info-center/project-list',
      });
    },
  },
};
</script>
