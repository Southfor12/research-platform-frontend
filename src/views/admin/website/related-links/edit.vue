<template>
  <div v-loading="loading" class="app-container" element-loading-text="数据处理中..."
    element-loading-spinner="el-icon-loading">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="单位" prop="factory_id">
        <el-select v-model="form.factory_id" :clearable="false" size="small" class="width-200" placeholder="选择单位">
          <el-option :label="factory.name" :value="factory.id" :key="idx"
            v-for="(factory,idx) in getSelectableFactories()"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="名称" prop="title">
        <el-input v-model="form.title" size="small" class="max-width-500" clearable />
      </el-form-item>
      <el-form-item label="链接" prop="link">
        <el-input v-model="form.link" size="small" class="max-width-500" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="submit('form')">保 存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import {
    relatedLinksInfo,
    addRelatedLinks,
    editRelatedLinks
  } from '@/api/relatedlinks';

  export default {
    data() {
      return {
        loading: false,
        form: {
          id: '',
          title: '',
          link: '',
          factory_id: '',
        },
        rules: {
          title: [{
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          }],
          link: [{
            required: true,
            message: '请输入链接',
            trigger: 'blur'
          }],
          factory_id: [{
            required: true,
            message: '请选择单位',
            trigger: 'blur'
          }],
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
          relatedLinksInfo({
            id: this.form.id
          }).then((response) => {
            if (response.status !== 200) {
              this.returnToList();
            } else {
              this.form = response.data;
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
              editRelatedLinks(this.form)
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
              addRelatedLinks(this.form)
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
          path: '/related-links/list'
        });
      },
    },
  };
</script>
