<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据处理中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-form-item label="ID" prop="id">
        <span>{{ user.id }}</span>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <!-- <span>{{user.name}}</span> -->
        <el-input v-model="form.name" size="small" class="width-200"></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="mobile">
        <span>{{ user.mobile }}</span>
      </el-form-item>
      <el-form-item label="登录密码" prop="password">
        <el-input type="password" size="small" class="width-200" v-model="form.password" auto-complete="new-password"></el-input>
      </el-form-item>
      <el-form-item label="一卡通号/院外卡号" prop="card_no">
        <el-input v-model="form.card_no" size="small" class="width-200"></el-input>
      </el-form-item>
      <el-form-item label="用户来源" prop="is_inner">
        <el-tag type="success" v-if="user.is_inner == 1">院内</el-tag>
        <el-tag v-else>院外</el-tag>
      </el-form-item>
      <el-form-item label="用户类型" prop="type">
        <span v-if="user.type == 1">职工</span>
        <span v-else>学生</span>
      </el-form-item>
      <el-form-item
        prop="discount"
        label="折扣(%)"
      >
        <el-input-number v-model="form.discount" :min="1" :max="100" :step="1" label="请填写折扣信息"></el-input-number>
      </el-form-item>
      <el-form-item
        v-if="user.is_inner == 1"
        :label="user.type == 1 ? '职工号' : '学生号'"
        prop="type"
      >
        <el-input v-model="form.no" size="small" class="width-200"></el-input>
      </el-form-item>
      <el-form-item label="身份证号" prop="id_card">
        <!-- 如果已经有身份证，则不能再次修改 -->
        <el-input
          v-model="form.id_card"
          size="small"
          class="width-200"
          :disabled="!form.canEditIdCard"
        ></el-input>
      </el-form-item>
      <el-form-item v-if="form.is_inner == 1" label="科研组室" prop="platform_id">
        <el-select
          v-model="form.platform_id"
          :filterable="true"
          size="small"
          class="width-200"
          placeholder="请选择科研组室"
        >
          <el-option
            v-for="(item, index) in platforms"
            :key="index"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" size="small" class="width-200"></el-input>
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
        <el-button type="primary" size="small" @click="submit()">保 存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { userInfo, editUser } from '@/api/user';
import { researchGroupInfo, addResearchGroup, editResearchGroup } from '@/api/research';
import { platformList } from '@/api/platform';
import { toast } from '@/utils/index';
import { validMobile } from '@/utils/validate';
import { mapGetters } from 'vuex';
import { aesEncrypt, rsaEncrypt, aesRandomKey } from '@/utils/encrypt';

export default {
  data() {
    const validateMobile = (rule, value, callback) => {
      if (!validMobile(value)) {
        callback(new Error('请输入正确手机号'));
      } else {
        callback();
      }
    };
    const passwordRule = (rule, value, callback) => {
      if (value == '') {
        callback();
        return;
      }
      var reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,16}$/;
      if (!reg.test(value)) {
        // if (value.length < 6) {
        callback(new Error('密码必须由大小写字母、数字、特殊字符组成的8-16字符组成'));
      } else {
        callback();
      }
    };
    const validateIdCard = (rule, value, callback) => {
      var reg =
        /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
      if (!reg.test(value)) {
        callback(new Error('请输入正确身份证号'));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      platforms: [],
      form: {
        canEditIdCard: true,
        id: '',
        // mobile: '',
        name: '',
        password: '',
        // is_inner: 1,
        id_card: '',
        platform_id: '',
        email: '',
        card_no: '',
        no: '',
        // type: 1,
        note: '',
        discount: 0,//折扣
      },
      user: {},
      rules: {
        password: [
          {
            min: 8,
            max: 16,
            validator: passwordRule,
            trigger: 'blur',
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(['pub_key']),
  },
  created() {
    this.queryPlatform();
    if (this.$route.params.id) {
      this.getInfo();
    } else {
      this.returnToList();
    }
  },
  methods: {
    getInfo() {
      this.form.password = '';
      this.form.id = parseInt(this.$route.params.id);
      if (this.form.id) {
        userInfo({
          id: this.form.id,
        }).then((response) => {
          if (response.status !== 200) {
            this.returnToList();
          } else {
            const data = response.data;
            this.user = data;
            this.form.name = data.name;
            this.form.mobile = data.mobile;
            this.form.type = data.type;
            this.form.no = data.no;
            this.form.is_inner = data.is_inner;
            this.form.id_card = data.id_card;
            if (data.id_card) {
              this.form.canEditIdCard = false;
            }
            this.form.platform_id = data.platform_id !== 0 ? data.platform_id : '';
            this.form.email = data.email;
            this.form.card_no = data.card_no;
            this.form.note = data.note;
            this.form.discount = data.discount;
          }
        });
      }
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let form = JSON.parse(JSON.stringify(this.form));
          let randomKey = aesRandomKey();
          form.random = rsaEncrypt(randomKey, this.pub_key);

          form.password = form.password ? this.encrypt(form.password) : '';
          form.card_no = form.card_no ? (form.card_no) : '';
          form.no = form.no ? (form.no) : '';
          form.email = form.email ? (form.email) : '';
          this.loading = true;

          delete form.mobile; // 手机号不可修改

          if (!form.canEditIdCard) {
            delete form.id_card;
          } else {
            form.id_card = form.id_card;
          }
          editUser(form)
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
          return false;
        }
      });
    },
    queryPlatform() {
      platformList({
        page: 1,
        size: 100,
        sort: 'created_at',
        sort_type: 'desc',
        is_deleted: '0',
      }).then((res) => {
        if (res.status === 200) {
          this.platforms = res.data.data;
        }
      });
    },
    returnToList() {
      this.$router.push({
        path: '/system/verify/list',
      });
    },
  },
};
</script>
<style lang="scss"></style>
