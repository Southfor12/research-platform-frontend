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
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" size="small" class="width-200" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="化学物登记号" prop="cas">
            <el-input v-model="form.cas" size="small" class="width-200" clearable />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="RFID标签" prop="rfid">
            <el-input v-model="form.rfid" size="small" class="width-200" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="厂家名称" prop="factory_name">
            <el-input v-model="form.factory_name" size="small" class="width-200" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="级别" prop="levels_arr">
            <el-select
              class="width-200"
              v-model="form.levels_arr"
              size="small"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="请输入文字然后回车添加级别"
            >
              <el-option
                v-for="item in levelOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="规格" prop="specifications_arr">
            <el-select
              v-model="form.specifications_arr"
              size="small"
              multiple
              filterable
              allow-create
              default-first-option
              class="width-200"
              placeholder="请输入文字然后回车添加规格"
            >
              <el-option
                v-for="item in specificationsOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="计量方式" prop="unit_type">
            <el-select
              v-model="form.unit_type"
              size="small"
              class="width-200"
              placeholder="请选择计量方式"
            >
              <el-option label="称重" value="1"></el-option>
              <el-option label="数量" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="库存" prop="number">
            <el-input-number
              v-model="form.number"
              :min="0"
              size="small"
              label="库存"
              class="width-200"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="单位" prop="unit">
            <el-input v-model="form.unit" size="small" class="width-200" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="1单位量" prop="price_number">
            <el-input v-model="form.price_number" size="small" class="width-200" clearable />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="1单位量价格" prop="price">
            <el-input v-model="form.price" size="small" class="width-200" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="科研组室" prop="platform_id">
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
              <el-option
                v-for="item in platforms"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="是否需要审核">
            <el-select
              v-model="form.need_audit"
              size="small"
              class="width-200"
              placeholder="是否工作中"
            >
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否共享">
            <el-select
              v-model="form.is_sharing"
              size="small"
              class="width-200"
              placeholder="是否共享"
            >
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="负责人1" prop="admin_id_1">
            <el-select
              v-model="form.admin_id_1"
              size="small"
              clearable
              class="width-200"
              filterable
              remote
              reserve-keyword
              :remote-method="getUsers"
              placeholder="输入姓名搜索选择"
            >
              <el-option v-for="item in users" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="负责人2" prop="admin_id_2">
            <el-select
              v-model="form.admin_id_2"
              size="small"
              clearable
              class="width-200"
              filterable
              remote
              reserve-keyword
              :remote-method="getUsers"
              placeholder="输入姓名搜索选择"
            >
              <el-option v-for="item in users" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="单位">
        <el-select v-model="form.factory_id" :clearable="false" size="small" class="width-200" placeholder="选择单位">
          <el-option :label="factory.name" :value="factory.id" :key="idx" v-for="(factory,idx) in getSelectableFactories()"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="说明书" prop="msds_content">
        <tinymce v-model="form.msds_content" :height="500" />
      </el-form-item>

      <el-form-item label="介绍">
        <el-input
          type="textarea"
          size="small"
          class="width-500"
          :rows="5"
          v-model="form.introduction"
        ></el-input>
      </el-form-item>

      <el-form-item label="备注">
        <el-input
          type="textarea"
          size="small"
          class="width-500"
          :rows="5"
          v-model="form.note"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="submit('form')">保 存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { hcsInfo, addHcs, editHcs } from '@/api/hcs';
import { platformList } from '@/api/platform';
import { userList } from '@/api/user';
import Tinymce from '@/components/Tinymce';

