<template>
    <div
      v-loading="loading"
      class="app-container"
      element-loading-text="数据查询中..."
      element-loading-spinner="el-icon-loading"
    >
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
          <!-- 只有在选中第三级节点时显示按钮 -->
          <el-button
            v-if="showAddButton"
            class="right"
            type="primary"
            size="small"
            icon="el-icon-plus"
            :min-width="minWidth"
            :min-height="minHeight"
            @click="toAdd(selectedLaboratory.id)"
          >
            添加笼架
          </el-button>
          <el-button
            v-if="showEditButton"
            class="right"
            type="primary"
            size="small"
            icon="el-icon-plus"
            @click="toEdit()"
          >
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
          </div>
          <div>
            <!-- 表格 -->
            <el-table
              :data="tableData"
              style="width: 100%; padding-left: 80px"
              :cell-class-name="getCellClassName"
              @cell-click="handleCellClick"
              v-if="showTable"
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
          </div>
        </el-main>
      </el-container>
    </div>
  </template>
  
  <script>
  import { getCourtyard, getTenement, getLaboratory, getRack, getCage } from '@/api/colleges';
  import Empty from '@/components/Empty';
  import { getCageused } from '@/api/order';
  
  export default {
    components: {
      Empty,
    },
    data() {
      return {
        activecage: [], //已经被选择过的笼架
  
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
      };
    },
    created() {
      this.init();
    },
    methods: {
      // 处理单元格点击事件
      handleCellClick(row, column) {
        let cellKey = { row: row.row, column: column.property };
        if (!row.row) {
          cellKey = { row: row, column: column };
        }
        const res =
          (row.row - 1) * this.columns.length + column.property.charCodeAt(0) - 'A'.charCodeAt(0);
        if (this.activecage.includes(res)) this.activeCells.push(cellKey);
      },
      // 根据单元格位置动态设置类名
      getCellClassName({ row, columnIndex, column }) {
        const colKey = this.columns[columnIndex - 1]; // 列名，从索引获取
        const isActive = this.activeCells.some(
          (cell) => cell.row === row.row && cell.column === colKey
        );
        return isActive ? 'highlight' : 'default-cell'; // 高亮或默认样式
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
                console.log(res.data);
                this.activecage = res.data;
                resolve();
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
    },
  };
  </script>
  
  
  <style >
  /* 高亮单元格样式 */
  .highlight {
    background-color: #ffd04b; /* 黄色 */
    color: #ffffff; /* 白色文字 */
  }
  .default-cell {
    background-color: #f9f9f9; /* 浅灰色 */
  }
  .el-table tbody tr:hover > td {
    background: #f9f9f9 !important;
  }
  </style>
  
  