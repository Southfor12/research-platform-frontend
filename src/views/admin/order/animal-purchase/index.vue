<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据处理中..."
    element-loading-spinner="el-icon-loading"
  >
    <div class="order-management">
      <div class="header">
        <h2>订单审核</h2>
      </div>

      <el-table :data="animalOrder" stripe border>
        <!-- 表格列定义 -->
        <el-table-column prop="id" label="订单编号" width="100">
          <template #default="scope">
            <el-tooltip content="查看详情" placement="top">
              <el-icon
                class="icon-eye"
                @click="viewAnimalOrderDetail(scope.row)"
                style="cursor: pointer; color: #409eff"
              >
                <i class="el-icon-view"></i>
              </el-icon>
            </el-tooltip>
            <el-link @click="viewAnimalOrderDetail(scope.row)">{{ scope.row.id }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="user_name" label="订单客户姓名" width="120" />
        <el-table-column prop="user_organization_name" label="课程组" width="100" />
        <el-table-column prop="create_time" label="订单时间" width="150" />
        <el-table-column prop="project_name" label="产品服务" />
        <el-table-column prop="age" label="周龄" />
        <el-table-column prop="weight" label="体重" />
        <el-table-column prop="gender" label="性别" />
        <el-table-column prop="price" label="价格" />
        <el-table-column prop="count" label="数量" />
        <el-table-column prop="totalCost" label="金额" />
        <el-table-column prop="extra" label="其他费用" />
        <el-table-column prop="finalCost" label="总额" />
        <el-table-column prop="description" label="备注" />
        <el-table-column prop="status_" label="当前状态标识">
          <template slot-scope="scope">
            <span :style="{ color: scope.row.status < 0 ? 'red' : 'inherit' }">
              {{ scope.row.status_ }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 4" type="success">审批通过</el-tag>
            <el-tag v-else-if="scope.row.status < 0" type="danger">审核不通过</el-tag>
            <el-button
              v-else
              type="primary"
              size="mini"
              @click="handleAnimalAudit(scope.row)"
            >
              {{ getAuditButtonText(scope.row.status) }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 订单详情弹窗 -->
      <el-dialog
        title="订单信息"
        :visible.sync="AnimalOrderDialogVisible"
        width="40%"
        append-to-body
        custom-class="el-dialog_"
      >
        <el-card shadow="hover" class="info-card">
          <el-form :column="2" border>
            <el-form-item label="订单编号">{{ selectedOrder.id }}</el-form-item>
            <el-form-item label="产品服务">{{ selectedOrder.project_name }}</el-form-item>
            <el-form-item label="价格">{{ selectedOrder.price }}</el-form-item>
            <el-form-item label="数量">{{ selectedOrder.count }}</el-form-item>
            <el-form-item label="金额合计">{{
              selectedOrder.count * selectedOrder.price
            }}</el-form-item>
            <el-form-item label="其他费用">{{ selectedOrder.extra }}</el-form-item>
            <el-form-item label="描述">{{ selectedOrder.remarks }}</el-form-item>
            <el-form-item label="申请的笼位">
              <el-table
                :data="tableData"
                style="width: 100%"
                :cell-class-name="getCellClassName"
                border
                text-align="center"
              >
                <el-table-column prop="row" label="#" width="50"></el-table-column>
                <el-table-column
                  v-for="col in columns"
                  :key="col"
                  :prop="col"
                  :label="col"
                  width="100"
                ></el-table-column>
              </el-table>
            </el-form-item>
          </el-form>
        </el-card>

        <el-card shadow="hover" class="progress-card">
          <h4>订单进展</h4>
          <el-steps :active="animalCurrentStep" finish-status="success">
            <el-step
              v-for="(step, index) in animalSteps"
              :key="index"
              :title="step.title"
              :description="step.description"
              :status="step.status"
            >
            </el-step>
          </el-steps>
        </el-card>

        <div slot="footer" class="dialog-footer">
          <el-button @click="AnimalOrderDialogVisible = false">关闭</el-button>
        </div>
      </el-dialog>

      <el-dialog
        title="审核订单"
        :visible.sync="AuditAnimalDialogVisible"
        width="40%"
        append-to-body
        custom-class="el-dialog_"
      >
        <el-card shadow="hover" class="info-card">
          <el-form label-width="100px">
            <el-form-item label="审核结果">
              <el-select
                v-model="AnimalAuditForm.choice"
                placeholder="请选择审核结果"
                clearable
              >
                <el-option label="审核通过" value="1"></el-option>
                <el-option label="审核不通过" value="-1"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="审核意见">
              <el-input
                type="textarea"
                v-model="AnimalAuditForm.info"
                placeholder="请输入审核意见"
              ></el-input>
            </el-form-item>
          </el-form>
        </el-card>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleAnimalAuditSubmit">提交</el-button>
          <el-button @click="AuditAnimalDialogVisible = false">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getOrderListByOrgId,
  checkAnimalOrder,
  get_a_AnimalOrder
} from '@/api/order';
import { get_a_Animal } from '@/api/product';
import { get_a_Rack } from '@/api/colleges';
import store from '@/store';

export default {
  name: 'AnimalPurchaseOrder',
  data() {
    return {
      AnimalAuditForm: {}, //审核信息
      AuditAnimalDialogVisible: false, //审核弹窗
      tableData: [], // 表格数据
      columns: [], // 表格列
      activeCells: [],
      AnimalOrderDialogVisible: false, // 控制订单详情弹窗的显示状态
      selectedOrder: {}, // 当前选中的订单
      loading: false,
      animalStutas: ['待支付', '待课题组管理员审核', '待采购人审核', '待中心主任审批', '审批通过'],
      animalStutas_: ['课题组管理员审核不通过', '采购人审核不通过', '中心主任审批不通过'],
      animalCurrentStep: 0, // 当前步骤索引
      animalSteps: [
        { title: '待付款', description: '等待付款' },
        { title: '课题组审核', description: '等待课题组审核' },
        { title: '采购人审核', description: '等待采购人审核' },
        { title: '中心主任审批', description: '等待中心主任审批' },
        { title: '审批通过', description: '流程已完成' },
      ],
      animalOrder: [],
      auditSteps: [
        { status: 1, text: '课题组审核' },
        { status: 2, text: '采购人审核' },
        { status: 3, text: '中心主任审批' },
      ],
    };
  },
  created() {
    this.getAnimalOrder();
  },
  methods: {
    async getAnimalOrder() {
      try {
        const res = await getOrderListByOrgId({ user_id: store.getters.member.id });
        console.log('API Response:', res);
        if (res.status === 1) {
          this.animalOrder = res.data.map(item => {
            let statusText = '';
            if (item.status < 0) {
              const rejectStep = Math.abs(item.status);
              const step = this.auditSteps.find(s => s.status === rejectStep);
              statusText = step ? `${step.text}不通过` : '审核不通过';
            } else {
              statusText = this.animalStutas[item.status];
            }

            return {
              ...item,
              name: item.project_name,
              totalCost: item.price * item.count,
              finalCost: (item.price * item.count) + item.extra,
              status_: statusText,
              auditStatus: item.status !== 1
            };
          });
          console.log('Processed animalOrder:', this.animalOrder);
        }
      } catch (error) {
        console.error('Error in getAnimalOrder:', error);
        this.$message.error('获取订单数据失败');
      }
    },

    generateTableData(rows, cols) {
      this.tableData = [];
      this.columns = [];
      for (let i = 1; i <= cols; i++) {
        this.columns.push(String.fromCharCode(64 + i));
      }
      for (let i = 1; i <= rows; i++) {
        let rowData = { row: i };
        this.columns.forEach((col) => {
          rowData[col] = `${col}${i}`;
        });
        this.tableData.push(rowData);
      }
    },

    getCellClassName({ row, columnIndex, column }) {
      const colKey = this.columns[columnIndex - 1];
      const isActive = this.activeCells.some(
        (cell) => cell.row === row.row && cell.column === colKey
      );
      return isActive ? 'highlight' : 'default-cell';
    },

    viewAnimalOrderDetail(order) {
      this.activeCells = [];
      this.selectedOrder = { ...order };
      this.AnimalOrderDialogVisible = true;
      if (order.rack_id)
        get_a_Rack({ id: order.rack_id }).then((res) => {
          order.width = res.data.width;
          order.height = res.data.height;
          this.generateTableData(order.height, order.width);
          console.log(order.cage_number[0]);
          const row = this.tableData[Math.floor(order.cage_number[0] / this.columns.length)];
          const column = this.columns.find(
            (col) =>
              col === String.fromCharCode(64 + (order.cage_number[0] % this.columns.length) + 1)
          );
          console.log(Math.floor(order.cage_number[0] / this.columns.length), column);
          let cellKey = { row: row.row, column: column };
          this.activeCells.push(cellKey);
        });
      this.animalCurrentStep = 0;
      this.animalSteps = [
        { title: '待付款', description: '等待付款' },
        { title: '课题组审核', description: '等待课题组审核' },
        { title: '采购人审核', description: '等待采购人审核' },
        { title: '中心主任审批', description: '等待中心主任审批' },
        { title: '审批', description: '流程已完成' },
      ];
      for (let i = 0; i < this.animalSteps.length; i++) this.animalSteps[i].status = '';
      if (order.status === this.animalSteps.length - 1) order.status++;
      if (order.status > 0) {
        for (let i = 0; i < order.status; i++) {
          this.animalSteps[i].title = this.animalSteps[i].title + '通过';
          this.animalSteps[i].description = '';
          this.animalCurrentStep++;
        }
        this.animalSteps[0].title = '已付款';
      } else if (order.status < 0) {
        for (let i = 0; i < -order.status - 1; i++) {
          this.animalSteps[i].title = this.animalSteps[i].title + '通过';
          this.animalSteps[i].description = '';
          this.animalCurrentStep++;
        }
        this.animalSteps[0].title = '已付款';
        this.animalSteps[-order.status - 1].title =
          this.animalSteps[-order.status - 1].title + '不通过';
        this.animalSteps[-order.status - 1].description = '';
        this.animalSteps[-order.status - 1].status = 'error';
      }
    },

    getAuditButtonText(status) {
      const step = this.auditSteps.find(s => s.status === status);
      return step ? step.text : '审核';
    },

    handleAnimalAudit(order) {
      this.AnimalAuditForm = {
        id: order.id,
        currentStatus: order.status
      };
      this.AuditAnimalDialogVisible = true;
    },

    handleAnimalAuditSubmit() {
      const currentOrder = this.animalOrder.find(item => item.id === this.AnimalAuditForm.id);
      if (!currentOrder) {
        this.$message.error('未找到当前订单');
        return;
      }

      if (this.AnimalAuditForm.choice === '1') {
        this.AnimalAuditForm.status = currentOrder.status + 1;
      } else if (this.AnimalAuditForm.choice === '-1') {
        this.AnimalAuditForm.status = -(currentOrder.status);
      }

      checkAnimalOrder(this.AnimalAuditForm).then((res) => {
        if (res.status === 1) {
          this.$message.success('审核提交成功');
          this.AuditAnimalDialogVisible = false;
          this.getAnimalOrder();
          
          if (this.AnimalAuditForm.choice === '1' && this.AnimalAuditForm.status < 4) {
            const nextStep = this.auditSteps.find(s => s.status === this.AnimalAuditForm.status);
            if (nextStep) {
              this.$message.info(`请等待${nextStep.text}`);
            }
          }
        } else {
          this.$message.error(res.msg || '审核提交失败');
        }
      }).catch(error => {
        console.error('审核提交错误:', error);
        this.$message.error('审核提交失败');
      });
    },
  }
};
</script>

<style>
.order-management {
  padding: 20px;
  background-color: #fff;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.header-actions {
  display: flex;
  gap: 10px;
}
.dialog-footer {
  text-align: right;
}
.el-dialog_ {
  border-radius: 10px;
  overflow: hidden;
}

.default-cell {
  background-color: #f9f9f9;
}

.highlight {
  background-color: #ffd04b;
  color: #ffffff;
}

.status-danger {
  color: #f56c6c;
  font-weight: bold;
}
</style> 