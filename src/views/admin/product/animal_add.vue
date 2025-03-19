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
          <el-form-item label="供应商" prop="supplier_id">
            <el-input v-model="form.supplier_id" size="big" class="width-200" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="动物级别" prop="level">
            <el-select v-model="form.level" size="big" class="width-200">
              <el-option label="SPF级" value="SPF级"></el-option>
              <el-option label="普通级" value="普通级"></el-option>
              <el-option label="清洁级" value="清洁级"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="年龄" prop="age">
            <el-input v-model="form.age" size="big" class="width-200" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="体重" prop="weight">
            <el-input v-model="form.weight" size="big" class="width-200" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="性别" prop="gender">
            <el-select v-model="form.gender" size="big" class="width-200">
              <el-option label="雄性" value="雄性"></el-option>
              <el-option label="雌性" value="雌性"></el-option>
              <el-option label="未限定" value="未限定"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="单价" prop="price">
            <el-input v-model="form.price" size="big" class="width-200" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="编号" prop="number">
            <el-input v-model="form.number" size="big" class="width-200" />
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
import { addAnimal, editAnimal, get_a_Animal } from '@/api/product';
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
        age: '',
        description: '',
        gender: '',
        level: '',
        name: '',
        number: '',
        price: '',
        supplier_id: '',
        weight: '',
        number: '',
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
        get_a_Animal({
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
        editAnimal(this.form)
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

          addAnimal(this.form)
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
        path: '/admin/product/animal',
      });
    },
  },
};
</script>
      