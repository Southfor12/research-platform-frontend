<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据处理中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-form-item label="一卡通号" prop="card_no">
        <el-input
          v-if="!form.id"
          v-model="form.card_no"
          size="small"
          class="max-width-200"
          clearable
        />
        <span v-else>{{ form.card_no }}</span>
      </el-form-item>
      <el-form-item label="过期时间" prop="expired_at">
        <el-date-picker
          size="small"
          v-model="form.expired_at"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          :picker-options="pickerOptions"
          placeholder="选择有效截止日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="单位">
        <el-select v-model="form.factory_id" :clearable="false" size="small" class="width-200" placeholder="选择单位">
          <el-option :label="factory.name" :value="factory.id" :key="idx" v-for="(factory,idx) in getSelectableFactories()"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="打开大门权限">
        <el-switch v-model="form.main_gate" active-color="#32CD32" inactive-color="#888888">
        </el-switch>
      </el-form-item>
      <el-form-item label="万能解锁卡">
        <el-switch v-model="form.super_poweron" active-color="#32CD32" inactive-color="#888888">
        </el-switch>
      </el-form-item>
      <!-- <el-form-item label="可打开门房间">
                <el-select v-model="form.platform_room_ids_arr" size="small" clearable class="max-width-300" filterable
                multiple
                placeholder="请选择房间">
                <el-option
                    v-for="item in rooms"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                />
                </el-select>
            </el-form-item> -->
      <el-form-item>
        <el-button type="primary" size="small" @click="submit('form')">保 存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { cardInfo, addCard, editCard } from '@/api/card';
import { platformRoomList } from '@/api/platform';
import { mapGetters } from 'vuex';
import { aesEncrypt, rsaEncrypt, aesRandomKey } from '@/utils/encrypt';

export default {
  data() {
    return {
      loading: false,
      form: {
        id: '',
        card_no: '',
        main_gate: false,
        super_poweron: false,
        expired_at: '',
        random: '',
        factory_id: '',
      },
      rooms: [],
      rules: {
        card_no: [
          {
            required: true,
            message: '请选择仪器',
            trigger: 'blur',
          },
        ],
        expired_at: [
          {
            required: true,
            message: '请选择过期时间',
            trigger: 'change',
          },
        ],
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        },
      },
      searchRoomForm: {
        page: 1,
        size: 1000,
        is_deleted: 0,
      },
    };
  },
  computed: {
    ...mapGetters(['pub_key']),
  },
  created() {
    this.form.factory_id = this.currentFactoryId;
    this.getRooms();
    if (this.$route.params.id) {
      this.getInfo();
    }
  },
  methods: {
    getInfo() {
      this.form.id = this.$route.params.id;
      if (this.form.id) {
        cardInfo({
          id: this.form.id,
        }).then((response) => {
          if (response.status !== 200) {
            this.returnToList();
          } else {
            const data = response.data;
            this.form.id = data.id;
            this.form.card_no = data.card_no;
            this.form.main_gate = data.main_gate ? true : false;
            this.form.super_poweron = data.super_poweron ? true : false;
            this.form.expired_at = data.expired_at;
            this.form.factory_id = data.factory_id;
          }
        });
      } else {
        this.returnToList();
      }
    },
    getRooms() {
      platformRoomList(this.searchRoomForm).then((res) => {
        if (res.status === 200) {
          this.rooms = res.data.data;
        }
      });
    },
    submit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          let form = JSON.parse(JSON.stringify(this.form));
          let randomKey = aesRandomKey();
          form.random = rsaEncrypt(randomKey, this.pub_key);
          form.card_no = aesEncrypt(form.card_no, randomKey);
          form.main_gate = form.main_gate ? 1 : 0;
          form.super_poweron = form.super_poweron ? 1 : 0;
          this.loading = true;
          if (form.id) {
            editCard(form)
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
            addCard(form)
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
        path: '/system/card/list',
      });
    },
  },
};
</script>
