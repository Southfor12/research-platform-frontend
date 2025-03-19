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
            <el-select
              :disabled="form.id > 0"
              @change="onFactoryChange"
              v-model="form.factory_id"
              :clearable="false"
              size="small"
              class="width-200"
              placeholder="选择单位"
            >
              <el-option
                :label="factory.name"
                :value="factory.id"
                :key="idx"
                v-for="(factory, idx) in getSelectableFactories()"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <!-- <el-form-item label="编号" prop="no">
            <el-input v-model="form.no" size="small" class="width-200" />
          </el-form-item> -->
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" size="small" class="width-200" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="编号" prop="no">
            <el-input v-model="form.no" size="small" class="width-200" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="刷卡器地址">
            <el-input
              v-model="form.ip_address"
              size="small"
              class="width-200"
              placeholder="刷卡器地址"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="锁屏电脑ID">
            <el-input
              v-model="form.screen_id"
              size="small"
              class="max-width-200"
              placeholder="锁屏电脑ID"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="摄像头IP地址">
            <el-input
              v-model="form.camera_ip"
              size="small"
              class="width-200"
              placeholder="摄像头IP地址"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="国别">
            <el-input v-model="form.country" size="small" class="width-200" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="厂家">
            <el-input v-model="form.factory" size="small" class="width-200" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="型号">
            <el-input v-model="form.model" size="small" class="width-200" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="放置地点">
            <el-input v-model="form.address" size="small" class="width-200" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="价格">
            <el-input v-model="form.price" size="small" class="width-200" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="实验室" prop="platform_id">
            <el-select
              v-model="form.platform_id"
              size="small"
              class="width-200"
              filterable
              @change="platformChange"
              placeholder="请选择实验室"
            >
              <el-option
                v-for="item in platforms"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="房间" prop="platform_room_id">
            <el-select
              :disabled="!form.platform_id"
              v-model="form.platform_room_id"
              size="small"
              class="width-200"
              filterable
              placeholder="请选择房间"
            >
              <el-option v-for="item in rooms" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="负责人" prop="admin_id">
            <el-select
              filterable
              v-model="form.admin_id"
              size="small"
              class="width-200"
              placeholder="输入姓名搜索选择"
            >
              <el-option v-for="item in users" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="仪器类型" prop="type_id">
            <el-select
              v-model="form.type_id"
              size="small"
              class="width-200"
              filterable
              remote
              reserve-keyword
              :remote-method="getTypes"
              placeholder="输入名称搜索选择"
            >
              <el-option v-for="item in types" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="form.need_train == 1 ? 6 : 12">
          <el-form-item label="是否需要培训" prop="need_train">
            <el-select
              v-model="form.need_train"
              size="small"
              class="width-200"
              placeholder="是否需要培训"
            >
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <!--  <el-col :span="6" v-show="form.need_train == 1">
          <el-form-item label="培训设置" prop="train_type">
            <el-select v-model="form.train_type" size="small" class="width-200" placeholder="培训授权类型">
              <el-option label="通过任意仪器或技术培训" :value="0"></el-option>
              <el-option label="仅需通过仪器培训" :value="1"></el-option>
              <el-option label="仅需通过技术培训" :value="2"></el-option>
              <el-option label="同时通过仪器和技术培训" :value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col> -->

        <el-col :span="12">
          <el-form-item label="是否需要考试" prop="need_auth">
            <el-select
              v-model="form.need_auth"
              size="small"
              class="width-200"
              placeholder="是否需要考试"
            >
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="开放方式" prop="share_type_arr">
            <el-select
              v-model="form.share_type_arr"
              size="small"
              multiple
              placeholder="请选择开放方式"
              class="width-200"
            >
              <el-option label="自主测样" value="1"></el-option>
              <el-option label="送样检测" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="重要性" prop="importance">
            <el-select
              v-model="form.importance"
              size="small"
              class="width-200"
              placeholder="重要性"
            >
              <el-option label="一般" :value="1"></el-option>
              <el-option label="特殊" :value="2"></el-option>
              <el-option label="贵重" :value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="仪器状态" prop="status">
            <el-select
              v-model="form.status"
              size="small"
              class="width-200"
              placeholder="是否工作中"
            >
              <el-option label="正常" :value="1"></el-option>
              <el-option label="维护" :value="2"></el-option>
              <el-option label="损坏" :value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="工作状态" prop="is_working">
            <el-select
              v-model="form.is_working"
              size="small"
              class="width-200"
              placeholder="是否工作中"
            >
              <el-option label="正在工作" :value="1"></el-option>
              <el-option label="停止工作" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="form.status > 1">
        <el-col :span="12">
          <el-form-item label="损坏/维护原因" prop="breakdown_cause">
            <el-input
              v-model="form.breakdown_cause"
              type="textarea"
              :rows="3"
              class="width-200"
              placeholder="请输入损坏/维护原因"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="损坏/维护时间" prop="breakdown_at">
            <el-date-picker
              v-model="form.breakdown_at"
              :picker-options="pickerOptions"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="请选择损坏/维护时间"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="开放预约" prop="is_sharing">
            <el-select
              v-model="form.is_sharing"
              size="small"
              class="width-200"
              placeholder="是否开放预约"
            >
              <el-option label="开放" :value="1"></el-option>
              <el-option label="不开放" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否需要审核" prop="need_audit" required>
            <el-switch v-model="form.need_audit" :active-value="1" :inactive-value="0"> </el-switch>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="注意事项" prop="notice">
        <tinymce v-model="form.notice" :height="500" width="80%" />
      </el-form-item>

      <el-form-item label="设备图片" prop="picture">
        <el-card shadow="never" class="edl-upload-card">
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
            :with-credentials="true"
          >
            <img v-if="form.picture" :src="domain + form.picture" class="uploader-img" />
            <i v-else class="el-icon-plus img-uploader-icon"></i>
          </el-upload>
          <div v-if="form.picture" class="edl-icon-container">
            <i class="el-icon-zoom-in edl-icon" @click="showBigImg(domain + form.picture)"></i>
            <i class="el-icon-delete edl-icon" @click="form.picture = ''"></i>
          </div>
        </el-card>
      </el-form-item>
      <el-form-item label="介绍">
        <el-input
          type="textarea"
          size="small"
          class="max-width-500"
          :rows="5"
          v-model="form.introduction"
        ></el-input>
      </el-form-item>
      <el-form-item label="性能指标">
        <el-input
          type="textarea"
          size="small"
          class="max-width-500"
          :rows="5"
          v-model="form.performance"
        ></el-input>
      </el-form-item>
      <el-form-item label="主要应用">
        <el-input
          type="textarea"
          size="small"
          class="max-width-500"
          :rows="5"
          v-model="form.application"
        ></el-input>
      </el-form-item>
      <el-form-item label="样品要求">
        <el-input
          type="textarea"
          size="small"
          class="max-width-500"
          :rows="5"
          v-model="form.sample_require"
        ></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          type="textarea"
          size="small"
          class="max-width-500"
          :rows="5"
          v-model="form.note"
        ></el-input>
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
import { apparatusTypeList, apparatusInfo, addApparatus, editApparatus } from '@/api/apparatus';
import { allPlatforms, platformUserList, getRooms } from '@/api/platform';
import { allUsers } from '@/api/user';
import { uploadUrl } from '@/api/public';
import { checkImgFile } from '@/utils/index';
import Tinymce from '@/components/Tinymce';

