<!-- 跨笼架移动弹窗组件 -->
<template>
  <el-dialog
    title="移动笼盒"
    :visible.sync="visible"
    width="90%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    class="move-cage-dialog"
  >
    <div class="move-cage-container">
      <!-- 源笼盒信息 -->
      <div class="source-cage">
        <h4>源笼盒信息</h4>
        <div class="cage-info">
          <p>笼盒名称：{{ sourceCageBoxInfo ? sourceCageBoxInfo.name : '-' }}</p>
          <p>笼盒ID：{{ sourceCageBoxInfo ? sourceCageBoxInfo.id : '-' }}</p>
          <p>笼盒类型：{{ sourceCageBoxInfo ? sourceCageBoxInfo.box_type : '-' }}</p>
          <p>位置：{{ sourcePosition }}</p>
          <p>笼架：{{ sourceRackLabel }}</p>
          <p>动物数量：{{ sourceCageBoxInfo ? sourceCageBoxInfo.animal_count : 0 }}</p>
          <p>价格：{{ sourceCageBoxInfo ? sourceCageBoxInfo.price : 0 }}</p>
        </div>
      </div>

      <!-- 目标笼架选择区域 -->
      <div class="target-area">
        <h4>选择目标笼架</h4>
        <el-container>
          <el-aside width="240px" class="sidebar">
            <h3 class="sidebar-title">区域分类</h3>
            <el-tree
              :data="categories"
              :default-expand-all="true"
              node-key="id"
              @node-click="handleCategoryClick"
              class="custom-tree"
              :render-content="renderTreeNode"
            />
          </el-aside>
          <el-main>
            <div v-if="showTargetTable">
              <!-- 目标笼位信息展示 -->
              <div v-if="targetCage.position" class="target-cage-info">
                <h4>已选择的目标笼位</h4>
                <div class="cage-info">
                  <p>位置：{{ targetCage.position }}</p>
                  <p>笼架：{{ selectedRack ? selectedRack.label : '-' }}</p>
                  <p>笼位ID：{{ targetCage.id || '-' }}</p>
                </div>
              </div>
              
              <el-table
                :data="tableData"
                style="width: 100%; padding-left: 80px; margin-bottom: 20px"
                :cell-class-name="getTargetCellClassName"
                @cell-click="handleTargetCellClick"
              >
                <el-table-column prop="row" label="#" width="50"></el-table-column>
                <el-table-column
                  v-for="col in columns"
                  :key="col"
                  :prop="col"
                  :label="col"
                  width="100"
                >
                  <template slot-scope="scope">
                    <div
                      class="cell-content"
                      :class="{ 
                        'has-cage': hasCage(scope.row.row, col),
                        'source-cage': isSourceCage(scope.row.row, col),
                        'target-cage': isTargetCage(scope.row.row, col)
                      }"
                    >
                      <div v-if="hasCage(scope.row.row, col)" class="animal-badge">
                        <img src="@/assets/images/animal-icon.svg" class="animal-icon" alt="动物" />
                      </div>
                      <div class="cell-info">
                        <span class="cell-position">{{ scope.row[col] }}</span>
                        <span v-if="getCellContact(scope.row.row, col)" class="cell-contact">
                          {{ getCellContact(scope.row.row, col) }}
                        </span>
                      </div>
                    </div>
                  </template>
                </el-table-column>
              </el-table>

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
                  <div class="legend-item">
                    <div class="color-block source-cage"></div>
                    <span>源笼盒</span>
                  </div>
                  <div class="legend-item">
                    <div class="color-block target-cage"></div>
                    <span>目标笼位</span>
                  </div>
                </div>
              </div>
            </div>
          </el-main>
        </el-container>
      </div>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="confirmMove" :disabled="!targetCage.id">确 定</el-button>
    </div>
  </el-dialog>
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
import { getCageused } from '@/api/order';
import {
  getCageId,
  moveCage,
  getCageBoxId,
  getOrderInfo
} from '@/api/ani_manage';

