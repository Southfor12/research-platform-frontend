<template>
  <div
    v-loading="loading"
    element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form :inline="true" :model="queryForm">
      <el-form-item v-if="getName()" :label="getType()">
        {{ getName() }}
      </el-form-item>
      <el-form-item label="打分来源">
        <el-select
          v-model="queryForm.source_type"
          :clearable="true"
          size="small"
          class="max-width-150"
          placeholder="打分来源"
        >
          <el-option label="平台" value="1"></el-option>
          <el-option v-if="queryForm.target_type !== 2" label="实验室" value="2"></el-option>
          <el-option v-if="queryForm.target_type === 1" label="课题组" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="单位">
        <el-select
          v-model="queryForm.factory_id"
          :clearable="false"
          size="small"
          class="max-width-150"
          placeholder="单位"
        >
          <el-option :label="factory.name" :value="factory.id" :key="idx" v-for="(factory,idx) in getSelectableFactories()"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button round size="small" @click="resetQuery">查询</el-button>
      </el-form-item>
      <el-form-item v-if="add_auth" class="right">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="toAdd(0)"
          >添加评分</el-button
        >
      </el-form-item>
    </el-form>
    <el-table :header-cell-style="{ background: '#fafafa' }" :data="list" style="width: 100%">
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="date" label="评分日期" />
      <el-table-column prop="total_score" label="得分" />
      <el-table-column prop="max_score" label="总分" />
      <el-table-column label="得分率">
        <template slot-scope="scope"> {{ scope.row.total_score_100 }}% </template>
      </el-table-column>
      <el-table-column label="打分来源">
        <template slot-scope="scope">
          {{ getSourceType(scope.row.source_type) }}
          <span v-if="scope.row.source_name">({{ scope.row.source_name }})</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="source_name" label="打分来源" /> -->
      <el-table-column prop="creator_name" label="打分人" />
      <el-table-column label="图片">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="
              img_urls = scope.row.img_urls;
              img1Visible = true;
            "
            >查看图片</el-button
          >
        </template>
      </el-table-column>
      <el-table-column prop="factory_id" label="单位">
        <template slot-scope="scope">
          {{getFactoryName(scope.row.factory_id)}}
        </template>
      </el-table-column>
      <el-table-column v-if="edit_auth || delete_auth" width="180" label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="
              edit_auth &&
              scope.row.source_type === source_type &&
              scope.row.source_id === source_id
            "
            size="mini"
            type="primary"
            @click="toAdd(scope.row)"
            >修改</el-button
          >
          <el-button
            v-if="
              delete_auth &&
              scope.row.source_type === source_type &&
              scope.row.source_id === source_id
            "
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
      <div slot="empty">
        <empty />
      </div>
    </el-table>
    <el-pagination
      class="dl-pagination"
      :hide-on-single-page="true"
      background
      :page-sizes="[10, 30, 50]"
      layout="total, prev, pager, next, sizes, jumper"
      :total="total"
      :current-page="queryForm.page"
      :page-size="queryForm.size"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-dialog
      :title="
        '对' + (user_name ? user_name : platform_name ? platform_name : group_name) + '进行评分'
      "
      :modal="false"
      :visible.sync="dialogVisible"
      :fullscreen="true"
    >
      <el-form ref="form" :model="form" label-width="150px">
        <el-form-item :label="getType()">{{ getName() }}</el-form-item>
        <el-form-item label="打分日期" prop="date">{{ form.date }}</el-form-item>
        <el-form-item :label="item.name" v-for="(item, index) in scoreList" :key="index">
          <div class="question-answer" v-for="(item1, index1) in item.items" :key="index1">
            <div class="question-title">{{ index1 + 1 }}. {{ item1.name }}</div>
            <div>
              <el-radio-group v-model="item1.answer">
                <el-radio
                  v-for="item2 in JSON.parse(item1.items)"
                  :key="item2.name"
                  :label="item2.name"
                  >{{ item2.name }}:{{ item2.score }}分</el-radio
                >
              </el-radio-group>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="图片" prop="date">
          <div
            v-for="(item, index) in img_urls"
            :key="index"
            style="
              float: left !important;
              width: 178px;
              height: 178px;
              margin-right: 10px;
              margin-bottom: 18px;
            "
          >
            <img :src="domain + item" style="width: 160px; height: 130px" class="uploader-img" />
            <div style="font-size: 30px; text-align: center" class="edl-icon-container">
              <i
                class="cursor-pointer el-icon-zoom-in edl-icon"
                @click="
                  imgVisible = true;
                  dialogImageUrl = domain + item;
                "
              ></i>
              <i class="cursor-pointer el-icon-delete edl-icon" @click="deleteImg(index)"></i>
            </div>
          </div>
          <el-card
            v-if="img_urls.length < 9"
            style="float: left"
            shadow="never"
            class="edl-upload-card"
          >
            <el-upload
              class="img-uploader"
              name="edianlaiImg"
              list-type="picture"
              :action="uploadUrl"
              :show-file-list="false"
              accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PNG,.GIF,.BMP"
              :headers="authHeader"
              :on-success="handleUploadSuccess"
              :before-upload="beforeUpload"
            >
              <i class="el-icon-plus img-uploader-icon"></i>
            </el-upload>
          </el-card>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="submit('form')">保 存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="imgVisible" :modal="false">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
    <el-dialog :visible.sync="img1Visible" :modal="false">
      <img
        width="100%"
        v-for="(item, index) in img_urls"
        :key="index"
        :src="domain + item"
        alt=""
      />
      <empty v-if="img_urls.length === 0" description="未上传图片" />
    </el-dialog>
  </div>
