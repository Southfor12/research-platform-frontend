<template>
  <div v-loading="loading" class="app-container" element-loading-text="数据处理中..."
    element-loading-spinner="el-icon-loading">
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="培训名称" prop="name">
            <el-input v-model="form.name" size="small" class="width-200" clearable placeholder="培训名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="科研组室" prop="platform_id">
            <el-select v-if="!form.id" v-model="form.platform_id" size="small" class="width-200"
              @change="platformChange" clearable filterable reserve-keyword placeholder="请选择科研组室">
              <el-option v-for="item in platforms" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
            <span v-else>{{ form.platform_name }}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="负责人" prop="leader_id">
            <el-select v-model="form.leader_id" size="small" clearable class="width-200" filterable remote
              reserve-keyword placeholder="输入姓名搜索选择">
              <el-option v-for="item in users" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="类型" prop="type">
            <el-select v-if="!form.id" v-model="form.type" :clearable="true" size="small" class="width-200"
              @change="typeChange" placeholder="类型">
              <el-option label="仪器培训" :value="1"></el-option>
              <el-option label="技术培训" :value="3"></el-option>
              <el-option label="服务培训" :value="2"></el-option>
            </el-select>
            <span v-else>
              {{ getTypes(form.type) }}
            </span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item v-if="form.type === 1 || form.type === 3" label="仪器" prop="apparatus_ids">
        <el-select v-if="!form.id" v-model="form.apparatus_ids" size="small" clearable class="width-200" filterable
          remote reserve-keyword :remote-method="getApparatus" placeholder="输入名称搜索选择">
          <el-option v-for="item in apparatus" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <span v-else>{{ form.apparatus_name }}</span>
      </el-form-item>

      <el-row>
        <el-col :span="12">
          <el-form-item label="培训时间" prop="train_time">
            <el-date-picker size="small" v-model="form.train_time" type="datetimerange" :picker-options="pickerOptions"
              range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否免费">
            <el-switch v-model="form.is_charge" active-color="#13ce66" inactive-color="#8f8f8f" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="!form.is_charge">
        <el-col :span="12">
          <el-form-item label="院内培训费用" prop="charge">
            <el-input-number size="small" v-model="form.charge" :min="0" :precision="2"></el-input-number>
            元
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="院外培训费用" prop="external_charge">
            <el-input-number size="small" v-model="form.external_charge" :min="0" :precision="2"></el-input-number>
            元
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="最大报名人数" prop="max_people">
            <el-input-number size="small" v-model="form.max_people" :min="0" :precision="0"></el-input-number>
            人
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="培训地点" prop="address">
            <el-input v-model="form.address" size="small" class="width-200" clearable />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="是否发布">
            <el-select v-model="form.is_published" size="small" class="width-200" placeholder="是否发布">
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否可以取消报名">
            <el-select v-model="form.can_cancel" size="small" class="width-200" placeholder="是否可以取消报名">
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="培训目的" prop="purpose">
            <el-input v-model="form.purpose" type="textarea" :rows="5" class="width-500" placeholder="请输入培训目的" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单位">
            <el-select v-model="form.factory_id" prop="factory_id" :clearable="false" size="small" class="width-200" placeholder="选择单位">
              <el-option :label="factory.name" :value="factory.id" :key="idx" v-for="(factory,idx) in getSelectableFactories()"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="实验计划及方案" prop="content">
        <tinymce v-model="form.content" :height="500" width="90%" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="submit('form')">保 存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import {
    trainInfo,
    addTrain,
    editTrain
  } from '@/api/train';
  import {
    platformList,
    platformUserList
  } from '@/api/platform';
  import {
    apparatusList,
    apparatusInfo
  } from '@/api/apparatus';
  import {
    userList
  } from '@/api/user';
  import {
    allUsers
  } from '@/api/user';
  import {
    checkGtZero,
    checkInt
  } from '@/utils/validate';
  import {
    timeFormat
  } from '@/utils/index';
  import Tinymce from '@/components/Tinymce';

  export default {
    components: {
      Tinymce,
    },
    data() {
      return {
        loading: false,
        searchLoading: false,
        form: {
          id: '',
          name: '',
          type: '',
          leader_id: '',
          content: '',
          platform_id: '',
          platform_name: '',
          apparatus_ids: '',
          apparatus_name: '',
          is_charge: false,
          charge: '',
          external_charge: '',
          max_people: '',
          train_time: [],
          start_time: '',
          end_time: '',
          address: '',
          purpose: '',
          permanent: 0,
          is_published: '0',
          can_cancel: '0',
          factory_id: '',
        },
        searchForm: {
          page: 1,
          size: 30,
          status: 1,
          name: '',
        },
        searchApparatusForm: {
          page: 1,
          size: 100,
          is_deleted: 0,
          platform_id: '',
          name: '',
        },
        searchPlatformForm: {
          page: 1,
          size: 100,
          is_deleted: 0,
        },
        users: [],
        platforms: [],
        apparatus: [],
        rules: {
          name: [{
            required: true,
            message: '请输入名称',
            trigger: 'blur',
          }, ],
          charge: [{
            required: true,
            message: '请输入院内培训费用',
            trigger: 'blur',
          }, ],
          external_charge: [{
            required: true,
            message: '请输入院外培训费用',
            trigger: 'blur',
          }, ],
          max_people: [{
            required: true,
            message: '请输入最大报名人数',
            trigger: 'blur',
          }, ],
          content: [{
            required: true,
            message: '请填写实验计划及方案',
            trigger: 'blur',
          }, ],
          purpose: [{
            required: true,
            message: '请填写培训目的',
            trigger: 'blur',
          }, ],
          type: [{
            required: true,
            message: '请选择类型',
            trigger: 'change',
          }, ],
          factory_id: [{
            required: true,
            message: '请选择单位',
            trigger: 'change',
          }, ],
          platform_id: [{
            required: true,
            message: '请选择子平台/实验室',
            trigger: 'change',
          }, ],
          apparatus_ids: [{
            required: true,
            message: '请选择仪器',
            trigger: 'change',
          }, ],
          leader_id: [{
            required: true,
            message: '请选择负责人',
            trigger: 'change',
          }, ],
          train_time: [{
            required: true,
            message: '请选择培训时间',
            trigger: 'change',
          }, ],
          address: [{
            required: true,
            message: '请输入培训地点',
            trigger: 'blur',
          }, ],
        },
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() <= Date.now();
          },
        },
      };
    },
    created() {
      this.form.factory_id = this.currentFactoryId;

      if (this.$route.params.id) {
        this.getInfo();
      } else {
        this.getPlatforms();
      }
      this.getUsers();
    },
    methods: {
      getInfo() {
        this.form.id = this.$route.params.id;
        if (this.form.id) {
          trainInfo(this.form).then((response) => {
            if (response.status !== 200) {
              this.returnToList();
            } else {
              const data = response.data;
              this.form.is_charge = data.charge > 0 || data.external_charge > 0 ? false : true;
              this.form.name = data.name;
              this.form.type = data.type;
              this.form.leader_id = data.leader_id;
              this.form.is_published = String(data.is_published);
              this.form.can_cancel = String(data.can_cancel);
              this.form.platform_name = data.platform_name;
              this.form.platform_id = data.platform_id;
              this.form.apparatus_ids = data.apparatus_ids;
              this.form.apparatus_name = data.apparatus_name;
              this.form.address = data.address;
              this.form.start_time = data.start_time;
              this.form.end_time = data.end_time;
              this.form.train_time = [data.start_time, data.end_time];
              this.form.charge = data.charge;
              this.form.external_charge = data.external_charge;
              this.form.max_people = data.max_people;
              this.form.address = data.address;
              this.form.content = data.content;
              this.form.purpose = data.purpose;
              this.form.factory_id = data.factory_id;
              // this.getUsers(data.platform_id)
            }
          });
        } else {
          this.returnToList();
        }
      },
      typeChange(type) {
        this.form.apparatus_ids = '';
        if (type === 1 || type === 3) { //技术培训或服务培训，需要选择仪器ID
          this.searchApparatusForm.platform_id = this.form.platform_id ? this.form.platform_id : '';
          this.getApparatus();
        }
      },
      platformChange(id) {
        this.form.apparatus_ids = '';
        this.searchApparatusForm.platform_id = id ? id : '';
        this.getApparatus();
      },
      getApparatus(query = '') {
        this.searchApparatusForm.name = query;
        apparatusList(this.searchApparatusForm).then((res) => {
          if (res.status === 200) {
            this.apparatus = res.data.data;
          }
        });
      },
      submit(form) {
        Console.log(22222);
        this.$refs[form].validate((valid) => {
          if (valid) {
            this.loading = true;
            this.form.start_time = timeFormat(
              new Date(this.form.train_time[0]),
              'yyyy-MM-dd hh:mm:ss',
            );
            this.form.end_time = timeFormat(new Date(this.form.train_time[1]), 'yyyy-MM-dd hh:mm:ss');
            if (this.form.is_charge) {
              this.form.charge = 0;
              this.form.external_charge = 0;
              // this.form.max_people = 0
            }
            if (this.form.id) {
              editTrain(this.form)
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
              addTrain(this.form)
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
      getTypes(type) {
        switch (type) {
          case 1:
            return '仪器培训';
          case 2:
            return '服务培训';
          case 3:
            return '技术培训';
        }
      },
      getUsers() {
        allUsers().then((res) => {
          if (res.status === 200) {
            this.users = [];
            res.data.users.forEach((item) => {
              this.users.push({
                id: item.id,
                name: item.name,
              });
            });
          }
        });
      },
      getPlatforms() {
        platformList(this.searchPlatformForm).then((res) => {
          if (res.status === 200) {
            this.platforms = res.data.data;
          }
        });
      },
      returnToList() {
        this.$router.push({
          path: '/train/list',
        });
      },
    },
  };
</script>
