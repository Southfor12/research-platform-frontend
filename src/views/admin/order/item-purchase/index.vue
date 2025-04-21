<template>
  <div class="app-container">
    <div class="order-management">
      <div class="header">
        <h2>物品订购管理</h2>
      </div>

      <el-table :data="list" stripe border v-loading="listLoading">
        <el-table-column prop="id" label="订单编号" width="100">
          <template #default="scope">
            <el-tooltip content="查看详情" placement="top">
              <el-icon class="icon-eye" @click="viewItemOrderDetail(scope.row)"
                style="cursor: pointer; margin-right: 5px; color: #409eff">
                <i class="el-icon-view"></i>
              </el-icon>
            </el-tooltip>
            <el-link @click="viewItemOrderDetail(scope.row)">{{ scope.row.id }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="user_name" label="订单客户姓名" width="120" />
        <el-table-column prop="user_organization_name" label="课题组" width="100" />
        <el-table-column prop="create_time" label="订单时间" width="150" />
        <el-table-column prop="name" label="物品名称" />
        <el-table-column prop="specification" label="规格" />
        <el-table-column prop="price" label="价格" />
        <el-table-column prop="count" label="数量" />
        <el-table-column prop="totalCost" label="金额" />
        <el-table-column prop="extra" label="其他费用" />
        <el-table-column prop="finalCost" label="总额" />
        <el-table-column prop="description" label="备注" />
        <el-table-column prop="status_" label="当前状态标识">
          <template #default="scope">
            <el-tag :type="getStatusTagType(scope.row.status)">
              {{ scope.row.status_ }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <template v-if="scope.row.status === 4">
              <el-tag type="success">审批通过</el-tag>
            </template>
            <template v-else-if="scope.row.status < 0">
              <el-tag type="danger">审核不通过</el-tag>
            </template>
            <template v-else>
              <el-button type="primary" size="small" @click="handleItemAudit(scope.row)">
                {{ getAuditButtonText(scope.row.status) }}
              </el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>

      <!-- 订单详情弹窗 -->
      <el-dialog title="订单信息" :visible.sync="ItemOrderDialogVisible" width="40%" append-to-body>
        <el-card shadow="hover" class="info-card">
          <el-form :column="2" border>
            <el-form-item label="订单编号">{{ selectedOrder.id }}</el-form-item>
            <el-form-item label="订单客户姓名">{{ selectedOrder.user_name }}</el-form-item>
            <el-form-item label="课题组">{{ selectedOrder.user_organization_name }}</el-form-item>
            <el-form-item label="订单时间">{{ selectedOrder.create_time }}</el-form-item>
            <el-form-item label="物品名称">{{ selectedOrder.name }}</el-form-item>
            <el-form-item label="规格">{{ selectedOrder.specification }}</el-form-item>
            <el-form-item label="价格">{{ selectedOrder.price }}</el-form-item>
            <el-form-item label="数量">{{ selectedOrder.count }}</el-form-item>
            <el-form-item label="金额">{{ selectedOrder.totalCost }}</el-form-item>
            <el-form-item label="其他费用">{{ selectedOrder.extra }}</el-form-item>
            <el-form-item label="总额">{{ selectedOrder.finalCost }}</el-form-item>
            <el-form-item label="备注">{{ selectedOrder.description }}</el-form-item>
          </el-form>
        </el-card>
      </el-dialog>

      <!-- 审核弹窗 -->
      <el-dialog title="审核订单" :visible.sync="AuditItemDialogVisible" width="40%" append-to-body>
        <el-card shadow="hover" class="info-card">
          <el-form label-width="100px">
            <el-form-item label="审核结果">
              <el-select v-model="ItemAuditForm.choice" placeholder="请选择审核结果" clearable>
                <el-option label="审核通过" value="1"></el-option>
                <el-option label="审核不通过" value="-1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="审核意见">
              <el-input type="textarea" v-model="ItemAuditForm.info" placeholder="请输入审核意见"></el-input>
            </el-form-item>
          </el-form>
        </el-card>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleItemAuditSubmit">提交</el-button>
          <el-button @click="AuditItemDialogVisible = false">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getAllItemOrder, checkItemOrder } from '@/api/order'

export default {
  name: 'ItemPurchase',
  data() {
    return {
      list: null,
      listLoading: true,
      ItemOrderDialogVisible: false,
      AuditItemDialogVisible: false,
      selectedOrder: {},
      ItemAuditForm: {
        choice: '',
        info: ''
      },
      itemStatus: ['待支付', '待课题组管理员审核', '待采购人审核', '待中心主任审批', '审批通过'],
      itemStatus_: ['课题组管理员审核不通过', '采购人审核不通过', '中心主任审批不通过'],
      auditSteps: [
        { status: 1, text: '课题组审核' },
        { status: 2, text: '采购人审核' },
        { status: 3, text: '中心主任审批' }
      ]
    }
  },
  created() {
    this.getItemOrder()
  },
  methods: {
    async getItemOrder() {
      try {
        this.listLoading = true
        const res = await getAllItemOrder({})
        if (res.status === 1) {
          this.list = res.data.map(item => {
            let statusText = ''
            if (item.status < 0) {
              const rejectStep = Math.abs(item.status)
              const step = this.auditSteps.find(s => s.status === rejectStep)
              statusText = step ? `${step.text}不通过` : '审核不通过'
            } else {
              statusText = this.itemStatus[item.status]
            }

            return {
              ...item,
              totalCost: item.price * item.count,
              finalCost: (item.price * item.count) + item.extra,
              status_: statusText
            }
          })
        }
      } catch (error) {
        console.error('获取物品订单失败:', error)
        this.$message.error('获取订单数据失败')
      } finally {
        this.listLoading = false
      }
    },
    viewItemOrderDetail(row) {
      this.selectedOrder = row
      this.ItemOrderDialogVisible = true
    },
    handleItemAudit(row) {
      this.selectedOrder = row
      this.ItemAuditForm = {
        id: row.id,
        currentStatus: row.status
      }
      this.AuditItemDialogVisible = true
    },
    async handleItemAuditSubmit() {
      if (!this.ItemAuditForm.choice) {
        this.$message.warning('请选择审核结果')
        return
      }

      const currentOrder = this.list.find(item => item.id === this.ItemAuditForm.id)
      if (!currentOrder) {
        this.$message.error('未找到当前订单')
        return
      }

      if (this.ItemAuditForm.choice === '1') {
        this.ItemAuditForm.status = currentOrder.status + 1
      } else if (this.ItemAuditForm.choice === '-1') {
        this.ItemAuditForm.status = -(currentOrder.status)
      }

      try {
        const res = await checkItemOrder(this.ItemAuditForm)
        if (res.status === 1) {
          this.$message.success('审核提交成功')
          this.AuditItemDialogVisible = false
          this.getItemOrder()
          
          if (this.ItemAuditForm.choice === '1' && this.ItemAuditForm.status < 4) {
            const nextStep = this.auditSteps.find(s => s.status === this.ItemAuditForm.status)
            if (nextStep) {
              this.$message.info(`请等待${nextStep.text}`)
            }
          }
        } else {
          this.$message.error(res.msg || '审核提交失败')
        }
      } catch (error) {
        console.error('审核提交错误:', error)
        this.$message.error('审核提交失败')
      }
    },
    getStatusTagType(status) {
      if (status < 0) return 'danger'
      if (status === 4) return 'success'
      return 'warning'
    },
    getAuditButtonText(status) {
      const step = this.auditSteps.find(s => s.status === status)
      return step ? step.text : '审核'
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px;
  background-color: #fff;
}

.order-management {
  .header {
    margin-bottom: 20px;
    h2 {
      margin: 0;
      font-size: 18px;
      color: #333;
    }
  }
}

.info-card {
  margin-bottom: 20px;
}

.dialog-footer {
  text-align: right;
}
</style> 