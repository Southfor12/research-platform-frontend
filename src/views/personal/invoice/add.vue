<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据处理中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="课题组" prop="research_group_id">
        <el-select
          v-model="form.research_group_id"
          size="small"
          clearable
          class="max-width-300"
          placeholder="请选择课题组"
        >
          <el-option v-for="item in accounts" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="发票类型" prop="type">
        <el-select
          v-model="form.type"
          size="small"
          clearable
          class="max-width-300"
          placeholder="请选择发票类型"
        >
          <el-option label="增值税普通发票" :value="1" />
          <el-option label="增值税专用发票" :value="2" />
          <el-option label="组织（非企业）增值税普通发票" :value="3" />
        </el-select>
      </el-form-item>
      <el-form-item label="发票抬头" prop="head">
        <el-input v-model="form.head" size="small" class="max-width-300" clearable />
      </el-form-item>
      <el-form-item label="纳税人识别号" prop="no">
        <el-input v-model="form.no" size="small" class="max-width-300" clearable />
      </el-form-item>
      <el-form-item label="开户银行" prop="bank">
        <el-input v-model="form.bank" size="small" class="max-width-300" clearable />
      </el-form-item>
      <el-form-item label="银行账户" prop="bank_no">
        <el-input v-model="form.bank_no" size="small" class="max-width-300" clearable />
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="form.address" size="small" class="max-width-300" clearable />
      </el-form-item>
      <el-form-item label="电话" prop="mobile">
        <el-input v-model="form.mobile" size="small" class="max-width-300" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="submit('form')">保 存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { frontResearchGroupList } from '@/api/research';
import { invoiceInfo, addInvoice, editInvoice } from '@/api/invoice';
import { mapGetters } from 'vuex';
import { aesEncrypt, rsaEncrypt, aesRandomKey } from '@/utils/encrypt';

export default {
  data() {
    return {
      loading: false,
      searchLoading: false,
      form: {
        id: '',
        research_group_id: '',
        type: '',
        head: '',
        no: '',
        bank: '',
        bank_no: '',
        address: '',
        mobile: '',
        random: '',
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
        research_group_id: [
          {
            required: true,
            message: '请选择课题账号',
            trigger: 'change',
          },
        ],
        type: [
          {
            required: true,
            message: '请选择发票类型',
            trigger: 'change',
          },
        ],
        head: [
          {
            required: true,
            message: '请填写发票抬头',
            trigger: 'blur',
          },
        ],
        no: [
          {
            required: true,
            message: '请填写纳税人识别号',
            trigger: 'blur',
          },
        ],
        bank: [
          {
            required: true,
            message: '请填写开户银行',
            trigger: 'blur',
          },
        ],
        bank_no: [
          {
            required: true,
            message: '请填写银行账户',
            trigger: 'blur',
          },
        ],
        address: [{ required: true, message: '请填写地址', trigger: 'blur' }],
        mobile: [{ required: true, message: '请填写电话', trigger: 'blur' }],
      },
    };
  },
  computed: {
    ...mapGetters(['pub_key']),
  },
  created() {
    this.getAccounts();
    this.getInfo();
  },
  methods: {
    getInfo() {
      this.form.id = this.$route.params.id;
      if (this.form.id) {
        invoiceInfo({ id: this.form.id }).then((response) => {
          if (response.status !== 200) {
            this.returnToList();
          } else {
            this.form = response.data;
          }
        });
      }
    },
    submit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          let form = JSON.parse(JSON.stringify(this.form));
          let randomKey = aesRandomKey();
          form.random = rsaEncrypt(randomKey, this.pub_key);
          form.head = aesEncrypt(form.head, randomKey);
          form.no = aesEncrypt(form.no, randomKey);
          form.bank = aesEncrypt(form.bank, randomKey);
          form.bank_no = aesEncrypt(form.bank_no, randomKey);
          form.address = aesEncrypt(form.address, randomKey);
          form.mobile = aesEncrypt(form.mobile, randomKey);
          this.loading = true;
          if (form.id) {
            editInvoice(form)
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
            addInvoice(form)
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
      frontResearchGroupList({
        page: 1,
        size: 100,
        is_deleted: 0,
        is_admin: 1,
      }).then((res) => {
        if (res.status === 200) {
          this.accounts = res.data.data;
        }
      });
    },
    returnToList() {
      this.$router.push({ path: '/personal/invoice/list' });
    },
  },
};
</script>