export default {
  components: {
    Tinymce,
  },
  data() {
    return {
      loading: false,
      dialogImageUrl: '',
      dialogVisible: false,
      uploadUrl: uploadUrl,
      form: {
        id: '',
        name: '',
        no: '',
        country: '',
        factory: '',
        model: '',
        camera_ip: '',
        address: '',
        price: '',
        importance: '',
        picture: '',
        type_id: '',
        platform_id: '',
        platform_room_id: '',
        is_working: '',
        need_auth: '',
        need_train: 0, //是否需要先参加培训，1是，0否
        train_type: 0, //培训类型: 0仪器培训或技术培训；1仪器培训；2技术培训；3仪器培训和技术培训
        is_sharing: '',
        status: '',
        ip_address: '',
        screen_id: '',
        admin_id: '',
        introduction: '',
        share_type: '',
        share_type_arr: [],
        performance: '',
        application: '',
        breakdown_cause: '',
        breakdown_at: '',
        sample_require: '',
        notice: '',
        note: '',
        need_audit: 1,
        factory_id: '',
      },
      domain: process.env.VUE_APP_DOMAIN,
      users: [],
      types: [],
      platforms: [],
      rooms: [],
      searchUserForm: {
        page: 1,
        size: 500,
        platform_id: '',
        is_deleted: 0,
      },
      searchTypeForm: {
        page: 1,
        size: 200,
        is_deleted: 0,
        name: '',
      },
      searchPlatformForm: {
        page: 1,
        size: 200,
        is_deleted: 0,
        type: 2,
        name: '',
        factory_id: '',
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      rules: {
        factory_id: [
          {
            required: true,
            message: '请选择单位',
            trigger: 'blur',
          },
        ],
        name: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'blur',
          },
        ],
        no: [
          {
            required: true,
            message: '请输入编号',
            trigger: 'blur',
          },
          // { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        notice: [
          {
            required: true,
            message: '请填写注意事项',
            trigger: 'blur',
          },
        ],
        breakdown_cause: [
          {
            required: true,
            message: '请填写损坏/维护原因',
            trigger: 'blur',
          },
        ],
        breakdown_at: [
          {
            required: true,
            message: '请选择损坏/维护时间',
            trigger: 'change',
          },
        ],
        need_auth: [
          {
            required: true,
            message: '请选择是否需要考试',
            trigger: 'change',
          },
        ],
        need_train: [
          {
            required: true,
            message: '请选择是否需要培训',
            trigger: 'change',
          },
        ],
        // train_type: [{
        //   required: true,
        //   message: '请选择培训类型',
        //   trigger: 'change',
        // }, ],
        share_type_arr: [
          {
            required: true,
            message: '请选择开放方式',
            trigger: 'change',
          },
        ],
        admin_id: [
          {
            required: true,
            message: '请选择负责人',
            trigger: 'change',
          },
        ],
        status: [
          {
            required: true,
            message: '请选择仪器状态',
            trigger: 'change',
          },
        ],
        importance: [
          {
            required: true,
            message: '请选择重要性',
            trigger: 'change',
          },
        ],
        type_id: [
          {
            required: true,
            message: '请选择仪器类型',
            trigger: 'change',
          },
        ],
        platform_id: [
          {
            required: true,
            message: '请选择实验室',
            trigger: 'change',
          },
        ],
        // platform_room_id: [{
        //   required: true,
        //   message: '请选择房间',
        //   trigger: 'change',
        // }, ],
        is_working: [
          {
            required: true,
            message: '请选择工作状态',
            trigger: 'change',
          },
        ],
        is_sharing: [
          {
            required: true,
            message: '请选择开放状态',
            trigger: 'change',
          },
        ],
      },
    };
  },
  mounted() {},
  created() {
    this.form.factory_id = this.currentFactoryId;

    this.getUsers();

    if (this.$route.params.id) {
      this.getInfo();
    } else {
      this.getPlatforms();
    }
    this.getTypes();
  },
  methods: {
    getInfo() {
      this.form.id = this.$route.params.id;
      if (this.form.id) {
        apparatusInfo({
          id: this.form.id,
        }).then((response) => {
          if (response.status !== 200) {
            this.returnToList();
          } else {
            const data = response.data;
            this.form.name = data.name;
            this.form.no = data.no;
            this.form.importance = data.importance;
            this.form.picture = data.picture;
            this.form.type_id = data.type_id;
            this.form.platform_id = data.platform_id;
            this.form.camera_ip = data.camera_ip;
            this.form.platform_room_id = data.platform_room_id;
            this.form.is_working = data.is_working;
            this.form.need_auth = data.need_auth;
            this.form.need_train = data.need_train;
            this.form.train_type = data.train_type;
            this.form.is_sharing = data.is_sharing;
            this.form.ip_address = data.ip_address;
            this.form.screen_id = data.screen_id;
            this.form.status = data.status;
            this.form.admin_id = data.admin_id;
            this.form.introduction = data.introduction;
            this.form.note = data.note;
            this.form.country = data.country;
            this.form.factory = data.factory;
            this.form.model = data.model;
            this.form.address = data.address;
            this.form.price = data.price;
            this.form.performance = data.performance;
            this.form.application = data.application;
            this.form.sample_require = data.sample_require;
            this.form.notice = data.notice;
            this.form.breakdown_at = data.breakdown_at;
            this.form.breakdown_cause = data.breakdown_cause;
            this.form.need_audit = data.need_audit;
            this.form.factory_id = data.factory_id;
            this.form.share_type_arr = data.share_type.split(',');
            this.platformChange(this.form.platform_id);
            this.getPlatforms();
            this.getTypes();
          }
        });
      } else {
        this.returnToList();
      }
    },
    onFactoryChange() {
      console.log('onFactoryChange');
      this.form.platform_id = '';
      this.form.platform_room_id = '';

      this.getPlatforms();
      this.getUsers();
      // this.getTypes();
    },
    submit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          if (!this.form.picture) {
            this.$message.error('请上传设备图片');
            return false;
          }
          this.loading = true;
          this.form.share_type = this.form.share_type_arr.join(',');
          if (this.form.id) {
            editApparatus(this.form)
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
            addApparatus(this.form)
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
    platformChange(value) {
      this.rooms = [];
      this.form.platform_room_id = '';
      getRooms({
        platform_id: this.form.platform_id,
      }).then((res) => {
        this.rooms = res.data;
        if (this.rooms.length > 0) {
          if (!this.form.platform_room_id) {
            this.form.platform_room_id = this.rooms[0].id;
          }
        }
      });
    },
    getUsers() {
      this.searchUserForm.factory_id = this.form.factory_id;

      allUsers(this.searchUserForm).then((res) => {
        if (res.status === 200) {
          this.users = res.data.users.map((item) => {
            return {
              id: item.id,
              name: item.name,
            };
          });
          if (!this.form.admin_id) {
            this.form.admin_id = this.users[0].id;
          }
        }
      });
    },
    getTypes(query = '') {
      this.searchTypeForm.name = query;
      this.searchTypeForm.factory_id = this.form.factory_id;

      apparatusTypeList(this.searchTypeForm).then((res) => {
        if (res.status === 200) {
          this.types = res.data.data;
        }
      });
    },
    getPlatforms(query = '') {
      this.searchPlatformForm.name = query;
      this.searchPlatformForm.factory_id = this.form.factory_id;

      allPlatforms(this.searchPlatformForm).then((res) => {
        if (res.status === 200) {
          this.platforms = res.data.platforms;
          this.platforms = this.platforms.filter((r) => {
            return r.factory_id == this.form.factory_id;
          });
          if (this.form.platform_id) {
            this.platforms.forEach((item) => {
              if (item.id === this.form.platform_id) {
                this.rooms = item.rooms;
              }
            });
          }
        }
      });
    },
    handleUploadSuccess(res, file) {
      res = this.decrypt(res);
      if (res.status === 200) {
        this.form.picture = res.data.url;
      }
    },
    beforeUpload(file) {
      return checkImgFile(file, 2, this.$message);
    },
    showBigImg(url) {
      this.dialogImageUrl = url;
      this.dialogVisible = true;
    },
    returnToList() {
      this.$router.push({
        path: '/apparatus/list',
      });
    },
  },
};
</script>
