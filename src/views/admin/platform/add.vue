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
            <el-select @change="onFactoryChange" v-model="form.factory_id" :clearable="false" size="small" class="width-200" placeholder="选择单位">
              <el-option :label="factory.name" :value="factory.id" :key="idx" v-for="(factory,idx) in getSelectableFactories()"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <!-- <el-form-item label="负责人" prop="admin_id">
            <el-select
              v-model="form.admin_id"
              size="small"
              clearable
              class="width-200"
              filterable
              remote
              reserve-keyword
              :remote-method="getUsers"
              :loading="searchLoading"
              placeholder="输入姓名搜索选择"
            >
              <el-option v-for="item in users" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item> -->
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="科研组室名称" prop="name">
            <el-input v-model="form.name" size="small" class="width-200" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="负责人" prop="admin_id">
            <el-select
              v-model="form.admin_id"
              size="small"
              clearable
              class="width-200"
              filterable
              remote
              reserve-keyword
              :remote-method="getUsers"
              :loading="searchLoading"
              placeholder="输入姓名搜索选择"
            >
              <el-option v-for="item in users" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="类型" prop="type">
            <el-select
              v-model="form.type"
              :clearable="true"
              size="small"
              class="width-200"
              @change="typeChange"
              placeholder="类型"
            >
              <el-option label="子平台" :value="1"></el-option>
              <el-option label="实验室" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-if="showPlatform" label="父平台" prop="parent_id">
            <el-select
              v-model="form.parent_id"
              size="small"
              clearable
              class="width-200"
              filterable
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
          <el-form-item label="是否需要预约" prop="should_audit">
            <el-select
              v-model="form.should_audit"
              :clearable="true"
              size="small"
              class="width-200"
              placeholder="是否需要预约"
            >
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="默认实验室" prop="default">
            <el-switch v-model="form.default" active-color="#13ce66" inactive-color="#8f8f8f" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="院内实验桌价格" prop="stage_price">
            <el-input-number
              size="small"
              v-model="form.stage_price"
              :min="0"
              :step="100"
              :precision="0"
              class="width-200"
            ></el-input-number>
            元/月/米
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="院外实验桌价格" prop="stage_price_external">
            <el-input-number
              size="small"
              v-model="form.stage_price_external"
              :min="0"
              :step="100"
              :precision="0"
              class="width-200"
            ></el-input-number>
            元/月/米
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="院内PI办公桌价格" prop="pi_stage_price">
            <el-input-number
              size="small"
              v-model="form.pi_stage_price"
              :min="0"
              :step="100"
              :precision="0"
              class="width-200"
            ></el-input-number>
            元/月/个
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="院外PI办公桌价格" prop="pi_stage_price_external">
            <el-input-number
              size="small"
              v-model="form.pi_stage_price_external"
              :min="0"
              :step="100"
              :precision="0"
              class="width-200"
            ></el-input-number>
            元/月/个
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="实验室条款" prop="promise">
        <tinymce v-model="form.promise" :height="300" width="80%" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          type="textarea"
          size="small"
          class="max-width-500"
          rows="5"
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
import { allPlatforms, platformInfo, addPlatform, editPlatform } from '@/api/platform';
import { userList } from '@/api/user';
import Tinymce from '@/components/Tinymce';

