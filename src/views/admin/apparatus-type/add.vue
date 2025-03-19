<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据处理中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <!-- <el-form-item label="单位" prop="factory_id">
        <el-select :disabled="this.form.id>0" v-model="form.factory_id" :clearable="false" size="small" class="width-200" placeholder="选择单位">
          <el-option :label="factory.name" :value="factory.id" :key="idx" v-for="(factory,idx) in getSelectableFactories()"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" size="small" class="max-width-200" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="submit('form')">保 存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { apparatusTypeInfo, addApparatusType, editApparatusType } from '@/api/apparatus';

export default {
  data() {
    return {
      loading: false,
      form: {
        id: '',
        name: '',
        factory_id: 1,
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '长度在 2 到 10 个字',
            trigger: 'blur',
          },
        ],
      },
    };
  },
  created() {
    this.form.factory_id = this.currentFactoryId;
    if (this.$route.params.id) {
      this.getInfo();
    }
  },
  methods: {
    getInfo() {
      this.form.id = this.$route.params.id;
      if (this.form.id) {
        apparatusTypeInfo({ id: this.form.id }).then((response) => {
          if (response.status !== 200) {
            this.returnToList();
          } else {
            const data = response.data;
            this.form.name = data.name;
            this.form.factory_id = data.factory_id;
          }
        });
      } else {
        this.returnToList();
      }
    },
    submit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.form.id) {
            editApparatusType(this.form)
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
            addApparatusType(this.form)
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
      this.$router.push({ path: '/apparatus-type/list' });
    },
  },
};
</script>
