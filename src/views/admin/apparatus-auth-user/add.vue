<template>
  <div v-loading="loading" class="app-container" element-loading-text="数据处理中..."
    element-loading-spinner="el-icon-loading">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="单位" prop="factory_id">
        <el-select @change="onFactoryChange" v-model="form.factory_id" :clearable="false" size="small" class="width-200"
          placeholder="选择单位">
          <el-option :label="factory.name" :value="factory.id" :key="idx"
            v-for="(factory,idx) in getSelectableFactories()"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="仪器" prop="apparatus_id">
        <el-select v-if="!form.id" v-model="form.apparatus_id" size="small" clearable class="width-200" filterable
          placeholder="输入名称搜索选择">
          <el-option v-for="item in apparatus" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <span v-else>{{ form.apparatus_name }}</span>
      </el-form-item>
      <el-form-item label="授权用户" prop="user_id">
        <el-select v-if="!form.id" v-model="form.user_id" size="small" clearable class="width-200" filterable
          placeholder="输入名称搜索选择">
          <el-option v-for="item in users" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <span v-else>{{ form.user_name }}</span>
      </el-form-item>
      <!-- <el-form-item label="折扣" prop="discount">
        <el-input
          class="width-200"
          @change="discountChange"
          type="number"
          :min="0"
          :max="100"
          v-model="form.discount"
          size="small"
        />
        %
        <span class="tips">(折扣值为0-100, 即百分比)</span>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" size="small" @click="submit('form')">保 存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import {
    apparatusAll,
    apparatusList,
    apparatusAuthUserInfo,
    addApparatusAuthUser,
    editApparatusAuthUser,
  } from '@/api/apparatus';
  import {
    userList,
    allUsers,
  } from '@/api/user';

  export default {
    data() {
      return {
        loading: false,
        form: {
          id: '',
          apparatus_id: '',
          user_id: '',
          apparatus_name: '',
          user_name: '',
          discount: 100,
          factory_id: '',
        },
        apparatus: [],
        users: [],
        rules: {
          apparatus_id: [{
            required: true,
            message: '请选择仪器',
            trigger: 'change',
          }, ],
          user_id: [{
            required: true,
            message: '请选择授权用户',
            trigger: 'change',
          }, ],
          discount: [{
            required: true,
            message: '请设置用户折扣',
            trigger: 'blur',
          }, ],
        },
        searchApparatusForm: {
          page: 1,
          size: 30,
          is_deleted: 0,
          name: '',
          factory_id: '',
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
      this.form.factory_id = this.currentFactoryId;
      if (this.$route.params.id) {
        this.getInfo();
      } else {
        this.getApparatus();
      }

      this.getUsers();
    },
    methods: {
      onFactoryChange() {
        this.form.apparatus_id = '';
        this.getApparatus();
      },
      getInfo() {
        this.form.id = this.$route.params.id;
        if (this.form.id) {
          apparatusAuthUserInfo({
            id: this.form.id
          }).then((response) => {
            if (response.status !== 200) {
              this.returnToList();
            } else {
              const data = response.data;
              this.form.apparatus_id = data.apparatus_id;
              this.form.user_id = data.user_id;
              this.form.apparatus_name = data.apparatus_name;
              this.form.user_name = data.user_name;
              this.form.discount = data.discount;
              this.form.factory_id = data.factory_id;
              this.getApparatus(data.apparatus_name);
              this.getUsers(data.user_name);
            }
          });
        } else {
          this.returnToList();
        }
      },
      getApparatus(name = '') {
        this.searchApparatusForm.name = name;
        this.searchApparatusForm.factory_id = this.form.factory_id;
        this.apparatus = [];
        apparatusAll(this.searchApparatusForm).then((res) => {
          if (res.status === 200) {
            this.apparatus = res.data.apparatuses;
          }
        });
      },
      getUsers(query = '') {
        this.searchUserForm.name = query;
        // userList(this.searchUserForm).then((res) => {
        //   if (res.status === 200) {
        //     this.users = res.data.data;
        //   }
        // });
        allUsers().then(res => {
          this.users = res.data.users;
        })
      },
      discountChange(value) {
        if (isNaN(value)) {
          this.form.discount = 100;
        } else {
          if (value < 0) {
            this.form.discount = 0;
          }
          if (value > 100) {
            this.form.discount = 100;
          }
        }
      },
      submit(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            this.loading = true;
            if (this.form.id) {
              editApparatusAuthUser(this.form)
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
              addApparatusAuthUser(this.form)
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
        this.$router.push({
          path: '/apparatus-auth-user/list'
        });
      },
    },
  };
</script>
