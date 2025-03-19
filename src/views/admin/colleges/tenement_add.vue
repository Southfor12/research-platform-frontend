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
          <el-form-item label="校区" prop="campus_id">
            <el-select v-model="form.campus_id" placeholder="请选择校区">
              <el-option
                v-for="item in campusList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="编码" prop="code">
            <el-input v-model="form.code" size="big" class="width-200" />
          </el-form-item>
        </el-col>
        <el-col :div="12">
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" size="big" class="width-200" />
          </el-form-item>
        </el-col>

        <el-col :div="12">
          <el-form-item label="楼层数" prop="floor_count">
            <el-input v-model="form.floor_count" size="big" class="width-200" />
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
import {
  addTenement,
  editTenement,
  get_a_Tenement,
  get_a_Courtyard,
  getCourtyard,
} from '@/api/colleges';
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
        //校区 编码 名称 楼层数 序号
        campus_id: '',
        code: '',
        name: '',
        is_deleted: false,
        is_deleted: '',
        number: '',
        id: '',
      },
      campusList: [],
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

      rules: {
        //校区 编码 名称 楼层数 序号
        // campus_name: [
        //   {
        //     required: true,
        //     message: '请选择校区',
        //     trigger: 'blur',
        //   },
        // { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        // ],
        code: [
          {
            required: true,
            message: '请输入编码',
            trigger: 'blur',
          },
        ],
        name: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'blur',
          },
        ],
        floor_count: [
          {
            required: true,
            message: '请输入楼层数',
            trigger: 'blur',
          },
        ],
        number: [
          {
            required: true,
            message: '请输入序号',
            trigger: 'blur',
          },
        ],
      },
    };
  },
  created() {
    this.getcampusList();
    if (this.$route.params.id) {
      this.getInfo();
    }
  },

  methods: {
    getcampusList() {
      this.loading = true;
      getCourtyard({ page: 1, pageSize: 1000 })
        .then((res) => {
          this.loading = false;
          this.campusList = res.data.content;

          // console.log(res.data.content);
        })
        .catch((_) => {
          this.loading = false;
        });
    },

    // 修改
    getInfo() {
      this.form.id = this.$route.params.id;
      if (this.form.id) {
        get_a_Tenement({
          id: this.form.id,
        }).then((response) => {
          const data = response.data;
          this.form.campus_name = data.campus_name;
          this.form.code = data.code;
          this.form.name = data.name;
          this.form.floor_count = data.floor_count;
          this.form.number = data.number;
          this.form.is_deleted = data.is_deleted;

          // this.getUsers(data.platform_id);
          // this.getPlatforms();
        });
      } else {
        this.returnToList();
      }
    },
    submit(form) {
      console.log(this.form);
      if (this.$route.params.id) {
        let id = this.campusList.filter((item) => item.name === this.form.campus_name).id;
        this.form.campus_id = id;
        editTenement(this.form)
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
            addTenement(this.form)
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
        path: '/admin/colleges/tenement',
      });
    },
  },
};
</script>
