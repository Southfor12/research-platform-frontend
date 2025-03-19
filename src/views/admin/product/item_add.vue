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
          <el-form-item label="产品服务" prop="name">
            <el-input v-model="form.name" size="big" class="width-200" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="编号" prop="number">
            <el-input v-model="form.number" size="big" class="width-200" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="供应商" prop="supplier_id">
            <el-input v-model="form.supplier_id" size="big" class="width-200" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="供应商电话" prop="supplier_phone">
            <el-input v-model="form.supplier_phone" size="big" class="width-200" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="规格" prop="specification">
            <el-input v-model="form.specification" size="big" class="width-200" />
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
import { addItem, editItem, get_a_Item } from '@/api/product';
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
        description: '',
        name: '',
        number: '',
        price: '',
        supplier_id: '',
        supplier_phone: '',
        specification: '',
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
        get_a_Item({
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
        editItem(this.form)
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

          addItem(this.form)
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
        path: '/admin/product/item',
      });
    },
  },
};
</script>
      