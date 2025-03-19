<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据处理中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form :inline="true">
      <el-form-item>课题组评分项</el-form-item>
      <el-form-item label="单位">
        <el-select
          v-model="factory_id"
          :clearable="false"
          size="small"
          class="max-width-150"
          placeholder="单位"
        >
          <el-option :label="factory.name" :value="factory.id" :key="idx" v-for="(factory,idx) in getSelectableFactories()"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button round size="small" @click="queryList">查询</el-button>
      </el-form-item>
      <el-form-item class="right" v-if="checkNode('add_group_score_item')">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="toAddType(false)"
          >添加课题组评分项类型</el-button
        >
      </el-form-item>
    </el-form>
    <el-collapse v-if="list.length > 0">
      <el-collapse-item v-for="(item, index) in list" :key="index" :name="item.id">
        <template slot="title">
          <div style="width: 100%; display: flex">
            <div style="display: inline-block; width: 50%">
              {{ item.name }}<span>(单位: {{getFactoryName(item.factory_id)}})</span>
            </div>
            <div style="display: inline-block; width: 50%; text-align: right; padding-right: 15px">
              <el-button
                size="mini"
                v-if="checkNode('add_group_score_item')"
                @click.stop="toAddTypeItem(false, item.id)"
                >添加课题组评分项</el-button
              >
              <el-button
                size="mini"
                v-if="checkNode('edit_group_score_item')"
                type="primary"
                @click.stop="toAddType(item)"
                >修改</el-button
              >
              <el-button
                size="mini"
                v-if="checkNode('delete_group_score_item')"
                type="danger"
                @click.stop="toDeleteType(item)"
                >删除</el-button
              >
            </div>
          </div>
        </template>
        <el-table :data="item.items" border style="width: 100%">
          <el-table-column prop="name" label="名称" />
          <el-table-column label="评分项">
            <template slot-scope="scope">
              <div v-html="getItems(scope.row.items)"></div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            v-if="checkNode('edit_group_score_item') || checkNode('delete_group_score_item')"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                class="bottom-10"
                v-if="checkNode('edit_group_score_item')"
                type="primary"
                @click.stop="toAddTypeItem(scope.row, item.id)"
                >修改</el-button
              ><br />
              <el-button
                size="mini"
                v-if="checkNode('delete_group_score_item')"
                type="danger"
                @click.stop="toDeleteTypeItem(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
    <empty v-else description="暂无课题组评分项" />
    <el-dialog
      :title="typeForm.id ? '修改课题组评分项类型' : '添加课题组评分项类型'"
      :visible.sync="typeFormVisible"
    >
      <el-form ref="typeForm" :rules="typeRules" label-width="150px" :model="typeForm">
        <el-form-item label="类型名称" prop="name">
          <el-input v-model="typeForm.name" size="small" :rows="3" class="width-50-percent" />
        </el-form-item>
        <el-form-item label="单位">
          <el-select v-model="typeForm.factory_id" :clearable="false" size="small" class="width-200" placeholder="选择单位">
            <el-option :label="factory.name" :value="factory.id" :key="idx" v-for="(factory,idx) in getSelectableFactories()"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="typeFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitTypeForm('typeForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="typeItemForm.id ? '修改课题组评分项' : '添加课题组评分项'"
      :visible.sync="typeItemFormVisible"
    >
      <el-form ref="typeItemForm" :rules="typeItemRules" label-width="150px" :model="typeItemForm">
        <el-form-item label="名称" prop="name">
          <el-input v-model="typeItemForm.name" size="small" class="max-width-200" clearable />
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
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="typeItemFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitTypeItemForm('typeItemForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { apparatusInfo } from '@/api/apparatus';
import {
  platformScoreTypeList,
  deletePlatformScoreType,
  addPlatformScoreType,
  editPlatformScoreType,
  deletePlatformScoreItem,
  addPlatformScoreItem,
  editPlatformScoreItem,
} from '@/api/grade';
import { checkNode } from '@/utils/validate';
import Empty from '@/components/Empty';

