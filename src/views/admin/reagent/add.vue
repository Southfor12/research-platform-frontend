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
          <el-form-item label="类型" prop="type">
            <el-select
              v-model="form.type"
              :clearable="true"
              size="small"
              placeholder="重要性"
              class="width-200"
            >
              <el-option label="试剂类" value="1"></el-option>
              <el-option label="办公用品类" value="2"></el-option>
              <el-option label="低值易耗品" value="3"></el-option>
              <el-option label="高值耗材" value="4"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="试剂类型" prop="reagent_level_id">
            <el-select
              v-model="form.reagent_level_id"
              size="small"
              clearable
              class="width-200"
              placeholder="试剂类型"
            >
              <el-option v-for="item in types" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
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
          <el-form-item label="单位" prop="unit">
            <el-input v-model="form.unit" size="small" class="width-200" clearable />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="1单位量" prop="price_number">
            <el-input v-model="form.price_number" size="small" class="width-200" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="1单位量价格" prop="price">
            <el-input v-model="form.price" size="small" class="width-200" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
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
              @change="platformChange"
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
          <el-form-item label="负责人" v-if="form.platform_id !== undefined">
            <el-select
              v-model="form.admin_id"
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
          <el-form-item label="介绍">
            <el-input
              type="textarea"
              size="small"
              class="width-200"
              v-model="form.introduction"
            ></el-input>
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

      <el-form-item label="备注">
        <el-input
          type="textarea"
          size="small"
          :rows="5"
          class="width-500"
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
import {
  reagentLevelList,
  reagentLevelInfo,
  reagentInfo,
  addReagent,
  editReagent,
} from '@/api/reagent';
import { platformList } from '@/api/platform';
import { userList } from '@/api/user';

export default {
  data() {
    return {
      loading: false,
      form: {
        id: '',
        name: '',
        type: '',
        factory_name: '',
        reagent_level_id: '',
        unit: '',
        price: '',
        price_number: '',
        number: '',
        unit_type: '',
        platform_id: '',
        admin_id: '',
        is_sharing: '0',
        need_audit: '0',
        introduction: '',
        note: '',
      },
      users: [],
      types: [],
      platforms: [],
      searchUserForm: {
        page: 1,
        size: 30,
        platform_id: '',
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
    this.getTypes();
    if (this.$route.params.id) {
      this.getInfo();
    } else {
      // this.getUsers()
      this.getPlatforms();
    }
  },
  methods: {
    getInfo() {
      this.form.id = this.$route.params.id;
      if (this.form.id) {
        reagentInfo({
          id: this.form.id,
        }).then((response) => {
          if (response.status !== 200) {
            this.returnToList();
          } else {
            const data = response.data;
            this.form.name = data.name;
            this.form.factory_name = data.factory_name;
            this.form.unit_type = String(data.unit_type);
            this.form.type = String(data.type);
            this.form.need_audit = String(data.need_audit);
            this.form.reagent_level_id = data.reagent_level_id;
            this.form.platform_id = data.platform_id;
            this.form.is_sharing = String(data.is_sharing);
            this.form.admin_id = data.admin_id;
            this.form.introduction = data.introduction;
            this.form.note = data.note;
            this.form.unit = data.unit;
            this.form.price = data.price;
            this.form.price_number = data.price_number;
            this.form.number = data.number;
            if (data.admin_id != '0') {
              this.getUsers(data.admin_name);
            } else {
              this.form.admin_id = '';
            }
            if (data.platform_id != '0') {
              this.getPlatforms(data.platform_name);
            } else {
              this.form.platform_id = '';
            }
            // reagentLevelInfo({ id: this.form.reagent_level_id, is_deleted: 0 }).then(res => {
            //     if (res.status === 200) {
            //         this.types.push(res.data)
            //     }
            // })
          }
        });
      } else {
        this.returnToList();
      }
    },
    platformChange(value) {
      console.log(value);
      if (value !== undefined) {
        this.searchUserForm.platform_id = value;
        this.getUsers();
      } else {
        this.form.admin_id = '';
      }
    },
    submit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.form.id) {
            editReagent(this.form)
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
            addReagent(this.form)
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
    getTypes(query = '') {
      this.searchTypeForm.name = query;
      reagentLevelList(this.searchTypeForm).then((res) => {
        if (res.status === 200) {
          this.types = res.data.data;
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
        path: '/reagent/list',
      });
    },
  },
};
</script>
