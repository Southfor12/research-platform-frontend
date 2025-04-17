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
        <div v-if="showTable">
          <!-- 表格 -->
          <el-table :data="tableData" style="width: 100%; padding-left: 80px; margin-bottom: 20px"
            :cell-class-name="getCellClassName" @cell-click="handleCellClick">
            <el-table-column prop="row" label="#" width="50"></el-table-column>
            <el-table-column v-for="col in columns" :key="col" :prop="col" :label="col" width="100">
              <template slot-scope="scope">
                <div
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
import { getCageused } from '@/api/order';
import {
  getCageId,
  getCageBoxId,
  getOrderInfo,
  getCageBoxInfo,
} from '@/api/ani_manage';

export default {
  name: 'RackDisplay',
  data() {
    return {
      loading: true,
      categories: [],
      campusList: [],
      tenementList: [],
      laboratoryList: [],
      cageList: [],
      campusmap: new Map(),
      tenementmap: new Map(),
      laboratorymap: new Map(),
      cagemap: new Map(),
      levelIconMap: {
        1: 'el-icon-office-building',
        2: 'el-icon-place',
        3: 'el-icon-house',
        4: 'el-icon-document',
      },
      showTable: false,
      rows: 10,
      columns: ['A', 'B', 'C', 'D', 'E'],
      tableData: [],
      activecage: [],
      cageInfoList: [],
      selectedRack: null,
      currentSelectedCage: {
        isSelected: false,
        position: '',
        row: null,
        column: '',
        index: null,
        numbers: null,
      },
      currentCageId: null,
      showLegend: true,
      cageInfoCache: new Map(),
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      try {
        await Promise.all([this.getCampusList(), this.getTenementList(), this.getLaboratoryList()]);

        this.campusList.forEach((campus) => {
          this.campusmap.set(campus.name, {
            id: campus.name,
            label: campus.name,
            level: 1,
            children: [],
          });
        });

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

        for (let laboratory of this.laboratoryList) {
          for (let campus of this.campusmap.values()) {
            for (let tenement of campus.children) {
              if (tenement.id === laboratory.building_name) {
                const list = [];
                await this.getRackList(laboratory.id);
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

    async getCampusList() {
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

    async getTenementList() {
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

    async getLaboratoryList() {
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

    async getRackList(id) {
      try {
        const res = await getRack({ roomId: id, page: 1, pageSize: 1000, hideSuccess: true });
        this.cageList = res.data.content;
      } catch (error) {
        console.error(error);
      }
    },

    renderTreeNode(h, { node, data }) {
      let iconClass = this.levelIconMap[node.level] || '';
      return h('span', { class: 'custom-tree-node' }, [
        h('i', { class: iconClass, style: { marginRight: '8px' } }),
        h('span', data.label),
      ]);
    },

    async handleCategoryClick(nodeData) {
      if (nodeData.level === 4) {
        this.selectedRack = nodeData;
        this.tableHeight = nodeData.height;
        this.tableWidth = nodeData.width;
        this.columns = [];
        this.rows = this.tableHeight;
        for (let i = 0; i < this.tableWidth; i++) {
          this.columns.push(String.fromCharCode(i + 'A'.charCodeAt(0)));
        }
        this.showTable = true;
        this.generateTableData();
        await this.getCageUsed_(nodeData.id);
        for (let i = 0; i < this.activecage.length; i++) {
          const row = this.tableData[Math.floor(this.activecage[i] / this.columns.length)];
          const column = this.columns.find(
            (col) =>
              col === String.fromCharCode(64 + (this.activecage[i] % this.columns.length) + 1)
          );
          this.handleCellClick(row, { property: column });
        }
      } else {
        this.selectedRack = null;
        this.showTable = false;
      }
    },

    generateTableData() {
      this.tableData = [];
      for (let i = 1; i <= this.rows; i++) {
        let rowData = { row: i };
        this.columns.forEach((col) => {
          rowData[col] = `${col}${i}`;
        });
        this.tableData.push(rowData);
      }
    },

    async getCageUsed_(id) {
      try {
        return new Promise((resolve, reject) => {
          getCageused({ cage_rack_id: id, hideSuccess: true })
            .then((res) => {
              this.activecage = res.data;
              getCageAll({ cage_rack_id: id, hideSuccess: true })
                .then(async (cageRes) => {
                  const cageInfoWithContacts = await Promise.all(
                    cageRes.data.map(async (cage) => {
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

    async handleCellClick(row, column) {
      if (column.property === 'row') return;

      const numbers =
        (row.row - 1) * this.tableWidth + (column.property.charCodeAt(0) - 'A'.charCodeAt(0));

      this.currentSelectedCage = {
        isSelected: true,
        position: `${column.property}${row.row}`,
        row: row.row,
        column: column.property,
        index: numbers,
        numbers: numbers,
      };

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
    },

    getCellClassName({ row, columnIndex, column }) {
      if (column.property === 'row') return '';

      const colKey = this.columns[columnIndex - 1];
      const cellNumber =
        (row.row - 1) * this.columns.length + (colKey.charCodeAt(0) - 'A'.charCodeAt(0));

      const isCurrentSelected =
        this.currentSelectedCage.isSelected &&
        this.currentSelectedCage.row === row.row &&
        this.currentSelectedCage.column === colKey;

      const cageInfo = this.cageInfoList.find((cage) => cage.number === cellNumber);
      const isCleaned = cageInfo && cageInfo.animal_count === 0 && cageInfo.is_reserved;
      const isReserved = cageInfo && cageInfo.animal_count === 0 && cageInfo.is_reserved;

      if (isCurrentSelected) return 'current-selected-cell';
      if (isCleaned) return 'cleaned-cell';
      if (isReserved) return 'reserved-cell';
      return 'default-cell';
    },

    toggleLegend() {
      this.showLegend = !this.showLegend;
    },

    hasCage(row, col) {
      const numbers = (row - 1) * this.columns.length + (col.charCodeAt(0) - 'A'.charCodeAt(0));
      return this.cageInfoList.some(cage => cage.number === numbers && cage.animal_count > 0);
    },

    getCellContact(row, col) {
      const cageInfo = this.cageInfoList.find(cage => cage.number === (row - 1) * this.columns.length + (col.charCodeAt(0) - 'A'.charCodeAt(0)));
      return cageInfo ? cageInfo.user : '';
    },
  },
  computed: {
    shouldShowTooltip() {
      return this.cageFields.some(field => ['cageName', 'orderNumber', 'contact', 'price'].includes(field));
    }
  },
};
</script>

<style scoped>
/* 高亮单元格样式 */
.highlight {
  background-color: #ffd04b;
  color: #ffffff;
}

.default-cell {
  background-color: #f9f9f9;
}

.el-table tbody tr:hover>td {
  background: #f9f9f9 !important;
}

/* 当前选中单元格样式 */
.current-selected-cell {
  animation: flash 1s infinite;
  color: white !important;
  font-weight: bold;
}

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

/* 已清理或预留的笼子样式 */
.cleaned-cell,
.reserved-cell {
  background-color: #409eff !important;
  color: white !important;
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

/* 单元格内容样式 */
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

.has-cage {
  position: relative;
  color: #E74C3C !important;
  font-weight: 600 !important;
  font-size: 14px !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  letter-spacing: 0.5px;
  display: inline-block;
  padding-top: 12px;
}

.animal-badge {
  position: absolute;
  top: 2px;
  right: 2px;
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

/* 侧边栏样式 */
.sidebar {
  background-color: #f5f7fa;
  padding: 20px;
  border-right: 1px solid #e6e6e6;
}

.sidebar-title {
  margin-bottom: 20px;
  font-size: 16px;
  color: #303133;
  font-weight: 600;
}

.custom-tree {
  background-color: transparent;
}

.custom-tree-node {
  display: flex;
  align-items: center;
  font-size: 14px;
  padding: 8px 0;
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
  height: 60px;
  position: relative;
  text-align: center !important;
  vertical-align: middle !important;
}
</style> 