<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据处理中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="账号" prop="research_group_account_id">
        <el-select
          v-model="form.research_group_account_id"
          size="small"
          @change="researchChange"
          clearable
          class="max-width-300"
          placeholder="请选择账号"
        >
          <el-option v-for="item in accounts" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.research_group_account_id" label="用户" prop="user_id">
        <el-select
          v-model="form.user_id"
          size="small"
          clearable
          class="max-width-300"
          reserve-keyword
          placeholder="请选择用户"
        >
          <el-option v-for="item in users" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.note" size="small" class="max-width-200" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="submit('form')">保 存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {
  frontResearchGroupAccountList,
  researchGroupUserList,
  researchGroupAccountAuthInfo,
  addResearchGroupAccountAuth,
  editResearchGroup,
} from '@/api/research';

export default {
  data() {
    return {
      loading: false,
      searchLoading: false,
      form: {
        id: '',
        research_group_account_id: '',
        user_id: '',
        note: '',
      },
      searchForm: {
        page: 1,
        size: 30,
        status: 1,
        name: '',
      },
      accountForm: {
        page: 1,
        size: 1000,
        is_deleted: 0,
        is_admin: 1,
        name: '',
      },
      users: [],
      accounts: [],
      rules: {
        research_group_account_id: [
          {
            required: true,
            message: '请选择课题账号',
            trigger: 'change',
          },
        ],
        user_id: [
          {
            required: true,
            message: '请选择用户',
            trigger: 'change',
          },
        ],
      },
    };
  },
  created() {
    this.getAccounts();
  },
  methods: {
    getInfo() {
      this.returnToList();
      // this.form.id = this.$route.params.id
      // if (this.form.id) {
      //     researchGroupAccountAuthInfo({ id: this.form.id }).then(response => {
      //         if (response.status !== 200) {
      //             this.returnToList()
      //         } else {
      //             const data = response.data
      //             this.form.name = data.name
      //             this.form.user_id = data.user_id
      //             this.form.fund_source = data.fund_source
      //             this.getUsers(data.leader_name)
      //         }
      //     })
      // } else {

      // }
    },
    submit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.form.id) {
            // editResearchGroup(this.form).then(response => {
            //     this.loading = false
            // }).catch(error => {
            //     this.loading = false
            // })
          } else {
            addResearchGroupAccountAuth(this.form)
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
    getAccounts(query = '') {
      this.accountForm.name = query;
      frontResearchGroupAccountList(this.accountForm).then((res) => {
        if (res.status === 200) {
          this.accounts = res.data.data;
        }
      });
    },
    researchChange(value) {
      this.form.user_id = '';
      if (value) {
        var research_group_id;
        this.accounts.forEach((item) => {
          if (item.id === value) {
            research_group_id = item.research_group_id;
          }
        });
        this.getUsers(research_group_id);
      }
    },
    getUsers(id) {
      this.users = [];
      researchGroupUserList({
        page: 1,
        size: 1000,
        research_group_id: id,
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
      this.$router.push({
        path: '/personal/research-group-account-auth/list',
      });
    },
  },
};
</script>