export default {
  name: 'MoveCageDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    sourceCageBoxInfo: {
      type: Object,
      default: () => ({})
    },
    sourcePosition: {
      type: String,
      default: ''
    },
    sourceRackLabel: {
      type: String,
      default: ''
    },
    sourceCageId: {
      type: [Number, String],
      default: null
    }
  },
  data() {
    return {
      categories: [],
      campusList: [],
      tenementList: [],
      laboratoryList: [],
      cageList: [],
      selectedRack: null,
      showTargetTable: false,
      tableData: [],
      columns: [],
      rows: 10,
      targetCage: {
        position: '',
        row: null,
        column: '',
        index: null,
        numbers: null,
        id: null
      },
      cageInfoList: [],
      showLegend: true,
      loading: false,
      // 图标映射
      levelIconMap: {
        1: 'el-icon-office-building',
        2: 'el-icon-place',
        3: 'el-icon-house',
        4: 'el-icon-document'
      },
      // 源笼盒位置信息
      sourceCagePosition: {
        row: null,
        column: '',
        position: ''
      }
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.init();
        this.parseSourcePosition();
      }
    }
  },
  methods: {
    // 解析源笼盒位置信息
    parseSourcePosition() {
      if (this.sourcePosition) {
        const match = this.sourcePosition.match(/([A-Z])(\d+)/);
        if (match) {
          this.sourceCagePosition = {
            column: match[1],
            row: parseInt(match[2]),
            position: this.sourcePosition
          };
          console.log('源笼盒位置信息已解析:', this.sourceCagePosition);
        }
      }
    },
    
    async init() {
      try {
        this.loading = true;
        await Promise.all([
          this.getCampusList(),
          this.getTenementList(),
          this.getLaboratoryList()
        ]);

        // 处理数据
        await this.processData();
        this.loading = false;
      } catch (error) {
        console.error('初始化失败:', error);
        this.$message.error('初始化失败');
        this.loading = false;
      }
    },

    // 获取校区列表
    async getCampusList() {
      try {
        const res = await getCourtyard({ page: 1, pageSize: 1000, hideSuccess: true });
        this.campusList = res.data.content;
      } catch (error) {
        console.error('获取校区列表失败:', error);
        throw error;
      }
    },

    // 获取楼栋列表
    async getTenementList() {
      try {
        const res = await getTenement({ page: 1, pageSize: 1000, hideSuccess: true });
        this.tenementList = res.data.content;
      } catch (error) {
        console.error('获取楼栋列表失败:', error);
        throw error;
      }
    },

    // 获取实验室列表
    async getLaboratoryList() {
      try {
        const res = await getLaboratory({ page: 1, pageSize: 1000, hideSuccess: true });
        this.laboratoryList = res.data.content;
      } catch (error) {
        console.error('获取实验室列表失败:', error);
        throw error;
      }
    },

    // 处理数据
    async processData() {
      const campusmap = new Map();
      
      // 处理校区数据
      this.campusList.forEach(campus => {
        campusmap.set(campus.name, {
          id: campus.name,
          label: campus.name,
          level: 1,
          children: []
        });
      });

      // 处理楼栋数据
      this.tenementList.forEach(tenement => {
        const campus = campusmap.get(tenement.campus_name);
        if (campus) {
          campus.children.push({
            id: tenement.name,
            label: tenement.name,
            level: 2,
            children: []
          });
        }
      });

      // 处理实验室和笼架数据
      for (const laboratory of this.laboratoryList) {
        for (const campus of campusmap.values()) {
          for (const tenement of campus.children) {
            if (tenement.id === laboratory.building_name) {
              const list = [];
              const rackRes = await getRack({ roomId: laboratory.id, page: 1, pageSize: 1000, hideSuccess: true });
              for (const rack of rackRes.data.content) {
                list.push({
                  id: rack.id,
                  label: rack.number,
                  level: 4,
                  height: rack.height,
                  width: rack.width
                });
              }
              tenement.children.push({
                id: laboratory.id,
                label: laboratory.name,
                level: 3,
                children: list
              });
              break;
            }
          }
        }
      }

      this.categories = Array.from(campusmap.values());
    },

    // 处理节点点击
    async handleCategoryClick(nodeData) {
      if (nodeData.level === 4) {
        // 重置所有状态，包括源笼盒位置信息
        this.resetAllState();
        
        this.selectedRack = nodeData;
        this.showTargetTable = true;
        this.tableHeight = nodeData.height;
        this.tableWidth = nodeData.width;
        this.columns = [];
        this.rows = this.tableHeight;
        
        // 设置表格列
        for (let i = 0; i < this.tableWidth; i++) {
          this.columns.push(String.fromCharCode(i + 'A'.charCodeAt(0)));
        }
        
        // 生成表格数据
        this.generateTableData();
        
        // 获取笼架使用情况
        await this.getCageUsed(nodeData.id);
      } else {
        // 重置所有状态，包括源笼盒位置信息
        this.resetAllState();
      }
    },

    // 重置所有状态
    resetAllState() {
      this.selectedRack = null;
      this.showTargetTable = false;
      this.tableData = [];
      this.columns = [];
      this.targetCage = {
        position: '',
        row: null,
        column: '',
        index: null,
        numbers: null,
        id: null
      };
      this.cageInfoList = [];
      // 重置源笼盒位置信息
      this.sourceCagePosition = {
        row: null,
        column: '',
        position: ''
      };
    },

    // 生成表格数据
    generateTableData() {
      this.tableData = [];
      for (let i = 1; i <= this.rows; i++) {
        const rowData = { row: i };
        this.columns.forEach(col => {
          rowData[col] = `${col}${i}`;
        });
        this.tableData.push(rowData);
      }
    },

    // 获取笼架使用情况
    async getCageUsed(id) {
      try {
        const res = await getCageused({ cage_rack_id: id, hideSuccess: true });
        const cageRes = await getCageAll({ cage_rack_id: id, hideSuccess: true });
        
        this.cageInfoList = await Promise.all(
          cageRes.data.map(async cage => {
            if (cage.animal_count > 0) {
              try {
                const cageBoxRes = await getCageBoxId({
                  cage_id: cage.id,
                  hideSuccess: true
                });
                
                if (cageBoxRes.data && cageBoxRes.data.id) {
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
      } catch (error) {
        console.error('获取笼架使用情况失败:', error);
        this.$message.error('获取笼架使用情况失败');
      }
    },

    // 渲染树节点
    renderTreeNode(h, { node, data }) {
      const iconClass = this.levelIconMap[node.level] || '';
      return h('span', { class: 'custom-tree-node' }, [
        h('i', { class: iconClass, style: { marginRight: '8px' } }),
        h('span', data.label)
      ]);
    },

    // 获取目标单元格类名
    getTargetCellClassName({ row, columnIndex, column }) {
      if (column.property === 'row') return '';

      const colKey = this.columns[columnIndex - 1];
      const cellNumber = (row.row - 1) * this.columns.length + (colKey.charCodeAt(0) - 'A'.charCodeAt(0));

      // 检查是否是当前选中的目标笼位
      const isTargetSelected = this.targetCage.position &&
        this.targetCage.row === row.row &&
        this.targetCage.column === colKey;

      // 检查是否是源笼盒
      const isSourceCage = this.sourceCagePosition.row === row.row &&
        this.sourceCagePosition.column === colKey;

      // 检查笼位是否已被占用
      const cageInfo = this.cageInfoList.find(cage => cage.number === cellNumber);
      const isOccupied = cageInfo && cageInfo.animal_count > 0;

      if (isTargetSelected) return 'target-selected-cell';
      if (isSourceCage) return 'source-cage-cell';
      if (isOccupied) return 'occupied-cell';
      return 'available-cell';
    },

    // 检查是否是源笼盒
    isSourceCage(row, col) {
      return this.sourceCagePosition.row === row && this.sourceCagePosition.column === col;
    },

    // 检查是否是目标笼位
    isTargetCage(row, col) {
      return this.targetCage.row === row && this.targetCage.column === col;
    },

    // 处理目标单元格点击
    async handleTargetCellClick(row, column) {
      if (column.property === 'row') return;

      const numbers = (row.row - 1) * this.tableWidth + (column.property.charCodeAt(0) - 'A'.charCodeAt(0));

      // 检查是否是源笼盒
      if (this.isSourceCage(row.row, column.property)) {
        this.$message.warning('不能选择源笼盒作为目标位置');
        return;
      }

      // 检查目标笼盒是否已被占用
      const targetCageInfo = this.cageInfoList.find(cage => cage.number === numbers);
      if (targetCageInfo && targetCageInfo.animal_count > 0) {
        this.$message.warning('目标笼盒已被占用，请选择其他位置');
        return;
      }

      // 先重置目标状态
      this.targetCage = {
        position: '',
        row: null,
        column: '',
        index: null,
        numbers: null,
        id: null
      };

      // 获取目标笼盒ID
      try {
        const response = await getCageId({
          rack_id: this.selectedRack.id,
          number: numbers,
          hideSuccess: true
        });
        
        if (response.data) {
          this.targetCage = {
            position: `${column.property}${row.row}`,
            row: row.row,
            column: column.property,
            index: numbers,
            numbers: numbers,
            id: response.data
          };
        } else {
          this.$message.warning('无法获取目标笼盒ID');
        }
      } catch (error) {
        console.error('获取目标笼盒ID失败:', error);
        this.$message.error('获取目标笼盒ID失败');
      }
    },

    // 检查笼位是否有笼盒
    hasCage(row, col) {
      const numbers = (row - 1) * this.columns.length + (col.charCodeAt(0) - 'A'.charCodeAt(0));
      return this.cageInfoList.some(cage => cage.number === numbers && cage.animal_count > 0);
    },

    // 获取单元格联系人
    getCellContact(row, col) {
      const cageInfo = this.cageInfoList.find(
        cage => cage.number === (row - 1) * this.columns.length + (col.charCodeAt(0) - 'A'.charCodeAt(0))
      );
      return cageInfo ? cageInfo.user : '';
    },

    // 切换图例显示
    toggleLegend() {
      this.showLegend = !this.showLegend;
    },

    // 处理关闭
    handleClose() {
      this.$emit('update:visible', false);
      this.resetAllState();
    },

    // 确认移动
    async confirmMove() {
      if (!this.targetCage.id) {
        this.$message.warning('请选择目标笼盒');
        return;
      }

      try {
        await moveCage({
          cage_box_id: this.sourceCageBoxInfo.id,
          newcage_id: this.targetCage.id
        });

        this.$message.success('移动笼盒成功');
        this.$emit('move-success');
        this.handleClose();
      } catch (error) {
        console.error('移动笼盒失败:', error);
        this.$message.error('移动笼盒失败');
      }
    }
  }
};
</script>

<style scoped>
.move-cage-dialog .move-cage-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.move-cage-dialog .source-cage {
  background-color: #f5f7fa;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.move-cage-dialog .source-cage h4 {
  margin-bottom: 15px;
  color: #303133;
}

.move-cage-dialog .source-cage .cage-info p {
  margin: 5px 0;
  color: #606266;
}

.move-cage-dialog .target-area h4 {
  margin-bottom: 15px;
  color: #303133;
}

.move-cage-dialog .target-cage-info {
  background-color: #f0f9eb;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.move-cage-dialog .target-cage-info h4 {
  margin-bottom: 10px;
  color: #67c23a;
}

.move-cage-dialog .target-cage-info .cage-info p {
  margin: 5px 0;
  color: #606266;
}

.move-cage-dialog .sidebar {
  background-color: #fff;
  border-right: 1px solid #e6e6e6;
  padding: 20px;
}

.move-cage-dialog .sidebar .sidebar-title {
  margin-bottom: 15px;
  color: #303133;
}

.move-cage-dialog .cell-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  padding-top: 18px;
  min-height: 60px;
}

.move-cage-dialog .has-cage {
  position: relative;
  color: #E74C3C !important;
  font-weight: 600 !important;
  font-size: 14px !important;
}

.move-cage-dialog .source-cage {
  background-color: #ffd700 !important;
  color: #000 !important;
  font-weight: 600 !important;
}

.move-cage-dialog .target-cage {
  background-color: #67c23a !important;
  color: white !important;
  font-weight: 600 !important;
}

.move-cage-dialog .animal-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.move-cage-dialog .animal-icon {
  width: 14px;
  height: 14px;
  object-fit: contain;
}

.move-cage-dialog .cell-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 2px;
}

.move-cage-dialog .cell-position {
  font-size: 14px;
  font-weight: 600;
  color: inherit;
}

.move-cage-dialog .cell-contact {
  font-size: 12px;
  color: #606266;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 4px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 2px;
}

.move-cage-dialog .has-cage .cell-contact {
  color: #E74C3C;
  background-color: rgba(231, 76, 60, 0.1);
}

.move-cage-dialog .source-cage .cell-contact {
  color: #000;
  background-color: rgba(255, 215, 0, 0.2);
}

.move-cage-dialog .target-cage .cell-contact {
  color: #fff;
  background-color: rgba(103, 194, 58, 0.2);
}

.move-cage-dialog .target-selected-cell {
  background-color: #67c23a !important;
  color: white !important;
  font-weight: 600 !important;
  position: relative;
}

.move-cage-dialog .source-cage-cell {
  background-color: #ffd700 !important;
  color: black !important;
  font-weight: 600 !important;
  position: relative;
}

.move-cage-dialog .source-cage-cell::after {
  content: '源';
  position: absolute;
  top: 2px;
  left: 2px;
  font-size: 12px;
  color: #000;
  background-color: rgba(255, 215, 0, 0.8);
  padding: 1px 4px;
  border-radius: 2px;
}

.move-cage-dialog .occupied-cell {
  background-color: #909399 !important;
  color: white !important;
  cursor: not-allowed;
}

.move-cage-dialog .available-cell {
  background-color: #f9f9f9;
  cursor: pointer;
}

.move-cage-dialog .available-cell:hover {
  background-color: #ecf5ff !important;
}

.color-legend-container {
  position: relative;
  margin-top: 20px;
}

.legend-toggle {
  position: absolute;
  right: 0;
  top: 0;
  cursor: pointer;
  padding: 5px;
}

.color-legend {
  background-color: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
  margin-top: 10px;
}

.legend-title {
  font-weight: bold;
  margin-bottom: 10px;
  color: #303133;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.color-block {
  width: 20px;
  height: 20px;
  margin-right: 10px;
  border-radius: 3px;
}

.highlight {
  background-color: #E74C3C;
}

.cleaned-cell {
  background-color: #909399;
}

.default-cell {
  background-color: #f9f9f9;
  border: 1px solid #dcdfe6;
}

.locked-cell {
  background-color: #f56c6c;
}

.source-cage {
  background-color: #ffd700;
}

.target-cage {
  background-color: #67c23a;
}

.target-selected-cell::after {
  content: '目标';
  position: absolute;
  top: 2px;
  left: 2px;
  font-size: 12px;
  color: #fff;
  background-color: rgba(103, 194, 58, 0.8);
  padding: 1px 4px;
  border-radius: 2px;
}
</style> 