export default {
  components: {
    Empty,
  },
  data() {
    return {
      loading: false,
      typeFormVisible: false,
      typeItemFormVisible: false,
      typeForm: {
        id: '',
        type: '2',
        name: '',
        choose: '',
        factory_id: '',
      },
      typeItemForm: {
        id: '',
        platform_score_type_id: '',
        name: '',
        items: '',
      },
      list: [],
      apparatus: {},
      searchRuleForm: {
        page: 1,
        size: 30,
        is_deleted: 0,
        name: '',
      },
      scoreItems: [],
      typeRules: {
        name: [
          {
            required: true,
            message: '请输入课题组评分项类型名称',
            trigger: 'blur',
          },
        ],
      },
      typeItemRules: {
        name: [
          {
            required: true,
            message: '请输入课题组评分项名称',
            trigger: 'blur',
          },
        ],
      },
      factory_id: '',
    };
  },
  created() {
    this.factory_id = this.currentFactoryId;
    this.typeForm.factory_id = this.currentFactoryId;
    this.queryList();
  },
  methods: {
    queryList() {
      platformScoreTypeList({ type: 2, size: 200 , factory_id: this.factory_id}).then((res) => {
        if (res.status === 200) {
          this.list = res.data.data;
        }
      });
    },
    submitTypeForm(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          if (this.typeForm.id) {
            editPlatformScoreType(this.typeForm).then((response) => {
              if (response.status === 1) {
                this.typeFormVisible = false;
                this.queryList();
              }
            });
          } else {
            addPlatformScoreType(this.typeForm).then((response) => {
              if (response.status === 1) {
                this.typeFormVisible = false;
                this.queryList();
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    submitTypeItemForm(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          let msg = '',
            msg1 = '',
            msg2 = '',
            checkPass = true,
            that = this;
          this.typeItemForm.items = [];
          this.scoreItems.forEach((item, index) => {
            this.typeItemForm.items.push({
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
          if (this.scoreItems.length === 0) {
            this.$message.error('请添加评分项');
            return false;
          }
          if (!checkPass) return false;
          this.typeItemForm.items = JSON.stringify(this.typeItemForm.items);
          if (this.typeItemForm.id) {
            editPlatformScoreItem(this.typeItemForm).then((response) => {
              if (response.status === 1) {
                this.typeItemFormVisible = false;
                this.queryList();
              }
            });
          } else {
            addPlatformScoreItem(this.typeItemForm).then((response) => {
              if (response.status === 1) {
                this.typeItemFormVisible = false;
                this.queryList();
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    toAddTypeItem(item, id) {
      this.typeItemForm.platform_score_type_id = id;
      this.typeItemForm.items = '';
      if (!item) {
        this.typeItemForm.id = '';
        this.typeItemForm.name = '';
        this.scoreItems = [];
      } else {
        this.typeItemForm.id = item.id;
        this.typeItemForm.name = item.name;
        this.scoreItems = JSON.parse(item.items);
      }
      this.typeItemFormVisible = true;
    },
    toDeleteType(item) {
      this.$confirm('确定要删除课题组评分项类型"' + item.name + '"吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deletePlatformScoreType({ id: item.id, is_deleted: 1 }).then((response) => {
          if (response.status === 1) this.queryList();
        });
      });
    },
    toDeleteTypeItem(item) {
      this.$confirm('确定要删除课题组评分项"' + item.name + '"吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deletePlatformScoreItem({ id: item.id, is_deleted: 1 }).then((response) => {
          if (response.status === 1) this.queryList();
        });
      });
    },
    getItems(items) {
      let text = '';
      JSON.parse(items).forEach((item) => {
        text += item.name + ':' + item.score + '分<br />';
      });
      return text;
    },
    subItem(id) {
      this.scoreItems.forEach((item, index) => {
        if (item.id === id) {
          this.scoreItems.splice(index, 1);
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
    toAddType(item) {
      if (!item) {
        this.typeForm.id = '';
        this.typeForm.name = '';
        this.typeForm.factory_id = this.currentFactoryId;
      } else {
        this.typeForm.id = item.id;
        this.typeForm.name = item.name;
        this.typeForm.factory_id = item.factory_id;
      }
      this.typeFormVisible = true;
    },
    checkNode(node) {
      return checkNode(node);
    },
    returnToList() {
      this.$router.push({ path: '/apparatus-charge-rule/list' });
    },
  },
};
</script>
