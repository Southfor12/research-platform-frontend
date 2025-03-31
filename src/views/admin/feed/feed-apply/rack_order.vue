<!-- 这是笼位预约与分配的功能模块 -->
<template>
    <div>
        <el-form :model="cageOrder" label-width="100px">
            <div class="order-management">
                <div class="header">
                    <h2>笼位订单管理</h2>
                </div>
                <!-- 笼位预约订单管理 -->
                <el-table :data="cageOrder" stripe border>
                    <el-table-column prop="id" label="预约申请ID" width="100">
                        <template #default="scope">
                            <el-tooltip content="查看详情" placement="top">
                                <el-icon class="icon-eye" @click="viewCageOrderDetail(scope.row)"
                                    style="cursor: pointer; margin-right: 5px; color: #409eff">
                                    <i class="el-icon-view"></i>
                                </el-icon>
                            </el-tooltip>
                            <el-link @click="viewCageOrderDetail(scope.row)">{{ scope.row.id }}</el-link>
                        </template>
                    </el-table-column>
                    <el-table-column prop="customer_name" label="预约客户名称" width="120" />
                    <el-table-column prop="order_time" label="预约时间" width="120" />
                    <el-table-column prop="facility_id" label="设施编号" width="120" />
                    <el-table-column prop="quantity" label="申请数量" width="100" />
                    <el-table-column prop="notes" label="备注" width="150" />
                    <el-table-column prop="status" label="状态标识">
                        <template #default="scope">
                            <el-tag :type="getStatusTagType(scope.row.status)">{{ scope.row.status_text }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="分配笼位" width="120" align="center">
                        <template #default="scope">
                            <el-button type="success" size="small" @click="assignCage(scope.row)">分配笼位</el-button>
                        </template>
                    </el-table-column>

                    <el-table-column label="分配权限" width="120" align="center">
                        <template #default="scope">
                            <el-button type="primary" size="small" @click="assignPermission(scope.row)">分配权限</el-button>
                        </template>
                    </el-table-column>

                    <el-table-column label="取消分配" width="120" align="center">
                        <template #default="scope">
                            <el-button type="warning" size="small" @click="cancelAssignment(scope.row)">取消分配</el-button>
                        </template>
                    </el-table-column>

                    <!-- <el-table-column label="已完成" width="120" align="center"> -->
                       <!-- <template #default="scope"> -->
                            <!-- <el-button type="info" size="small" @click="markCompleted(scope.row)">完成</el-button> -->
                        <!-- </template> -->
                    <!-- </el-table-column> -->
                </el-table>
            </div>

        </el-form>
        <!-- 分配笼位弹窗 -->
        <el-dialog :visible.sync="dialogVisible" title="分配笼位" width="1000px" :modal="false" style="margin-top: 5vh;">
            <template>
                <div v-loading="loading" class="app-container" element-loading-text="数据查询中..."
                    element-loading-spinner="el-icon-loading">
                    <el-container>
                        <el-aside width="240px" class="sidebar">
                            <h3 class="sidebar-title">饲养笼架</h3>
                            <el-tree :data="categories" :default-expand-all="true" node-key="id"
                                @node-click="handleCategoryClick" class="custom-tree"
                                :render-content="renderTreeNode" />
                        </el-aside>
                        <el-main>
                            <el-row justify="space-between" align="middle" style="margin-bottom: 10px;">
                                <el-col>
                                    <h3 class="sidebar-title">查看笼架</h3>
                                </el-col>
                                <el-col>
                                    <span>客户笼子预约数: <b>{{ reservedCages }}</b></span>
                                    <span style="margin-left: 20px;">已选笼子数: <b>{{ count }}</b></span>
                                </el-col>
                            </el-row>

                            <div>
                                <!-- 表格 -->
                                <el-table :data="tableData" style="width: 100%; padding-left: 80px"
                                    :cell-class-name="getCellClassName" @cell-click="handleCellClick" v-if="showTable">
                                    <el-table-column prop="row" label="#" width="50"></el-table-column>
                                    <el-table-column v-for="col in columns" :key="col" :prop="col" :label="col"
                                        width="100"></el-table-column>
                                </el-table>
                            </div>
                        </el-main>
                    </el-container>
                </div>
            </template>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleAssignConfirm">确认分配</el-button>
                </span>
            </template>
        </el-dialog>



    </div>
</template>

<script>
import {assignCage} from '@/api/order';
import { addCageOrder } from '@/api/order';
import { getCourtyard, getTenement, getLaboratory, getRack, getCage } from '@/api/colleges';
import Empty from '@/components/Empty';
import { getCageused } from '@/api/order';
import { assignCagetouser, delCage } from '@/api/colleges';
export default {
    name: 'CageOrder',
    components: {
        Empty,
    },
    data() {
        return {
            observed_rack_id: 0,//给用户分配的笼架的id
            flag: 0,
            selectedCageNum: [], //笼位的位置信息 如23 43...
            selectedCagesList: [], // 新的数组用于存储已选笼子，给用户的自持笼架 如A1 C5...
            reservedCages: 0,//用户的笼子预约数
            cageOrder: [],  //笼位订单信息的存储
            dialogVisible: false, //控制弹窗的显示和隐藏
            selectedOrder: null, // 选中的订单数据

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
        this.getCageOrder();
        this.init();

    },
    methods: {
        getStatusTagType(status) {
            switch (status) {
                case 0:
                    return 'danger'; // 未分配
                case 1:
                    return 'success'; // 已分配
                case 2:
                    return 'success'; // 已分配（未使用）
                case 3:
                    return 'info'; // 已完成（未使用）
                default:
                    return '';
            }
        },

        // 获取笼位预约订单数据信息
        async getCageOrder() {
            // 这里调用API获取订单数据
            try {
                const response = await addCageOrder(); //发送请求
                console.log('response:', response);
                this.cageOrder = response.data.map(order => ({
                    id: order.id,
                    customer_name: order.name,
                    order_type: "排队预约",
                    facility_id: order.room_name,
                    quantity: order.requested_count,
                    notes: order.remarks,
                    status: order.status,
                    order_time: order.create_time,
                    status_text: order.status === 1 ? "已分配" : "未分配",
                }));
            } catch (error) {

            }

        },

        viewCageOrderDetail(order) {
            console.log('查看订单详情:', order);
        },
        //点击分配笼位按钮时触发(显示弹窗)
        assignCage(order) {
            this.selectedOrder = order; // 存储当前操作的订单
            this.reservedCages = order.quantity;
            this.$set(this, 'dialogVisible', true); // 强制 Vue 监听
            this.dialogVisible = true;  // 显示弹窗
            //console.log("该订单的客户姓名",order.customer_name);
            //console.log("我选中的客户订单",this.selectedOrder)
            //console.log('分配笼位:', order);
            //console.log(this.dialogVisible);
        },
        // 点击确认分配按钮时触发
        async handleAssignConfirm() {
            // 我需要知道当前笼位的 申请者id，笼位位置id，笼位标记为"自持笼位""已使用笼位"
            //console.log(this.selectedCagesList);
            //console.log("笼子的位置数字",this.selectedCageNum),
            //console.log("分配笼位给订单:", this.selectedOrder);
            // console.log("我选中的客户订单",this.selectedOrder.id)
            // console.log(this.selectedRack);
            // console.log("observed_rack_id",this.observed_rack_id);

            const requestedData={
                rack_id:this.observed_rack_id,
                number:this.selectedCageNum,
                cage_booking_id:this.selectedOrder.id
            }
            try {
                const response = await assignCagetouser(requestedData);
                console.log('response:', response);
                if (response.code === 200) {
                    this.$message.success('笼位分配成功！');
                } else {
                    this.$message.error('笼位分配失败！');
                }
                this.getCageOrder();
            } catch (error) {
                console.error('Error:', error);
               this.$message.error('笼位分配失败！');
            }
            this.dialogVisible = false; // 关闭弹窗
            this.$message.success('笼位分配成功！');
        },
        assignPermission(order) {
            console.log('分配权限:', order);
        },
        async cancelAssignment(order) {
            try {
                console.log('取消分配:', order.id);
                const response = await delCage({ id: order.id });
                console.log('response:', response);
                if (response.status === 1) {
                    this.$message.success('笼位取消成功！');
                } else {
                    this.$message.error('笼位取消失败！');
                }
                this.getCageOrder();
            } catch (error) {
                
            }
        },
        markCompleted(order) {
            console.log('标记为已完成:', order);
        },


        // 处理单元格点击事件
        handleCellClick(row, column) {
            console.log(this.flag);
            let cellKey = { row: row.row, column: column.property };
            //console.log(cellKey);
            if (!row.row) {
                cellKey = { row: row, column: column };
            }
            if (this.flag === 0) {
                // res显示笼子的在笼架的位置信息
                const res =
                    (row.row - 1) * this.columns.length + column.property.charCodeAt(0) - 'A'.charCodeAt(0);
                if (this.activecage.includes(res)) this.activeCells.push(cellKey);
                //console.log("你好，这是我已经使用过的笼子",this.activeCells);
            }else if(this.flag===1){
                const res =
                    (row.row - 1) * this.columns.length + column.property.charCodeAt(0) - 'A'.charCodeAt(0);
                console.log(res);
                this.selectedCageNum.push(res);
                // if (this.activecage.includes(res)) 
                this.selectedCagesList.push(cellKey);
                //console.log("我红色被执行了");
                console.log("我是被选中的单元格",this.selectedCagesList);
                this.count++;
                //console.log(this.count);
            }
        },
        // 根据单元格位置动态设置类名
        // getCellClassName({ row, columnIndex, column }) {
        //     const colKey = this.columns[columnIndex - 1]; // 列名，从索引获取

        //     const isActive = this.activeCells.some(
        //         (cell) => cell.row === row.row && cell.column === colKey
        //     );
        //     return isActive ? 'highlight' : 'default-cell'; // 高亮或默认样式
        // },
        getCellClassName({ row, columnIndex, column }) {
            const colKey = this.columns[columnIndex - 1]; // 获取列名
            const isActive = this.activeCells.some(
                (cell) => cell.row === row.row && cell.column === colKey
            );

            const isSelected = this.selectedCagesList.some(
                (cell) => cell.row === row.row && cell.column === colKey
            );

            if (isSelected) {
                return 'highlight-red';
            }

            // 如果在 activeCells 中，返回黄色高亮类
            return isActive ? 'highlight-yellow' : 'default-cell'; // 如果都没有选中，返回默认样式
        },

        generateTableData() {
            this.tableData = []; //用来存储表格的数据，初始化为空数组。
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
                //console.log("我是被选中的笼架",nodeData.id);
                this.observed_rack_id=nodeData.id;
                this.selectedRack = nodeData; // 选择当前笼架
               // console.log("我是被选中的笼架",selectedRack);
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
                this.flag=0;
                this.getCageUsed_(nodeData.id).then(() => {
                    for (let i = 0; i < this.activecage.length; i++) {
                        const row = this.tableData[Math.floor(this.activecage[i] / this.columns.length)]; // 获取特定行的数据
                        const column = this.columns.find(
                            (col) =>
                                col === String.fromCharCode(64 + (this.activecage[i] % this.columns.length) + 1)
                        ); // 获取特定列的名字                    
                        this.handleCellClick(row, { property: column });
                        //console.log("我在查询已经使用过的笼子啦，行列如下",row, { property: column });
                    }
                    this.flag = 1;
                });

                this.selectedCagesList = [];
                //this.flag = 1;
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

.app-container {
    margin-top: 0px;
    padding: 0px;
}

/* 红色高亮 */
.highlight-red {
    background-color: red;
    /* 设置背景为红色 */
    color: white;
    /* 可选，设置文本颜色为白色，保证红色背景下文字清晰可见 */
}

/* 黄色高亮 */
.highlight-yellow {
    background-color: yellow;
    /* 设置背景为黄色 */
    color: black;
    /* 可选，设置文本颜色为黑色，确保黄色背景下文字清晰可见 */
}

/* 默认单元格样式 */
.default-cell {
    background-color: transparent;
    /* 默认情况下，背景透明 */
    color: black;
    /* 设置文本颜色为黑色 */
}
</style>