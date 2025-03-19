<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据处理中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="180px">
      <el-form-item label="实验室" prop="platform_id">
        <el-select
          v-if="!form.id"
          v-model="form.platform_id"
          size="small"
          class="max-width-300"
          filterable
          remote
          reserve-keyword
          :remote-method="getApparatus"
          placeholder="实验室"
        >
          <el-option v-for="item in platforms" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <span v-else>{{ form.platform_name }}</span>
      </el-form-item>
      <el-form-item label="门禁编号" prop="sn">
        <el-input v-model="form.sn" size="small" class="max-width-200" clearable />
      </el-form-item>
      <el-form-item label="门禁名称" prop="name">
        <el-input v-model="form.name" size="small" class="max-width-200" clearable />
      </el-form-item>
      <el-form-item label="门禁类型" prop="type">
        <el-select
          v-model="form.type"
          :clearable="true"
          size="small"
          class="max-width-150"
          placeholder="请选择门禁类型"
        >
          <el-option label="实验室门" value="1"></el-option>
          <el-option label="实验室总大门" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="门禁号" prop="door_no">
        <el-select
          v-model="form.door_no"
          :clearable="true"
          size="small"
          class="max-width-150"
          placeholder="请选择门禁号"
        >
          <el-option label="1" value="1"></el-option>
          <el-option label="2" value="2"></el-option>
          <el-option label="3" value="3"></el-option>
          <el-option label="4" value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="IP地址" prop="ip">
        <el-input v-model="form.ip" size="small" class="max-width-200" clearable />
      </el-form-item>
      <el-form-item label="负责人/安全员" prop="safety_manager">
        <el-input v-model="form.safety_manager" size="small" class="width-200" clearable />
      </el-form-item>
      <el-form-item label="负责人/安全员手机号" prop="safety_manager_mobile">
        <el-input v-model="form.safety_manager_mobile" size="small" class="width-200" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="submit('form')">保 存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {
  frontPlatformList,
  platformRoomInfo,
  addPlatformRoom,
  editPlatformRoom,
} from '@/api/platform';
import { userList } from '@/api/user';
import { mapGetters } from 'vuex';
import { aesEncrypt, rsaEncrypt, aesRandomKey } from '@/utils/encrypt';
import { validMobile } from '@/utils/validate';

export default {
  data() {
    const validateMobile = (rule, value, callback) => {
      if (!validMobile(value)) {
        callback(new Error('请输入正确手机号'));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      users: [],
      form: {
        id: '',
        platform_id: '',
        platform_name: '',
        type: '',
        sn: '',
        name: '',
        ip: '',
        safety_manager: '',
        safety_manager_mobile: '',
        door_no: '',
      },
      platforms: [],
      rules: {
        platform_id: [
          {
            required: true,
            message: '请选择实验室',
            trigger: 'change',
          },
        ],
        type: [
          {
            required: true,
            message: '请选择门禁类型',
            trigger: 'change',
          },
        ],
        sn: [
          {
            required: true,
            message: '请填写门禁编号',
            trigger: 'blur',
          },
        ],
        ip: [
          {
            required: true,
            message: '请填写IP地址',
            trigger: 'blur',
          },
        ],
        name: [
          {
            required: true,
            message: '请填写门禁名称',
            trigger: 'blur',
          },
        ],
        door_no: [
          {
            required: true,
            message: '请选择门禁号',
            trigger: 'change',
          },
        ],
        safety_manager: [
          {
            required: true,
            message: '请填写负责人/安全员',
            trigger: 'blur',
          },
        ],
        safety_manager_mobile: [
          {
            required: true,
            validator: validateMobile,
            trigger: 'blur',
          },
        ],
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
        name: '',
      },
    };
  },
  computed: {
    ...mapGetters(['pub_key']),
  },
  created() {
    if (this.$route.params.id) {
      this.getInfo();
    } else {
      this.getApparatus();
    }
  },
  methods: {
    getInfo() {
      this.form.id = this.$route.params.id;
      if (this.form.id) {
        platformRoomInfo({ id: this.form.id }).then((response) => {
          if (response.status !== 200) {
            this.returnToList();
          } else {
            const data = response.data;
            this.form.platform_id = data.platform_id;
            this.form.platform_name = data.platform_name;
            this.form.type = data.type.toString();
            this.form.sn = data.sn;
            this.form.name = data.name;
            this.form.door_no = data.door_no;
            this.form.ip = data.ip;
            this.form.safety_manager = data.safety_manager;
            this.form.safety_manager_mobile = data.safety_manager_mobile;
          }
        });
      } else {
        this.returnToList();
      }
    },
    getApparatus(query = '') {
      this.searchApparatusForm.name = query;
      frontPlatformList(this.searchApparatusForm).then((res) => {
        if (res.status === 200) {
          this.platforms = res.data.data;
        }
      });
    },
    submit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          let form = JSON.parse(JSON.stringify(this.form));
          let randomKey = aesRandomKey();
          form.random = rsaEncrypt(randomKey, this.pub_key);
          form.sn = aesEncrypt(form.sn, randomKey);
          form.ip = aesEncrypt(form.ip, randomKey);
          this.loading = true;
          if (form.id) {
            editPlatformRoom(form)
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
            addPlatformRoom(form)
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
      this.$router.push({ path: '/personal/platform-room/list' });
    },
  },
};
</script>
