<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据处理中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-form-item label="子平台/实验室" prop="platform_id">
        <el-select
          v-if="!form.id"
          v-model="form.platform_id"
          size="small"
          clearable
          class="max-width-300"
          filterable
          remote
          reserve-keyword
          :remote-method="getApparatus"
          placeholder="输入名称搜索选择"
        >
          <el-option v-for="item in platforms" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <span v-else>{{ form.platform_name }}</span>
      </el-form-item>
      <el-form-item label="成员" prop="user_id">
        <el-select
          v-if="!form.id"
          v-model="form.user_id"
          size="small"
          clearable
          class="max-width-300"
          filterable
          remote
          reserve-keyword
          :remote-method="getUsers"
          placeholder="输入名称搜索选择"
        >
          <el-option v-for="item in users" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <span v-else>{{ form.user_name }}</span>
      </el-form-item>
      <el-form-item label="有效截止日期(含)" prop="expired_at">
        <el-date-picker
          size="small"
          v-model="form.expired_at"
          type="date"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd"
          placeholder="选择有效截止日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="可携带危化品">
        <el-select
          v-model="form.hcses_arr"
          size="small"
          class="max-width-200"
          allow-create
          multiple
          filterable
          default-first-option
        >
          <el-option v-for="(item, index) in hcses" :value="item" :label="item" :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="submit('form')">保 存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { platformList, platformUserInfo, addPlatformUser, editPlatformUser } from '@/api/platform';
import { userList } from '@/api/user';

export default {
  data() {
    return {
      loading: false,
      form: {
        id: '',
        platform_id: '',
        platform_name: '',
        user_id: '',
        user_name: '',
        expired_at: '',
        hcses: '',
        hcses_arr: [],
      },
      platforms: [],
      users: [],
      hcses: [],
      rules: {
        platform_id: [
          {
            required: true,
            message: '请选择子平台/实验室',
            trigger: 'change',
          },
        ],
        user_id: [
          {
            required: true,
            message: '请选择授权用户',
            trigger: 'change',
          },
        ],
        expired_at: [
          {
            required: true,
            message: '请选择有效截止日期',
            trigger: 'change',
          },
        ],
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        },
      },
      searchApparatusForm: {
        page: 1,
        size: 30,
        is_deleted: 0,
        name: '',
      },
      searchUserForm: {
        page: 1,
        size: 30,
        is_deleted: 0,
        name: '',
      },
    };
  },
  created() {
    if (this.$route.params.id) {
      this.getInfo();
    } else {
      this.getUsers();
      this.getApparatus();
    }
  },
  methods: {
    getInfo() {
      this.form.id = this.$route.params.id;
      if (this.form.id) {
        platformUserInfo({ id: this.form.id }).then((response) => {
          if (response.status !== 200) {
            this.returnToList();
          } else {
            const data = response.data;
            this.form.platform_id = data.platform_id;
            this.form.platform_name = data.platform_name;
            this.form.user_id = data.user_id;
            this.form.user_name = data.user_name;
            this.form.expired_at = data.expired_at.substring(0, 11);
            this.form.hcses_arr = data.hcses ? data.hcses.split(',') : [];
          }
        });
      } else {
        this.returnToList();
      }
    },
    getApparatus(query = '') {
      this.searchApparatusForm.name = query;
      platformList(this.searchApparatusForm).then((res) => {
        if (res.status === 200) {
          this.platforms = res.data.data;
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
    submit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.form.hcses = this.form.hcses_arr.length > 0 ? this.form.hcses_arr.join(',') : '';
          this.form.expired_at = this.form.expired_at.substring(0, 11) + ' 23:59:59';
          this.loading = true;
          if (this.form.id) {
            editPlatformUser(this.form)
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
            addPlatformUser(this.form)
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
    returnToList() {
      this.$router.push({ path: '/personal/platform-user/list' });
    },
  },
};
</script>
