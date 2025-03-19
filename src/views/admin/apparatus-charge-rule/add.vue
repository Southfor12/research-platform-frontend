<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据处理中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form :inline="true">
      <el-form-item label="仪器">{{ apparatus.name }}</el-form-item>
      <el-form-item class="right" v-if="checkNode('add_sample_deliver')">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="toAddType(false)"
          >添加计费类型</el-button
        >
      </el-form-item>
    </el-form>
    <el-collapse v-if="list.length > 0">
      <el-collapse-item v-for="(item, index) in list" :key="index" :name="item.id">
        <template slot="title">
          <div style="width: 100%; display: flex">
            <div style="display: inline-block; width: 50%">
              <span v-if="item.choose" class="not-null">*</span>{{ item.title }}
            </div>
            <div style="display: inline-block; width: 50%; text-align: right; padding-right: 15px">
              <el-button
                size="mini"
                v-if="checkNode('add_sample_deliver_item')"
                @click.stop="toAddTypeItem(false, item.id)"
                >添加计费项</el-button
              >
              <el-button
                size="mini"
                v-if="checkNode('edit_sample_deliver')"
                type="primary"
                @click.stop="toAddType(item)"
                >修改</el-button
              >
              <el-button
                size="mini"
                v-if="checkNode('delete_sample_deliver')"
                type="danger"
                @click.stop="toDeleteType(item)"
                >删除</el-button
              >
            </div>
          </div>
        </template>
        <el-table :data="item.items" border style="width: 100%">
          <el-table-column prop="title" label="名称" />
          <!-- <el-table-column label="类型">
                        <template slot-scope="scope">
                            {{ scope.row.type === 1 ? '按样品' : (scope.row.type === 2 ? '按小时' : (scope.row.type === 3 ? '按次' : '其他')) }}
                        </template>
                    </el-table-column> -->
          <el-table-column prop="charge" label="院内用户价格">
            <template slot-scope="scope">
              {{ scope.row.charge }}元/{{
                scope.row.type === 1
                  ? '样品'
                  : scope.row.type === 2
                    ? '小时'
                    : scope.row.type === 3
                      ? '次'
                      : scope.row.unit
              }}
            </template>
          </el-table-column>
          <el-table-column label="院外用户价格">
            <template slot-scope="scope">
              {{ scope.row.external_charge }}元/{{
                scope.row.type === 1
                  ? '样品'
                  : scope.row.type === 2
                    ? '小时'
                    : scope.row.type === 3
                      ? '次'
                      : scope.row.unit
              }}
            </template>
          </el-table-column>
          <el-table-column label="自主检测免费">
            <template slot-scope="scope">{{ scope.row.self_free === 1 ? '是' : '否' }}</template>
          </el-table-column>
          <el-table-column
            label="操作"
            v-if="checkNode('edit_sample_deliver_item') || checkNode('delete_sample_deliver_item')"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                class="bottom-10"
                v-if="checkNode('edit_sample_deliver_item')"
                type="primary"
                @click.stop="toAddTypeItem(scope.row, item.id)"
                >修改</el-button
              ><br />
              <el-button
                size="mini"
                v-if="checkNode('delete_sample_deliver_item')"
                type="danger"
                @click.stop="toDeleteTypeItem(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
    <empty v-else description="暂无计费类型" />
    <el-dialog
      :title="typeForm.id ? '修改计费类型' : '添加计费类型'"
      :visible.sync="typeFormVisible"
    >
      <el-form ref="typeForm" :rules="typeRules" label-width="150px" :model="typeForm">
        <el-form-item label="类型名称" prop="title">
          <el-input v-model="typeForm.title" size="small" :rows="3" class="width-50-percent" />
        </el-form-item>
        <el-form-item label="是否必选" prop="choose">
          <el-select
            v-model="typeForm.choose"
            :clearable="true"
            size="small"
            class="max-width-150"
            placeholder="是否必选"
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="typeFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitTypeForm('typeForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="typeItemForm.id ? '修改计费项' : '添加计费项'"
      :visible.sync="typeItemFormVisible"
    >
      <el-form ref="typeItemForm" :rules="typeItemRules" label-width="150px" :model="typeItemForm">
        <el-form-item label="计费项名称" prop="title">
          <el-input v-model="typeItemForm.title" size="small" :rows="3" class="width-50-percent" />
        </el-form-item>
        <el-form-item label="计费项类型" prop="type">
          <el-select
            v-model="typeItemForm.type"
            :clearable="true"
            size="small"
            class="max-width-150"
            placeholder="计费项类型"
          >
            <el-option label="按样品" :value="1"></el-option>
            <el-option label="按小时" :value="2"></el-option>
            <el-option label="按次" :value="3"></el-option>
            <el-option label="其他" :value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="typeItemForm.type === 4" label="其他计费项单位" prop="unit">
          <el-input v-model="typeItemForm.unit" size="small" :rows="3" class="max-width-150" />
        </el-form-item>
        <el-form-item label="院内用户价格" prop="charge">
          <el-input-number
            size="small"
            :min="0"
            :step="10"
            v-model="typeItemForm.charge"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="院外用户价格" prop="external_charge">
          <el-input-number
            size="small"
            :min="0"
            :step="10"
            v-model="typeItemForm.external_charge"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="自主检测免费" prop="self_free">
          <el-select
            v-model="typeItemForm.self_free"
            :clearable="true"
            size="small"
            class="max-width-150"
            placeholder="自主检测免费"
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input
            v-model="typeItemForm.note"
            type="textarea"
            :rows="3"
            class="max-width-300"
            placeholder="请输入备注内容"
          />
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
  sampleDeliverInfo,
  sampleDeliverList,
  deleteSampleDeliver,
  addSampleDeliver,
  editSampleDeliver,
  deleteSampleDeliverItem,
  addSampleDeliverItem,
  editSampleDeliverItem,
} from '@/api/charge';
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
      typeForm: { id: '', apparatus_id: '', title: '', choose: '' },
      typeItemForm: {
        id: '',
        sample_deliver_id: '',
        title: '',
        type: '',
        charge: '',
        external_charge: '',
        self_free: '',
        unit: '',
        note: '',
      },
      list: [],
      apparatus: {},
      searchRuleForm: {
        page: 1,
        size: 30,
        is_deleted: 0,
        name: '',
      },
      typeRules: {
        title: [
          {
            required: true,
            message: '请输入类型名称',
            trigger: 'blur',
          },
        ],
        choose: [
          {
            required: true,
            message: '请选择是否必须',
            trigger: 'change',
          },
        ],
      },
      typeItemRules: {
        title: [
          {
            required: true,
            message: '请输入计费项名称',
            trigger: 'blur',
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
      apparatusInfo({ id: this.$route.params.id }).then((response) => {
        if (response.status !== 200) {
          this.returnToList();
        } else {
          this.apparatus = response.data;
          this.typeForm.apparatus_id = this.apparatus.id;
          this.queryList();
        }
      });
    },
    queryList() {
      sampleDeliverList({
        apparatus_id: this.apparatus.id,
        size: 100,
      }).then((res) => {
        if (res.status === 200) {
          this.list = res.data.data;
        }
        console.log(this.list);
      });
    },
    submitTypeForm(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          if (this.typeForm.id) {
            editSampleDeliver(this.typeForm).then((response) => {
              if (response.status === 1) {
                this.typeFormVisible = false;
                this.queryList();
              }
            });
          } else {
            addSampleDeliver(this.typeForm).then((response) => {
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
          if (this.typeItemForm.id) {
            editSampleDeliverItem(this.typeItemForm).then((response) => {
              if (response.status === 1) {
                this.typeItemFormVisible = false;
                this.queryList();
              }
            });
          } else {
            addSampleDeliverItem(this.typeItemForm).then((response) => {
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
      this.typeItemForm.sample_deliver_id = id;
      if (!item) {
        this.typeItemForm.id = '';
        this.typeItemForm.title = '';
        this.typeItemForm.type = '';
        this.typeItemForm.charge = '';
        this.typeItemForm.external_charge = '';
        this.typeItemForm.self_free = '';
        this.typeItemForm.unit = '';
        this.typeItemForm.note = '';
      } else {
        this.typeItemForm.id = item.id;
        this.typeItemForm.title = item.title;
        this.typeItemForm.type = item.type;
        this.typeItemForm.charge = item.charge;
        this.typeItemForm.external_charge = item.external_charge;
        this.typeItemForm.self_free = item.self_free;
        this.typeItemForm.unit = item.unit;
        this.typeItemForm.note = item.note;
      }
      this.typeItemFormVisible = true;
    },
    toDeleteType(item) {
      this.$confirm('确定要删除计费类型"' + item.title + '"吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deleteSampleDeliver({ id: item.id, is_deleted: 1 }).then((response) => {
          if (response.status === 1) this.queryList();
        });
      });
    },
    toDeleteTypeItem(item) {
      this.$confirm('确定要删除计费项"' + item.title + '"吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deleteSampleDeliverItem({ id: item.id, is_deleted: 1 }).then((response) => {
          if (response.status === 1) this.queryList();
        });
      });
    },
    toAddType(item) {
      if (!item) {
        this.typeForm.id = '';
        this.typeForm.title = '';
        this.typeForm.choose = '';
      } else {
        this.typeForm.id = item.id;
        this.typeForm.title = item.title;
        this.typeForm.choose = item.choose;
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
