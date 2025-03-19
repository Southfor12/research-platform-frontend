<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据处理中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-row>
        <el-col :div="12">
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" size="big" class="width-200" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="序号" prop="number">
            <el-input v-model="form.number" size="big" class="width-200" />
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
      form: {
        name: '',
        number: '',
        id: '',
      },
      domain: process.env.VUE_APP_DOMAIN,
      users: [],
      types: [],
      platforms: [],
      rooms: [],
      searchUserForm: {
        page: 1,
        size: 30,
        status: 1,
        name: '',
      },
      searchTypeForm: {
        page: 1,
        size: 30,
        is_deleted: 0,
        name: '',
      },
      searchPlatformForm: {
        page: 1,
        size: 30,
        type: 2,
        is_deleted: 0,
        name: '',
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
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
    if (this.$route.params.id) {
      this.getInfo();
    }
  },
  methods: {
    // 修改
    getInfo() {
      console.log(this.$route.params.id);
      this.form.id = this.$route.params.id;
      if (this.form.id) {
        get_a_Courtyard({
          id: this.form.id,
        }).then((response) => {
          const data = response.data;
          this.form.name = data.name;
          console.log(data.name);
          this.form.number = data.number;
          // this.getUsers(data.platform_id);
          // this.getPlatforms();
        });
      } else {
        this.returnToList();
      }
    },
    submit(form) {
      console.log(this.form.number);
      if (this.$route.params.id) {
        editCourtyard(this.form)
          .then((response) => {
            this.loading = false;
            if (response.status === 1) {
              this.returnToList();
            }
          })
          .catch((error) => {
            this.loading = false;
          });

        return;
      }
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.loading = true;

          if (this.form.number) {
            console.log(this.form);
            addCourtyard(this.form)
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
        path: '/admin/colleges/courtyard',
      });
    },
    indexMethod(index) {
      return index + (this.queryForm.page - 1) * this.queryForm.size + 1;
    },
  },
};
</script>
