<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据处理中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-button
      type="success"
      class="right bottom-30"
      size="small"
      icon="el-icon-plus"
      @click="toAdd(false, -1)"
      >添加轮播图
    </el-button>
    <el-table :data="list" style="width: 100%; margin: 15px 0">
      <el-table-column width="100px" type="index" label="序号" />
      <el-table-column label="标题" width="180">
        <template slot-scope="scope">
          {{ scope.row.name ? scope.row.name : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="图片" @click="showBigImg(domain + scope.row.img_url)">
        <template slot-scope="scope">
          <img
            :src="domain + scope.row.img_url"
            style="height: 50px; vertical-align: middle"
          />
        </template>
      </el-table-column>
      <el-table-column label="链接">
        <template slot-scope="scope">
          {{ scope.row.url ? scope.row.url : '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="factory_id" label="单位">
          <template slot-scope="scope">
            {{getFactoryName(scope.row.factory_id)}}
          </template>
      </el-table-column>
      <el-table-column width="180" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="toAdd(scope.row, scope.$index)"
            >修改</el-button
          >
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary" size="small" @click="doSave()">保 存</el-button>
    <el-dialog title="添加轮播图" :visible.sync="dialogFormVisible">
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="标题">
          <el-input
            size="small"
            class="max-width-200"
            v-model="editForm.name"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="value">
          <el-card shadow="never" class="edl-upload-card">
            <el-upload
              class="img-uploader"
              list-type="picture"
              accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PNG,.GIF,.BMP"
              :action="uploadUrl"
              :headers="authHeader"
              :show-file-list="false"
              :on-success="handleUploadSuccess"
              :before-upload="beforeUpload"
            >
              <img v-if="editForm.img_url" :src="domain + editForm.img_url" class="uploader-img" />
              <i v-else class="el-icon-plus img-uploader-icon"></i>
            </el-upload>
            <div v-if="editForm.img_url" class="edl-icon-container">
              <i
                class="el-icon-zoom-in edl-icon"
                @click="showBigImg(domain + editForm.img_url)"
              ></i>
              <i class="el-icon-delete edl-icon" @click="editForm.img_url = ''"></i>
            </div>
          </el-card>
          <span class="tips">说明：建议图片大小为1280:450</span>
        </el-form-item>
        <el-form-item label="链接">
          <el-input
            size="small"
            class="max-width-200"
            v-model="editForm.url"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addImg">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>
<script>
import { settingInfo, settingUpdate } from '@/api/system';
import { uploadUrl } from '@/api/public';
import { checkImgFile } from '@/utils/index';
import Vue from 'vue';

export default {
  data() {
    return {
      loading: false,
      action: '',
      currentIndex: -1,
      dialogFormVisible: false,
      dialogImageUrl: '',
      dialogVisible: false,
      uploadUrl: uploadUrl,
      domain: process.env.VUE_APP_DOMAIN,
      list: [],
      editForm: {
        name: '',
        img_url: '',
        url: '',
      },
      form: {
        type: 'horse_lamp',
        value: '',
      },
    };
  },
  created() {
    settingInfo(this.form).then((res) => {
      if (res.status === 200) {
        this.form.value = res.data.value;
        this.list = JSON.parse(res.data.value);
      }
    });
  },
  methods: {
    addImg() {
      if (!this.editForm.img_url) {
        this.$message.error('请上传图片');
        return false;
      }

      if (!this.editForm.url.startsWith("http")) {
        this.$message.error("请填写正确的链接");
        return false;
      }

      if (this.action === 'edit') {
        this.list.forEach((item, index) => {
          if (index === this.currentIndex) {
            this.list[index] = {
              name: this.editForm.name,
              img_url: this.editForm.img_url,
              url: this.editForm.url,
            };
            Vue.set(this.list, index, this.list[index]);
          }
        });
      } else {
        this.list.push(this.editForm);
      }
      this.dialogFormVisible = false;
      this.doSave();
    },
    toAdd(row, index) {
      if (row) {
        this.action = 'edit';
        this.currentIndex = index;
        this.editForm = {
          name: row.name,
          img_url: row.img_url,
          url: row.url,
        };
      } else {
        this.action = 'add';
        this.editForm = {
          name: '',
          img_url: '',
          url: '',
        };
      }
      this.dialogFormVisible = true;
    },
    handleDelete(row) {
      this.list.forEach((item, index) => {
        if (item.img_url === row.img_url) {
          this.list.splice(index, 1);
        }
      });
      this.doSave();
    },
    //保存新的轮播图配置数据
    doSave() {
      this.form.value = JSON.stringify(this.list);
      this.loading = true;
      settingUpdate(this.form)
        .then((response) => {
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    handleUploadSuccess(res, file) {
      res = this.decrypt(res);
      if (res.status === 200) {
        this.editForm.img_url = res.data.url;
      }
    },
    beforeUpload(file) {
      return checkImgFile(file, 10, this.$message);
    },
    showBigImg(url) {
      this.dialogImageUrl = url;
      this.dialogVisible = true;
    }
  }
};
</script>
