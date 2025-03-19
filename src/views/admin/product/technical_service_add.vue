<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据处理中..."
    element-loading-spinner="el-icon-loading"
  >
    <!-- 编号、技术服务、负责人、负责人电话、单价、描述 -->
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="编号" prop="number">
            <el-input v-model="form.number" size="big" class="width-200" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="技术服务" prop="name">
            <el-select v-model="form.name" size="big" class="width-200">
              <el-option label="冻存服务" value="冻存服务"></el-option>
              <el-option label="复苏服务" value="复苏服务"></el-option>
              <el-option label="净化服务" value="净化服务"></el-option>
            </el-select>
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
          <el-form-item label="单价" prop="price">
            <el-input v-model="form.price" size="big" class="width-200" />
          </el-form-item>
        </el-col>

        <el-col :div="12">
          <el-form-item label="描述" prop="description">
            <el-input
              v-model="form.description"
              type="textarea"
              size="big"
              class="width-500"
              :rows="7"
            />
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
import { addTechnical, editTechnical, get_a_Technical } from '@/api/product';
import Tinymce from '@/components/Tinymce';

export default {
  components: {
    Tinymce,
  },
  data() {
    return {
      loading: false,

      form: {
        // 编号、技术服务、负责人、负责人电话、单价、描述
        id: '',
        number: '',
        name: '',
        manager: '',
        manager_mobile: '',
        price: '',
        description: '',
      },

      rules: {
        // name: [
        //   {
        //     required: true,
        //     message: '请输入名称',
        //     trigger: 'blur',
        //   },
        // ],
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
      //       console.log(this.$route.params.id);
      this.form.id = this.$route.params.id;
      if (this.form.id) {
        get_a_Technical({
          id: this.form.id,
        }).then((response) => {
          const data = response.data;
          this.form = data;
        });
      } else {
        this.returnToList();
      }
    },
    submit(form) {
      //       console.log(this.form.number);
      if (this.$route.params.id) {
        editTechnical(this.form)
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

          addTechnical(this.form)
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
      });
    },
    returnToList() {
      this.$router.push({
        path: '/admin/product/technical',
      });
    },
  },
};
</script>
                  