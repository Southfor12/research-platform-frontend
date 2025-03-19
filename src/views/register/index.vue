<template>
  <div class="register-container">
    <div class="common-header">
      <router-link to="/">
        <img src="/favicon.ico" class="common-header__logo">
        <h1 class="common-header__title">上海市肿瘤研究所</h1>
      </router-link>
      <div class="common-header__login">
        <div>
          <el-link @click="navTo('/login')" class="loginBtn" :underline="false">登录</el-link>
        </div>
      </div>
    </div>
    <div class="register-form-container">
      <div class="register-form-title">
        <el-radio-group v-model="userType" style="margin-bottom: 30px;" @change="typeChange">
          <el-radio-button label="in" class="hospital_registration">所内注册</el-radio-button>
          <el-radio-button label="out" class="Out_of_hospital_registration">所外注册</el-radio-button>
        </el-radio-group>
      </div>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item v-if="userType === 'in' || form.type === 2" label="院区" prop="factory_id">
          <el-select @change="onFactoryChange" v-model="form.factory_id" :clearable="false" size="small"
            class="width-200" placeholder="选择院区">
            <el-option :label="factory.name" :value="factory.id" :key="idx"
              v-for="(factory,idx) in getSelectableFactories()"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="userType === 'in' || (userType === 'out' && form.type == 2)" label="科研组室"
          prop="platform_id">
          <el-select v-model="form.platform_id" placeholder="请选择科研组室" filterable>
            <el-option v-for="(item, index) in platforms" :key="index" :label="item.name" :value="item.id"></el-option>
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
        <el-form-item label="确认密码" prop="rePassword">
          <el-input type="password" v-model="form.rePassword" placeholder="确认密码"></el-input>
        </el-form-item>
        <el-form-item label="人员类别" prop="type">
          <el-radio-group v-model="form.type" @input="onTypeChange">
            <el-radio :label="1">{{userType === 'in'? '职工':'其他'}}</el-radio>
            <el-radio :label="2">{{userType === 'in'? '学生':'联培人员'}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="userType === 'in'" :label="form.type == 1 ? '工号':'学号'" prop="no">
          <el-input v-model="form.no" :placeholder="'请填写'+(form.type == 1 ? '工号':'学号')"></el-input>
        </el-form-item>
        <el-form-item v-if="form.type === 2" label="导师" :prop="form.type === 2 ? 'mentor_id' : ''">
          <el-select v-model="form.mentor_id" placeholder="请选择导师" class="max-width-300" filterable>
            <el-option :label="mentor.name" :value="mentor.id" v-for="(mentor,mentorIndex) in mentors"
              :key="mentorIndex"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="userType === 'in' && form.type === 2" label="毕业时间" prop="graduation_at">
          <el-date-picker v-model="form.graduation_at" type="date" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item v-if="userType === 'out'" label="单位" prop="unit" required>
          <el-input v-model="form.unit" placeholder="请填写单位，例如复旦大学"></el-input>
        </el-form-item>

        <el-form-item v-if="userType === 'out'" label="部门" prop="department" required>
          <el-input v-model="form.department" placeholder="请填写院系课题组，例如生命科学学院-王力课题组"></el-input>
        </el-form-item>

        <!-- <el-form-item v-if="userType === 'out'" label="身份证" prop="idCardImg" required>
          <el-upload
            class="img-uploader"
            name="edianlaiImg"
            list-type="picture"
            :action="uploadUrl"
            :show-file-list="true"
            accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PNG,.GIF,.BMP"
            :headers="authHeader"
            :on-success="handleUploadSuccess"
            :before-upload="beforeUpload"
          >
            <i class="el-icon-plus img-uploader-icon"></i>
          </el-upload>
        </el-form-item> -->
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
          <div style="text-align: center;margin: 20px;padding-right: 100px;">
            <el-button :loading="loading" type="primary" @click="onSubmit('form')" class="registerBtn">注册</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {
    uploadUrl
  } from '@/api/public';
  import {
    register,
    userList,
    allUsers
  } from '@/api/user';
  import {
    checkImgFile
  } from '@/utils/index';
  import {
    indexList as platformIndexList,
    allPlatformsByFactoryId,
  } from '@/api/platform'
  import {
    validMobile,
    validEmail
  } from '@/utils/validate'
  import {
    aesEncrypt,
    rsaEncrypt,
    aesRandomKey
  } from "@/utils/encrypt"
  import sha256 from 'js-sha256'
  import {
    mapGetters
  } from 'vuex'

  export default {
    data() {
      const validateMobile = (rule, value, callback) => {
        if (!validMobile(value)) {
          callback(new Error('请输入正确手机号'))
        } else {
          callback()
        }
      }
      const passwordRule = (rule, value, callback) => {
        // if (value.length < 6) {
        //   callback(new Error('密码长度不能小于6位'))
        // } else {
        //   callback()
        // }

        var reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,16}$/
        if (!reg.test(value)) {
          callback(new Error('密码必须由大小写字母、数字、特殊字符组成的8-16字符组成'))
        } else {
          callback()
        }
      }
      const validatePassword = (rule, value, callback) => {
        if (value !== this.form.password) {
          callback(new Error('两次密码输入不一致'))
        } else {
          callback()
        }
      }
      const validateIdCard = (rule, value, callback) => {
        var reg = /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
        if (!reg.test(value)) {
          callback(new Error('请输入正确身份证号'))
        } else {
          callback()
        }
      }

      return {
        uploadUrl: uploadUrl,
        userType: 'in',
        platforms: [],
        allUsers: [],
        platformForm: {
          page: 1,
          size: 100,
          sort: 'created_at',
          sort_type: 'desc',
          is_deleted: '0'
        },
        form: {
          factory_id: '',
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
          id_card_img: '',
        },
        rules: {
          mobile: [{
            required: true,
            trigger: 'blur',
            validator: validateMobile
          }],
          no: [{
            required: true,
            trigger: 'blur',
            message: '请填写该项'
          }],
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
          name: [{
            required: true,
            message: '请填写姓名',
            trigger: 'blur'
          }],
          province: [{
            required: true,
            message: '请填写省份',
            trigger: 'blur'
          }],
          company: [{
            required: true,
            message: '请填写单位',
            trigger: 'blur'
          }],
          unit: [{
            required: true,
            message: '请填写单位',
            trigger: 'blur'
          }],
          department: [{
            required: true,
            message: '请填写部门',
            trigger: 'blur'
          }],
          // research_group_name: [{
          //   required: true,
          //   message: '请填写课题名称',
          //   trigger: 'blur'
          // }],
          deliver_address: [{
            required: true,
            message: '请填写邮寄地址',
            trigger: 'blur'
          }],
          password: [{
              required: true,
              message: '请填写密码',
              trigger: 'blur'
            },
            {
              min: 6,
              max: 16,
              validator: passwordRule,
              trigger: 'blur'
            }
          ],
          rePassword: [{
              required: true,
              message: '请再次输入密码',
              trigger: 'blur'
            },
            {
              required: true,
              trigger: 'blur',
              validator: validatePassword
            }
          ],
          type: [{
            required: true,
            message: '请选择人员类别',
            trigger: 'change'
          }],
          // is_inner: [{ required: true, message: '请选择用户类型', trigger: 'change' }],
          // card_no: [{ required: true, message: '请填写一卡通号', trigger: 'blur' }],
          // fund_source: [{
          //   required: true,
          //   message: '请填写经费来源',
          //   trigger: 'blur'
          // }],
          platform_id: [{
            required: true,
            message: '请选择科研组室',
            trigger: 'change'
          }],
          factory_id: [{
            required: true,
            message: '请选择厂家',
            trigger: 'change'
          }],
          organization_name: [{
              required: true,
              message: '请填写科研组室/课题名称',
              trigger: 'blur'
            },
            {
              min: 2,
              max: 18,
              message: '科研组室/课题名称长度为2-18个字',
              trigger: 'blur'
            }
          ],
          mentor_id: [{
            required: true,
            message: '请选择导师',
            trigger: 'change'
          }],
          fund_description: [{
            required: true,
            message: '请填写经费情况',
            trigger: 'blur'
          }],
          graduation_at: [{
            required: true,
            message: '请填写毕业时间',
            trigger: 'blur'
          }],
          none: [{
            required: false,
            message: '',
            trigger: 'blur'
          }]
        },
        loading: false,
        searchLoading: false
      }
    },
    created() {
      if (this.getSelectableFactories()) {
        this.form.factory_id = this.getSelectableFactories()[0].id;
      }
      this.loadPlatform();
      this.loadAllUsers();
    },
    computed: {
      ...mapGetters([
        'pub_key'
      ]),
      mentors: function() {
        return this.allUsers.filter((user) => {
          return user.type == 1 || user.type == 3; //导师或者院外人员可以选择
        })
      }
    },
    methods: {
      onTypeChange() {//用户类型切换
        this.$refs['form'].clearValidate();
      },
      onFactoryChange() {
        this.form.platform_id = '';
        this.loadPlatform();
      },
      onSubmit(form) {
        this.$refs.form.validate(valid => {
          if (valid) {
            let form = JSON.parse(JSON.stringify(this.form));
            form.research_group_name = form.name + '的课题' + Math.floor(Math.random() * 10000);
            form.is_inner = this.userType === 'in' ? 1 : 0;
            let originPassword = form.password;
            form.mobile = this.encrypt(form.mobile);
            form.password = this.encrypt(form.password);
            form.name = form.name;
            form.no = form.no;

            // form.rePassword = sha256(form.rePassword)
            this.loading = true
            register(form).then((res) => {
              this.form.password = originPassword
              this.loading = false
              if (res.status === 1) {
                this.$router.push({
                  path: '/'
                })
              } else {
                this.form.password = ''
                this.form.rePassword = ''
              }
            }).catch(() => {
              this.form.password = originPassword
              this.loading = false
            })
          } else {
            return false
          }
        })
      },
      loadAllUsers() {
        allUsers().then(res => {
          if (res.status == 200) {
            this.allUsers = res.data.users
            // console.log(this.allUsers)
          }
        })
      },
      loadPlatform() {
        allPlatformsByFactoryId({
          factory_id: this.form.factory_id
        }).then(res => {
          this.platforms = res.data.platforms
        })
      },
      typeChange(value) {
        this.$refs['form'].clearValidate();
        this.form.type = 1
        if (value === 'in') {
          this.form.platform_id = ''
          this.form.mentor_id = ''
          this.form.fund_source = ''
          this.form.fund_description = ''
        }
      },
      handleUploadSuccess(res, file) {
        res = this.decrypt(res);
        if (res.status === 200) {
          this.form.id_card_img = res.data.url;
        }
      },
      beforeUpload(file) {
        return checkImgFile(file, 2, this.$message);
      },
    }
  }
