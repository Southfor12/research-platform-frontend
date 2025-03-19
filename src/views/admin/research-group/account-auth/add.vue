<template>
  <div v-loading="loading" class="app-container" element-loading-text="数据处理中..."
    element-loading-spinner="el-icon-loading">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="账号" prop="research_group_account_id">
        <el-select :filterable="true" v-model="form.research_group_account_id" size="small" clearable class="width-200"
          @change="researchChange" placeholder="输入名称搜索选择">
          <el-option v-for="item in accounts" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="用户" prop="user_id">
        <el-select v-model="form.user_id" size="small" clearable class="width-200" placeholder="输入姓名搜索选择">
          <el-option v-for="item in users" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.note" type="textarea" size="small" class="width-500" :rows="5" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="submit('form')">保 存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import {
    researchGroupAccountList,
    researchGroupAccountAll,
    researchGroupUserList,
    researchGroupAccountAuthInfo,
    addResearchGroupAccountAuth,
    editResearchGroup
  } from '@/api/research';
  import {
    allUsers
  } from '@/api/user';

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
          size: 30,
          is_deleted: 0,
          name: '',
        },
        users: [],
        accounts: [],
        rules: {
          research_group_account_id: [{
            required: true,
            message: '请选择课题账号',
            trigger: 'change',
          }, ],
          user_id: [{
            required: true,
            message: '请选择用户',
            trigger: 'change',
          }, ],
        },
      };
    },
    created() {
      this.getAccounts();
      this.getUsers();
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
        // this.accountForm.name = query;
        researchGroupAccountAll().then((res) => {
          this.accounts = res.data;
        });
      },
      researchChange(value) {
        // this.form.user_id = '';
        // if (value) {
        //   var research_group_id;
        //   this.accounts.forEach((item) => {
        //     if (item.id === value) {
        //       research_group_id = item.research_group_id;
        //     }
        //   });
        // }
      },
      getUsers() {
        this.users = [];
        allUsers().then((res) => {
          this.users = res.data.users;
        });
      },
      returnToList() {
        this.$router.push({
          path: '/research-group-account-auth/list',
        });
      },
    },
  };
</script>
<style lang="scss"></style>
