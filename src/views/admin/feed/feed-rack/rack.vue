<!-- 这是饲养笼架的显示模块 -->
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
              <el-checkbox-group v-model="selectionMode">
                <el-checkbox label="all">所有</el-checkbox>
                <el-checkbox label="cage">笼子</el-checkbox>
                <el-checkbox label="position">位置</el-checkbox>
              </el-checkbox-group>
            </el-col>
            <!-- 笼子显示字段 -->
            <el-col :span="8">
              <h5>笼子显示</h5>
              <el-checkbox-group v-model="cageFields">
                <el-checkbox label="owner">所有者</el-checkbox>
                <el-checkbox label="phone">电话</el-checkbox>
                <el-checkbox label="topic">课题</el-checkbox>
                <el-checkbox label="contact">联系人</el-checkbox>
                <el-checkbox label="contactPhone">联系电话</el-checkbox>
                <el-checkbox label="team">课题组</el-checkbox>
                <el-checkbox label="price">价格</el-checkbox>
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
              </el-checkbox-group>
            </el-col>
          </el-row>

          <!-- 表格 -->
          <el-table :data="tableData" style="width: 100%; padding-left: 80px; margin-bottom: 20px;"
            :cell-class-name="getCellClassName" @cell-click="handleCellClick">
            <el-table-column prop="row" label="#" width="50"></el-table-column>
            <el-table-column v-for="col in columns" :key="col" :prop="col" :label="col" width="100"></el-table-column>
          </el-table>

          <!-- 功能按钮组 - 第一行 -->
          <div class="button-group">
            <el-button type="primary" size="small" icon="el-icon-delete" @click="handleCleanRack">清理笼盒</el-button>
            <el-button type="primary" size="small" icon="el-icon-edit">编辑笼盒</el-button>
            <el-button type="primary" size="small" icon="el-icon-plus">移动笼盒</el-button>
            <el-button type="primary" size="small" icon="el-icon-edit">修改状态</el-button>
            <el-button type="primary" size="small" icon="el-icon-document">订单信息</el-button>
            <el-button type="primary" size="small" icon="el-icon-search">清空订单</el-button>
            <el-button type="primary" size="small" icon="el-icon-printer">打印标签</el-button>
            <el-button type="primary" size="small" icon="el-icon-user" @click="handleChangeContact">变更联系人</el-button>
            <el-button type="primary" size="small" icon="el-icon-warning">饲养异常</el-button>
            <el-button type="primary" size="small" icon="el-icon-setting">提交工单</el-button>
            <el-button type="primary" size="small" icon="el-icon-printer">重打标签</el-button>
          </div>

          <!-- 功能按钮组 - 第二行 -->
          <div class="button-group">
            <el-button type="primary" size="small" icon="el-icon-upload2">导入笼盒</el-button>
            <el-button type="primary" size="small" icon="el-icon-setting">笼位锁定</el-button>
            <el-button type="primary" size="small" icon="el-icon-close">取消锁定</el-button>
            <el-button type="primary" size="small" icon="el-icon-share">笼位分配</el-button>
            <el-button type="primary" size="small" icon="el-icon-close">取消分配</el-button>
            <el-button type="primary" size="small" icon="el-icon-user">笼位授权</el-button>
            <el-button type="primary" size="small" icon="el-icon-close">取消授权</el-button>
            <el-button type="primary" size="small" icon="el-icon-printer">打印笼架</el-button>
            <el-button type="primary" size="small" icon="el-icon-user">笼位授权</el-button>
            <el-button type="primary" size="small" icon="el-icon-close">取消授权</el-button>
          </div>

          <!-- 色卡提示区域 -->
          <div class="color-legend-container">
            <div class="legend-toggle" @click="toggleLegend">
              <i :class="showLegend ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"></i>
            </div>
            <div class="color-legend" v-show="showLegend">
              <div class="legend-title">笼位状态说明</div>
              <div class="legend-item">
                <div class="color-block current-selected-cell"></div>
                <span>当前选中笼子</span>
              </div>
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
            </div>
          </div>

          <!-- 变更联系人弹窗 -->
          <el-dialog
            title="变更联系人"
            :visible.sync="contactDialogVisible"
            width="500px"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :show-close="false">
            <div class="contact-dialog-content">
              <div class="current-contact">
                <span class="label">当前联系人：</span>
                <span class="value">{{ currentContactName }}</span>
              </div>
              <div class="new-contact">
                <span class="label">选择新联系人：</span>
                <el-select
                  v-model="selectedContactId"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入联系人姓名搜索"
                  :remote-method="remoteSearch"
                  :loading="loading"
                  style="width: 100%">
                  <el-option
                    v-for="item in contactOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button @click="contactDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="confirmChangeContact">确 定</el-button>
            </div>
          </el-dialog>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { getCourtyard, getTenement, getLaboratory, getRack, getCage, getCageAll } from '@/api/colleges';
import Empty from '@/components/Empty';
import { getCageused } from '@/api/order';
import { getCageId, cleanRack, updateCageContact ,getUserById, allUsers } from '@/api/ani_manage';