export default {
  components: {
    Tinymce,
  },
  data() {
    return {
      loading: false,
      form: {
        id: '',
        name: '',
        cas: '',
        rfid: '',
        msds_url: '',
        msds_content: '',
        factory_name: '',
        levels_arr: [],
        levels: '',
        specifications: '',
        specifications_arr: [],
        unit: '',
        number: '',
        price: '',
        price_number: '',
        unit_type: '',
        platform_id: '',
        admin_id_1: '',
        admin_id_2: '',
        is_sharing: '0',
        need_audit: '0',
        introduction: '',
        note: '',
        factory_id: '',
      },
      users: [],
      types: [],
      platforms: [],
      levelOptions: [],
      specificationsOptions: [],
      searchUserForm: {
        page: 1,
        size: 30,
        status: 1,
        is_inner: 1,
        name: '',
      },
      searchTypeForm: {
        page: 1,
        size: 30,
        is_deleted: 0,
        name: '',
      },
      searchPlatformForm: {
        page: 1,
        size: 30,
        is_deleted: 0,
        name: '',
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'blur',
          },
          // { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        factory_name: [
          {
            required: true,
            message: '请输入厂家名称',
            trigger: 'blur',
          },
        ],
        msds_content: [
          {
            required: true,
            message: '请输入说明书内容',
            trigger: 'blur',
          },
        ],
        cas: [
          {
            required: true,
            message: '请输入化学物登记号',
            trigger: 'blur',
          },
        ],
        rfid: [
          {
            required: true,
            message: '请输入RFID标签',
            trigger: 'blur',
          },
        ],
        unit: [
          {
            required: true,
            message: '请输入单位',
            trigger: 'blur',
          },
        ],
        number: [
          {
            required: true,
            message: '请输入库存',
            trigger: 'blur',
          },
        ],
        price_number: [
          {
            required: true,
            message: '请输入1单位量',
            trigger: 'blur',
          },
        ],
        price: [
          {
            required: true,
            message: '请输入1单位量价格',
            trigger: 'blur',
          },
        ],
        platform_id: [
          {
            required: true,
            message: '请选择子平台/实验室',
            trigger: 'change',
          },
        ],
        levels_arr: [
          {
            required: true,
            message: '请添加等级',
            trigger: 'change',
          },
        ],
        specifications_arr: [
          {
            required: true,
            message: '请添加规格',
            trigger: 'change',
          },
        ],
        admin_id_1: [
          {
            required: true,
            message: '请选择负责人1',
            trigger: 'change',
          },
        ],
        admin_id_2: [
          {
            required: true,
            message: '请选择负责人2',
            trigger: 'change',
          },
        ],
        unit_type: [
          {
            required: true,
            message: '请选择计量方式',
            trigger: 'change',
          },
        ],
        type: [
          {
            required: true,
            message: '请选择类型',
            trigger: 'change',
          },
        ],
        reagent_level_id: [
          {
            required: true,
            message: '请选择危化等级',
            trigger: 'change',
          },
        ],
      },
    };
  },
  created() {
    this.form.factory_id = this.currentFactoryId;
    if (this.$route.params.id) {
      this.getUsers();
      this.getInfo();
    } else {
      this.getUsers();
      this.getPlatforms();
    }
  },
  methods: {
    getInfo() {
      this.form.id = this.$route.params.id;
      if (this.form.id) {
        hcsInfo({
          id: this.form.id,
        }).then((response) => {
          if (response.status !== 200) {
            this.returnToList();
          } else {
            const data = response.data;
            this.form.name = data.name;
            this.form.factory_name = data.factory_name;
            this.form.cas = data.cas;
            this.form.rfid = data.rfid;
            this.form.levels = data.levels;
            this.form.specifications = data.specifications;
            this.form.levels_arr = data.levels.split(',');
            this.form.factory_id = data.factory_id;

            this.form.specifications_arr = data.specifications.split(',');
            data.levels.split(',').forEach((element) => {
              this.levelOptions.push({
                lable: element,
                value: element,
              });
            });
            data.specifications.split(',').forEach((element) => {
              this.specificationsOptions.push({
                lable: element,
                value: element,
              });
            });
            this.form.msds_content = data.msds_content;
            this.form.msds_url = data.msds_url;
            this.form.unit_type = String(data.unit_type);
            this.form.type = String(data.type);
            this.form.need_audit = String(data.need_audit);
            this.form.reagent_level_id = data.reagent_level_id;
            this.form.platform_id = data.platform_id;
            this.form.is_sharing = String(data.is_sharing);
            this.form.admin_id_1 = data.admin_id_1;
            this.form.admin_id_2 = data.admin_id_2;
            this.form.introduction = data.introduction;
            this.form.number = data.number;
            this.form.note = data.note;
            this.form.unit = data.unit;
            this.form.price = data.price;
            this.form.price_number = data.price_number;
            if (data.platform_id != '0') {
              this.getPlatforms(data.platform_name);
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
          if (this.form.admin_id_1 == this.form.admin_id_2) {
            this.$message.error('两位负责人不能是同一个人');
            return false;
          }
          this.form.levels = this.form.levels_arr.join(',');
          this.form.specifications = this.form.specifications_arr.join(',');
          this.loading = true;
          if (this.form.id) {
            editHcs(this.form)
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
            addHcs(this.form)
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
    getUsers(query = '') {
      this.searchUserForm.name = query;
      userList(this.searchUserForm).then((res) => {
        if (res.status === 200) {
          this.users = res.data.data;
        }
      });
    },
    getPlatforms(query = '') {
      this.searchPlatformForm.name = query;
      platformList(this.searchPlatformForm).then((res) => {
        if (res.status === 200) {
          this.platforms = res.data.data;
        }
      });
    },
    handleUploadSuccess(res, file) {
      res = this.decrypt(res);
      if (res.status === 200) {
        this.form.picture = res.data.url;
      }
    },
    returnToList() {
      this.$router.push({
        path: '/hcs/list',
      });
    },
  },
};
</script>
