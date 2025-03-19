<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据处理中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="高" prop="height">
            <el-input v-model="form.height" size="big" class="width-200" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="宽" prop="width">
            <el-input v-model="form.width" size="big" class="width-200" />
          </el-form-item>
        </el-col>

        <el-col :div="12">
          <el-form-item label="编号" prop="number">
            <el-input v-model="form.number" size="big" class="width-200" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="负责人" prop="manager">
            <el-input v-model="form.manager" size="big" class="width-200" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="负责人电话" prop="manager_mobile">
            <el-input v-model="form.manager_mobile" size="big" class="width-200" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="价格" prop="price">
            <el-input v-model="form.price" size="big" class="width-200" />
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
import { addRack, editRack, get_a_Rack } from '@/api/colleges';
import Tinymce from '@/components/Tinymce';

export default {
  components: {
    Tinymce,
  },
  data() {
    return {
      loading: false,

      form: {
        id: '',
        number: '',
        height: '',
        width: '',
        manager: '',
        manager_mobile: '',
        price: '',
        room_id: '',
      },

      rules: {
        height: [
          {
            required: true,
            message: '请输入高',
            trigger: 'blur',
          },
        ],
        width: [
          {
            required: true,
            message: '请输入宽',
            trigger: 'blur',
          },
          // { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
      },
    };
  },
  created() {
    this.form.room_id = this.$route.query.id;
    if (this.$route.params.id) {
      this.getInfo();
    }
  },
  methods: {
    // 修改
    getInfo() {
      this.form.id = this.$route.params.id;
      console.log(this.form.id);
      if (this.form.id) {
        get_a_Rack({
          id: this.form.id,
        }).then((response) => {
          this.form = response.data;
        });
      } else {
        this.returnToList();
      }
    },
    submit(form) {
      if (this.$route.params.id) {
        editRack(this.form)
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

          addRack(this.form)
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
    returnToList() {
      this.$router.push({
        path: '/admin/colleges/rack',
      });
    },
  },
};
</script>
      