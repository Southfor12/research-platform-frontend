<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据处理中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="仪器" prop="apparatus_id">
        {{ form.apparatus_name }}
      </el-form-item>
      <el-form-item label="耗材">
        <el-select
          v-model="form.reagent_ids_arr"
          size="small"
          clearable
          class="max-width-300"
          filterable
          remote
          reserve-keyword
          multiple
          :remote-method="getReagent"
          placeholder="输入名称搜索选择"
        >
          <el-option v-for="item in reagent" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <span class="tips"> (输入名称搜索并选择耗材)</span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="submit('form')">保 存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { apparatusInfo, addApparatusReagent, editApparatusReagent } from '@/api/apparatus';
import { reagentList } from '@/api/reagent';

export default {
  data() {
    return {
      loading: false,
      form: {
        id: '',
        apparatus_id: '',
        apparatus_name: '',
        reagent_ids: '',
        reagent_ids_arr: [],
      },
      reagent: [],
      rules: {
        apparatus_id: [
          {
            required: true,
            message: '请选择仪器',
            trigger: 'change',
          },
        ],
      },
      searchApparatusForm: {
        page: 1,
        size: 30,
        is_deleted: 0,
        name: '',
      },
      searchReagentForm: {
        page: 1,
        size: 30,
        is_deleted: 0,
        name: '',
      },
    };
  },
  created() {
    if (this.$route.params.id) {
      this.getInfo();
    } else {
      this.returnToList();
    }
  },
  methods: {
    getInfo() {
      this.form.id = this.$route.params.id;
      if (this.form.id) {
        apparatusInfo({ id: this.form.id }).then((response) => {
          if (response.status !== 200) {
            this.returnToList();
          } else {
            const data = response.data;
            this.form.apparatus_id = data.id;
            this.form.apparatus_name = data.name;
            data.reagents.forEach((item) => {
              this.form.reagent_ids_arr.push(item.id);
              this.reagent.push({
                id: item.id,
                name: item.name,
              });
            });
          }
        });
      } else {
        this.returnToList();
      }
    },
    getReagent(query = '') {
      this.searchReagentForm.name = query;
      reagentList(this.searchReagentForm).then((res) => {
        if (res.status === 200) {
          this.reagent = res.data.data;
        }
      });
    },
    submit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.form.reagent_ids = this.form.reagent_ids_arr.join(',');
          this.loading = true;
          if (this.form.id) {
            editApparatusReagent(this.form)
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
            addApparatusReagent(this.form)
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
      this.$router.push({ path: '/personal/apparatus-reagent/list' });
    },
  },
};
</script>
