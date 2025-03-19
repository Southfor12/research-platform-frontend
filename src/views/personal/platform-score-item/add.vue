<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据处理中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" size="small" class="max-width-200" clearable />
      </el-form-item>
      <el-form-item label="评分项">
        <div>
          <i @click="addItem" class="el-icon-circle-plus-outline common-icon"></i>
        </div>
        <div v-for="(item, index) in scoreItems" :key="index">
          名称:
          <el-input
            v-model="item.name"
            size="small"
            class="max-width-150 score-item-input"
            clearable
          />
          分值:
          <el-input
            v-model="item.score"
            size="small"
            class="max-width-150 score-item-input"
            clearable
          />
          <i
            v-if="scoreItems.length > 1"
            @click="subItem(item.id)"
            class="el-icon-remove-outline common-icon"
          ></i>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="submit('form')">保 存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { platformScoreItemInfo, addPlatformScoreItem, editPlatformScoreItem } from '@/api/platform';

export default {
  data() {
    return {
      loading: false,
      form: {
        id: '',
        name: '',
        items: '',
      },
      scoreItems: [
        {
          id: new Date().getTime(),
          name: '',
          score: '',
        },
      ],
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          // { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        type: [
          {
            required: true,
            message: '请选择类型',
            trigger: 'change',
          },
        ],
        parent_id: [
          {
            required: true,
            message: '请选择父平台',
            trigger: 'change',
          },
        ],
        admin_id: [
          {
            required: true,
            message: '请选择负责人',
            trigger: 'change',
          },
        ],
        should_audit: [
          {
            required: true,
            message: '请选择是否需要预约',
            trigger: 'change',
          },
        ],
      },
    };
  },
  created() {
    if (this.$route.params.id) {
      this.getInfo();
    }
  },
  methods: {
    getInfo() {
      this.form.id = this.$route.params.id;
      if (this.form.id) {
        platformScoreItemInfo({ id: this.form.id }).then((response) => {
          if (response.status !== 200) {
            this.returnToList();
          } else {
            const data = response.data;
            this.form.name = data.name;
            this.form.items = JSON.parse(data.items);
            this.scoreItems = [];
            this.form.items.forEach((item, index) => {
              this.scoreItems.push({
                id: index,
                name: item.name,
                score: item.score,
              });
            });
          }
        });
      } else {
        this.returnToList();
      }
    },
    submit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          let msg = '',
            msg1 = '',
            msg2 = '',
            checkPass = true,
            that = this;
          this.form.items = [];
          this.scoreItems.forEach((item, index) => {
            this.form.items.push({
              name: item.name,
              score: item.score,
            });
            if (!item.name) msg += index + 1 + '，';
            if (!item.score) msg1 += index + 1 + '，';
            if (item.score && (!Number.isInteger(Number(item.score)) || Number(item.score) < 0))
              msg2 += index + 1 + '，';
          });
          if (msg || msg1 || msg2) {
            msg = msg.substring(0, msg.length - 1);
            msg1 = msg1.substring(0, msg1.length - 1);
            msg2 = msg2.substring(0, msg2.length - 1);
            checkPass = false;
            this.$message.error(
              (msg ? '第' + msg + '项名称未填写 ' : ' ') +
                (msg1 ? '第' + msg1 + '项分值未填写 ' : ' ') +
                (msg2 ? '第' + msg2 + '项分值类型错误, 必须为非负整数' : ''),
            );
          }
          if (!checkPass) return false;
          this.form.items = JSON.stringify(this.form.items);
          this.loading = true;
          if (this.form.id) {
            editPlatformScoreItem(this.form)
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
            addPlatformScoreItem(this.form)
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
    addItem() {
      this.scoreItems.push({
        id: new Date().getTime(),
        name: '',
        score: '',
      });
    },
    subItem(id) {
      this.scoreItems.forEach((item, index) => {
        if (item.id === id) {
          this.scoreItems.splice(index, 1);
        }
      });
    },
    returnToList() {
      this.$router.push({ path: '/personal/platform-score-item/list' });
    },
  },
};
</script>
<style lang="scss" scoped>
.score-item-input {
  margin-right: 15px;
}
</style>
