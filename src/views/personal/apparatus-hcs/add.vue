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
      <el-form-item label="危化品" prop="hcs_ids_arr">
        <el-select
          v-model="form.hcs_ids_arr"
          size="small"
          clearable
          class="max-width-300"
          filterable
          remote
          reserve-keyword
          multiple
          :remote-method="getHcs"
          placeholder="输入名称搜索选择"
        >
          <el-option v-for="item in hcses" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <span class="tips"> (输入名称搜索并选择危化品)</span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="submit('form')">保 存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { apparatusList, apparatusInfo, addApparatusHcs, editApparatusHcs } from '@/api/apparatus';
import { hcsList } from '@/api/hcs';

export default {
  data() {
    return {
      loading: false,
      form: {
        id: '',
        apparatus_id: '',
        apparatus_name: '',
        hcs_ids: '',
        hcs_ids_arr: [],
      },
      apparatus: [],
      hcses: [],
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
            data.hcses.forEach((item) => {
              this.form.hcs_ids_arr.push(item.id);
              this.hcses.push({
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
    getApparatus(query = '') {
      this.searchApparatusForm.name = query;
      apparatusList(this.searchApparatusForm).then((res) => {
        if (res.status === 200) {
          this.apparatus = res.data.data;
        }
      });
    },
    getHcs(query = '') {
      this.searchReagentForm.name = query;
      hcsList(this.searchReagentForm).then((res) => {
        if (res.status === 200) {
          this.hcses = res.data.data;
        }
      });
    },
    submit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.form.hcs_ids = this.form.hcs_ids_arr.join(',');
          this.loading = true;
          if (this.form.id) {
            editApparatusHcs(this.form)
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
            addApparatusHcs(this.form)
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
      this.$router.push({ path: '/personal/apparatus-hcs/list' });
    },
  },
};
</script>