export default {
  components: {
    Empty,
  },
  data() {
    return {
      activecage: [], //已经被选择过的笼架
      cageInfoList: [], // 存储笼子的详细信息
      count: 0,
      rows: 10, // 行数
      columns: ['A', 'B', 'C', 'D', 'E'], // 列名
      tableData: [], // 表格数据
      activeCells: [], // 选择的
      activeCells_: [], // 已选择的

      selectionMode: [], // 选择模式默认全选
      cageFields: [], // 笼子字段默认全不选
      positionFields: [], // 位置字段默认全不选

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
        row: null,    // 行号
        column: '',   // 列号
        index: null,  // 笼子索引
      },
      // 新增：当前操作选中的笼位信息
      currentSelectedCage: {
        isSelected: false,
        position: '', // 位置信息 (例如: A1)
        row: null,    // 行号
        column: '',   // 列号
        index: null,  // 笼子索引
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
    };
  },
  created() {
    this.init();
  },
  methods: {
    // 处理单元格点击事件
    async handleCellClick(row, column) {
      let cellKey = { row: row.row, column: column.property };
      if (!row.row) {
        cellKey = { row: row, column: column };
      }
      const res = (row.row - 1) * this.columns.length + column.property.charCodeAt(0) - 'A'.charCodeAt(0);

      // 原有逻辑保持不变
      if (this.activecage.includes(res)) {
        this.activeCells.push(cellKey);
      }

      // 新增：记录当前选中的笼位信息
      if (column.property !== 'row') { // 忽略序号列
        // 计算从0开始的位置索引
        const numbers = (row.row - 1) * this.tableWidth + (column.property.charCodeAt(0) - 'A'.charCodeAt(0));

        this.currentSelectedCage = {
          isSelected: true,
          position: `${column.property}${row.row}`,
          row: row.row,
          column: column.property,
          index: res,
          numbers: numbers
        };

        // 获取笼子ID
        if (this.selectedRack && this.selectedRack.id) {
          try {
            const response = await getCageId({
              rack_id: this.selectedRack.id,
              number: numbers
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
      const cellNumber = (row.row - 1) * this.columns.length + (colKey.charCodeAt(0) - 'A'.charCodeAt(0));

      // 检查是否是当前选中的笼位
      const isCurrentSelected = this.currentSelectedCage.isSelected &&
        this.currentSelectedCage.row === row.row &&
        this.currentSelectedCage.column === colKey;

      // 检查是否是已激活的笼位
      const isActive = this.activeCells.some(
        (cell) => cell.row === row.row && cell.column === colKey
      );

      // 检查是否是已清理的笼位
      const isCleaned = this.cleanedCages && this.cleanedCages.some(
        (cage) => cage.row === row.row && cage.column === colKey
      );

      // 检查是否是已预留的笼位
      const cageInfo = this.cageInfoList.find(cage => cage.number === cellNumber);
      const isReserved = cageInfo && cageInfo.animal_count === 0 && cageInfo.is_reserved;

      // 返回对应的样式类名
      if (isCurrentSelected) return 'current-selected-cell';
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
          getCageused({ cage_rack_id: id })
            .then((res) => {
              this.activecage = res.data;
              // 获取笼子的详细信息
              getCageAll({ cage_rack_id: id })
                .then((cageRes) => {
                  this.cageInfoList = cageRes.data;
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
        getCourtyard({ page: 1, pageSize: 1000 })
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
        getTenement({ page: 1, pageSize: 1000 })
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
        getLaboratory({ page: 1, pageSize: 1000 })
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
        const res = await getRack({ roomId: id, page: 1, pageSize: 1000 });
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

    // 处理清理笼架
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
        await cleanRack({
          cage_id: this.currentCageId
        });
        this.$message.success('清理笼子成功');

        // 刷新笼架数据
        if (this.selectedRack && this.selectedRack.id) {
          await this.getCageUsed_(this.selectedRack.id);
          // 将清理的笼子添加到已清理列表
          if (!this.cleanedCages) {
            this.cleanedCages = [];
          }
          this.cleanedCages.push({
            row: this.currentSelectedCage.row,
            column: this.currentSelectedCage.column
          });
          // 重置选中状态
          this.currentSelectedCage = {
            isSelected: false,
            position: '',
            row: null,
            column: '',
            index: null,
            numbers: null
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
        // 获取当前笼子的所有者信息
        const cageInfo = this.cageInfoList.find(cage => cage.id === this.currentCageId);
        if (!cageInfo || !cageInfo.user_id) {
          this.$message.warning('未找到笼子所有者信息');
          return;
        }

        // 获取当前联系人信息
        const userRes = await getUserById({ id: cageInfo.user_id });
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

    // 远程搜索联系人
    remoteSearch(query) {
      if (query !== '') {
        this.loading = true;
        // 这里可以添加远程搜索逻辑，目前使用本地过滤
        setTimeout(() => {
          this.loading = false;
          this.contactOptions = this.contactOptions.filter(item => {
            return item.name.toLowerCase().includes(query.toLowerCase());
          });
        }, 200);
      } else {
        this.contactOptions = this.contactOptions;
      }
    },

    // 确认变更联系人
    async confirmChangeContact() {
      if (!this.selectedContactId) {
        this.$message.warning('请选择新联系人');
        return;
      }

      try {
        await updateCageContact({
          cage_id: this.currentCageId,
          user_id: this.selectedContactId
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
        numbers: null
      };
      this.currentCageId = null;
      this.cleanedCages = []; // 重置已清理的笼子列表
    }
  }
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
  background-color: #409EFF;
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
.el-button [class^="el-icon-"] {
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
.cleaned-cell, .reserved-cell {
  background-color: #409EFF !important;
  color: white !important;
}

/* 确保已清理或预留状态的优先级高于hover效果 */
.el-table tbody tr:hover>td.cleaned-cell,
.el-table tbody tr:hover>td.reserved-cell {
  background-color: #409EFF !important;
}

.el-table td.cleaned-cell,
.el-table td.reserved-cell {
  background-color: #409EFF !important;
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
  background-color: #409EFF;
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
  border-bottom: 1px solid #EBEEF5;
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
  background-color: #409EFF;
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
</style>