export default {
  components: {
    Tinymce,
  },
  data() {
    return {
      loading: false,
      searchLoading: false,
      showPlatform: false,
      information_time: 0,
      learning_time: 0,
      form: {
        id: '',
        name: '',
        type: '',
        admin_id: '',
        should_audit: '',
        stage_price: 0,
        stage_price_external: 0,
        pi_stage_price: 0,
        pi_stage_price_external: 0,
        parent_id: '',
        promise: '',
        single_choose_num: 1,
        multi_choose_num: 1,
        check_num: 1,
        pass_rate: 60,
        pass_type: '',
        information_time: 0,
        learning_time: 0,
        default: false,
        is_default: 0,
        note: '',
        factory_id: '',
      },
      searchForm: {
        page: 1,
        size: 30,
        status: 1,
        name: '',
      },
      searchPlatformForm: {
        page: 1,
        size: 30,
        type: 1,
        is_deleted: 0,
        name: '',
      },
      users: [],
      platforms: [],
      rules: {
        name: [
          {
            required: true,
            message: '请输入名称',
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
        parent_id: [
          {
            required: true,
            message: '请选择父平台',
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
        should_audit: [
          {
            required: true,
            message: '请选择是否需要预约',
            trigger: 'change',
          },
        ],
        stage_price: [
          {
            required: true,
            message: '请填写院内实验桌价格',
            trigger: 'blur',
          },
        ],
        stage_price_external: [
          {
            required: true,
            message: '请填写院外实验桌价格',
            trigger: 'blur',
          },
        ],
        pi_stage_price: [
          {
            required: true,
            message: '请填写院内PI办公桌价格',
            trigger: 'blur',
          },
        ],
        pi_stage_price_external: [
          {
            required: true,
            message: '请填写院外PI办公桌价格',
            trigger: 'blur',
          },
        ],
        promise: [
          {
            required: true,
            message: '请填写实验室条款',
            trigger: 'blur',
          },
        ],
        single_choose_num: [
          {
            required: true,
            message: '请填写单选题抽考数量',
            trigger: 'blur',
          },
        ],
        multi_choose_num: [
          {
            required: true,
            message: '请填写多选题抽考数量',
            trigger: 'blur',
          },
        ],
        information_time: [
          {
            required: true,
            message: '请填写规章制度学习时间',
            trigger: 'blur',
          },
        ],
        learning_time: [
          {
            required: true,
            message: '请填写学习资料学习时间',
            trigger: 'blur',
          },
        ],
        check_num: [
          {
            required: true,
            message: '请填写判断题抽考数量',
            trigger: 'blur',
          },
        ],
        pass_type: [
          {
            required: true,
            message: '请选择考试通过标准',
            trigger: 'change',
          },
        ],
        pass_rate: [
          {
            required: true,
            message: '请选择通过考核正确比例',
            trigger: 'change',
          },
        ],
        factory_id: [
          {
            required: true,
            message: '请选择单位',
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
      this.getUsers();
      this.getPlatforms();
    }
  },
  methods: {
    onFactoryChange()
    {
      this.form.parent_id = '';
      this.getPlatforms();
    },
    getInfo() {
      this.form.id = this.$route.params.id;
      if (this.form.id) {
        platformInfo({
          platform_id: this.form.id,
        }).then((response) => {
          if (response.status !== 200) {
            this.returnToList();
          } else {
            this.form = response.data;
            // this.form.default = this.form.is_default ? true : false
            this.information_time = parseInt(this.form.information_time / 60);
            this.learning_time = parseInt(this.form.learning_time / 60);
            if (this.form.type == 2) this.showPlatform = true;
            this.getUsers(this.form.leader_name);
            this.getPlatforms(this.form.parent_name);
          }
        });
      } else {
        this.returnToList();
      }
    },
    typeChange() {
      if (this.form.type == 2) {
        this.showPlatform = true;
      } else {
        this.form.parent_id = '';
        this.showPlatform = false;
      }
    },
    submit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.form.information_time = this.information_time * 60;
          this.form.learning_time = this.learning_time * 60;
          this.form.is_default = this.form.default ? 1 : 0;
          this.loading = true;
          if (this.form.id) {
            editPlatform(this.form)
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
            addPlatform(this.form)
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
      this.searchForm.name = query;
      this.searchLoading = true;
      userList(this.searchForm)
        .then((res) => {
          this.searchLoading = false;
          if (res.status === 200) {
            this.users = res.data.data;
          }
        })
        .catch((_) => {
          this.searchLoading = false;
        });
    },
    getPlatforms(name = '') {
      this.searchPlatformForm.name = name;
      this.searchPlatformForm.factory_id = this.form.factory_id;
      allPlatforms(this.searchPlatformForm).then((res) => {
        if (res.status === 200) {
          this.platforms = res.data.platforms;
        }
      });
    },
    returnToList() {
      this.$router.push({
        path: '/platform/list',
      });
    },
  },
};
</script>
