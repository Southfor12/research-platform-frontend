<template>
  <div v-loading="loading" class="app-container" element-loading-text="数据处理中..."
    element-loading-spinner="el-icon-loading">
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="编号" prop="number">
            <el-input v-model="form.number" size="big" class="width-200" />
          </el-form-item>
        </el-col>

        <!-- 院区 -->
        <el-col :span="12">
          <el-form-item label="院区" prop="campus_name">
            <el-select size="big" class="width-200" @change="handleCampusChange" v-model="form.campus_name">
              <el-option v-for="item in this.campusList" :key="item.id" :label="item.name"
                :value="item.name"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <!-- 楼栋 -->
        <el-col :span="12">
          <el-form-item label="楼栋" prop="tenement">
            <el-select size="big" class="width-200" @change="handleBuildingChange" v-model="form.building_id">
              <el-option v-for="item in this.tenementList" :key="item.id" :label="item.name"
                :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <!-- 实验室 -->
        <el-col :span="12">
          <el-form-item label="实验室" prop="room_id">
            <el-select v-model="form.room_id" size="big" class="width-200" @change="handleLaboratoryChange">
              <el-option v-for="item in this.laboratoryList" :key="item.id" :label="item.name"
                :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="区域" prop="area_type">
            <el-select v-model="form.area_type" size="big" class="width-200">
              <el-option label="普通区" value="普通区" />
              <el-option label="屏障区" value="屏障区" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="动物类型" prop="animal_type">
            <el-input v-model="form.animal_type" size="big" class="width-200" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="统计日期" prop="stats_date">
            <el-date-picker v-model="form.stats_date" size="big" type="date" value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="负责人" prop="manager">
            <el-input v-model="form.manager" size="big" class="width-200" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="联系方式" prop="manager_mobile">
            <el-input v-model="form.manager_mobile" size="big" class="width-200" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="价格" prop="price">
            <el-input v-model.number="form.price" size="big" class="width-200" type="number" placeholder="请输入价格">
              <template slot="append">元/天</template>
            </el-input>
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
import { addFeed, editFeed, get_a_Feed } from '@/api/product';
import { getCourtyard, getTenement, getLaboratory } from '@/api/colleges';
import Tinymce from '@/components/Tinymce';

export default {
  components: {
    Tinymce,
  },
  data() {
    return {
      loading: false,

      laboratoryList: [], // 实验室列表
      tenementList: [], // 楼栋列表
      campusList: [], // 院区列表

      AlllaboratoryList: [], // 所有实验室列表
      AlltenementList: [], // 所有楼栋列表
      AllcampusList: [], // 所有院区列表

      form: {
        room_id: '',
        building_id: '',
        campus_name: '',
        id: '',
        number: '',
        area_type: '', //区域
        room_name: '',
        manager_mobile: '',
        manager: '',
        animal_type: '',
        stats_date: '',
        price: '',
      },

      rules: {
        rules: {
          // 其他原有规则...
          price: [
            { required: true, message: '价格不能为空', trigger: 'blur' },
            {
              type: 'number',
              message: '必须输入数字值',
              trigger: ['blur', 'change']
            },
            {
              validator: (rule, value, callback) => {
                if (value < 0) {
                  callback(new Error('价格不能为负数'));
                } else {
                  callback();
                }
              },
              trigger: ['blur', 'change']
            }
          ]
        }
      },
    };
  },
  created() {
    this.init();
  },
  methods: {
    // 选择校区时更新楼宇列表
    handleCampusChange() {
      this.form.building_id = '';
      if (this.form.campus_name) {
        // 根据选择的校区更新楼宇列表
        this.tenementList = this.AlltenementList.filter(
          (item) => item.campus_name === this.form.campus_name
        );
      } else {
        // 如果没有选择校区，清空楼宇列表
        this.tenementList = [];
      }
    },

    // 选择楼宇时更新校区和实验室列表
    handleBuildingChange() {
      this.form.room_id = '';
      const selectedBuilding = this.AlltenementList.find(
        (item) => item.id === this.form.building_id
      );
      if (selectedBuilding) {
        // 根据楼宇的 campus_id 自动更新对应的校区
        this.form.campus_name = selectedBuilding.campus_name;

        // 根据选择的楼宇更新实验室列表
        this.laboratoryList = this.AlllaboratoryList.filter(
          (item) =>
            item.building_name ===
            this.AlltenementList.find((item) => item.id === this.form.building_id).name
        );
      } else {
        // 如果没有选择楼宇，清空实验室列表
        this.laboratoryList = [];
      }
    },

    handleLaboratoryChange() {
      const res = this.AlllaboratoryList.find((item) => item.id === this.form.room_id);
      this.form.campus_name = res.campus_name;
      this.form.building_id = res.building_name;
    },

    // 修改
    getInfo() {
      //       console.log(this.$route.params.id);
      this.form.id = this.$route.params.id;
      if (this.form.id) {
        get_a_Feed({
          id: this.form.id,
        }).then((response) => {
          const data = response.data;
          this.form = data;
          this.handleLaboratoryChange();
        });
      } else {
        this.returnToList();
      }
    },
    submit(form) {
      if (this.$route.params.id) {
        editFeed(this.form)
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

          addFeed(this.form)
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
        path: '/admin/product/feed',
      });
    },

    // 获取 Campus 列表
    getCampusList() {
      return new Promise((resolve, reject) => {
        getCourtyard({ page: 1, pageSize: 1000 })
          .then((res) => {
            this.campusList = res.data.content;
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },

    // 获取 Tenement 列表
    getTenementList() {
      return new Promise((resolve, reject) => {
        getTenement({ page: 1, pageSize: 1000 })
          .then((res) => {
            this.tenementList = res.data.content;
            resolve();
          })
          .catch(() => { });
      });
    },

    // 获取 Laboratory 列表
    getLaboratoryList() {
      return new Promise((resolve, reject) => {
        getLaboratory({ page: 1, pageSize: 1000 })
          .then((res) => {
            this.laboratoryList = res.data.content;
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },
    // 初始化数据
    async init() {
      try {
        await Promise.all([this.getCampusList(), this.getTenementList(), this.getLaboratoryList()]);
        // console.log(this.campusList, this.tenementList, this.laboratoryList);
        this.AllcampusList = this.campusList;
        this.AlltenementList = this.tenementList;
        this.AlllaboratoryList = this.laboratoryList;
        this.AllcageList = this.cageList;
        if (this.$route.params.id) {
          this.getInfo();
        }
      } catch (error) {
        this.loading = false;
        console.error(error);
      }
    },
  },
};
</script>