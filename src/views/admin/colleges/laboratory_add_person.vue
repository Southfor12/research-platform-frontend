<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据处理中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form ref="form" :model="manager_" :rules="rules" label-width="150px">
      <el-row>
        <el-col :div="12">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="manager_.name" size="big" class="width-200" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="用户名" prop="user_name">
            <el-input v-model="manager_.user_name" size="big" class="width-200" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :div="12">
          <el-form-item label="身份" prop="identity">
            <el-input v-model="manager_.identity" size="big" class="width-200" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="系统角色" prop="description">
            <el-input v-model="manager_.description" size="big" class="width-200" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :div="12">
          <el-form-item label="电话" prop="mobile">
            <el-input v-model="manager_.mobile" size="big" class="width-200" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="manager_.email" size="big" class="width-200" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item>
        <el-button type="primary" size="small" @click="submit('form')">保 存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { addCourtyard, editCourtyard, get_a_Courtyard } from '@/api/colleges';
import { frontPlatformList, platformUserList } from '@/api/platform';
import { uploadUrl } from '@/api/public';
import { checkImgFile } from '@/utils/index';
import Tinymce from '@/components/Tinymce';

export default {
  components: {
    Tinymce,
  },
  data() {
    return {
      loading: false,
      dialogImageUrl: '',
      dialogVisible: false,
      uploadUrl: uploadUrl,
      manager: [],
      manager_: { name: '', user_name: '', identity: '', description: '', mobile: '', email: '' },

      rules: {
        name: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'blur',
          },
          // { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        number: [
          {
            required: true,
            message: '请输入序号',
            trigger: 'blur',
          },
          // { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
      },
    };
  },
  created() {
    const form = JSON.parse(this.$route.query.manager);
    if (form) {
      this.manager = form;
    }
    console.log(this.$route.query.id);
    if (this.$route.query.id) {
      this.manager_ = this.manager[this.$route.query.id - 1];
    }
    console.log(this.manager_);
  },
  methods: {
    submit() {
      this.returnToList();
    },
    returnToList() {
      if (this.$route.query.id) {
        this.manager[this.$route.query.id - 1] = this.manager_;
      } else this.manager.push(this.manager_);

      if (this.$route.params.id) {
        this.$router.push({
          name: 'adminLaboratoryEdit',
          params: { id: this.$route.params.id },
          query: {
            form: JSON.stringify(this.manager),
            form_: this.$route.query.form,
            danger: this.$route.query.danger,
            id: this.$route.params.id,
          },
        });
      } else {
        this.$router.push({
          path: '/admin/colleges/laboratory-add/',
          query: {
            form: JSON.stringify(this.manager),
            form_: this.$route.query.form,
            danger: this.$route.query.danger,
          },
        });
      }
    },
  },
};
</script>