</template>
<script>
import {
  platformScoreTypeList,
  platformScoreRecordList,
  addPlatformScoreRecord,
  editPlatformScoreRecord,
  deletePlatformScoreRecord,
} from '@/api/grade';
import { uploadUrl } from '@/api/public';
import { checkImgFile } from '@/utils/index';
import Empty from '@/components/Empty';

export default {
  name: 'grade',
  components: {
    Empty,
  },
  props: {
    target_type: {
      type: Number,
      default: 1, //1用户，2实验室，3课题组
    },
    factory_id: {
      type: Number,
      default: 1, //1用户，2实验室，3课题组
    },
    target_id: {
      type: Number,
      default: 1, //如果target_type为1传用户ID，target_type为2传实验室ID，target_type为3传课题组ID
    },
    source_type: {
      // type: ,
      default: '', //打分者类型,1平台，2实验室，3课题组
    },
    source_id: {
      type: Number,
      default: 0, //如果source_type为1，传0；如果为2，传实验室ID；如果是3，传课题组ID
    },
    user_name: {
      type: String,
    },
    platform_name: {
      type: String,
    },
    group_name: {
      type: String,
    },
    add_auth: {
      type: Number | Boolean,
      default: 0,
    },
    edit_auth: {
      type: Number | Boolean,
      default: 0,
    },
    delete_auth: {
      type: Number | Boolean,
      default: 0,
    },
  },
  data() {
    return {
      loading: false,
      imgVisible: false,
      img1Visible: false,
      dialogVisible: false,
      dialogImageUrl: '',
      list: [],
      scoreList: [],
      img_urls: [],
      total: 0,
      uploadUrl: uploadUrl,
      domain: process.env.VUE_APP_DOMAIN,
      form: {
        id: '',
        date: '',
        target_type: '',
        target_id: '',
        source_type: '',
        source_id: '',
        data: [],
        img_urls: '',
      },
      queryForm: {
        page: 1,
        size: 10,
        date: '',
        source_type: '',
        factory_id: '',
      },
    };
  },
  created() {
    var today = new Date();
    this.form.date =
      today.getFullYear() +
      '-' +
      (today.getMonth() < 9 ? '0' : '') +
      (today.getMonth() + 1) +
      '-' +
      (today.getDate() < 10 ? '0' : '') +
      today.getDate();
    this.form.target_type = this.target_type;
    this.form.target_id = this.target_id;
    this.form.source_type = this.source_type;
    this.form.source_id = this.source_id;
    this.queryForm.target_type = this.target_type;
    this.queryForm.target_id = this.target_id;
    this.queryForm.factory_id = this.factory_id;
    this.queryList();
  },
  methods: {
    queryList() {
      this.loading = true;
      platformScoreRecordList(this.queryForm)
        .then((res) => {
          this.loading = false;
          if (res.status === 200) {
            this.list = res.data.data;
            this.total = res.data.total;
          }
        })
        .catch((_) => {
          this.loading = false;
        });
    },
    resetQuery() {
      this.queryForm.page = 1;
      this.queryList();
    },
    queryScoreList(row) {
      var type = this.target_type === 1 ? 3 : this.target_type === 2 ? 1 : 2;
      var temp = {};
      platformScoreTypeList({
        type,
        size: 100,
      }).then((res) => {
        if (res.status === 200) {
          this.scoreList = [];
          if (row) {
            // console.log(row)
            res.data.data.forEach((item, index) => {
              temp = item;
              temp.items.forEach((item1, index1) => {
                item1.answer = '';
                row.data.forEach((score, ind) => {
                  if (score.score_item_id == item1.id) {
                    item1.answer = score.name;
                  }
                });
              });
              this.scoreList.push(temp);
            });
          } else {
            res.data.data.forEach((item, index) => {
              temp = item;
              temp.items.forEach((item1, index1) => {
                item1.answer = '';
              });
              this.scoreList.push(temp);
            });
          }
        }
      });
    },
    toAdd(item) {
      if (item) {
        this.form.id = item.id;
        this.form.date = item.date;
        this.img_urls = item.img_urls;
        this.form.img_urls = item.img_urls.join(',');
      } else {
        var today = new Date();
        this.form.id = '';
        this.img_urls = [];
        this.form.date =
          today.getFullYear() +
          '-' +
          (today.getMonth() < 9 ? '0' : '') +
          (today.getMonth() + 1) +
          '-' +
          (today.getDate() < 10 ? '0' : '') +
          today.getDate();
      }
      this.queryScoreList(item);
      this.dialogVisible = true;
    },
    submit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          let msg = '';
          let that = this;
          this.form.data = [];
          this.scoreList.forEach((item, index) => {
            item.items.forEach((item1, index1) => {
              if (item1.answer) {
                that.form.data.push({
                  name: item1.answer,
                  score_item_id: item1.id,
                });
              } else {
                msg += index + 1 + '，';
              }
            });
          });
          if (msg) {
            this.$message.error('有未打分的项');
            return false;
          }
          this.form.data = JSON.stringify(this.form.data);
          if (this.form.id) {
            editPlatformScoreRecord(this.form).then((response) => {
              if (response.status === 1) {
                this.queryList();
                this.dialogVisible = false;
              }
            });
          } else {
            addPlatformScoreRecord(this.form).then((response) => {
              if (response.status === 1) {
                this.queryList();
                this.dialogVisible = false;
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    handleDelete(item) {
      this.$confirm('确定要删除该评分吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deletePlatformScoreRecord({
          id: item.id,
          is_deleted: 1,
        }).then((response) => {
          if (response.status === 1) {
            this.queryList();
          }
        });
      });
    },
    deleteImg(index) {
      this.img_urls.splice(index, 1);
      this.form.img_urls = this.img_urls.join(',');
    },
    getName() {
      if (this.target_type === 1) {
        return this.user_name;
      } else if (this.target_type === 2) {
        return this.platform_name;
      } else {
        return this.group_name;
      }
    },
    getType() {
      if (this.target_type === 1) {
        return '用户';
      } else if (this.target_type === 2) {
        return '实验室';
      } else {
        return '课题组';
      }
    },
    getSourceType(type) {
      if (type === 1) {
        return '平台';
      } else if (type === 2) {
        return '实验室';
      } else if (type === 3) {
        return '课题组';
      } else {
        return '仪器管理员';
      }
    },
    handleUploadSuccess(res, file) {
      res = this.decrypt(res);
      if (res.status === 200) {
        this.img_urls.push(res.data.url);
        this.form.img_urls = this.img_urls.join(',');
      }
    },
    beforeUpload(file) {
      return checkImgFile(file, 2, this.$message);
    },
    handleSizeChange(val) {
      this.queryForm.size = val;
      this.queryList();
    },
    handleCurrentChange(val) {
      this.queryForm.page = val;
      this.queryList();
    },
  },
};
</script>