</script>
<style lang="scss" scope>
  body {
    background: #f6f6f6;
  }

  .common-header__title {
    color: #103770;
  }

  //头部登录
  .loginBtn:hover {
    color: #103770 !important;
  }

  .hospital_registration {
    .el-radio-button__inner:hover {
      color: #103770 !important;
    }
  }

  .hospital_registration.is-active {
    .el-radio-button__inner {
      background-color: #103770 !important;
      border: 1px solid #103770;
    }

    .el-radio-button__inner:hover {
      color: #fff !important;
    }

  }

  .el-radio.is-checked {
    .el-radio__label {
      color: #103770 !important;
    }
  }



  .Out_of_hospital_registration {
    .el-radio-button__inner:hover {
      color: #103770;
    }
  }

  .Out_of_hospital_registration.is-active {
    .el-radio-button__inner {
      background-color: #103770 !important;
      border: 1px solid #103770;
    }

    .el-radio-button__inner:hover {
      color: #ffffff;
      border: 1px solid #103770;
    }

  }

  .el-button--primary,
  .registerBtn {
    background-color: #103770 !important;
    border: 1px solid #103770 !important;
  }

  .registerBtn:hover {
    background-color: #144f96 !important;
    border: 1px solid #144f96 !important;
  }

  .el-radio__input.is-checked {

    // .el-radio__inner::after{
    //   background-color: #822a2c !important;
    // }
    .el-radio__inner {
      background-color: #103770 !important;
      border: #103770;
    }
  }

  .register-container {
    width: 100%;
    background: #f6f6f6;

    .register-form-container {
      max-width: 1000px;
      background: #ffffff;
      margin: 80px auto;
      padding: .5rem 0;

      .register-form-title {
        width: 100%;
        height: 6rem;
        line-height: 6rem;
        text-align: center;
        font-size: 30px;
        color: #373d41;

      }

      .el-form {
        max-width: 450px;
        margin: 0 auto;
      }
    }
  }
</style>
