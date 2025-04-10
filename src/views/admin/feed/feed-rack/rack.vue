<!-- 这是饲养笼架的显示模块 -->
 <!-- 包含了饲养笼架的表格和功能按钮，请耐心阅读 -->
<template>
  <div v-loading="loading" class="app-container" element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading">
    <el-container>
      <el-aside width="240px" class="sidebar">
        <h3 class="sidebar-title">区域分类</h3>
        <el-tree :data="categories" :default-expand-all="true" node-key="id" @node-click="handleCategoryClick"
          class="custom-tree" :render-content="renderTreeNode" />
      </el-aside>
      <el-main>
        <!-- 只有在选中第三级节点时显示按钮 -->
        <el-button v-if="showAddButton" class="right" type="primary" size="small" icon="el-icon-plus"
          :min-width="minWidth" :min-height="minHeight" @click="toAdd(selectedLaboratory.id)">
          添加笼架
        </el-button>
        <el-button v-if="showEditButton" class="right" type="primary" size="small" icon="el-icon-plus"
          @click="toEdit()">
          修改笼架
        </el-button>

        <br />
        <br />
        <div v-if="showTable">
          <el-row>
            <el-col :span="8">
              <h5>选择模式</h5>
              <el-radio-group v-model="selectionMode">
                <el-radio label="all">所有</el-radio>
                <el-radio label="cage">笼盒</el-radio>
                <el-radio label="position">位置</el-radio>
              </el-radio-group>
            </el-col>
            <!-- 笼子显示字段 -->
            <el-col :span="8">
              <h5>笼盒显示</h5>
              <el-checkbox-group v-model="cageFields">
                <el-checkbox label="cageName">笼盒名称</el-checkbox>
                <el-checkbox label="animalType">动物类别</el-checkbox>
                <el-checkbox label="animalSpecies">动物品系</el-checkbox>
                <el-checkbox label="speciesShort">品系简称</el-checkbox>
                <el-checkbox label="baseType">基因型</el-checkbox>
                <el-checkbox label="birthDate">出生日期</el-checkbox>
                <el-checkbox label="gender">性别</el-checkbox>
                <el-checkbox label="furColor">毛色</el-checkbox>
                <el-checkbox label="status">状态</el-checkbox>
                <el-checkbox label="experimentDate">实验日期</el-checkbox>
                <el-checkbox label="project">项目</el-checkbox>
                <el-checkbox label="projectNumber">项目编号</el-checkbox>
                <el-checkbox label="contact">联系人</el-checkbox>
                <el-checkbox label="contactPhone">联系电话</el-checkbox>
                <el-checkbox label="team">课题组</el-checkbox>
                <el-checkbox label="price">价格</el-checkbox>
                <el-checkbox label="orderNumber">订单号</el-checkbox>
              </el-checkbox-group>
            </el-col>

            <!-- 位置显示字段 -->
            <el-col :span="8">
              <h5>位置显示</h5>
              <el-checkbox-group v-model="positionFields">
                <el-checkbox label="all">所有</el-checkbox>
                <el-checkbox label="lock">锁定</el-checkbox>
                <el-checkbox label="allocationInfo">分配信息</el-checkbox>
                <el-checkbox label="orderReserved">订单预留</el-checkbox>
                <el-checkbox label="teamReserved">排队预约</el-checkbox>
              </el-checkbox-group>
            </el-col>
          </el-row>

          <!-- 表格 -->
          <el-table :data="tableData" style="width: 100%; padding-left: 80px; margin-bottom: 20px"
            :cell-class-name="getCellClassName" @cell-click="handleCellClick">
            <el-table-column prop="row" label="#" width="50"></el-table-column>
            <el-table-column v-for="col in columns" :key="col" :prop="col" :label="col" width="100">
              <template slot-scope="scope">
                <el-tooltip
                  v-if="shouldShowTooltip"
                  :content="tooltipContent"
                  placement="top"
                  :visible-arrow="true"
                  effect="light"
                  popper-class="cage-info-tooltip"
                  :enterable="false"
                  :value="tooltipVisible && hoveredCell && hoveredCell.row === scope.row.row && hoveredCell.col === col"
                  :manual="true">
                  <div
                    @mouseenter="handleCellHover(scope.row, col)"
                    @mouseleave="handleCellLeave"
                    class="cell-content"
                    :class="{ 'has-cage': hasCage(scope.row.row, col) }">
                    <div v-if="hasCage(scope.row.row, col)" class="animal-badge">
                      <img src="@/assets/images/animal-icon.svg" class="animal-icon" alt="动物" />
                    </div>
                    <div class="cell-info">
                      <span class="cell-position">{{ scope.row[col] }}</span>
                      <span v-if="getCellContact(scope.row.row, col)" class="cell-contact">{{ getCellContact(scope.row.row, col) }}</span>
                    </div>
                  </div>
                </el-tooltip>
                <div v-else
                  class="cell-content"
                  :class="{ 'has-cage': hasCage(scope.row.row, col) }">
                  <div v-if="hasCage(scope.row.row, col)" class="animal-badge">
                    <img src="@/assets/images/animal-icon.svg" class="animal-icon" alt="动物" />
                  </div>
                  <div class="cell-info">
                    <span class="cell-position">{{ scope.row[col] }}</span>
                    <span v-if="getCellContact(scope.row.row, col)" class="cell-contact">{{ getCellContact(scope.row.row, col) }}</span>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>

          <!-- 功能按钮组 - 第一行 -->
          <div class="button-group">
            <el-button type="primary" size="small" icon="el-icon-delete" @click="handleCleanRack">清理笼盒</el-button>
            <el-button type="primary" size="small" icon="el-icon-edit" @click="handleEditCage">编辑笼盒</el-button>
            <el-button type="primary" size="small" icon="el-icon-plus" @click="handleMoveCage">移动笼盒</el-button>
            <el-button type="primary" size="small" icon="el-icon-edit" @click="handleUpdateStatus">修改状态</el-button>
            <el-button type="primary" size="small" icon="el-icon-document" @click="handleOrderInfo">订单信息</el-button>
            <el-button type="primary" size="small" icon="el-icon-search">清空订单</el-button>
            <el-button type="primary" size="small" icon="el-icon-printer">打印标签</el-button>
            <el-button type="primary" size="small" icon="el-icon-user" @click="handleChangeContact">变更联系人</el-button>
            <el-button type="primary" size="small" icon="el-icon-warning" @click="handleAbnormal">饲养异常</el-button>
            <el-button type="primary" size="small" icon="el-icon-setting">提交工单</el-button>
            <el-button type="primary" size="small" icon="el-icon-printer">重打标签</el-button>
          </div>

          <!-- 功能按钮组 - 第二行 -->
          <div class="button-group">
            <el-button type="primary" size="small" icon="el-icon-upload2" @click="handleImportCage">导入笼盒</el-button>
            <el-button type="primary" size="small" icon="el-icon-setting" @click="handleLockCage">笼位锁定</el-button>
            <el-button type="primary" size="small" icon="el-icon-close" @click="handleUnlockCage">取消锁定</el-button>
            <el-button type="primary" size="small" icon="el-icon-share">笼位分配</el-button>
            <el-button type="primary" size="small" icon="el-icon-close">取消分配</el-button>
            <el-button type="primary" size="small" icon="el-icon-user" @click="handleAuthorization">笼位授权</el-button>
            <el-button type="primary" size="small" icon="el-icon-close" @click="handleCancelAuthorization">取消授权</el-button>
            <el-button type="primary" size="small" icon="el-icon-printer">打印笼架</el-button>
            <el-button type="primary" size="small" icon="el-icon-user" @click="handleRackAuthorization">笼架授权</el-button>
            <el-button type="primary" size="small" icon="el-icon-close" @click="handleCancelRackAuthorization">取消所有</el-button>
          </div>

          <!-- 色卡提示区域 -->
          <div class="color-legend-container">
            <div class="legend-toggle" @click="toggleLegend">
              <i :class="showLegend ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"></i>
            </div>
            <div class="color-legend" v-show="showLegend">
              <div class="legend-title">笼位状态说明</div>
              <div class="legend-item">
                <div class="color-block highlight"></div>
                <span>正在饲养</span>
              </div>
              <div class="legend-item">
                <div class="color-block cleaned-cell"></div>
                <span>笼子空，但已被占用</span>
              </div>
              <div class="legend-item">
                <div class="color-block default-cell"></div>
                <span>未使用</span>
              </div>
              <div class="legend-item">
                <div class="color-block locked-cell"></div>
                <span>已锁定</span>
              </div>
            </div>
          </div>

          <!-- 变更联系人弹窗 -->
          <el-dialog title="变更联系人" :visible.sync="contactDialogVisible" width="500px" :close-on-click-modal="false"
            :close-on-press-escape="false" :show-close="false">
            <div class="contact-dialog-content">
              <div class="current-contact">
                <span class="label">当前联系人：</span>
                <span class="value">{{ currentContactName }}</span>
              </div>
              <div class="new-contact">
                <span class="label">选择新联系人：</span>
                <el-select v-model="selectedContactId" filterable remote reserve-keyword placeholder="请输入联系人姓名搜索"
                  :remote-method="remoteSearch" :loading="loading" style="width: 100%">
                  <el-option v-for="item in contactOptions" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button @click="contactDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="confirmChangeContact">确 定</el-button>
            </div>
          </el-dialog>

          <!-- 导入笼盒弹窗 -->
          <el-dialog title="导入笼盒" :visible.sync="importCageDialogVisible" width="500px" :close-on-click-modal="false"
            :close-on-press-escape="false" :show-close="false">
            <div class="import-cage-content">
              <el-form :model="importCageForm" ref="importCageForm" label-width="100px">
                <el-form-item label="笼盒名称" prop="name">
                  <el-input v-model="importCageForm.name" placeholder="请输入笼盒名称"></el-input>
                </el-form-item>
                <el-form-item label="笼盒类型" prop="boxType">
                  <el-select v-model="importCageForm.boxType" placeholder="请选择笼盒类型" style="width: 100%">
                    <el-option v-for="item in boxTypeOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="订单编号" prop="orderId">
                  <el-input v-model="importCageForm.orderId" disabled></el-input>
                </el-form-item>
                <el-form-item label="客户ID" prop="customerId">
                  <el-input v-model="importCageForm.customerId" disabled></el-input>
                </el-form-item>
                <el-form-item label="客户联系人" prop="customerContact">
                  <el-input v-model="importCageForm.customerContact" disabled></el-input>
                </el-form-item>
                <el-form-item label="价格" prop="price">
                  <el-input-number v-model="importCageForm.price" :min="0" :precision="2"
                    style="width: 100%"></el-input-number>
                </el-form-item>
              </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button @click="importCageDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="submitImportCage">确 定</el-button>
            </div>
          </el-dialog>

          <!-- 移动笼盒弹窗 -->
          <move-cage-dialog
            :visible.sync="moveCageDialogVisible"
            :source-cage-box-info="sourceCageBoxInfo"
            :source-position="currentSelectedCage.position"
            :source-rack-label="selectedRack ? selectedRack.label : ''"
            :source-cage-id="currentCageId"
            @move-success="handleMoveSuccess"
          />

          <!-- 修改状态弹窗 -->
          <el-dialog title="修改状态" :visible.sync="statusDialogVisible" width="500px" :close-on-click-modal="false"
            :close-on-press-escape="false" :show-close="false">
            <div class="status-dialog-content">
              <el-form :model="statusForm" ref="statusForm" label-width="100px">
                <el-form-item label="动物状态" prop="animalStatus">
                  <el-select v-model="statusForm.animalStatus" placeholder="请选择动物状态" style="width: 100%">
                    <el-option v-for="item in animalStatusList" :key="item.id" :label="item.status"
                      :value="item.status">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="实验状态" prop="experimentalStatus">
                  <el-select v-model="statusForm.experimentalStatus" placeholder="请选择实验状态" style="width: 100%">
                    <el-option v-for="item in experimentalStatusOptions" :key="item.value" :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button @click="statusDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="confirmUpdateStatus">确 定</el-button>
            </div>
          </el-dialog>

          <!-- 订单信息弹窗 -->
          <el-dialog title="订单信息" :visible.sync="orderInfoDialogVisible" width="500px" :close-on-click-modal="false"
            :close-on-press-escape="false" custom-class="order-info-dialog" :show-close="false">
            <div class="order-info-content">
              <el-form :model="orderInfo" ref="orderInfoForm" label-width="120px">
                <div class="info-section">
                  <el-form-item label="饲养订单" prop="care_order_id">
                    <el-input v-model="orderInfo.care_order_id" placeholder="请输入饲养订单号"></el-input>
                  </el-form-item>
                  <el-form-item label="技术服务订单" prop="work_order_id">
                    <el-select v-model="orderInfo.work_order_id" multiple filterable allow-create default-first-option
                      placeholder="请输入技术服务订单号" style="width: 100%">
                      <el-option v-for="item in orderInfo.work_order_id" :key="item" :label="item" :value="item">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="客户联系人" prop="user">
                    <el-input v-model="orderInfo.user" placeholder="请输入客户联系人"></el-input>
                  </el-form-item>
                  <el-form-item label="价格" prop="price">
                    <el-input-number v-model="orderInfo.price" :precision="2" :step="0.1" :min="0" style="width: 100%">
                      <template slot="append">元/笼/天</template>
                    </el-input-number>
                  </el-form-item>
                </div>
              </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button @click="orderInfoDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="saveOrderInfo">保 存</el-button>
            </div>
          </el-dialog>

          <!-- 编辑笼盒弹窗 -->
          <el-dialog title="编辑笼盒" :visible.sync="editCageDialogVisible" width="500px" :close-on-click-modal="false"
            :close-on-press-escape="false" :show-close="false">
            <div class="edit-cage-content">
              <el-form :model="editCageForm" ref="editCageForm" label-width="100px">
                <el-form-item label="笼盒名称" prop="name">
                  <el-input v-model="editCageForm.name" placeholder="请输入新的笼盒名称"></el-input>
                </el-form-item>
              </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button @click="editCageDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="submitEditCage">确 定</el-button>
            </div>
          </el-dialog>

          <!-- 饲养异常弹窗 -->
          <el-dialog title="饲养异常" :visible.sync="abnormalDialogVisible" width="600px" :close-on-click-modal="false"
            :close-on-press-escape="false" :show-close="false">
            <div class="abnormal-content">
              <el-form :model="abnormalForm" ref="abnormalForm" label-width="100px">
                <el-form-item label="位置" prop="position">
                  <el-input v-model="abnormalForm.position" disabled></el-input>
                </el-form-item>
                <el-form-item label="异常类型" prop="abnormality">
                  <el-select v-model="abnormalForm.abnormality" placeholder="请选择异常类型" style="width: 100%">
                    <el-option
                      v-for="item in abnormalTypes"
                      :key="item.id"
                      :label="item.abnormality_type"
                      :value="item.abnormality_type">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="图片" prop="images">
                  <el-upload
                    class="upload-demo"
                    action="#"
                    :auto-upload="false"
                    :on-change="handleFileChange"
                    :file-list="fileList"
                    multiple
                    :limit="5">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过20MB</div>
                  </el-upload>
                </el-form-item>
                <el-form-item label="描述" prop="description">
                  <el-input
                    type="textarea"
                    :rows="4"
                    placeholder="请输入异常情况描述"
                    v-model="abnormalForm.description">
                  </el-input>
                </el-form-item>
              </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button @click="abnormalDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="submitAbnormal">提 交</el-button>
            </div>
          </el-dialog>

          <!-- 笼位授权弹窗 -->
          <el-dialog title="笼位授权" :visible.sync="authDialogVisible" width="500px" :close-on-click-modal="false"
            :close-on-press-escape="false" :show-close="false">
            <div class="auth-dialog-content">
              <div class="cage-info">
                <span class="label">当前笼位：</span>
                <span class="value">{{ currentSelectedCage.position }}</span>
              </div>
              <div class="user-select">
                <span class="label">选择用户：</span>
                <el-select v-model="selectedAuthUserId" filterable remote reserve-keyword placeholder="请输入用户姓名搜索"
                  :remote-method="remoteSearch" :loading="loading" style="width: 100%">
                  <el-option v-for="item in contactOptions" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button @click="authDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="confirmAuthorization">确 定</el-button>
            </div>
          </el-dialog>

          <!-- 笼架授权弹窗 -->
          <el-dialog title="笼架授权" :visible.sync="rackAuthDialogVisible" width="800px" :close-on-click-modal="false"
            :close-on-press-escape="false" :show-close="false">
            <div class="auth-dialog-content">
              <div class="cage-info">
                <span class="label">当前笼架：</span>
                <span class="value">{{ selectedRack ? selectedRack.label : '' }}</span>
              </div>
              <div class="user-select">
                <span class="label">选择用户：</span>
                <el-select v-model="selectedRackAuthUserId" filterable remote reserve-keyword placeholder="请输入用户姓名搜索"
                  :remote-method="remoteSearch" :loading="loading" style="width: 100%">
                  <el-option v-for="item in contactOptions" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </div>
              
              <!-- 已授权笼位信息表格 -->
              <div class="reserved-cages-table">
                <h4>已授权笼位信息</h4>
                <el-table :data="reservedCages" style="width: 100%" border>
                  <el-table-column prop="number" label="笼位编号" width="100" align="center"></el-table-column>
                  <el-table-column prop="user_name" label="授权用户" width="120" align="center"></el-table-column>
                  <el-table-column prop="research_group_name" label="研究组" width="150" align="center">
                    <template slot-scope="scope">
                      {{ scope.row.research_group_name || '暂无' }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="animal_count" label="动物数量" width="100" align="center">
                    <template slot-scope="scope">
                      <span :class="{ 'negative-count': scope.row.animal_count < 0 }">
                        {{ scope.row.animal_count }}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="cage_box_name" label="笼盒名称" width="150" align="center">
                    <template slot-scope="scope">
                      {{ scope.row.cage_box_name || '暂无' }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="care_order_id" label="订单号" width="120" align="center">
                    <template slot-scope="scope">
                      {{ scope.row.care_order_id || '暂无' }}
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button @click="rackAuthDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="confirmRackAuthorization">确 定</el-button>
            </div>
          </el-dialog>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import {
  getCourtyard,
  getTenement,
  getLaboratory,
  getRack,
  getCage,
  getCageAll,
} from '@/api/colleges';
import Empty from '@/components/Empty';
import { getCageused } from '@/api/order';
import {
  getCageId,
  cleanRack,
  updateCageContact,
  getUserById,
  allUsers,
  moveCage,
  getCageBoxId,
  getOrderInfo,
  importNewCage,
  updateAnimalStatus,
  updateOrderInfo,
  lockCage,
  unlockCage,
  getCageBoxInfo,
  updateCageBoxInfo,
  cageAuthorization,
  cancelAuthorization,
  getReservedCage,
  cancelRackAuthorization,
} from '@/api/ani_manage';
import { getAnimalStatus } from '@/api/ani_setting';
import { feedAbnormal } from '@/api/ani_manage';
import { getFeedAbnormalType } from '@/api/ani_manage';
import MoveCageDialog from './move-cage-dialog.vue';

export default {
  components: {
    Empty,
    MoveCageDialog
  },
  data() {
    return {
      lockedCages: [], // 存储已锁定的笼位ID
      activecage: [], //已经被选择过的笼架
      cageInfoList: [], // 存储笼子的详细信息
      count: 0,
      rows: 10, // 行数
      columns: ['A', 'B', 'C', 'D', 'E'], // 列名
      tableData: [], // 表格数据
      activeCells: [], // 选择的
      activeCells_: [], // 已选择的            +

      selectionMode: 'all', // 选择模式默认为"所有"
      cageFields: [], // 笼子字段默认不选中
      positionFields: [], // 位置字段默认不选中

      minWidth: 80, // 设置每个格子的最小宽度
      minHeight: 50, // 设置每个格子的最小高度

      selectedLaboratory: null,
      selectedRack: null,
      showAddButton: false,
      showEditButton: false,
      showTable: false,
      loading: true,
      categories: [],
      campusList: [],
      tenementList: [],
      laboratoryList: [],
      cageList: [],
      cagesList: [],
      campusmap: new Map(),
      tenementmap: new Map(),
      laboratorymap: new Map(),
      cagemap: new Map(),
      // 图标映射
      levelIconMap: {
        1: 'el-icon-office-building', // Campus 图标
        2: 'el-icon-place', // Tenement 图标
        3: 'el-icon-house', // Laboratory 图标
        4: 'el-icon-document', // Rack 图标
      },
      selectedCell: null, // 当前选中的单元格
      selectedCageInfo: {
        position: '', // 位置信息 (例如: A1)
        row: null, // 行号
        column: '', // 列号
        index: null, // 笼子索引
      },
      // 新增：当前操作选中的笼位信息
      currentSelectedCage: {
        isSelected: false,
        position: '', // 位置信息 (例如: A1)
        row: null, // 行号
        column: '', // 列号
        index: null, // 笼子索引
        numbers: null, // 从0开始的位置索引
      },
      currentCageId: null, // 当前选中笼子的ID
      cleanedCages: [], // 已清理的笼子列表
      showLegend: true, // 控制色卡提示区域的显示/隐藏

      // 变更联系人相关数据
      contactDialogVisible: false,
      currentContactName: '',
      currentContactId: null,
      selectedContactId: null,
      contactOptions: [],

      moveCageDialogVisible: false, // 移动笼盒对话框显示状态
      targetCage: {
        position: '',
        row: null,
        column: '',
        index: null,
        numbers: null,
        id: null,
      },
      targetRack: null,

      sourceCageBoxInfo: null, // 添加源笼盒详细信息

      // 导入笼盒相关数据
      importCageDialogVisible: false, // 导入笼盒弹窗显示状态
      importCageForm: {
        name: '', // 笼盒名称
        boxType: '', // 笼盒类型
        orderId: '', // 订单编号
        customerId: '', // 客户ID
        customerContact: '', // 客户联系人
        price: 0, // 价格
      },
      boxTypeOptions: [
        { label: '普通笼盒', value: '普通笼盒' },
        { label: '哨兵笼盒', value: '哨兵笼盒' },
        { label: '压测笼盒', value: '压测笼盒' },
      ],

      // 修改状态相关数据
      statusDialogVisible: false, // 修改状态弹窗显示状态
      animalStatusList: [], // 动物状态列表
      experimentalStatusOptions: [
        { label: '准备实验', value: '准备实验' },
        { label: '检疫', value: '检疫' },
        { label: '实验结束', value: '实验结束' },
      ],
      statusForm: {
        animalStatus: '', // 动物状态
        experimentalStatus: '', // 实验状态
      },

      orderInfoDialogVisible: false, // 订单信息弹窗显示状态
      orderInfo: {
        care_order_id: '',
        work_order_id: [],
        user: '',
        price: 0,
      },

      loadingTooltip: false,
      hoveredCell: null,
      tooltipContent: '',
      cageInfoCache: new Map(), // 添加缓存
      tooltipVisible: false, // 控制tooltip显示

      editCageDialogVisible: false, // 编辑笼盒弹窗显示状态
      editCageForm: {
        name: '', // 笼盒名称
      },

      abnormalDialogVisible: false, // 饲养异常弹窗显示状态
      abnormalForm: {
        position: '', // 位置信息
        abnormality: '', // 异常类型
        description: '', // 描述
      },
      fileList: [], // 文件列表
      authDialogVisible: false, // 笼位授权弹窗显示状态
      selectedAuthUserId: null, // 选中的授权用户ID
      abnormalTypes: [], // 存储异常类型列表
      rackAuthDialogVisible: false, // 笼架授权弹窗显示状态
      selectedRackAuthUserId: null, // 选中的笼架授权用户ID
      reservedCages: [], // 存储已授权的笼位信息
    };
  },
  created() {
    this.init();
  },
  methods: {
    // 添加防抖函数
    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },

    // 处理单元格点击事件
    async handleCellClick(row, column) {
      let cellKey = { row: row.row, column: column.property };
      if (!row.row) {
        cellKey = { row: row, column: column };
      }
      const res =
        (row.row - 1) * this.columns.length + column.property.charCodeAt(0) - 'A'.charCodeAt(0);

      // 原有逻辑保持不变
      if (this.activecage.includes(res)) {
        this.activeCells.push(cellKey);
      }

      // 新增：记录当前选中的笼位信息
      if (column.property !== 'row') {
        // 忽略序号列
        // 计算从0开始的位置索引
        const numbers =
          (row.row - 1) * this.tableWidth + (column.property.charCodeAt(0) - 'A'.charCodeAt(0));

        this.currentSelectedCage = {
          isSelected: true,
          position: `${column.property}${row.row}`,
          row: row.row,
          column: column.property,
          index: res,
          numbers: numbers,
        };

        // 获取笼子ID
        if (this.selectedRack && this.selectedRack.id) {
          try {
            const response = await getCageId({
              rack_id: this.selectedRack.id,
              number: numbers,
              hideSuccess: true
            });
            this.currentCageId = response.data;
          } catch (error) {
            console.error('获取笼子ID失败:', error);
            this.$message.error('获取笼子ID失败');
          }
        }
      }
    },
    // 根据单元格位置动态设置类名
    getCellClassName({ row, columnIndex, column }) {
      if (column.property === 'row') return '';

      const colKey = this.columns[columnIndex - 1];
      const cellNumber =
        (row.row - 1) * this.columns.length + (colKey.charCodeAt(0) - 'A'.charCodeAt(0));

      // 检查是否是当前选中的笼位
      const isCurrentSelected =
        this.currentSelectedCage.isSelected &&
        this.currentSelectedCage.row === row.row &&
        this.currentSelectedCage.column === colKey;

      // 检查是否是已激活的笼位
      const isActive = this.activeCells.some(
        (cell) => cell.row === row.row && cell.column === colKey
      );

      // 检查是否是已清理的笼位
      const cageInfo = this.cageInfoList.find((cage) => cage.number === cellNumber);
      const isCleaned = cageInfo && cageInfo.animal_count === 0 && cageInfo.is_reserved;

      // 检查是否是已预留的笼位
      const isReserved = cageInfo && cageInfo.animal_count === 0 && cageInfo.is_reserved;

      // 检查是否是已锁定的笼位
      const isLocked = cageInfo && this.lockedCages.includes(cageInfo.id);

      // 返回对应的样式类名
      if (isCurrentSelected) return 'current-selected-cell';
      if (isLocked) return 'locked-cell';
      if (isCleaned) return 'cleaned-cell';
      if (isReserved) return 'reserved-cell';
      return isActive ? 'highlight' : 'default-cell';
    },
    generateTableData() {
      this.tableData = [];
      this.activeCells = [];
      this.activeCells_ = [];
      this.count = 0;
      for (let i = 1; i <= this.rows; i++) {
        let rowData = { row: i };
        this.columns.forEach((col) => {
          rowData[col] = `${col}${i}`;
        });
        this.tableData.push(rowData);
      }
    },
    getCageUsed_(id) {
      try {
        return new Promise((resolve, reject) => {
          getCageused({ cage_rack_id: id, hideSuccess: true })
            .then((res) => {
              this.activecage = res.data;
              // 获取笼子的详细信息
              getCageAll({ cage_rack_id: id, hideSuccess: true })
                .then(async (cageRes) => {
                  // 获取每个笼子的联系人信息
                  const cageInfoWithContacts = await Promise.all(
                    cageRes.data.map(async (cage) => {
                      if (cage.animal_count > 0) {
                        try {
                          // 获取笼盒ID
                          const cageBoxRes = await getCageBoxId({
                            cage_id: cage.id,
                            hideSuccess: true
                          });
                          
                          if (cageBoxRes.data && cageBoxRes.data.id) {
                            // 获取订单信息
                            const orderRes = await getOrderInfo({
                              cage_id: cage.id,
                              hideSuccess: true
                            });
                            
                            if (orderRes.data && orderRes.data.user) {
                              return {
                                ...cage,
                                user: orderRes.data.user
                              };
                            }
                          }
                        } catch (error) {
                          console.error('获取联系人信息失败:', error);
                        }
                      }
                      return cage;
                    })
                  );
                  
                  this.cageInfoList = cageInfoWithContacts;
                  resolve();
                })
                .catch(() => {
                  reject();
                });
            })
            .catch(() => {
              reject();
            });
        });
      } catch (error) {
        console.error(error);
      }
    },

    // 处理节点点击事件
    handleCategoryClick(nodeData) {
      // 判断点击的节点层级并设置相应的状态
      if (nodeData.level === 3) {
        this.showAddButton = true; // 第三级节点显示添加按钮
        this.selectedLaboratory = nodeData; // 选择当前实验室
        this.selectedRack = null; // 清空笼架选择
        this.showEditButton = false; // 隐藏修改按钮
      } else {
        this.showAddButton = false;
        this.selectedLaboratory = null;
      }

      if (nodeData.level === 4) {
        this.selectedRack = nodeData; // 选择当前笼架
        this.showEditButton = true; // 显示修改按钮
        this.tableHeight = nodeData.height; // 设置表格高度
        this.tableWidth = nodeData.width; // 设置表格宽度
        this.columns = []; // 清空表格列名
        this.rows = this.tableHeight;
        for (let i = 0; i < this.tableWidth; i++) {
          this.columns.push(String.fromCharCode(i + 'A'.charCodeAt(0))); // 设置表格列名
        }
        this.showTable = true; // 显示表格
        this.generateTableData(); // 生成表格
        this.getCageUsed_(nodeData.id).then(() => {
          for (let i = 0; i < this.activecage.length; i++) {
            const row = this.tableData[Math.floor(this.activecage[i] / this.columns.length)]; // 获取特定行的数据
            const column = this.columns.find(
              (col) =>
                col === String.fromCharCode(64 + (this.activecage[i] % this.columns.length) + 1)
            ); // 获取特定列的名字
            this.handleCellClick(row, { property: column });
          }
        });
      } else {
        this.selectedRack = null;
        this.showEditButton = false;
        this.showTable = false; // 隐藏表格
      }
    },

    // 获取笼子列表
    getCageList(id) {
      getCage(id)
        .then((res) => {
          this.cagesList = res.data.content;
        })
        .catch(() => {
          this.$message.error('获取笼子列表失败');
        });
    },
    // 获取 Campus 列表
    getCampusList() {
      return new Promise((resolve, reject) => {
        getCourtyard({ page: 1, pageSize: 1000, hideSuccess: true })
          .then((res) => {
            this.campusList = res.data.content;
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },

    // 获取 Tenement 列表
    getTenementList() {
      return new Promise((resolve, reject) => {
        getTenement({ page: 1, pageSize: 1000, hideSuccess: true })
          .then((res) => {
            this.tenementList = res.data.content;
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },

    // 获取 Laboratory 列表
    getLaboratoryList() {
      return new Promise((resolve, reject) => {
        getLaboratory({ page: 1, pageSize: 1000, hideSuccess: true })
          .then((res) => {
            this.laboratoryList = res.data.content;
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },

    // 获取 Rack 列表
    async getRackList(id) {
      try {
        const res = await getRack({ roomId: id, page: 1, pageSize: 1000, hideSuccess: true });
        this.cageList = res.data.content;
      } catch (error) {
        console.error(error);
      }
    },

    // 初始化数据
    async init() {
      try {
        await Promise.all([this.getCampusList(), this.getTenementList(), this.getLaboratoryList()]);

        // 处理 campusList 数据
        this.campusList.forEach((campus) => {
          this.campusmap.set(campus.name, {
            id: campus.name,
            label: campus.name,
            level: 1,
            children: [],
          });
        });

        // 处理 Tenement 数据
        this.tenementList.forEach((tenement) => {
          let campus = this.campusmap.get(tenement.campus_name);
          if (campus) {
            campus.children.push({
              id: tenement.name,
              label: tenement.name,
              level: 2,
              children: [],
            });
          }
        });

        // 处理 Laboratory 数据
        for (let laboratory of this.laboratoryList) {
          for (let campus of this.campusmap.values()) {
            for (let tenement of campus.children) {
              if (tenement.id === laboratory.building_name) {
                const list = [];
                await this.getRackList(laboratory.id); // 等待获取笼架数据
                for (let rack of this.cageList) {
                  list.push({
                    id: rack.id,
                    label: rack.number,
                    level: 4,
                    height: rack.height,
                    width: rack.width,
                    manager: rack.manager,
                    manager_mobile: rack.manager_mobile,
                    price: rack.price,
                  });
                }
                tenement.children.push({
                  id: laboratory.id,
                  label: laboratory.name,
                  level: 3,
                  children: list,
                });
                break;
              }
            }
          }
        }

        this.categories = Array.from(this.campusmap.values());
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.error(error);
      }
    },

    // 渲染树节点
    renderTreeNode(h, { node, data }) {
      let iconClass = this.levelIconMap[node.level] || ''; // 动态获取图标

      return h('span', { class: 'custom-tree-node' }, [
        h('i', { class: iconClass, style: { marginRight: '8px' } }), // 自定义图标
        h('span', data.label), // 节点文本
      ]);
    },

    // 跳转到添加页面
    toAdd(id) {
      if (id) {
        this.$router.push({ path: '/admin/colleges/rack-add/', query: { id } });
      } else {
        this.$message.error('未选择实验室');
      }
    },

    // 跳转到编辑页面
    toEdit() {
      if (this.selectedRack && this.selectedRack.id) {
        this.$router.push({ path: '/admin/colleges/rack-add/' + this.selectedRack.id });
      } else {
        this.$message.error('未选择笼架');
      }
    },

    // 处理导入笼盒按钮点击
    async handleImportCage() {
      if (!this.currentSelectedCage.isSelected) {
        this.$message.warning('请先选择要导入的笼位');
        return;
      }

      if (!this.currentCageId) {
        this.$message.warning('未获取到笼子ID');
        return;
      }

      try {
        // 获取订单信息
        const orderRes = await getOrderInfo({
          cage_id: this.currentCageId,
        });

        if (orderRes.data) {
          this.importCageForm.orderId = orderRes.data.care_order_id;
          this.importCageForm.customerId = orderRes.data.user_id;
          this.importCageForm.customerContact = orderRes.data.user;
          this.importCageForm.price = orderRes.data.price;
        }

        // 重置其他表单字段
        this.importCageForm.name = '';
        this.importCageForm.boxType = '';

        // 显示弹窗
        this.importCageDialogVisible = true;
      } catch (error) {
        console.error('获取订单信息失败:', error);
        this.$message.error('获取订单信息失败');
      }
    },

    // 提交导入笼盒
    async submitImportCage() {
      try {
        // 表单验证
        if (!this.importCageForm.name) {
          this.$message.warning('请输入笼盒名称');
          return;
        }
        if (!this.importCageForm.boxType) {
          this.$message.warning('请选择笼盒类型');
          return;
        }

        // 调用导入笼盒接口
        const response = await importNewCage({
          cage_id: this.currentCageId,
          box_type: this.importCageForm.boxType,
          care_order_id: parseInt(this.importCageForm.orderId),
          user_id: 3, // 从订单信息中获取的用户ID
          name: this.importCageForm.name,
          price: this.importCageForm.price,
        });

        if (response.status === 1) {
          this.$message.success(response.msg || '导入笼盒成功');
          this.importCageDialogVisible = false;

          // 刷新笼架数据
          if (this.selectedRack && this.selectedRack.id) {
            await this.getCageUsed_(this.selectedRack.id);
          }
        } else {
          this.$message.error(response.msg || '导入笼盒失败');
        }
      } catch (error) {
        console.error('导入笼盒失败:', error);
        this.$message.error('导入笼盒失败');
      }
    },

    async handleCleanRack() {
      if (!this.currentSelectedCage.isSelected) {
        this.$message.warning('请先选择要清理的笼子');
        return;
      }

      if (!this.currentCageId) {
        this.$message.warning('未获取到笼子ID');
        return;
      }

      try {
        // 获取笼盒ID
        const cageBoxRes = await getCageBoxId({
          cage_id: this.currentCageId,
        });

        if (!cageBoxRes.data || !cageBoxRes.data.id) {
          this.$message.warning('未找到对应的笼盒信息');
          return;
        }

        // 使用笼盒ID调用清理接口
        await cleanRack({
          cage_box_id: cageBoxRes.data.id,
        });

        this.$message.success('清理笼盒成功');

        // 刷新笼架数据
        if (this.selectedRack && this.selectedRack.id) {
          await this.getCageUsed_(this.selectedRack.id);
          // 将清理的笼子添加到已清理列表
          if (!this.cleanedCages) {
            this.cleanedCages = [];
          }
          this.cleanedCages.push({
            row: this.currentSelectedCage.row,
            column: this.currentSelectedCage.column,
          });
          // 重置选中状态
          this.currentSelectedCage = {
            isSelected: false,
            position: '',
            row: null,
            column: '',
            index: null,
            numbers: null,
          };
          this.currentCageId = null;
        }
      } catch (error) {
        console.error('清理笼架失败:', error);
        this.$message.error('清理笼架失败');
      }
    },

    // 切换色卡提示区域的显示/隐藏
    toggleLegend() {
      this.showLegend = !this.showLegend;
    },

    // 处理变更联系人按钮点击
    async handleChangeContact() {
      if (!this.currentSelectedCage.isSelected) {
        this.$message.warning('请先选择要变更联系人的笼子');
        return;
      }

      if (!this.currentCageId) {
        this.$message.warning('未获取到笼子ID');
        return;
      }

      try {
        // 获取笼盒ID
        const cageBoxRes = await getCageBoxId({
          cage_id: this.currentCageId,
        });

        if (!cageBoxRes.data || !cageBoxRes.data.id) {
          this.$message.warning('未找到对应的笼盒信息');
          return;
        }

        // 直接使用笼盒信息中的用户ID
        if (!cageBoxRes.data.user_id) {
          this.$message.warning('未找到笼盒所有者信息');
          return;
        }

        // 获取当前联系人信息
        const userRes = await getUserById({ id: cageBoxRes.data.user_id });
        if (userRes.status === 200 && userRes.data) {
          this.currentContactName = userRes.data.name;
          this.currentContactId = userRes.data.id;
        } else {
          this.$message.warning('获取当前联系人信息失败');
          return;
        }

        // 获取所有可用联系人
        const allUsersRes = await allUsers();
        if (allUsersRes.status === 200 && allUsersRes.data.users) {
          this.contactOptions = allUsersRes.data.users;
        } else {
          this.$message.warning('获取联系人列表失败');
          return;
        }

        // 显示弹窗
        this.contactDialogVisible = true;
      } catch (error) {
        console.error('获取联系人信息失败:', error);
        this.$message.error('获取联系人信息失败');
      }
    },

    // 确认变更联系人
    async confirmChangeContact() {
      if (!this.selectedContactId) {
        this.$message.warning('请选择新联系人');
        return;
      }

      try {
        // 获取笼盒ID
        const cageBoxRes = await getCageBoxId({
          cage_id: this.currentCageId,
        });

        if (!cageBoxRes.data || !cageBoxRes.data.id) {
          this.$message.warning('未找到对应的笼盒信息');
          return;
        }

        // 使用笼盒ID调用更新联系人接口
        await updateCageContact({
          cage_box_id: cageBoxRes.data.id,
          user_id: this.selectedContactId,
        });

        this.$message.success('变更联系人成功');
        this.contactDialogVisible = false;

        // 刷新笼架数据
        if (this.selectedRack && this.selectedRack.id) {
          await this.getCageUsed_(this.selectedRack.id);
        }
      } catch (error) {
        console.error('变更联系人失败:', error);
        this.$message.error('变更联系人失败');
      }
    },
    // 处理修改状态按钮点击
    async handleUpdateStatus() {
      if (!this.currentSelectedCage.isSelected) {
        this.$message.warning('请先选择要修改状态的笼子');
        return;
      }

      if (!this.currentCageId) {
        this.$message.warning('未获取到笼子ID');
        return;
      }

      try {
        console.log('开始获取笼盒信息...'); // 添加日志
        // 获取笼盒信息
        const cageBoxRes = await getCageBoxId({
          cage_id: this.currentCageId,
        });
        console.log('笼盒信息响应:', cageBoxRes); // 添加日志

        if (!cageBoxRes.data || !cageBoxRes.data.id) {
          this.$message.warning('未找到对应的笼盒信息');
          return;
        }

        console.log('开始获取动物状态列表...'); // 添加日志
        try {
          // 获取动物状态列表
          const statusRes = await getAnimalStatus();
          console.log('动物状态列表响应:', statusRes); // 添加日志

          if (!statusRes) {
            console.error('getAnimalStatus 返回为空');
            this.$message.error('获取动物状态列表失败: 返回数据为空');
            return;
          }

          if (statusRes.status === 1 && statusRes.data) {
            this.animalStatusList = statusRes.data;
            console.log('设置动物状态列表成功:', this.animalStatusList); // 添加日志
          } else {
            console.error('获取动物状态列表失败:', statusRes);
            this.$message.warning('获取动物状态列表失败: ' + (statusRes.msg || '未知错误'));
            return;
          }
        } catch (statusError) {
          console.error('获取动物状态列表出错:', statusError);
          this.$message.error('获取动物状态列表失败: ' + (statusError.message || '未知错误'));
          return;
        }

        // 重置表单
        this.statusForm = {
          animalStatus: '',
          experimentalStatus: '',
        };

        // 显示弹窗
        this.statusDialogVisible = true;
      } catch (error) {
        console.error('整体处理失败:', error);
        this.$message.error('获取信息失败: ' + (error.message || '未知错误'));
      }
    },

    // 确认修改状态
    async confirmUpdateStatus() {
      if (!this.statusForm.animalStatus) {
        this.$message.warning('请选择动物状态');
        return;
      }
      if (!this.statusForm.experimentalStatus) {
        this.$message.warning('请选择实验状态');
        return;
      }

      try {
        // 获取笼盒ID
        const cageBoxRes = await getCageBoxId({
          cage_id: this.currentCageId,
        });
        console.log('笼盒ID:', cageBoxRes.data.id);

        if (!cageBoxRes.data || !cageBoxRes.data.id) {
          this.$message.warning('未找到对应的笼盒信息');
          return;
        }

        // 调用更新状态接口
        const response = await updateAnimalStatus({
          cage_box_id: cageBoxRes.data.id,
          status: this.statusForm.animalStatus,
          experimental_status: this.statusForm.experimentalStatus,
        });

        if (response.status === 1) {
          this.$message.success(response.msg || '修改状态成功');
          this.statusDialogVisible = false;

          // 刷新笼架数据
          if (this.selectedRack && this.selectedRack.id) {
            await this.getCageUsed_(this.selectedRack.id);
          }
        } else {
          this.$message.error(response.msg || '修改状态失败');
        }
      } catch (error) {
        console.error('修改状态失败:', error);
        this.$message.error('修改状态失败');
      }
    },
    // 处理移动笼盒按钮点击
    async handleMoveCage() {
      if (!this.currentSelectedCage.isSelected) {
        this.$message.warning('请先选择要移动的笼子');
        return;
      }

      if (!this.currentCageId) {
        this.$message.warning('未获取到笼子ID');
        return;
      }

      try {
        // 获取源笼盒详细信息
        const cageBoxRes = await getCageBoxId({
          cage_id: this.currentCageId,
        });

        if (cageBoxRes.status === 1 && cageBoxRes.data) {
          this.sourceCageBoxInfo = cageBoxRes.data;
          this.moveCageDialogVisible = true;
        } else {
          this.$message.warning('获取源笼盒信息失败');
          return;
        }
      } catch (error) {
        console.error('获取源笼盒信息失败:', error);
        this.$message.error('获取源笼盒信息失败');
      }
    },

    // 处理移动成功
    async handleMoveSuccess() {
      // 刷新笼架数据
      if (this.selectedRack && this.selectedRack.id) {
        await this.getCageUsed_(this.selectedRack.id);
      }
      
      // 重置选中状态
      this.currentSelectedCage = {
        isSelected: false,
        position: '',
        row: null,
        column: '',
        index: null,
        numbers: null,
      };
      this.currentCageId = null;
    },

    // 处理移动笼盒对话框关闭
    handleMoveCageDialogClose() {
      this.targetCage = {
        position: '',
        row: null,
        column: '',
        index: null,
        numbers: null,
        id: null,
      };
      this.targetRack = null;
      this.sourceCageBoxInfo = null;
      this.moveCageDialogVisible = false;
    },

    // 获取笼子动物数量
    getCageAnimalCount(number) {
      const cageInfo = this.cageInfoList.find((cage) => cage.number === number);
      return cageInfo ? cageInfo.animal_count : 0;
    },

    // 处理目标笼盒单元格点击
    async handleTargetCellClick(row, column) {
      if (column.property === 'row') return;

      const numbers =
        (row.row - 1) * this.tableWidth + (column.property.charCodeAt(0) - 'A'.charCodeAt(0));

      // 检查是否是当前选中的源笼盒
      if (numbers === this.currentSelectedCage.numbers) {
        this.$message.warning('不能选择源笼盒作为目标位置');
        return;
      }

      // 检查目标笼盒是否已被占用
      const targetCageInfo = this.cageInfoList.find((cage) => cage.number === numbers);
      if (targetCageInfo && targetCageInfo.animal_count > 0) {
        this.$message.warning('目标笼盒已被占用，请选择其他位置');
        return;
      }

      this.targetCage = {
        position: `${column.property}${row.row}`,
        row: row.row,
        column: column.property,
        index: numbers,
        numbers: numbers,
      };

      // 获取目标笼盒ID
      try {
        const response = await getCageId({
          rack_id: this.selectedRack.id,
          number: numbers,
          hideSuccess: true
        });
        this.targetCage.id = response.data;
      } catch (error) {
        console.error('获取目标笼盒ID失败:', error);
        this.$message.error('获取目标笼盒ID失败');
      }
    },

    // 获取目标单元格的类名
    getTargetCellClassName({ row, columnIndex, column }) {
      if (column.property === 'row') return '';

      const colKey = this.columns[columnIndex - 1];
      const cellNumber =
        (row.row - 1) * this.columns.length + (colKey.charCodeAt(0) - 'A'.charCodeAt(0));

      // 检查是否是当前选中的目标笼位
      const isTargetSelected =
        this.targetCage.position &&
        this.targetCage.row === row.row &&
        this.targetCage.column === colKey;

      // 检查是否是源笼位
      const isSource = this.currentSelectedCage.numbers === cellNumber;

      // 检查笼位是否已被占用
      const cageInfo = this.cageInfoList.find((cage) => cage.number === cellNumber);
      const isOccupied = cageInfo && cageInfo.animal_count > 0;

      if (isTargetSelected) return 'target-selected-cell';
      if (isSource) return 'source-cell';
      if (isOccupied) return 'occupied-cell';
      return 'available-cell';
    },
    // 确认移动笼盒
    async confirmMoveCage() {
      if (!this.targetCage.id) {
        this.$message.warning('请选择目标笼盒');
        return;
      }

      try {
        await moveCage({
          cage_box_id: this.sourceCageBoxInfo.id,
          newcage_id: this.targetCage.id,
        });

        this.$message.success('移动笼盒成功');
        this.moveCageDialogVisible = false;

        // 刷新笼架数据
        if (this.selectedRack && this.selectedRack.id) {
          await this.getCageUsed_(this.selectedRack.id);
        }

        // 重置选中状态
        this.currentSelectedCage = {
          isSelected: false,
          position: '',
          row: null,
          column: '',
          index: null,
          numbers: null,
        };
        this.currentCageId = null;
      } catch (error) {
        console.error('移动笼盒失败:', error);
        this.$message.error('移动笼盒失败');
      }
    },
    // 处理订单信息按钮点击
    async handleOrderInfo() {
      if (!this.currentSelectedCage.isSelected) {
        this.$message.warning('请先选择笼子');
        return;
      }

      if (!this.currentCageId) {
        this.$message.warning('未获取到笼子ID');
        return;
      }

      try {
        // 获取订单信息
        const response = await getOrderInfo({
          cage_id: this.currentCageId,
        });

        if (response.status === 1 && response.data) {
          // 确保 work_order_id 是数组
          this.orderInfo = {
            ...response.data,
            work_order_id: Array.isArray(response.data.work_order_id)
              ? response.data.work_order_id
              : response.data.work_order_id
                ? [response.data.work_order_id]
                : [],
          };
          this.orderInfoDialogVisible = true;
        } else {
          // 如果没有订单信息，初始化空的表单
          this.orderInfo = {
            care_order_id: '',
            work_order_id: [],
            user: '',
            price: 0,
          };
          this.orderInfoDialogVisible = true;
        }
      } catch (error) {
        console.error('获取订单信息失败:', error);
        this.$message.error('获取订单信息失败');
      }
    },
    async saveOrderInfo() {
      try {
        // 获取笼盒ID
        const cageBoxRes = await getCageBoxId({
          cage_id: this.currentCageId,
        });

        if (!cageBoxRes.data || !cageBoxRes.data.id) {
          this.$message.warning('未找到对应的笼盒信息');
          return;
        }

        // 调用更新订单信息的接口
        const response = await updateOrderInfo({
          cage_box_id: cageBoxRes.data.id,
          care_order_id: this.orderInfo.care_order_id,
          work_order_id: this.orderInfo.work_order_id,
          user: this.orderInfo.user,
          price: this.orderInfo.price,
        });

        if (response.status === 1) {
          this.$message.success('保存订单信息成功');
          this.orderInfoDialogVisible = false;
        } else {
          this.$message.error(response.msg || '保存订单信息失败');
        }
      } catch (error) {
        console.error('保存订单信息失败:', error);
        this.$message.error('保存订单信息失败');
      }
    },
    // 处理笼位锁定
    async handleLockCage() {
      if (!this.currentSelectedCage.isSelected) {
        this.$message.warning('请先选择要锁定的笼子');
        return;
      }

      if (!this.currentCageId) {
        this.$message.warning('未获取到笼子ID');
        return;
      }

      try {
        const response = await lockCage({
          cage_id: this.currentCageId
        });

        if (response.status === 1) {
          this.$message.success('笼位锁定成功');
          // 将锁定的笼位ID添加到数组中
          if (!this.lockedCages.includes(this.currentCageId)) {
            this.lockedCages.push(this.currentCageId);
          }
        } else {
          this.$message.error(response.msg || '笼位锁定失败');
        }
      } catch (error) {
        console.error('笼位锁定失败:', error);
        this.$message.error('笼位锁定失败');
      }
    },

    // 处理笼位解锁
    async handleUnlockCage() {
      if (!this.currentSelectedCage.isSelected) {
        this.$message.warning('请先选择要解锁的笼子');
        return;
      }

      if (!this.currentCageId) {
        this.$message.warning('未获取到笼子ID');
        return;
      }

      try {
        const response = await unlockCage({
          cage_id: this.currentCageId
        });

        if (response.status === 1) {
          this.$message.success('笼位解锁成功');
          // 从数组中移除解锁的笼位ID
          this.lockedCages = this.lockedCages.filter(id => id !== this.currentCageId);
        } else {
          this.$message.error(response.msg || '笼位解锁失败');
        }
      } catch (error) {
        console.error('笼位解锁失败:', error);
        this.$message.error('笼位解锁失败');
      }
    },

    // 修改后的handleCellHover方法
    async handleCellHover(row, col) {
      // 检查是否有需要显示的字段
      const fieldsToShow = this.cageFields.filter(field => 
        ['cageName', 'orderNumber', 'contact', 'price', 'contactPhone', 
         'animalType', 'animalSpecies', 'baseType', 'birthDate', 'gender', 
         'furColor', 'status'].includes(field)
      );
      if (fieldsToShow.length === 0) return;
      
      const position = `${col}${row.row}`;
      this.hoveredCell = { row: row.row, col: col };
      
      // 生成缓存key，包含选中的字段信息
      const cacheKey = `${position}-${fieldsToShow.join('-')}`;
      
      // 如果缓存中有数据，直接使用
      if (this.cageInfoCache.has(cacheKey)) {
        this.tooltipContent = this.cageInfoCache.get(cacheKey);
        this.tooltipVisible = true;
        return;
      }

      this.loadingTooltip = true;
      this.tooltipContent = '加载中...';
      this.tooltipVisible = true;

      try {
        const numbers = (row.row - 1) * this.columns.length + (col.charCodeAt(0) - 'A'.charCodeAt(0));
        
        // 获取笼子ID
        const cageResponse = await getCageId({
          rack_id: this.selectedRack.id,
          number: numbers,
          hideSuccess: true
        });

        if (!cageResponse.data) {
          const content = '暂无信息';
          this.tooltipContent = content;
          this.cageInfoCache.set(cacheKey, content);
          return;
        }

        let contentParts = [];

        // 处理需要笼盒信息的字段
        const needCageBoxInfo = fieldsToShow.some(field => 
          ['cageName', 'animalType', 'animalSpecies', 'baseType', 'birthDate', 'gender', 'furColor', 'status'].includes(field)
        );

        // 处理需要订单信息的字段
        const needOrderInfo = fieldsToShow.some(field => 
          ['orderNumber', 'contact', 'price', 'contactPhone'].includes(field)
        );

        // 并行获取所需信息
        const [cageBoxResponse, orderResponse] = await Promise.all([
          needCageBoxInfo ? getCageBoxId({
            cage_id: cageResponse.data,
            hideSuccess: true
          }) : Promise.resolve(null),
          needOrderInfo ? getOrderInfo({
            cage_id: cageResponse.data,
            hideSuccess: true
          }) : Promise.resolve(null)
        ]);

        // 处理笼盒信息
        if (needCageBoxInfo && cageBoxResponse && cageBoxResponse.data) {
          // 处理笼盒名称
          if (fieldsToShow.includes('cageName')) {
            contentParts.push(`笼盒名称：${cageBoxResponse.data.name || '暂无名称'}`);
          }

          // 获取动物信息
          const animalInfoResponse = await getCageBoxInfo({
            cage_box_id: cageBoxResponse.data.id
          });

          if (animalInfoResponse.data && animalInfoResponse.data.animalImports && animalInfoResponse.data.animalImports.length > 0) {
            // 获取第一个动物的信息作为显示
            const animal = animalInfoResponse.data.animalImports[0];
            
            // 处理动物类别
            if (fieldsToShow.includes('animalType')) {
              contentParts.push(`动物类别：${animal.type || '暂无'}`);
            }
            
            // 处理动物品系
            if (fieldsToShow.includes('animalSpecies')) {
              contentParts.push(`动物品系：${animal.strain || '暂无'}`);
            }
            
            // 处理基因型
            if (fieldsToShow.includes('baseType')) {
              contentParts.push(`基因型：${animal.genotype || '暂无'}`);
            }
            
            // 处理出生日期
            if (fieldsToShow.includes('birthDate')) {
              const birthDate = animal.birth_time ? animal.birth_time.split(' ')[0] : '暂无';
              contentParts.push(`出生日期：${birthDate}`);
            }
            
            // 处理性别
            if (fieldsToShow.includes('gender')) {
              contentParts.push(`性别：${animal.gender || '暂无'}`);
            }
            
            // 处理毛色
            if (fieldsToShow.includes('furColor')) {
              contentParts.push(`毛色：${animal.color || '暂无'}`);
            }
            
            // 处理状态
            if (fieldsToShow.includes('status')) {
              contentParts.push(`状态：${animal.status || '暂无'}`);
            }
          } else {
            // 如果没有动物信息，为每个需要动物信息的字段添加"暂无"
            for (const field of fieldsToShow) {
              if (['animalType', 'animalSpecies', 'baseType', 'birthDate', 'gender', 'furColor', 'status'].includes(field)) {
                switch (field) {
                  case 'animalType':
                    contentParts.push('动物类别：暂无');
                    break;
                  case 'animalSpecies':
                    contentParts.push('动物品系：暂无');
                    break;
                  case 'baseType':
                    contentParts.push('基因型：暂无');
                    break;
                  case 'birthDate':
                    contentParts.push('出生日期：暂无');
                    break;
                  case 'gender':
                    contentParts.push('性别：暂无');
                    break;
                  case 'furColor':
                    contentParts.push('毛色：暂无');
                    break;
                  case 'status':
                    contentParts.push('状态：暂无');
                    break;
                }
              }
            }
          }
        }
        
        // 处理订单信息
        if (needOrderInfo && orderResponse && orderResponse.data) {
          for (const field of fieldsToShow) {
            switch (field) {
              case 'orderNumber':
                contentParts.push(`订单号：${orderResponse.data.care_order_id || '暂无'}`);
                break;
              case 'contact':
                contentParts.push(`联系人：${orderResponse.data.user || '暂无'}`);
                break;
              case 'contactPhone':
                contentParts.push(`联系方式：${orderResponse.data.user_phone || '暂无'}`);
                break;
              case 'price':
                const price = orderResponse.data.price;
                const formattedPrice = price ? `${parseFloat(price).toFixed(2)}元/笼/天` : '暂无';
                contentParts.push(`价格：${formattedPrice}`);
                break;
            }
          }
        } else if (needOrderInfo) {
          // 如果没有订单信息，为每个需要订单信息的字段添加"暂无"
          for (const field of fieldsToShow) {
            if (['orderNumber', 'contact', 'price', 'contactPhone'].includes(field)) {
              switch (field) {
                case 'orderNumber':
                  contentParts.push('订单号：暂无');
                  break;
                case 'contact':
                  contentParts.push('联系人：暂无');
                  break;
                case 'contactPhone':
                  contentParts.push('联系方式：暂无');
                  break;
                case 'price':
                  contentParts.push('价格：暂无');
                  break;
              }
            }
          }
        }

        // 如果有信息要显示，则用换行符连接；否则显示暂无信息
        const content = contentParts.length > 0 ? contentParts.join('\n') : '暂无信息';
        this.tooltipContent = content;
        this.cageInfoCache.set(cacheKey, content);
      } catch (error) {
        console.error('获取信息失败:', error);
        this.tooltipContent = '获取信息失败';
      } finally {
        this.loadingTooltip = false;
      }
    },

    handleCellLeave() {
      this.loadingTooltip = false;
      this.hoveredCell = null;
      this.tooltipContent = '';
      this.tooltipVisible = false;
    },
    // 添加新方法：检查笼位是否存在笼盒
    hasCage(row, col) {
      const numbers = (row - 1) * this.columns.length + (col.charCodeAt(0) - 'A'.charCodeAt(0));
      return this.cageInfoList.some(cage => cage.number === numbers && cage.animal_count > 0);
    },

    // 处理编辑笼盒按钮点击
    async handleEditCage() {
      if (!this.currentSelectedCage.isSelected) {
        this.$message.warning('请先选择要编辑的笼子');
        return;
      }

      if (!this.currentCageId) {
        this.$message.warning('未获取到笼子ID');
        return;
      }

      try {
        // 获取笼盒ID
        const cageBoxRes = await getCageBoxId({
          cage_id: this.currentCageId,
        });

        if (!cageBoxRes.data || !cageBoxRes.data.id) {
          this.$message.warning('未找到对应的笼盒信息');
          return;
        }

        // 设置当前笼盒名称
        this.editCageForm.name = cageBoxRes.data.name || '';
        
        // 显示弹窗
        this.editCageDialogVisible = true;
      } catch (error) {
        console.error('获取笼盒信息失败:', error);
        this.$message.error('获取笼盒信息失败');
      }
    },

    // 提交编辑笼盒
    async submitEditCage() {
      if (!this.editCageForm.name) {
        this.$message.warning('请输入笼盒名称');
        return;
      }

      try {
        // 获取笼盒ID
        const cageBoxRes = await getCageBoxId({
          cage_id: this.currentCageId,
        });

        if (!cageBoxRes.data || !cageBoxRes.data.id) {
          this.$message.warning('未找到对应的笼盒信息');
          return;
        }

        // 调用更新笼盒信息的接口
        const response = await updateCageBoxInfo({
          cage_box_id: cageBoxRes.data.id,
          name: this.editCageForm.name,
        });

        if (response.status === 1) {
          this.$message.success('编辑笼盒成功');
          this.editCageDialogVisible = false;

          // 刷新笼架数据
          if (this.selectedRack && this.selectedRack.id) {
            await this.getCageUsed_(this.selectedRack.id);
          }
        } else {
          this.$message.error(response.msg || '编辑笼盒失败');
        }
      } catch (error) {
        console.error('编辑笼盒失败:', error);
        this.$message.error('编辑笼盒失败');
      }
    },

    // 处理饲养异常按钮点击
    async handleAbnormal() {
      if (!this.currentSelectedCage.isSelected) {
        this.$message.warning('请先选择笼子');
        return;
      }

      if (!this.currentCageId) {
        this.$message.warning('未获取到笼子ID');
        return;
      }

      // 获取异常类型列表
      await this.getAbnormalTypes();

      // 设置位置信息
      this.abnormalForm = {
        position: this.currentSelectedCage.position,
        abnormality: '',
        description: '',
      };
      this.fileList = [];
      this.abnormalDialogVisible = true;
    },

    // 处理文件改变
    handleFileChange(file, fileList) {
      this.fileList = fileList;
    },

    // 提交饲养异常
    async submitAbnormal() {
      if (!this.abnormalForm.abnormality) {
        this.$message.warning('请选择异常类型');
        return;
      }

      if (!this.abnormalForm.description) {
        this.$message.warning('请输入异常情况描述');
        return;
      }

      try {
        const response = await feedAbnormal({
          abnormality: this.abnormalForm.abnormality,
          cage_id: this.currentCageId,
          description: this.abnormalForm.description
        });

        if (response.status === 1) {
          this.$message.success('提交成功');
          this.abnormalDialogVisible = false;
          
          // 刷新笼架数据
          if (this.selectedRack && this.selectedRack.id) {
            await this.getCageUsed_(this.selectedRack.id);
          }
        } else {
          this.$message.error(response.msg || '提交失败');
        }
      } catch (error) {
        console.error('提交饲养异常失败:', error);
        this.$message.error('提交失败');
      }
    },

    // 处理笼位授权按钮点击
    async handleAuthorization() {
      if (!this.currentSelectedCage.isSelected) {
        this.$message.warning('请先选择要授权的笼子');
        return;
      }

      if (!this.currentCageId) {
        this.$message.warning('未获取到笼子ID');
        return;
      }

      try {
        // 获取所有用户列表
        const response = await allUsers();
        if (response.status === 200 && response.data.users) {
          this.contactOptions = response.data.users;
        } else {
          this.$message.warning('获取用户列表失败');
          return;
        }

        this.selectedAuthUserId = null;
        this.authDialogVisible = true;
      } catch (error) {
        console.error('获取用户列表失败:', error);
        this.$message.error('获取用户列表失败');
      }
    },

    // 确认授权
    async confirmAuthorization() {
      if (!this.selectedAuthUserId) {
        this.$message.warning('请选择要授权的用户');
        return;
      }

      try {
        const response = await cageAuthorization({
          cage_id: this.currentCageId,
          user_id: this.selectedAuthUserId
        });

        if (response.status === 1) {
          this.$message.success('笼位授权成功');
          this.authDialogVisible = false;

          // 刷新笼架数据
          if (this.selectedRack && this.selectedRack.id) {
            await this.getCageUsed_(this.selectedRack.id);
          }
        } else {
          this.$message.error(response.msg || '笼位授权失败');
        }
      } catch (error) {
        console.error('笼位授权失败:', error);
        this.$message.error('笼位授权失败');
      }
    },

    // 处理取消授权按钮点击
    async handleCancelAuthorization() {
      if (!this.currentSelectedCage.isSelected) {
        this.$message.warning('请先选择要取消授权的笼子');
        return;
      }

      if (!this.currentCageId) {
        this.$message.warning('未获取到笼子ID');
        return;
      }

      try {
        const response = await cancelAuthorization({
          cage_id: this.currentCageId
        });

        if (response.status === 1) {
          this.$message.success('取消授权成功');
          
          // 强制刷新页面
          window.location.reload();
        } else {
          this.$message.error(response.msg || '取消授权失败');
        }
      } catch (error) {
        console.error('取消授权失败:', error);
        this.$message.error('取消授权失败');
      }
    },
    getCellContact(row, col) {
      const cageInfo = this.cageInfoList.find(cage => cage.number === (row - 1) * this.columns.length + (col.charCodeAt(0) - 'A'.charCodeAt(0)));
      return cageInfo ? cageInfo.user : '';
    },
    // 获取异常类型列表
    async getAbnormalTypes() {
      try {
        const response = await getFeedAbnormalType();
        if (response.status === 1 && response.data) {
          this.abnormalTypes = response.data;
        } else {
          this.$message.error('获取异常类型列表失败');
        }
      } catch (error) {
        console.error('获取异常类型列表失败:', error);
        this.$message.error('获取异常类型列表失败');
      }
    },
    // 处理笼架授权按钮点击
    async handleRackAuthorization() {
      if (!this.selectedRack || !this.selectedRack.id) {
        this.$message.warning('请先选择笼架');
        return;
      }

      try {
        // 获取所有用户列表
        const response = await allUsers();
        if (response.status === 200 && response.data.users) {
          this.contactOptions = response.data.users;
        } else {
          this.$message.warning('获取用户列表失败');
          return;
        }

        // 获取已授权的笼位信息
        const reservedResponse = await getReservedCage({
          cage_rack_id: this.selectedRack.id
        });

        if (reservedResponse.status === 1 && reservedResponse.data) {
          this.reservedCages = reservedResponse.data;
        } else {
          this.$message.warning('获取已授权笼位信息失败');
          return;
        }

        this.selectedRackAuthUserId = null;
        this.rackAuthDialogVisible = true;
      } catch (error) {
        console.error('获取信息失败:', error);
        this.$message.error('获取信息失败');
      }
    },

    // 确认笼架授权
    async confirmRackAuthorization() {
      if (!this.selectedRackAuthUserId) {
        this.$message.warning('请选择要授权的用户');
        return;
      }

      try {
        const response = await cageAuthorization({
          cage_id: this.selectedRack.id,
          user_id: this.selectedRackAuthUserId
        });

        if (response.status === 1) {
          this.$message.success('笼架授权成功');
          this.rackAuthDialogVisible = false;

          // 刷新笼架数据
          if (this.selectedRack && this.selectedRack.id) {
            await this.getCageUsed_(this.selectedRack.id);
          }
        } else {
          this.$message.error(response.msg || '笼架授权失败');
        }
      } catch (error) {
        console.error('笼架授权失败:', error);
        this.$message.error('笼架授权失败');
      }
    },

    // 处理取消笼架授权按钮点击
    async handleCancelRackAuthorization() {
      if (!this.selectedRack || !this.selectedRack.id) {
        this.$message.warning('请先选择笼架');
        return;
      }

      try {
        const response = await cancelRackAuthorization({
          cage_rack_id: this.selectedRack.id
        });

        if (response.status === 1) {
          this.$message.success('取消所有授权成功');
          
          // 刷新笼架数据
          if (this.selectedRack && this.selectedRack.id) {
            await this.getCageUsed_(this.selectedRack.id);
          }
        } else {
          this.$message.error(response.msg || '取消所有授权失败');
        }
      } catch (error) {
        console.error('取消所有授权失败:', error);
        this.$message.error('取消所有授权失败');
      }
    },
  },
  watch: {
    // 监听笼架选择变化，重置当前选中状态
    selectedRack() {
      this.currentSelectedCage = {
        isSelected: false,
        position: '',
        row: null,
        column: '',
        index: null,
        numbers: null,
      };
      this.currentCageId = null;
      this.cleanedCages = []; // 重置已清理的笼子列表
    },
  },
  computed: {
    // 修改计算属性，添加price字段
    shouldShowTooltip() {
      return this.cageFields.some(field => ['cageName', 'orderNumber', 'contact', 'price'].includes(field));
    }
  },
};
</script>


<style>
/* 高亮单元格样式 */
.highlight {
  background-color: #ffd04b;
  /* 黄色 */
  color: #ffffff;
  /* 白色文字 */
}

.default-cell {
  background-color: #f9f9f9;
  /* 浅灰色 */
}

.el-table tbody tr:hover>td {
  background: #f9f9f9 !important;
}

/* 按钮组样式 */
.button-group {
  margin: 10px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-start;
}

.button-group .el-button {
  margin: 0;
  background-color: #409eff;
  border: none;
  color: white;
  padding: 8px 15px;
  border-radius: 4px;
  font-size: 12px;
  min-width: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.button-group .el-button:hover {
  background-color: #66b1ff;
}

/* 调整按钮内图标和文字的间距 */
.el-button [class^='el-icon-'] {
  margin-right: 5px;
}

/* 确保按钮组之间有适当的间距 */
.button-group+.button-group {
  margin-top: 8px;
}

/* 表格下方区域样式 */
.el-table {
  margin-bottom: 20px !important;
}

/* 选中单元格的闪烁动画 */
@keyframes flash {
  0% {
    background-color: #ff4444;
  }

  50% {
    background-color: #ff6666;
  }

  100% {
    background-color: #ff4444;
  }
}

/* 选中单元格样式 */
.selected-cell {
  animation: flash 1s infinite;
  color: white !important;
  font-weight: bold;
}

/* 确保选中状态的优先级高于hover效果 */
.el-table tbody tr:hover>td.selected-cell {
  background-color: #ff4444 !important;
  animation: flash 1s infinite !important;
}

/* 调整表格hover效果 */
.el-table td.selected-cell {
  background-color: #ff4444 !important;
  animation: flash 1s infinite !important;
}

/* 当前选中单元格的闪烁动画 */
@keyframes flash {
  0% {
    background-color: #ff4444;
  }

  50% {
    background-color: #ff6666;
  }

  100% {
    background-color: #ff4444;
  }
}

/* 当前选中单元格样式 */
.current-selected-cell {
  animation: flash 1s infinite;
  color: white !important;
  font-weight: bold;
}

/* 确保当前选中状态的优先级高于其他效果 */
.el-table tbody tr:hover>td.current-selected-cell {
  background-color: #ff4444 !important;
  animation: flash 1s infinite !important;
}

.el-table td.current-selected-cell {
  background-color: #ff4444 !important;
  animation: flash 1s infinite !important;
}

/* 已清理或预留的笼子样式 */
.cleaned-cell,
.reserved-cell {
  background-color: #409eff !important;
  color: white !important;
}

/* 确保已清理或预留状态的优先级高于hover效果 */
.el-table tbody tr:hover>td.cleaned-cell,
.el-table tbody tr:hover>td.reserved-cell {
  background-color: #409eff !important;
}

.el-table td.cleaned-cell,
.el-table td.reserved-cell {
  background-color: #409eff !important;
}

/* 色卡提示区域样式 */
.color-legend-container {
  position: relative;
  margin-top: 20px;
  display: flex;
  align-items: flex-start;
}

.legend-toggle {
  width: 24px;
  height: 24px;
  background-color: #409eff;
  color: white;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.legend-toggle:hover {
  background-color: #66b1ff;
}

.legend-toggle i {
  font-size: 16px;
}

.color-legend {
  margin-left: 10px;
  background-color: white;
  padding: 15px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  min-width: 200px;
}

.legend-title {
  font-size: 14px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid #ebeef5;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
  color: #606266;
}

.legend-item:last-child {
  margin-bottom: 0;
}

.color-block {
  width: 20px;
  height: 20px;
  margin-right: 8px;
  border-radius: 2px;
}

.color-block.highlight {
  background-color: #ffd04b;
}

.color-block.cleaned-cell {
  background-color: #409eff;
}

.color-block.default-cell {
  background-color: #f9f9f9;
  border: 1px solid #dcdfe6;
}

.color-block.current-selected-cell {
  background-color: #ff4444;
  animation: flash 1s infinite;
}

/* 变更联系人弹窗样式 */
.contact-dialog-content {
  padding: 20px;
}

.current-contact {
  margin-bottom: 20px;
}

.current-contact .label {
  font-weight: bold;
  margin-right: 10px;
}

.new-contact .label {
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
}

.dialog-footer {
  text-align: right;
  padding-top: 20px;
}

.move-cage-container {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  margin-bottom: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.source-cage,
.target-cage {
  flex: 1;
  margin: 0 20px;
  padding: 20px;
  background-color: white;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.cage-info {
  margin-top: 10px;
}

.cage-info p {
  margin: 5px 0;
  color: #606266;
}

.target-cage-selection {
  margin-top: 20px;
}

.target-cage-selection h4 {
  margin-bottom: 15px;
  color: #303133;
}

/* 目标笼盒选择相关样式 */
.target-selected-cell {
  background-color: #67c23a !important;
  color: white !important;
}

.source-cell {
  background-color: #f56c6c !important;
  color: white !important;
}

.occupied-cell {
  background-color: #909399 !important;
  color: white !important;
  cursor: not-allowed;
}

.available-cell {
  background-color: #f9f9f9;
  cursor: pointer;
}

.available-cell:hover {
  background-color: #ecf5ff !important;
}

/* 订单信息弹窗样式 */
.order-info-dialog .el-dialog__header {
  padding: 20px;
  border-bottom: 1px solid #ebeef5;
}

.order-info-dialog .el-dialog__title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.order-info-content {
  padding: 30px 20px;
}

.order-info-content .info-section {
  background-color: #f8f9fb;
  border-radius: 8px;
  padding: 20px;
}

.order-info-content .info-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px dashed #e4e7ed;
}

.order-info-content .info-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.order-info-content .info-label {
  width: 120px;
  color: #909399;
  font-size: 14px;
  line-height: 24px;
}

.order-info-content .info-value {
  flex: 1;
  color: #303133;
  font-size: 14px;
  line-height: 24px;
  font-weight: 500;
}

.order-info-content .info-value.price {
  color: #f56c6c;
  font-size: 16px;
  font-weight: 600;
}

.order-info-content .info-value.price .unit {
  margin-left: 4px;
  font-size: 12px;
  color: #909399;
  font-weight: normal;
}

.order-info-dialog .dialog-footer {
  padding: 10px 20px 20px;
  text-align: right;
}

.order-info-dialog .dialog-footer .el-button {
  padding: 9px 20px;
}

/* 锁定笼位样式 */
.locked-cell {
  background-color: #909399 !important;
  color: white !important;
}

/* 确保锁定状态的优先级高于hover效果 */
.el-table tbody tr:hover>td.locked-cell {
  background-color: #909399 !important;
}

.el-table td.locked-cell {
  background-color: #909399 !important;
}

.color-block.locked-cell {
  background-color: #909399;
}

/* 添加新的样式 */
.cell-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  padding-top: 18px;
}

.cage-info-tooltip {
  max-width: 300px !important;
  padding: 12px !important;
  background: white !important;
  border: 1px solid #e4e7ed !important;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1) !important;
  white-space: pre-line !important;
  line-height: 1.5 !important;
}

.cage-info {
  font-size: 14px;
  color: #606266;
}

.cage-info-title {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #ebeef5;
}

.cage-info-item {
  margin: 8px 0;
  display: flex;
  align-items: center;
}

.cage-info-item .label {
  color: #909399;
  margin-right: 8px;
  min-width: 70px;
}

.cage-info-item .value {
  color: #303133;
  font-weight: 500;
}

/* 添加加载动画 */
@keyframes loading-rotate {
  100% {
    transform: rotate(360deg);
  }
}

.loading-indicator {
  animation: loading-rotate 1s linear infinite;
  margin-right: 5px;
}

.has-cage {
  position: relative;
  color: #E74C3C !important;
  font-weight: 600 !important;
  font-size: 14px !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  letter-spacing: 0.5px;
  display: inline-block;
  padding-top: 12px; /* 为图标留出空间 */
}

.has-cage:hover {
  color: #C0392B !important;
  transform: scale(1.05);
  transition: all 0.2s ease;
}

.el-table td .has-cage {
  color: #E74C3C !important;
  font-weight: 600 !important;
  font-size: 14px !important;
}

.el-table tbody tr:hover>td .has-cage {
  color: #C0392B !important;
}

.has-cage::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 2px;
  bottom: -2px;
  left: 0;
  background-color: #E74C3C;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s ease;
}

.has-cage:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}

.el-table td {
  position: relative;
  text-align: center !important;
  vertical-align: middle !important;
  padding: 8px !important;
}

.cell-content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}

/* 编辑笼盒弹窗样式 */
.edit-cage-content {
  padding: 20px;
}

.edit-cage-content .el-form-item {
  margin-bottom: 20px;
}

.edit-cage-content .el-input {
  width: 100%;
}

/* 饲养异常弹窗样式 */
.abnormal-content {
  padding: 20px;
}

.abnormal-content .el-form-item {
  margin-bottom: 20px;
}

.abnormal-content .el-textarea {
  width: 100%;
}

.upload-demo {
  margin-bottom: 10px;
}

.el-upload__tip {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}

/* 笼位授权弹窗样式 */
.auth-dialog-content {
  padding: 20px;
}

.auth-dialog-content .cage-info {
  margin-bottom: 20px;
}

.auth-dialog-content .label {
  font-weight: bold;
  margin-right: 10px;
}

.auth-dialog-content .user-select {
  margin-top: 20px;
}

.auth-dialog-content .el-select {
  margin-top: 10px;
}

/* 添加动物图标样式 */
.animal-badge {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.animal-icon {
  width: 14px;
  height: 14px;
  object-fit: contain;
  display: block;
}

.animal-label {
  font-size: 12px;
  color: #67c23a;
  line-height: 1;
}

@keyframes swing {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(3deg);
  }
  75% {
    transform: rotate(-3deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

/* 添加单元格信息样式 */
.cell-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.cell-position {
  font-size: 14px;
  font-weight: 600;
  color: inherit;
}

.cell-contact {
  font-size: 12px;
  color: #606266;
  margin-top: 2px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.has-cage .cell-contact {
  color: #E74C3C;
}

/* 调整单元格内容的布局 */
.cell-content {
  padding: 4px;
  min-height: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* 调整动物图标位置 */
.animal-badge {
  position: absolute;
  top: 2px;
  right: 2px;
}

/* 确保表格单元格有足够的高度 */
.el-table td {
  height: 60px;
  padding: 4px !important;
}

/* 已授权笼位信息表格样式 */
.reserved-cages-table {
  margin-top: 20px;
}

.reserved-cages-table h4 {
  margin-bottom: 15px;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.negative-count {
  color: #F56C6C;
  font-weight: bold;
}

/* 调整弹窗内容样式 */
.auth-dialog-content {
  padding: 20px;
}

.auth-dialog-content .cage-info,
.auth-dialog-content .user-select {
  margin-bottom: 20px;
}

.auth-dialog-content .label {
  font-weight: bold;
  margin-right: 10px;
  display: inline-block;
  width: 80px;
}

.auth-dialog-content .value {
  color: #606266;
}

/* 表格样式调整 */
.el-table {
  margin-top: 10px;
}

.el-table th {
  background-color: #f5f7fa;
  color: #606266;
  font-weight: 600;
}

.el-table td {
  padding: 8px 0;
}
</style>