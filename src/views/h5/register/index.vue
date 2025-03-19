<template>
  <div class="register-container">
    <van-nav-bar
      title="科研公共服务平台注册"
      left-text="返回"
      left-arrow
      @click-left="toLogin"
    />
    <div class="register-form-container">
      <div class="register-form-title">
        <el-radio-group v-model="userType" style="margin-bottom: 30px" @change="typeChange">
          <el-radio-button label="in">院内注册</el-radio-button>
          <el-radio-button label="out">院外注册</el-radio-button>
        </el-radio-group>
      </div>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item v-if="userType === 'in'" label="科研组室" prop="platform_id">
          <el-select v-model="form.platform_id" placeholder="请选择科研组室" filterable>
            <el-option
              v-for="(item, index) in platforms"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请填写姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="form.mobile" placeholder="请填写手机号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="form.password" placeholder="请填写密码"></el-input>
        </el-form-item>
        <el-form-item v-if="userType === 'in'" label="人员类别" prop="type">
          <el-radio v-model="form.type" :label="1">职工</el-radio>
          <el-radio v-model="form.type" :label="2">学生</el-radio>
        </el-form-item>
        <el-form-item v-if="userType === 'in'" :label="form.type == 1 ? '工号' : '学号'" prop="no">
          <el-input
            v-model="form.no"
            :placeholder="'请填写' + (form.type == 1 ? '工号' : '学号')"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-if="userType === 'in' && form.type === 2"
          label="导师"
          :prop="form.type === 2 ? 'mentor_id' : ''"
        >
          <el-select
            v-model="form.mentor_id"
            placeholder="请选择导师"
            class="max-width-300"
            filterable
          >
            <el-option
              :label="mentor.name"
              :value="mentor.id"
              v-for="(mentor, mentorIndex) in mentors"
              :key="mentorIndex"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="userType === 'in' && form.type === 2"
          label="毕业时间"
          prop="graduation_at"
        >
          <el-date-picker v-model="form.graduation_at" type="date" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item v-if="userType === 'out'" label="单位" prop="unit" required>
          <el-input v-model="form.unit" placeholder="请填写单位"></el-input>
        </el-form-item>

        <el-form-item v-if="userType === 'out'" label="部门" prop="department" required>
          <el-input v-model="form.department" placeholder="部门"></el-input>
        </el-form-item>
        <!-- <el-form-item v-if="userType === 'out' || (userType === 'in' && form.type === 1)" label="课题名称" prop="research_group_name">
          <el-input v-model="form.research_group_name" placeholder="请填写课题名称"></el-input>
        </el-form-item> -->
        <!-- <el-form-item v-if="userType === 'out' || (userType === 'in' && form.type === 1)" label="经费来源" prop="fund_source">
          <el-input v-model="form.fund_source"></el-input>
        </el-form-item> -->
        <!-- <el-form-item v-if="userType === 'out'" label="省份" prop="province">
          <el-input v-model="form.province"></el-input>
        </el-form-item> -->
        <!-- <el-form-item v-if="userType === 'out'" label="单位" prop="company">
          <el-input v-model="form.company"></el-input>
        </el-form-item> -->
        <!-- <el-form-item v-if="userType === 'out'" label="邮寄地址" prop="deliver_address">
          <el-input v-model="form.deliver_address"></el-input>
        </el-form-item> -->
        <!-- <el-form-item label="E-mail" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item> -->
        <!--  <el-form-item label="确认密码" prop="rePassword">
          <el-input type="password" v-model="form.rePassword" placeholder="请再次确认密码"></el-input>
        </el-form-item> -->
        <!-- <el-form-item label="身份证" prop="id_card">
          <el-input v-model="form.id_card" placeholder="请填写身份证号"></el-input>
        </el-form-item> -->
        <el-form-item>
          <div style="text-align: center">
            <el-button
              style="width: 100%"
              :loading="loading"
              type="primary"
              @click="onSubmit('form')"
              >注册</el-button
            >
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { register, userList, allUsers } from '@/api/user';
import { indexList as platformIndexList } from '@/api/platform';
import { validMobile, validEmail } from '@/utils/validate';
import { aesEncrypt, rsaEncrypt, aesRandomKey } from '@/utils/encrypt';
import sha256 from 'js-sha256';
import { mapGetters } from 'vuex';

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
      var reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,16}$/;
      if (!reg.test(value)) {
        // if (value.length < 6) {
        callback(new Error('密码必须由大小写字母、数字、特殊字符组成的8-16字符组成'));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value !== this.form.password) {
        callback(new Error('两次密码输入不一致'));
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
      userType: 'in',
      platforms: [],
      allUsers: [],
      platformForm: {
        page: 1,
        size: 100,
        sort: 'created_at',
        sort_type: 'desc',
        is_deleted: '0',
      },
      form: {
        mobile: '',
        name: '',
        no: '',
        password: '',
        // rePassword: '',
        is_inner: '1',
        platform_id: '',
        research_group_name: '',
        fund_source: '',
        type: 1, //导师
        // card_no: '',
        id_card: '',
        email: '',
        mentor_id: '',
        province: '',
        company: '',
        deliver_address: '',
        unit: '',
        department: '',
        graduation_at: '',
        random: '',
      },
      rules: {
        mobile: [
          {
            required: true,
            trigger: 'blur',
            validator: validateMobile,
          },
        ],
        no: [
          {
            required: true,
            trigger: 'blur',
            message: '请填写该项',
          },
        ],
        // email: [{
        //   required: true,
        //   trigger: 'blur',
        //   validator: validEmail
        // }],
        // id_card: [
        // {
        //   required: true,
        //   message: '请填写身份证号',
        //   trigger: 'blur'
        // },
        // {
        //   required: false,
        //   trigger: 'blur',
        //   validator: validateIdCard
        // }
        // ],
        name: [
          {
            required: true,
            message: '请填写姓名',
            trigger: 'blur',
          },
        ],
        province: [
          {
            required: true,
            message: '请填写省份',
            trigger: 'blur',
          },
        ],
        company: [
          {
            required: true,
            message: '请填写单位',
            trigger: 'blur',
          },
        ],
        unit: [
          {
            required: true,
            message: '请填写单位',
            trigger: 'blur',
          },
        ],
        department: [
          {
            required: true,
            message: '请填写部门',
            trigger: 'blur',
          },
        ],
        // research_group_name: [{
        //   required: true,
        //   message: '请填写课题名称',
        //   trigger: 'blur'
        // }],
        deliver_address: [
          {
            required: true,
            message: '请填写邮寄地址',
            trigger: 'blur',
          },
        ],
        password: [
          {
            required: true,
            message: '请填写密码',
            trigger: 'blur',
          },
          {
            min: 8,
            max: 16,
            validator: passwordRule,
            trigger: 'blur',
          },
        ],
        // rePassword: [{
        //     required: true,
        //     message: '请再次输入密码',
        //     trigger: 'blur'
        //   },
        //   {
        //     required: true,
        //     trigger: 'blur',
        //     validator: validatePassword
        //   }
        // ],
        type: [
          {
            required: true,
            message: '请选择人员类别',
            trigger: 'change',
          },
        ],
        // is_inner: [{ required: true, message: '请选择用户类型', trigger: 'change' }],
        // card_no: [{ required: true, message: '请填写一卡通号', trigger: 'blur' }],
        // fund_source: [{
        //   required: true,
        //   message: '请填写经费来源',
        //   trigger: 'blur'
        // }],
        platform_id: [
          {
            required: true,
            message: '请选择科研组室',
            trigger: 'change',
          },
        ],
        organization_name: [
          {
            required: true,
            message: '请填写科研组室/课题名称',
            trigger: 'blur',
          },
          {
            min: 2,
            max: 18,
            message: '科研组室/课题名称长度为2-18个字',
            trigger: 'blur',
          },
        ],
        mentor_id: [
          {
            required: true,
            message: '请选择导师',
            trigger: 'change',
          },
        ],
        fund_description: [
          {
            required: true,
            message: '请填写经费情况',
            trigger: 'blur',
          },
        ],
        none: [
          {
            required: false,
            message: '',
            trigger: 'blur',
          },
        ],
      },
      loading: false,
      searchLoading: false,
    };
  },
  created() {
    this.loadPlatform();
    this.loadAllUsers();
  },
  computed: {
    ...mapGetters(['pub_key']),
    mentors: function () {
      return this.allUsers.filter((user) => {
        return user.type == 1 || user.type == 3; //导师或者院外人员可以选择
      });
    },
  },
  methods: {
    onSubmit(form) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let randomKey = aesRandomKey();
          let form = JSON.parse(JSON.stringify(this.form));
          form.research_group_name = form.name + '的课题' + Math.floor(Math.random() * 10000);
          form.is_inner = this.userType === 'in' ? 1 : 0;
          let originPassword = form.password;
          form.random = rsaEncrypt(randomKey, this.pub_key);
          form.mobile = aesEncrypt(form.mobile, randomKey);
          form.password = aesEncrypt(sha256(form.password), randomKey);
          form.name = aesEncrypt(form.name, randomKey);
          if (form.no) form.no = aesEncrypt(form.no, randomKey);
          // form.rePassword = sha256(form.rePassword)
          this.loading = true;
          register(form)
            .then((res) => {
              this.form.password = originPassword;
              this.loading = false;
              if (res.status === 1) {
                this.$router.push({
                  path: '/h5/login',
                });
              } else {
                this.form.password = '';
                this.form.rePassword = '';
              }
            })
            .catch(() => {
              this.form.password = originPassword;
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
    loadAllUsers() {
      allUsers().then((res) => {
        if (res.status == 200) {
          this.allUsers = res.data.users;
          // console.log(this.allUsers)
        }
      });
    },
    loadPlatform() {
      platformIndexList({
        a: 1,
      }).then((res) => {
        if (res.status === 200) {
          this.platforms = res.data.data;
        }
      });
    },
    typeChange(value) {
      this.form.type = 1;
      if (value === 'in') {
        this.form.platform_id = '';
        this.form.mentor_id = '';
        this.form.fund_source = '';
        this.form.fund_description = '';
      }
    },
    toLogin() {
      this.$router.push({
        path: '/h5/login',
      });
    },
  },
};
</script>
<style lang="scss" scoped>
body {
  background: #f6f6f6;
}

.register-container {
  width: 100%;
  background: #f6f6f6;

  .register-form-container {
    max-width: 1000px;
    background: #ffffff;
    margin: 30px auto;
    padding: 0.5rem 0;

    .register-form-title {
      width: 100%;
      height: 6rem;
      line-height: 6rem;
      text-align: center;
      font-size: 30px;
      color: #373d41;
    }

    .el-form {
      max-width: 360px;
      margin: 0 66px;
    }
  }
}
</style>
