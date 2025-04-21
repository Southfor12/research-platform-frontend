<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据处理中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-tabs v-model="activeTab" @keydown.native="handleTabSwitch" @tab-click="handleTabChange">
      <el-tab-pane label="动物订单" name="animalOrder">
        <el-form :model="animalOrder" label-width="100px"
          ><div class="order-management">
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
                  <el-tag v-if="scope.row.status === 2" type="success">已审核</el-tag>
                  <el-tag v-else-if="scope.row.status === -2" type="danger">审核不通过</el-tag>
                  <el-button
                    v-else-if="scope.row.status === 1"
                    type="primary"
                    size="mini"
                    @click="handleAnimalAudit(scope.row)"
                  >
                    审核
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
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="物品订单" name="itemOrder">
        <el-form :model="itemOrder" label-width="100px">
          <div class="order-management">
            <div class="header">
              <h2>订单审核</h2>
            </div>

            <el-table :data="itemOrder" stripe border>
              <!-- 表格列定义 -->
              <el-table-column prop="id" label="订单编号" width="100">
                <template #default="scope">
                  <el-tooltip content="查看详情" placement="top">
                    <el-icon
                      class="icon-eye"
                      @click="viewItemOrderDetail(scope.row)"
                      style="cursor: pointer; margin-right: 5px; color: #409eff"
                    >
                      <i class="el-icon-view"></i>
                    </el-icon>
                  </el-tooltip>
                  <el-link @click="viewItemOrderDetail(scope.row)">{{ scope.row.id }}</el-link>
                </template>
              </el-table-column>
              <el-table-column prop="user_name" label="订单客户姓名" width="120" />
              <el-table-column prop="user_organization_name" label="课程组" width="100" />
              <el-table-column prop="create_time" label="订单时间" width="150" />
              <el-table-column prop="name" label="产品服务" />
              <el-table-column prop="supplier_name" label="供应商" />
              <el-table-column prop="price" label="价格" />
              <el-table-column prop="count" label="数量" />
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
                  <el-tag v-if="scope.row.status === 2" type="success">已审核</el-tag>
                  <el-tag v-else-if="scope.row.status === -2" type="danger">审核不通过</el-tag>
                  <el-button
                    v-else-if="scope.row.status === 1"
                    type="primary"
                    size="mini"
                    @click="handleItemAudit(scope.row)"
                  >
                    审核
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

            <!-- 订单详情弹窗 -->
            <el-dialog
              title="订单信息"
              :visible.sync="ItemOrderDialogVisible"
              width="600px"
              append-to-body
              custom-class="el-dialog_"
            >
              <el-card shadow="hover" class="info-card">
                <el-form :column="2" border>
                  <el-form-item label="订单编号">{{ selectedOrder.id }}</el-form-item>
                  <el-form-item label="产品服务">{{ selectedOrder.name }}</el-form-item>
                  <el-form-item label="价格">{{ selectedOrder.price }}</el-form-item>
                  <el-form-item label="数量">{{ selectedOrder.count }}</el-form-item>
                  <el-form-item label="金额合计">{{ selectedOrder.totalCost }}</el-form-item>
                  <el-form-item label="描述">{{ selectedOrder.description }}</el-form-item>
                </el-form>
              </el-card>

              <el-card shadow="hover" class="progress-card">
                <h4>订单进展</h4>
                <el-steps :active="itemCurrentStep" finish-status="success">
                  <el-step
                    v-for="(step, index) in itemSteps"
                    :key="index"
                    :title="step.title"
                    :description="step.description"
                    :status="step.status"
                  >
                  </el-step>
                </el-steps>
              </el-card>

              <div slot="footer" class="dialog-footer">
                <el-button @click="ItemOrderDialogVisible = false">关闭</el-button>
              </div>
            </el-dialog>

            <el-dialog
              title="审核订单"
              :visible.sync="AuditItemDialogVisible"
              width="40%"
              append-to-body
              custom-class="el-dialog_"
            >
              <el-card shadow="hover" class="info-card">
                <el-form label-width="100px">
                  <el-form-item label="审核结果">
                    <el-select
                      v-model="ItemAuditForm.choice"
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
                      v-model="ItemAuditForm.info"
                      placeholder="请输入审核意见"
                    ></el-input>
                  </el-form-item>
                </el-form>
              </el-card>
              <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleItemAuditSubmit">提交</el-button>
                <el-button @click="AuditItemDialogVisible = false">取消</el-button>
              </div>
            </el-dialog>
          </div>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="饲养订单" name="feedOrder">
        <el-form :model="feedOrder" label-width="100px">
          <div class="order-management">
            <div class="header">
              <h2>订单审核</h2>
            </div>

            <el-table :data="feedOrder" stripe border>
              <!-- 表格列定义 -->
              <el-table-column prop="id" label="订单编号" width="100">
                <template #default="scope">
                  <el-tooltip content="查看详情" placement="top">
                    <el-icon
                      class="icon-eye"
                      @click="viewFeedOrderDetail(scope.row)"
                      style="cursor: pointer; margin-right: 5px; color: #409eff"
                    >
                      <i class="el-icon-view"></i>
                    </el-icon>
                  </el-tooltip>
                  <el-link @click="viewFeedOrderDetail(scope.row)">{{ scope.row.id }}</el-link>
                </template>
              </el-table-column>
              <el-table-column prop="user_name" label="订单客户姓名" width="120" />
              <el-table-column prop="user_organization_name" label="课程组" width="100" />
              <el-table-column prop="create_time" label="订单时间" width="150" />
              <el-table-column prop="source" label="动物来源" />
              <el-table-column prop="area_type" label="区域" />
              <el-table-column prop="animal_type" label="动物种类" />
              <el-table-column prop="level" label="动物级别" />
              <el-table-column prop="start_time" label="开始时间" />
              <el-table-column prop="end_time" label="结束时间" />
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
                  <el-tag v-if="scope.row.status === 2" type="success">已审核</el-tag>
                  <el-tag v-else-if="scope.row.status === -2" type="danger">审核不通过</el-tag>
                  <el-button
                    v-else-if="scope.row.status === 1"
                    type="primary"
                    size="mini"
                    @click="handleFeedAudit(scope.row)"
                  >
                    审核
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

            <!-- 订单详情弹窗 -->
            <el-dialog
              title="订单信息"
              :visible.sync="FeedOrderDialogVisible"
              width="600px"
              append-to-body
              custom-class="el-dialog_"
            >
              <el-card shadow="hover" class="info-card">
                <el-form :column="2" border>
                  <el-form-item label="订单编号">{{ selectedOrder.id }}</el-form-item>
                  <el-form-item label="订单客户姓名">{{ selectedOrder.user_name }}</el-form-item>
                  <el-form-item label="课程组">{{
                    selectedOrder.user_organization_name
                  }}</el-form-item>
                  <el-form-item label="订单时间">{{ selectedOrder.create_time }}</el-form-item>
                  <el-form-item label="动物来源">{{ selectedOrder.source }}</el-form-item>
                  <el-form-item label="区域">{{ selectedOrder.area_type }}</el-form-item>
                  <el-form-item label="动物种类">{{ selectedOrder.animal_type }}</el-form-item>
                  <el-form-item label="动物级别">{{ selectedOrder.level }}</el-form-item>
                  <el-form-item label="开始时间">{{ selectedOrder.start_time }}</el-form-item>
                  <el-form-item label="结束时间">{{ selectedOrder.end_time }}</el-form-item>
                  <el-form-item label="备注">{{ selectedOrder.description }}</el-form-item>
                  <el-form-item label="当前状态标识">{{ selectedOrder.status }}</el-form-item>
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
                <el-steps :active="feedCurrentStep" finish-status="success">
                  <el-step
                    v-for="(step, index) in feedSteps"
                    :key="index"
                    :title="step.title"
                    :description="step.description"
                    :status="step.status"
                  >
                  </el-step>
                </el-steps>
              </el-card>

              <div slot="footer" class="dialog-footer">
                <el-button @click="FeedOrderDialogVisible = false">关闭</el-button>
              </div>
            </el-dialog>

            <el-dialog
              title="审核订单"
              :visible.sync="AuditFeedDialogVisible"
              width="40%"
              append-to-body
              custom-class="el-dialog_"
            >
              <el-card shadow="hover" class="info-card">
                <el-form label-width="100px">
                  <el-form-item label="审核结果">
                    <el-select
                      v-model="FeedAuditForm.choice"
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
                      v-model="FeedAuditForm.info"
                      placeholder="请输入审核意见"
                    ></el-input>
                  </el-form-item>
                </el-form>
              </el-card>
              <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleFeedAuditSubmit">提交</el-button>
                <el-button @click="AuditFeedDialogVisible = false">取消</el-button>
              </div>
            </el-dialog>
          </div>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="技术订单" name="techOrder">
        <el-form :model="techOrder" label-width="100px">
          <div class="order-management">
            <div class="header">
              <h2>订单审核</h2>
            </div>
            <!-- 订单编号、订购人、课题组、订单时间、技术服务（冻存服务、复苏服务、净化服务）、价格、数量、金额、备注、状态 -->
            <el-table :data="techOrder" stripe border>
              <!-- 表格列定义 -->
              <el-table-column prop="id" label="订单编号" width="100">
                <template #default="scope">
                  <el-tooltip content="查看详情" placement="top">
                    <el-icon
                      class="icon-eye"
                      @click="viewTechOrderDetail(scope.row)"
                      style="cursor: pointer; margin-right: 5px; color: #409eff"
                    >
                      <i class="el-icon-view"></i>
                    </el-icon>
                  </el-tooltip>
                  <el-link @click="viewTechOrderDetail(scope.row)">{{ scope.row.id }}</el-link>
                </template>
              </el-table-column>
              <el-table-column prop="user_name" label="订单客户姓名" width="120" />
              <el-table-column prop="user_organization_name" label="课程组" width="100" />
              <el-table-column prop="create_time" label="订单时间" width="150" />
              <el-table-column prop="name" label="技术服务" />
              <el-table-column prop="price" label="价格" />
              <el-table-column prop="count" label="数量" />
              <el-table-column prop="totalCost" label="金额" />
              <el-table-column prop="info" label="备注" />
              <el-table-column prop="status_" label="当前状态标识">
                <template slot-scope="scope">
                  <span :style="{ color: scope.row.status < 0 ? 'red' : 'inherit' }">
                    {{ scope.row.status_ }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.status === 2" type="success">已审核</el-tag>
                  <el-tag v-else-if="scope.row.status === -2" type="danger">审核不通过</el-tag>
                  <el-button
                    v-else-if="scope.row.status === 1"
                    type="primary"
                    size="mini"
                    @click="handleTechAudit(scope.row)"
                  >
                    审核
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

            <!-- 订单详情弹窗 -->
            <el-dialog
              title="订单信息"
              :visible.sync="TechOrderDialogVisible"
              width="600px"
              append-to-body
              custom-class="el-dialog_"
            >
              <el-card shadow="hover" class="info-card">
                <el-form :column="2" border>
                  <el-form-item label="订单编号">{{ selectedOrder.id }}</el-form-item>
                  <el-form-item label="订单客户姓名">{{ selectedOrder.user_name }}</el-form-item>
                  <el-form-item label="课程组">{{
                    selectedOrder.user_organization_name
                  }}</el-form-item>
                  <el-form-item label="订单时间">{{ selectedOrder.create_time }}</el-form-item>
                  <el-form-item label="技术服务">{{ selectedOrder.name }}</el-form-item>
                  <el-form-item label="价格">{{ selectedOrder.price }}</el-form-item>
                  <el-form-item label="数量">{{ selectedOrder.count }}</el-form-item>
                  <el-form-item label="金额合计">{{ selectedOrder.totalCost }}</el-form-item>
                  <el-form-item label="备注">{{ selectedOrder.info }}</el-form-item>
                  <el-form-item label="当前状态标识">{{ selectedOrder.status }}</el-form-item>
                </el-form>
              </el-card>

              <el-card shadow="hover" class="progress-card">
                <h4>订单进展</h4>
                <el-steps :active="techCurrentStep" finish-status="success">
                  <el-step
                    v-for="(step, index) in techSteps"
                    :key="index"
                    :title="step.title"
                    :description="step.description"
                    :status="step.status"
                  >
                  </el-step>
                </el-steps>
              </el-card>

              <div slot="footer" class="dialog-footer">
                <el-button @click="TechOrderDialogVisible = false">关闭</el-button>
              </div>
            </el-dialog>

            <el-dialog
              title="审核订单"
              :visible.sync="AuditTechDialogVisible"
              width="40%"
              append-to-body
              custom-class="el-dialog_"
            >
              <el-card shadow="hover" class="info-card">
                <el-form label-width="100px">
                  <el-form-item label="审核结果">
                    <el-select
                      v-model="TechAuditForm.choice"
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
                      v-model="TechAuditForm.info"
                      placeholder="请输入审核意见"
                    ></el-input>
                  </el-form-item>
                </el-form>
              </el-card>
              <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleTechAuditSubmit">提交</el-button>
                <el-button @click="AuditTechDialogVisible = false">取消</el-button>
              </div>
            </el-dialog>
          </div></el-form
        >
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
            <script>
import {
  //测试
  getAllItemOrder,
  getAllFeedOrder,
  getAllTechOrder,
  getAllAnimalOrder,
  checkAnimalOrder,
  checkItemOrder,
  checkFeedOrder,
  checkTechOrder,
  get_a_FeedOrder,
  submitTechAudit,
  submitAnimalAudit,
  submitItemAudit,
  submitFeedAudit,
  getOrderListByOrgId,
  getFeedOrderListByOrgId,
  getItemOrderListByOrgId,
  getTechOrderListByOrgId,
} from '@/api/order';
import { get_a_Feed, get_a_Animal } from '@/api/product';
import { get_a_Rack } from '@/api/colleges';
import store from '@/store';
export default {
  name: 'OrderManagement',
  data() {
    return {
      TechAuditForm: {}, //审核信息
      AnimalAuditForm: {},
      ItemAuditForm: {},
      FeedAuditForm: {},
      AuditTechDialogVisible: false, //审核弹窗
      AuditAnimalDialogVisible: false,
      AuditItemDialogVisible: false,
      AuditFeedDialogVisible: false,

      tableData: [], // 表格数据
      columns: [], // 表格列
      activeCells: [],
      searchQuery: '', // 搜索内容

      AnimalOrderDialogVisible: false, // 控制订单详情弹窗的显示状态
      ItemOrderDialogVisible: false, // 控制订单详情弹窗的显示状态
      FeedOrderDialogVisible: false, // 控制订单详情弹窗的显示状态
      TechOrderDialogVisible: false, // 控制订单详情弹窗的显示状态
      selectedOrder: {}, // 当前选中的订单
      loading: false,

      activeTab: 'animalOrder', // 初始选中的标签页
      tabNames: ['animalOrder', 'itemOrder', 'feedOrder', 'techOrder'], // 标签页的 name 顺序

      animalStutas: ['待支付', '待课题组管理员审核', '待采购人审核', '待中心主任审批', '审批通过'],
      itemStutas: ['待支付', '待课题组管理员审核', '待采购人审核', '待中心主任审批', '审批通过'],
      feedStutas: ['待支付', '待课题组管理员审核', '待饲养管理员审批', '审批通过'],
      techStutas: [
        '待支付',
        '待课题组管理员审核',
        '待饲养管理员审批',
        '待中心主任审批',
        '审批通过',
      ],

      animalStutas_: ['课题组管理员审核不通过', '采购人审核不通过', '中心主任审批不通过'],
      itemStutas_: ['课题组管理员审核不通过', '采购人审核不通过', '中心主任审批不通过'],
      feedStutas_: ['课题组管理员审核不通过', '饲养管理员审批不通过'],
      techStutas_: ['课题组管理员审核不通过', '饲养管理员审批不通过', '中心主任审批不通过'],

      animalCurrentStep: 0, // 当前步骤索引
      itemCurrentStep: 0,
      feedCurrentStep: 0,
      techCurrentStep: 0,

      animalSteps: [
        { title: '待付款', description: '等待付款' },
        { title: '课题组审核', description: '等待课题组审核' },
        { title: '采购人审核', description: '等待采购人审核' },
        { title: '中心主任审批', description: '等待中心主任审批' },
        { title: '审批通过', description: '流程已完成' },
      ],
      itemSteps: [
        { title: '待付款', description: '等待付款' },
        { title: '课题组审核', description: '等待课题组审核' },
        { title: '采购人审核', description: '等待采购人审核' },
        { title: '中心主任审批', description: '等待中心主任审批' },
        { title: '审批通过', description: '等待流程已完成' },
      ],
      feedSteps: [
        { title: '待付款', description: '等待付款' },
        { title: '课题组审核', description: '等待课题组审核' },
        { title: '饲养管理员审核', description: '等待饲养管理员审核' },
        { title: '审批通过', description: '流程已完成' },
      ],
      techSteps: [
        { title: '待付款', description: '等待付款' },
        { title: '课题组审核', description: '等待课题组审核' },
        { title: '饲养管理员审核', description: '等待饲养管理员审核' },
        { title: '中心主任审批', description: '等待中心主任审批' },
        { title: '审批通过', description: '流程已完成' },
      ],

      animalOrder: [],
      itemOrder: [],
      feedOrder: [],
      techOrder: [],
      form: {
        name: '',
        number: '',
        id: '',
      },
    };
  },
  created() {
    //     this.loading = true;
    //     this.queryList();

    this.getAnimalOrder();
  },
  methods: {
    // 审核订单

    handleTabChange(newTab, oldTab) {
      if (newTab === 'animalOrder') this.getAnimalOrder();
      if (newTab === 'itemOrder') this.getItemOrder();
      if (newTab === 'feedOrder') this.getFeedOrder();
      if (newTab === 'techOrder') this.getTechOrder();
    },

    async getAnimalOrder() {
      try {
        // 新的实现
        const res = await getOrderListByOrgId({ user_id: store.getters.member.id });
        console.log('API Response:', res); // 添加日志查看返回数据
        if (res.status === 1) {
          this.animalOrder = res.data.map(item => {
            // 处理状态标识
            let statusText = '';
            if (item.status < 0) {
              // 审核不通过
              statusText = '课题组管理员审核不通过';
            } else {
              // 审核通过，使用正常状态
              statusText = this.animalStutas[item.status];
            }

            return {
              ...item,
              name: item.project_name, // 将 project_name 映射为 name
              totalCost: item.price * item.count,
              finalCost: (item.price * item.count) + item.extra,
              status_: statusText,
              // 添加审核状态判断
              auditStatus: item.status !== 1
            };
          });

          // 暂时注释掉角色过滤代码
          /*
          if (store.getters.member.role_id === 13) {
            this.animalOrder = this.animalOrder.filter(item => item.status === 1);
          } else if (store.getters.member.role_id === 14) {
            this.animalOrder = this.animalOrder.filter(item => item.status === 2);
          } else if (store.getters.member.role_id === 12) {
            this.animalOrder = this.animalOrder.filter(item => item.status === 3);
          } else {
            this.animalOrder = [];
          }
          */
          
          console.log('Processed animalOrder:', this.animalOrder); // 添加日志查看处理后的数据
        }
      } catch (error) {
        console.error('Error in getAnimalOrder:', error);
        this.$message.error('获取订单数据失败');
      }
    },

    getFeedOrder() {
      /*
      getAllFeedOrder().then((res) => {
        const promises = res.data.map((item) =>
          get_a_Feed({ id: item.care_id }).then((ress) => {
            return {
              ...item,
              animal_type: ress.data.animal_type,
              room_id: ress.data.room_id,
              area_type: ress.data.area_type,
              totalCost: item.price * item.count + item.extra,
              finalCost: item.totalCost,
            };
          })
        );

        Promise.all(promises).then((data) => {
          this.feedOrder = data; // 确保所有数据加载完成后再赋值
          if (store.getters.member.role_id === 13) {
            this.feedOrder = this.feedOrder.filter((item) => item.status === 1);
          } else if (store.getters.member.role_id === 15) {
            this.feedOrder = this.feedOrder.filter((item) => item.status === 2);
          } else this.feedOrder = [];
          this.feedOrder.forEach((item) => {
            item.status_ = this.feedStutas[item.status];
          });
        });
      });
      */
      
      // 新的实现
      getFeedOrderListByOrgId({ user_id: store.getters.member.id })
        .then(res => {
          console.log('Feed API Response:', res); // 添加日志查看返回数据
          if (res.status === 1) {
            this.feedOrder = res.data.map(item => {
              // 处理状态标识
              let statusText = '';
              if (item.status < 0) {
                // 审核不通过
                statusText = '课题组管理员审核不通过';
              } else {
                // 审核通过，使用正常状态
                statusText = this.feedStutas[item.status];
              }

              return {
                ...item,
                totalCost: item.price * item.count,
                finalCost: (item.price * item.count) + (item.extra || 0),
                status_: statusText,
                // 添加审核状态判断
                auditStatus: item.status !== 1
              };
            });
            
            console.log('Processed feedOrder:', this.feedOrder); // 添加日志查看处理后的数据
          }
        })
        .catch(error => {
          console.error('Error in getFeedOrder:', error);
          this.$message.error('获取饲养订单数据失败');
        });
    },

    getItemOrder() {
      getItemOrderListByOrgId({ user_id: store.getters.member.id })
        .then(res => {
          console.log('Item API Response:', res); // 添加日志查看返回数据
          if (res.status === 1) {
            this.itemOrder = res.data.map(item => {
              // 处理状态标识
              let statusText = '';
              if (item.status < 0) {
                // 审核不通过
                statusText = '课题组管理员审核不通过';
              } else {
                // 审核通过，使用正常状态
                statusText = this.itemStutas[item.status];
              }

              return {
                ...item,
                totalCost: item.price * item.count,
                finalCost: (item.price * item.count) + (item.extra || 0),
                status_: statusText,
                // 添加审核状态判断
                auditStatus: item.status !== 1
              };
            });
            
            console.log('Processed itemOrder:', this.itemOrder); // 添加日志查看处理后的数据
          }
        })
        .catch(error => {
          console.error('Error in getItemOrder:', error);
          this.$message.error('获取物品订单数据失败');
        });
    },

    getTechOrder() {
      getTechOrderListByOrgId({ user_id: store.getters.member.id })
        .then(res => {
          console.log('Tech API Response:', res); // 添加日志查看返回数据
          if (res.status === 1) {
            this.techOrder = res.data.map(item => {
              // 处理状态标识
              let statusText = '';
              if (item.status < 0) {
                // 审核不通过
                statusText = '课题组管理员审核不通过';
              } else {
                // 审核通过，使用正常状态
                statusText = this.techStutas[item.status];
              }

              return {
                ...item,
                totalCost: item.price * item.count,
                finalCost: (item.price * item.count) + (item.extra || 0),
                status_: statusText,
                // 添加审核状态判断
                auditStatus: item.status !== 1
              };
            });
            
            console.log('Processed techOrder:', this.techOrder); // 添加日志查看处理后的数据
          }
        })
        .catch(error => {
          console.error('Error in getTechOrder:', error);
          this.$message.error('获取技术订单数据失败');
        });
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
    }, //初始化表格

    reviewOrder(order) {
      this.$message.success(`审核订单：${order.orderNumber}`);
    },

    // 根据单元格位置动态设置类名
    getCellClassName({ row, columnIndex, column }) {
      const colKey = this.columns[columnIndex - 1]; // 列名，从索引获取
      const isActive = this.activeCells.some(
        (cell) => cell.row === row.row && cell.column === colKey
      );
      return isActive ? 'highlight' : 'default-cell'; // 高亮或默认样式
    },

    // 查看订单详情
    viewAnimalOrderDetail(order) {
      this.activeCells = [];
      this.selectedOrder = { ...order }; // 将选中的订单复制到 selectedOrder
      this.AnimalOrderDialogVisible = true; // 显示弹窗
      if (order.rack_id)
        get_a_Rack({ id: order.rack_id }).then((res) => {
          order.width = res.data.width;
          order.height = res.data.height;
          this.generateTableData(order.height, order.width);
          console.log(order.cage_number[0]);
          const row = this.tableData[Math.floor(order.cage_number[0] / this.columns.length)]; // 获取特定行的数据
          const column = this.columns.find(
            (col) =>
              col === String.fromCharCode(64 + (order.cage_number[0] % this.columns.length) + 1)
          ); // 获取特定列的名字
          console.log(Math.floor(order.cage_number[0] / this.columns.length), column);
          let cellKey = { row: row.row, column: column };
          this.activeCells.push(cellKey); // 记录当前单元格位置
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
    viewItemOrderDetail(order) {
      this.selectedOrder = { ...order }; // 将选中的订单复制到 selectedOrder
      this.ItemOrderDialogVisible = true; // 显示弹窗
      this.itemCurrentStep = 0;
      this.itemSteps = [
        { title: '待付款', description: '等待付款' },
        { title: '课题组审核', description: '等待课题组审核' },
        { title: '采购人审核', description: '等待采购人审核' },
        { title: '中心主任审批', description: '等待中心主任审批' },
        { title: '审批', description: '流程已完成' },
      ];
      for (let i = 0; i < this.itemSteps.length; i++) this.itemSteps[i].status = '';
      if (order.status === this.itemSteps.length - 1) order.status++;
      if (order.status > 0) {
        for (let i = 0; i < order.status; i++) {
          this.itemSteps[i].title = this.itemSteps[i].title + '通过';
          this.itemSteps[i].description = '';
          this.itemCurrentStep++;
        }
        this.itemSteps[0].title = '已付款';
      } else if (order.status < 0) {
        for (let i = 0; i < -order.status - 1; i++) {
          this.itemSteps[i].title = this.itemSteps[i].title + '通过';
          this.itemSteps[i].description = '';
          this.itemCurrentStep++;
        }
        this.itemSteps[0].title = '已付款';
        this.itemSteps[-order.status - 1].title =
          this.itemSteps[-order.status - 1].title + '不通过';
        this.itemSteps[-order.status - 1].description = '';
        this.itemSteps[-order.status - 1].status = 'error';
      }
    },
    viewFeedOrderDetail(order) {
      this.selectedOrder = { ...order }; // 将选中的订单复制到 selectedOrder
      this.FeedOrderDialogVisible = true; // 显示弹窗
      get_a_Rack({ id: order.rack_id }).then((res) => {
        order.width = res.data.width;
        order.height = res.data.height;
        this.generateTableData(order.height, order.width);
        console.log(order.cage_number[0]);
        const row = this.tableData[Math.floor(order.cage_number[0] / this.columns.length)]; // 获取特定行的数据
        const column = this.columns.find(
          (col) =>
            col === String.fromCharCode(64 + (order.cage_number[0] % this.columns.length) + 1)
        ); // 获取特定列的名字
        console.log(Math.floor(order.cage_number[0] / this.columns.length), column);
        let cellKey = { row: row.row, column: column };
        this.activeCells.push(cellKey); // 记录当前单元格位置
      });
      this.feedCurrentStep = 0;
      this.feedSteps = [
        { title: '待付款', description: '等待付款' },
        { title: '课题组审核', description: '等待课题组审核' },
        { title: '饲养管理员审核', description: '等待饲养管理员审核' },
        { title: '审批', description: '流程已完成' },
      ];
      for (let i = 0; i < this.feedSteps.length; i++) this.feedSteps[i].status = '';
      if (order.status === this.feedSteps.length - 1) order.status++;
      if (order.status > 0) {
        for (let i = 0; i < order.status; i++) {
          this.feedSteps[i].title = this.feedSteps[i].title + '通过';
          this.feedSteps[i].description = '';
          this.feedCurrentStep++;
        }
        this.feedSteps[0].title = '已付款';
      } else if (order.status < 0) {
        for (let i = 0; i < -order.status - 1; i++) {
          this.feedSteps[i].title = this.feedSteps[i].title + '通过';
          this.feedSteps[i].description = '';
          this.feedCurrentStep++;
        }
        this.feedSteps[0].title = '已付款';
        this.feedSteps[-order.status - 1].title =
          this.feedSteps[-order.status - 1].title + '不通过';
        this.feedSteps[-order.status - 1].description = '';
        this.feedSteps[-order.status - 1].status = 'error';
      }
    },
    viewTechOrderDetail(order) {
      this.selectedOrder = { ...order }; // 将选中的订单复制到 selectedOrder
      this.TechOrderDialogVisible = true; // 显示弹窗
      this.techCurrentStep = 0;
      this.techSteps = [
        { title: '待付款', description: '等待付款' },
        { title: '课题组审核', description: '等待课题组审核' },
        { title: '技术员审核', description: '等待技术员审核' },
        { title: '审批', description: '流程已完成' },
      ];
      for (let i = 0; i < this.techSteps.length; i++) this.techSteps[i].status = '';
      if (order.status === this.techSteps.length - 1) order.status++;
      if (order.status > 0) {
        for (let i = 0; i < order.status; i++) {
          this.techSteps[i].title = this.techSteps[i].title + '通过';
          this.techSteps[i].description = '';
          this.techCurrentStep++;
        }
        this.techSteps[0].title = '已付款';
      } else if (order.status < 0) {
        for (let i = 0; i < -order.status - 1; i++) {
          this.techSteps[i].title = this.techSteps[i].title + '通过';
          this.techSteps[i].description = '';
          this.techCurrentStep++;
        }
        this.techSteps[0].title = '已付款';
        this.techSteps[-order.status - 1].title =
          this.techSteps[-order.status - 1].title + '不通过';
        this.techSteps[-order.status - 1].description = '';
        this.techSteps[-order.status - 1].status = 'error';
      }
    },

    handleTechAudit(order) {
      this.TechAuditForm.id = order.id;
      this.AuditTechDialogVisible = true; // 显示审核弹窗
    },
    handleAnimalAudit(order) {
      this.AnimalAuditForm.id = order.id;
      this.AuditAnimalDialogVisible = true; // 显示审核弹窗
    },
    handleItemAudit(order) {
      this.ItemAuditForm.id = order.id;
      this.AuditItemDialogVisible = true; // 显示审核弹窗
    },
    handleFeedAudit(order) {
      this.FeedAuditForm.id = order.id;
      this.AuditFeedDialogVisible = true; // 显示审核弹窗
    },

    //tab键切换
    handleTabSwitch(event) {
      if (event.key === 'Tab') {
        event.preventDefault(); // 防止默认的 Tab 行为
        const currentIndex = this.tabNames.indexOf(this.activeTab);

        if (!event.shiftKey) {
          // Tab 键，切换到下一个标签
          const nextIndex = (currentIndex + 1) % this.tabNames.length;
          this.activeTab = this.tabNames[nextIndex];
        } else {
          // Shift + Tab，切换到上一个标签
          const prevIndex = (currentIndex - 1 + this.tabNames.length) % this.tabNames.length;
          this.activeTab = this.tabNames[prevIndex];
        }
      }
    },
    handleTechAuditSubmit() {
      // 获取当前订单的状态
      const currentOrder = this.techOrder.find(item => item.id === this.TechAuditForm.id);
      if (!currentOrder) {
        this.$message.error('未找到当前订单');
        return;
      }

      // 根据审核结果更新状态
      if (this.TechAuditForm.choice === '1') {
        // 审核通过，状态值+1
        this.TechAuditForm.status = currentOrder.status + 1;
      } else if (this.TechAuditForm.choice === '-1') {
        // 审核不通过，状态值+1取反
        this.TechAuditForm.status = -(currentOrder.status + 1);
      }

      // 提交审核
      checkTechOrder(this.TechAuditForm).then((res) => {
        if (res.status === 1) {
          this.$message.success('审核提交成功');
          this.AuditTechDialogVisible = false;
          this.getTechOrder(); // 重新获取订单列表
        } else {
          this.$message.error(res.msg || '审核提交失败');
        }
      }).catch(error => {
        console.error('审核提交错误:', error);
        this.$message.error('审核提交失败');
      });
    },
    handleAnimalAuditSubmit() {
      // 获取当前订单的状态
      const currentOrder = this.animalOrder.find(item => item.id === this.AnimalAuditForm.id);
      if (!currentOrder) {
        this.$message.error('未找到当前订单');
        return;
      }

      // 根据审核结果更新状态
      if (this.AnimalAuditForm.choice === '1') {
        // 审核通过，状态值+1
        this.AnimalAuditForm.status = currentOrder.status + 1;
      } else if (this.AnimalAuditForm.choice === '-1') {
        // 审核不通过，状态值+1取反
        this.AnimalAuditForm.status = -(currentOrder.status + 1);
      }

      // 提交审核
      checkAnimalOrder(this.AnimalAuditForm).then((res) => {
        if (res.status === 1) {
          this.$message.success('审核提交成功');
          this.AuditAnimalDialogVisible = false;
          this.getAnimalOrder(); // 重新获取订单列表
        } else {
          this.$message.error(res.msg || '审核提交失败');
        }
      }).catch(error => {
        console.error('审核提交错误:', error);
        this.$message.error('审核提交失败');
      });
    },
    handleItemAuditSubmit() {
      // 获取当前订单的状态
      const currentOrder = this.itemOrder.find(item => item.id === this.ItemAuditForm.id);
      if (!currentOrder) {
        this.$message.error('未找到当前订单');
        return;
      }

      // 根据审核结果更新状态
      if (this.ItemAuditForm.choice === '1') {
        // 审核通过，状态值+1
        this.ItemAuditForm.status = currentOrder.status + 1;
      } else if (this.ItemAuditForm.choice === '-1') {
        // 审核不通过，状态值+1取反
        this.ItemAuditForm.status = -(currentOrder.status + 1);
      }

      // 提交审核
      checkItemOrder(this.ItemAuditForm).then((res) => {
        if (res.status === 1) {
          this.$message.success('审核提交成功');
          this.AuditItemDialogVisible = false;
          this.getItemOrder(); // 重新获取订单列表
        } else {
          this.$message.error(res.msg || '审核提交失败');
        }
      }).catch(error => {
        console.error('审核提交错误:', error);
        this.$message.error('审核提交失败');
      });
    },
    handleFeedAuditSubmit() {
      // 获取当前订单的状态
      const currentOrder = this.feedOrder.find(item => item.id === this.FeedAuditForm.id);
      if (!currentOrder) {
        this.$message.error('未找到当前订单');
        return;
      }

      // 根据审核结果更新状态
      if (this.FeedAuditForm.choice === '1') {
        // 审核通过，状态值+1
        this.FeedAuditForm.status = currentOrder.status + 1;
      } else if (this.FeedAuditForm.choice === '-1') {
        // 审核不通过，状态值+1取反
        this.FeedAuditForm.status = -(currentOrder.status + 1);
      }

      // 提交审核
      checkFeedOrder(this.FeedAuditForm).then((res) => {
        if (res.status === 1) {
          this.$message.success('审核提交成功');
          this.AuditFeedDialogVisible = false;
          this.getFeedOrder(); // 重新获取订单列表
        } else {
          this.$message.error(res.msg || '审核提交失败');
        }
      }).catch(error => {
        console.error('审核提交错误:', error);
        this.$message.error('审核提交失败');
      });
    },
  },

  watch: {
    activeTab(newTab, oldTab) {
      this.handleTabChange(newTab, oldTab);
    },
  },
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
  border-radius: 10px; /* 设置圆角 */
  overflow: hidden; /* 避免内容溢出 */
}

/* 默认单元格样式 */
.default-cell {
  background-color: #f9f9f9; /* 浅灰色 */
}

/* 高亮单元格样式 */
.highlight {
  background-color: #ffd04b; /* 黄色 */
  color: #ffffff; /* 白色文字 */
}

/* 审核不通过状态样式 */
.status-danger {
  color: #f56c6c;
  font-weight: bold;
}
</style>