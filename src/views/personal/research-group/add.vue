<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据处理中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="130px">
      <el-form-item label="课题组名称" prop="name">
        <el-input v-model="form.name" size="small" class="max-width-200" clearable />
      </el-form-item>
      <el-form-item label="子平台/实验室" prop="platform_id">
        <el-select
          v-if="!form.id"
          v-model="form.platform_id"
          @change="platformChange"
          :clearable="true"
          size="small"
          class="max-width-150"
          placeholder="实验室"
        >
          <el-option v-for="item in platforms" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <span v-else>{{ form.platform_name }}</span>
      </el-form-item>
      <el-form-item v-if="form.platform_id" label="负责人" prop="leader_id">
        <el-select
          v-model="form.leader_id"
          size="small"
          clearable
          class="max-width-300"
          reserve-keyword
          placeholder="请选择负责人"
        >
          <el-option v-for="item in users" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="资金来源" prop="fund_source">
        <el-input v-model="form.fund_source" size="small" class="max-width-200" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="submit('form')">保 存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { frontPlatformList, platformUserList } from '@/api/platform';
import { researchGroupInfo, addResearchGroup, editResearchGroup } from '@/api/research';

export default {
  data() {
    return {
      loading: false,
      searchLoading: false,
      form: {
        id: '',
        name: '',
        leader_id: '',
        platform_id: '',
        platform_name: '',
        fund_source: '',
      },
      searchForm: {
        page: 1,
        size: 30,
        status: 1,
        name: '',
      },
      users: [],
      platforms: [],
      rules: {
        name: [
          {
            required: true,
            message: '请输入课题组名称',
            trigger: 'blur',
          },
          // { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        fund_source: [
          {
            required: true,
            message: '请输入资金来源',
            trigger: 'blur',
          },
          {
            min: 6,
            max: 100,
            message: '长度在 6 到 100 个字',
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
        leader_id: [
          {
            required: true,
            message: '请选择课题负责人',
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
        researchGroupInfo({ id: this.form.id }).then((response) => {
          if (response.status !== 200) {
            this.returnToList();
          } else {
            const data = response.data;
            this.form.name = data.name;
            this.form.platform_id = data.platform_id;
            this.form.platform_name = data.platform_name;
            this.form.leader_id = data.leader_id;
            this.form.fund_source = data.fund_source;
            this.getUsers(data.platform_id);
          }
        });
      } else {
        this.returnToList();
      }
    },
    getPlatforms() {
      frontPlatformList({ page: 1, size: 100, is_deleted: 0 }).then((res) => {
        if (res.status === 200) {
          this.platforms = res.data.data;
        }
      });
    },
    platformChange(value) {
      this.form.leader_id = '';
      if (value) {
        this.getUsers(value);
      }
    },
    submit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.form.id) {
            editResearchGroup(this.form)
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
            addResearchGroup(this.form)
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
    getUsers(id) {
      this.users = [];
      platformUserList({
        page: 1,
        size: 1000,
        platform_id: id,
        is_deleted: 0,
      }).then((res) => {
        if (res.status === 200) {
          res.data.data.forEach((item) => {
            this.users.push({
              id: item.user_id,
              name: item.user_name,
            });
          });
        }
      });
    },
    returnToList() {
      this.$router.push({ path: '/personal/research-group/list' });
    },
  },
};
</script>
