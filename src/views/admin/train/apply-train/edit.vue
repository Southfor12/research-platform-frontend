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
          <el-form-item label="名称" prop="name">
            <el-input
              v-model="form.name"
              size="small"
              style="width: 173px"
              clearable
              placeholder="培训名称"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="科研组室" prop="platform_id">
            <el-select
              v-if="!form.id"
              v-model="form.platform_id"
              size="small"
              class="max-width-200"
              @change="platformChange"
              clearable
              filterable
              reserve-keyword
              placeholder="请选择科研组室"
            >
              <el-option
                v-for="item in platforms"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            <span class="max-width-200" v-else>{{ form.platform_name }}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="负责人" prop="leader_id">
            <el-select
              v-model="form.leader_id"
              size="small"
              clearable
              class="max-width-200"
              filterable
              remote
              reserve-keyword
              :remote-method="getUsers"
              :loading="searchLoading"
              placeholder="输入姓名搜索选择"
            >
              <el-option v-for="item in users" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="类型" prop="type">
            <el-select
              v-if="!form.id"
              v-model="form.type"
              :clearable="true"
              size="small"
              class="max-width-200"
              @change="typeChange"
              placeholder="类型"
            >
              <el-option label="仪器培训" :value="1"></el-option>
              <el-option label="服务培训" :value="2"></el-option>
              <el-option label="技术培训" :value="3"></el-option>
            </el-select>
            <span v-else>
              {{ getTypes(form.type) }}
            </span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="是否免费">
            <el-switch v-model="form.is_charge" active-color="#13ce66" inactive-color="#8f8f8f" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="培训地点" prop="address">
            <el-input
              v-model="form.address"
              size="small"
              style="width: 173px"
              clearable
              placeholder="培训地点"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item v-if="form.type === 1" label="仪器" prop="apparatus_ids">
        <el-select
          v-if="!form.id"
          v-model="form.apparatus_ids"
          size="small"
          clearable
          class="max-width-300"
          filterable
          remote
          reserve-keyword
          :remote-method="getApparatus"
          placeholder="输入名称搜索选择"
        >
          <el-option v-for="item in apparatus" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <span v-else>{{ form.apparatus_name }}</span>
      </el-form-item>
      <el-form-item label="单位" prop="factory_id">
        <el-select
          v-model="form.factory_id"
          :clearable="false"
          size="small"
          class="width-200"
          placeholder="选择单位"
        >
          <el-option
            :label="factory.name"
            :value="factory.id"
            :key="idx"
            v-for="(factory, idx) in getSelectableFactories()"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item
            v-if="!form.is_charge && form.type !== 1"
            label="院内培训费用"
            prop="charge"
          >
            <el-input-number
              size="small"
              class="max-width-300"
              v-model="form.charge"
              :min="0"
              :precision="2"
            ></el-input-number>
            元
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            v-if="!form.is_charge && form.type !== 1"
            label="院外培训费用"
            prop="external_charge"
          >
            <el-input-number
              size="small"
              class="max-width-300"
              v-model="form.external_charge"
              :min="0"
              :precision="2"
            ></el-input-number>
            元
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item v-if="!form.is_charge && form.type === 1" label="培训费用">
        <div>
          <i @click="addItem" class="el-icon-circle-plus-outline common-icon"></i>
        </div>
        <div v-for="(item, index) in chargeItems" :key="index">
          收费项:
          <el-input
            v-model="item.title"
            size="small"
            class="max-width-150 score-item-input"
            placeholder="收费项"
            clearable
          />
          院内价格:
          <el-input-number
            @change="
              (currentValue, oldValue) => {
                priceNumberChange(currentValue, oldValue, index, 1);
              }
            "
            size="small"
            v-model="item.charge"
            :min="0"
          ></el-input-number>
          院外价格:
          <el-input-number
            @change="
              (currentValue, oldValue) => {
                priceNumberChange(currentValue, oldValue, index, 2);
              }
            "
            size="small"
            v-model="item.external_charge"
            :min="0"
          ></el-input-number>
          <i
            v-if="chargeItems.length > 1"
            @click="chargeItems.splice(index, 1)"
            class="el-icon-remove-outline common-icon"
          ></i>
        </div>
      </el-form-item>

      <el-row>
        <el-col :span="12">
          <el-form-item label="是否发布">
            <el-select
              v-model="form.is_published"
              size="small"
              class="max-width-300"
              placeholder="是否发布"
            >
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="培训目的" prop="purpose">
            <el-input
              v-model="form.purpose"
              type="textarea"
              :rows="3"
              class="max-width-300"
              placeholder="请输入培训目的"
            />
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
import { trainInfo, addTrain, editTrain } from '@/api/train';
import { platformList } from '@/api/platform';
import { apparatusList, apparatusInfo } from '@/api/apparatus';
import { userList } from '@/api/user';
import { checkGtZero, checkInt } from '@/utils/validate';
import { timeFormat } from '@/utils/index';
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
        start_time: '',
        end_time: '',
        address: '',
        purpose: '',
        config: '',
        is_published: '0',
        permanent: 1,
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
      chargeItems: [],
      rules: {
        name: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'blur',
          },
        ],
        charge: [
          {
            required: true,
            message: '请输入院内培训费用',
            trigger: 'blur',
          },
        ],
        external_charge: [
          {
            required: true,
            message: '请输入院外培训费用',
            trigger: 'blur',
          },
        ],
        purpose: [
          {
            required: true,
            message: '请填写培训目的',
            trigger: 'blur',
          },
        ],
        content: [
          {
            required: true,
            message: '请填写实验计划及方案',
            trigger: 'blur',
          },
        ],
        type: [
          {
            required: true,
            message: '请选择类型',
            trigger: 'change',
          },
        ],
        platform_id: [
          {
            required: true,
            message: '请选择子平台/实验室',
            trigger: 'change',
          },
        ],
        apparatus_ids: [
          {
            required: true,
            message: '请选择仪器',
            trigger: 'change',
          },
        ],
        leader_id: [
          {
            required: true,
            message: '请选择负责人',
            trigger: 'change',
          },
        ],
        address: [
          {
            required: true,
            message: '请输入培训地点',
            trigger: 'blur',
          },
        ],
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
            if (data.type !== 1)
              this.form.is_charge = data.charge > 0 || data.external_charge > 0 ? false : true;
            else this.form.is_charge = data.config ? false : true;
            this.form.name = data.name;
            this.form.type = data.type;
            this.form.leader_id = data.leader_id;
            this.form.is_published = String(data.is_published);
            this.form.platform_name = data.platform_name;
            this.form.platform_id = data.platform_id;
            this.form.apparatus_ids = data.apparatus_ids;
            this.form.apparatus_name = data.apparatus_name;
            this.form.address = data.address;
            this.form.start_time = data.start_time;
            this.form.end_time = data.end_time;
            this.form.charge = data.charge;
            this.form.external_charge = data.external_charge;
            this.form.address = data.address;
            this.form.content = data.content;
            this.form.purpose = data.purpose;
            this.form.factory_id = data.factory_id;

            if (this.form.type === 1 && this.form.is_charge === false) {
              this.chargeItems = JSON.parse(data.config);
            }
            // this.getUsers(data.leader_name)
          }
        });
      } else {
        this.returnToList();
      }
    },
    typeChange(type) {
      this.form.apparatus_ids = '';
      if (type === 1) {
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
    addItem() {
      this.chargeItems.push({
        title: '',
        charge: '',
        external_charge: '',
      });
    },
    priceNumberChange(current, pre, index, type) {
      if (current !== 0 && !current) {
        if (type === 1) {
          this.chargeItems[index].charge = -1;
        } else if (type === 2) {
          this.chargeItems[index].external_charge = -1;
        }
      }
    },
    submit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          if (this.form.type === 1 && !this.form.is_charge) {
            if (this.chargeItems.length === 0) {
              this.$message.error('请至少添加一项收费项');
              return false;
            }
            try {
              var temp = [];
              this.chargeItems.forEach((item, index) => {
                if (!item.title) {
                  throw '第' + (index + 1) + '项收费名称未填写';
                }
                if (temp.indexOf(item.title) > -1) {
                  throw (
                    '第' +
                    (temp.indexOf(item.title) + 1) +
                    '收费项与第' +
                    (index + 1) +
                    '收费项名称重复'
                  );
                }
                temp.push(item.title);
              });
            } catch (error) {
              this.$message.error(error);
              return false;
            }
            this.form.config = JSON.stringify(this.chargeItems);
          }
          if (this.form.is_charge) {
            this.form.charge = 0;
            this.form.external_charge = 0;
            this.form.max_people = 0;
            this.form.config = '';
          }
          this.loading = true;
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
    getUsers(query = '') {
      this.searchForm.name = query;
      this.searchLoading = true;
      userList(this.searchForm)
        .then((res) => {
          this.searchLoading = false;
          if (res.status === 200) {
            this.users = res.data.data;
          }
        })
        .catch((_) => {
          this.searchLoading = false;
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
        path: '/apply-train/list',
      });
    },
  },
};
</script>
