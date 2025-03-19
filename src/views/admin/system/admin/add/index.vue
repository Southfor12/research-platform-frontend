<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据处理中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
      <!-- <el-form-item v-if="!ruleForm.id" label="用户类型">
        <el-switch v-model="userExists" active-text="已存在用户" inactive-text="新用户">
        </el-switch>
      </el-form-item> -->
      <el-form-item v-if="!userExists || ruleForm.id" label="姓名" prop="name">
        <el-input
          v-if="!ruleForm.id"
          v-model="ruleForm.name"
          size="small"
          class="max-width-200"
          clearable
        />
        <span v-else>{{ ruleForm.name }}</span>
      </el-form-item>
      <el-form-item v-if="!userExists || ruleForm.id" label="手机号" prop="mobile">
        <el-input
          v-if="!ruleForm.id"
          v-model="ruleForm.mobile"
          size="small"
          class="max-width-200"
          clearable
        />
        <span v-else>{{ ruleForm.mobile }}</span>
      </el-form-item>
      <el-form-item v-if="userExists && ruleForm.id == 0" label="管理员" prop="user_id">
        <el-select
          v-model="ruleForm.user_id"
          size="small"
          clearable
          class="max-width-300"
          filterable
          remote
          reserve-keyword
          :remote-method="getUsers"
          :placeholder="'输入姓名查找'"
        >
          <el-option v-for="item in users" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-select
          v-model="ruleForm.role"
          size="small"
          clearable
          class="max-width-300"
          filterable
          placeholder="请选择角色"
        >
          <el-option
            v-for="item in roleOptions"
            :key="item.id"
            :label="item.role_name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="submitForm('ruleForm')">保 存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { roleList, addAdmin, editAdmin, adminInfo } from '@/api/system';
import { userList } from '@/api/user';
import { checkPhone } from '@/utils/validate';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      roleOptions: [],
      ruleForm: {
        name: '',
        mobile: '',
        role: '',
        type: '',
        user_id: '',
        random: '',
        id: '',
      },
      searchUserForm: {
        page: 1,
        size: 30,
        status: 1,
        name: '',
      },
      userExists: true,
      allRoles: [],
      users: [],
      rules: {
        name: [
          {
            required: true,
            message: '请输入管理员姓名',
            trigger: 'blur',
          },
          // { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        mobile: [
          {
            required: true,
            message: '请输入管理员手机号',
            trigger: 'blur',
          },
          { validator: checkPhone, trigger: 'blur' },
        ],
        role: [
          {
            required: true,
            message: '请选择角色',
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
      loading: false,
    };
  },
  computed: {
    ...mapGetters(['pub_key']),
  },
  created() {
    if (this.$route.params.id) {
      this.getAdmin();
    } else {
      this.getUsers();
      this.baseRoleList();
    }
  },
  methods: {
    getAdmin() {
      this.ruleForm.id = this.$route.params.id;
      if (this.ruleForm.id) {
        adminInfo({ id: this.ruleForm.id }).then((response) => {
          if (response.status !== 200) {
            this.$router.push({ path: '/system/admin/list' });
          } else {
            const adminData = response.data;
            this.ruleForm.name = adminData.name;
            this.ruleForm.mobile = adminData.mobile;
            this.ruleForm.role = adminData.role_id;
            this.baseRoleList(adminData.role);
          }
        });
      }
    },
    getUsers(query = '') {
      this.searchUserForm.name = query;
      userList(this.searchUserForm).then((res) => {
        if (res.status === 200) {
          this.users = res.data.data;
        }
      });
    },
    roleDisabled() {},
    baseRoleList(role_id) {
      roleList({ page: 1, size: 1000 }).then((response) => {
        if (response.status === 200) {
          this.allRoles = response.data.data;
          this.allRoles.forEach((item) => {
            this.roleOptions.push(item);
          });
          if (role_id) this.ruleForm.role = role_id;
        }
      });
    },
    getRoleOptions(val) {
      this.roleOptions = [];
      this.ruleForm.role = '';
      if (typeof this.ruleForm.type !== undefined) {
        this.allRoles.forEach((item) => {
          if (item.role_type == this.ruleForm.type) this.roleOptions.push(item);
        });
      }
    },
    submitForm(ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          let ruleForm = JSON.parse(JSON.stringify(this.ruleForm));
          ruleForm.mobile = this.encrypt(ruleForm.mobile);
          this.loading = true;
          if (ruleForm.id) {
            editAdmin(ruleForm)
              .then((response) => {
                this.loading = false;
                if (response.status === 1)
                  this.$router.push({
                    path: '/system/admin/list',
                  });
              })
              .catch((error) => {
                this.loading = false;
              });
          } else {
            addAdmin(ruleForm)
              .then((response) => {
                this.loading = false;
                if (response.status === 1) {
                  this.$router.push({
                    path: '/system/admin/list',
                  });
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
  },
};
</script>
