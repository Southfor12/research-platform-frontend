<template>
  <div
    style="height: auto"
    v-loading="loading"
    class="app-container"
    element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading"
  >
    <div style="font-weight: bolder">确认商品</div>
    <hr />

    <el-table :header-cell-style="{ background: '#fafafa' }" :data="list" style="width: 100%">
      <el-table-column prop="name" label="产品规格" />

      <el-table-column prop="price" label="单价" />
      <el-table-column prop="count" label="数量" header-align="left">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-button
              size="mini"
              icon="el-icon-minus"
              @click="if (scope.row.count > 1) scope.row.count--;"
            ></el-button>
            <span style="margin: -10px 10px">{{ scope.row.count }}</span>
            <el-button size="mini" icon="el-icon-plus" @click="scope.row.count++"></el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述" />
    </el-table>
    <div style="font-size: 18px; color: #333; margin-top: 20px; float: right">
      订单总额: <span style="color: red; font-weight: bold; font-size: 22px">{{ totalPrice }}</span>
    </div>

    <br />
    <br />
    <br />
    <br />

    <div style="font-weight: bolder">所属项目</div>
    <hr />

    <el-table
      :header-cell-style="{ background: '#fafafa' }"
      :data="project_list"
      style="width: 100%"
    >
      <el-table-column prop="pro_id" label="项目编号" />
      <el-table-column prop="pro_name" label="项目名称" />
      <el-table-column prop="pro_from" label="来源" />

      <el-table-column width="180" label="操作">
        <template #default="scope">
          <el-checkbox :checked="scope.row.selected" @change="selectOnly(scope.row)"> </el-checkbox>
        </template>
      </el-table-column>
    </el-table>

    <br />
    <br />
    <br />
    <br />

    <div style="font-weight: bolder">是否饲养</div>
    <hr />

    <el-radio-group v-model="is_laboratory">
      <el-radio label="true">是</el-radio>
      <el-radio label="false">否</el-radio>
    </el-radio-group>

    <br />

    <div v-if="is_laboratory === 'true'" style="font-weight: bolder">
      <el-form
        ref="form"
        :model="submitform"
        :rules="rules"
        label-width="150px"
        style="margin-top: 40px"
      >
        <!-- 动物来源 -->
        <el-row gutter="20">
          <el-col :span="12">
            <el-form-item label="动物来源" prop="source">
              <el-select v-model="submitform.source" size="big" class="width-200">
                <el-option label="从中心购买" value="从中心购买"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 所属课题组 -->
        <el-row gutter="20">
          <el-col :span="12">
            <el-form-item label="课题组" prop="research_group_name">
              <el-select v-model="submitform.research_group_name" size="big" class="width-200">
                <el-option 
                  v-for="item in researchGroupList" 
                  :key="item" 
                  :label="item" 
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 动物明细 -->
        <el-row gutter="20">
          <el-col :span="24">
            <div style="font-weight: bolder">动物明细</div>
            <hr />
            <el-table :data="submitform.animals" border style="width: 100%">
              <!-- 动物类型 -->
              <el-table-column label="动物类型" width="180">
                <template #default="scope">
                  <el-select v-model="scope.row.animalType" placeholder="选择类型" clearable>
                    <el-option v-for="type in uniqueAnimalTypes" :key="type.id" :label="type.name" :value="type.name" />
                  </el-select>
                </template>
              </el-table-column>
              <!-- 品系 -->
              <el-table-column label="品系" width="180">
                <template #default="scope">
                  <el-select v-model="scope.row.breed" placeholder="选择品系" clearable>
                    <el-option v-for="strain in filteredStrains(scope.row.animalType)" :key="strain.id"
                      :label="strain.strain_name" :value="strain.strain_name" />
                  </el-select>
                </template>
              </el-table-column>
              <!-- 体重 -->
              <el-table-column label="体重">
                <template #default="scope">
                  <el-input v-model="scope.row.weight" placeholder="体重"></el-input>
                </template>
              </el-table-column>
              <!-- 周龄 -->
              <el-table-column label="周龄">
                <template #default="scope">
                  <el-input v-model="scope.row.age" placeholder="周龄"></el-input>
                </template>
              </el-table-column>
              <!-- 性别 -->
              <el-table-column label="性别">
                <template #default="scope">
                  <el-select v-model="scope.row.gender" placeholder="性别">
                    <el-option label="雄性" value="雄性"></el-option>
                    <el-option label="雌性" value="雌性"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <!-- 数量 -->
              <el-table-column label="数量">
                <template #default="scope">
                  <el-input v-model="scope.row.count" placeholder="数量"></el-input>
                </template>
              </el-table-column>
              <!-- 供应商 -->
              <el-table-column label="供应商">
                <template #default="scope">
                  <el-select v-model="scope.row.supplier" placeholder="供应商">
                    <el-option v-for="supplier in suppliers" :key="supplier" :label="supplier" :value="supplier"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <!-- 操作 -->
              <el-table-column label="操作" width="150">
                <template #default="scope">
                  <el-button type="danger" size="small" @click="deleteRow(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 添加按钮 -->
            <el-row style="margin-top: 20px">
              <el-col :span="24">
                <el-button type="primary" @click="addRow">添加一行</el-button>
              </el-col>
            </el-row>
          </el-col>
        </el-row>

        <el-row gutter="20">
          <!-- 院区 -->
          <el-col :span="12">
            <el-form-item label="院区" prop="campus_name">
              <el-select
                v-model="submitform.campus_name"
                size="big"
                @change="handleCampusChange"
                class="width-200"
              >
                <el-option
                  v-for="item in this.campusList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 楼栋 -->
          <el-col :span="12">
            <el-form-item label="楼栋" prop="tenement">
              <el-select
                v-model="submitform.building_id"
                size="big"
                @change="handleBuildingChange"
                class="width-200"
              >
                <el-option
                  v-for="item in this.tenementList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 实验室 -->
          <el-col :span="12">
            <el-form-item label="实验室" prop="laboratory_id">
              <el-select
                v-model="submitform.laboratory_id"
                @change="handleLaboratoryChange"
                size="big"
                class="width-200"
              >
                <el-option
                  v-for="item in this.laboratoryList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="已选笼子数量" prop="count">
              <el-input v-model="submitform.count" size="medium" class="width-200" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row gutter="20">
          <!-- 申请类型 -->
          <el-col :span="12">
            <el-form-item label="申请类型" prop="type">
              <el-select v-model="submitform.type" size="medium" class="width-200">
                <el-option value="true" label="新笼位"></el-option>
                <el-option value="false" label="自持笼位"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 总价 -->
          <el-col :span="12">
            <el-form-item label="预计需要笼子数" prop="price">
              <el-input size="medium" class="width-200" :readonly="true" :value="totalCageNums + '个'">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row gutter="20">
          <!-- 笼盒类型 -->
          <el-col :span="12">
            <el-form-item label="笼盒类型" prop="cage_box_type">
              <el-select v-model="submitform.cage_box_type" size="medium" class="width-200" @change="handleCageBoxTypeChange">
                <el-option v-for="item in cageBoxList" :key="item.id" :label="item.box_type" :value="item.box_type"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 笼盒价格 -->
          <el-col :span="12">
            <el-form-item label="笼盒价格/个" prop="cage_box_price">
              <el-input size="medium" class="width-200" :readonly="true" :value="submitform.cage_box_price + '元'">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <!-- 表格 -->
          <el-col>
            <el-form-item label="选择笼架" prop="rack_id">
              <el-select
                v-model="submitform.rack_id"
                size="medium"
                class="width-200"
                @change="handleRackChange"
              >
                <el-option
                  v-for="item in this.cageList"
                  :key="item.id"
                  :label="item.number"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-table
              :data="tableData"
              style="width: 100%; padding-left: 80px"
              :cell-class-name="getCellClassName"
              @cell-click="handleCellClick"
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
          </el-col>
        </el-row>

        <el-row gutter="20">
          <el-col :span="12">
            <el-form-item label="实验内容" prop="description">
              <el-input
                v-model="submitform.description"
                type="textarea"
                rows="10"
                placeholder="请输入实验内容"
                class="width-500"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row gutter="20">
          <el-col :span="12">
            <el-form-item label="选择开始日期" prop="start_time">
              <el-date-picker
                v-model="submitform.start_time"
                type="date"
                placeholder="选择开始日期"
                style="width: 100%"
                @change="watchDateChange"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row gutter="20">
          <el-col :span="12">
            <el-form-item label="选择结束日期" prop="end_time">
              <el-date-picker
                v-model="submitform.end_time"
                type="date"
                placeholder="选择结束日期"
                style="width: 100%"
                @change="watchDateChange"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 饲养服务选择 -->
        <el-row gutter="20">
          <el-col :span="12">
            <el-form-item label="饲养服务" prop="care_id">
              <el-select 
                v-model="submitform.care_id" 
                size="big" 
                class="width-200"
                @change="handleCareServiceChange"
                filterable
                placeholder="请选择饲养服务">
                <el-option
                  v-for="item in filteredFeedServices"
                  :key="item.id"
                  :label="`${item.animal_type} - ${item.room_name} - ${item.manager}`"
                  :value="item.id">
                  <span>{{ item.animal_type }} - {{ item.room_name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">
                    {{ item.price }}元/天
                  </span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 总价格展示 -->
        <el-row gutter="20">
          <el-col :span="12">
            <el-form-item label="总价格" prop="total_price">
              <el-input size="medium" class="width-200" :readonly="true" :value="calculateTotalPrice().toFixed(2) + '元'">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-row gutter="20" style="text-align: right">
      <el-col>
        <el-button type="primary" @click="handleSubmit">确认</el-button>
      </el-col>
    </el-row>
  </div>
</template>
        
        <script>
import { getCourtyard, getTenement, getLaboratory, getRack } from '@/api/colleges';
import { getCageused, get_a_AnimalOrder, editFeed, editAnimalOrder } from '@/api/order';
import { get_a_Animal } from '@/api/product';
import store from '@/store';
import Empty from '@/components/Empty';
import {getServiceType} from '@/api/order';
import { getAnimalStrain, getAnimalType } from '@/api/ani_setting';
import { getCageBoxList } from '@/api/cage_box';
import { getResearchGroupName } from '@/api/ani_manage';
import { getFeedService, getReservedCage2 } from '@/api/ani_manage';

export default {
  components: {
    Empty,
  },
  data() {
    return {
      animalTypeMap: new Map(), // 用于存储动物类型name和id的映射
      defaultAnimalType: '', // 新增默认类型字段
      unitPrice: 0,
      animalStrains: [],
      animalTypes: [],
      laboratoryList: [], // 实验室列表
      tenementList: [], // 楼栋列表
      campusList: [], // 院区列表
      cageList: [], // 笼架列表
      AlllaboratoryList: [], // 所有实验室列表
      AlltenementList: [], // 所有楼栋列表
      AllcampusList: [], // 所有院区列表
      AllcageList: [], // 所有笼架列表
      suppliers: ['上海新菲公司', '北京供应商', '广州供应商'], // 供应商示例数据
      cageBoxList: [], // 新增笼盒列表
      feedPrice: 0, // 新增饲养价格
      researchGroupList: [], // 课题组列表
      reservedCageNumbers: [], // 新增：存储自持笼位编号

      rows: 10, // 行数
      columns: ['A', 'B', 'C', 'D', 'E'], // 列名

      tableData: [], // 表格数据
      activeCells: [], // 存储多选单元格的信息
      activecage: [],  // 存储多选单元格的信息  被选中的笼子的位置号
      lockedCageNumbers: [], // 存储锁定笼位的编号

      is_laboratory: 'true', // 是否饲养
      project_list: [
        {
          pro_id: '1',
          pro_name: '动物园',
          pro_from: '动物园',
        },
      ], // 项目列表
      submitform: {
        level: '', // SPF等级
        project_name: '', // 项目名称
        source: '从中心购买', // 改为 "从中心购买"
        user_id: store.getters.member.id,
        care_id: '',
        rack_id: '',
        count: 0,
        description: '',
        cage_box_type: '',
        cage_box_price: 0,
        research_group_name: '',
        cage_number: [],
        start_time: '',
        end_time: '',
        animals: [{
          name: '',
          animalType: '', // 注意：示例中是 animal_type
          breed: '', // 示例中没有这个字段
          weight: '',
          age: '',
          gender: '',
          count: '',
          supplier: ''
        }]
      },
      queryForm: {
        id: '',
        name: '',
        supervisor: '',
        level: '',
        age: '',
        weight: '',
        sex: '',
        price: '',
        description: '',
        number: '',
        page: 1,
        page_size: 10,
      },

      list: [],
      feedServiceList: [], // 存储饲养服务列表
      rules: {
        care_id: [
          { required: true, message: '请选择饲养服务', trigger: 'change' }
        ]
      }
    };
  },

  computed: {
    totalPrice() {
      let total = 0;
      this.list.forEach((item) => {
        total += item.price * item.count;
      });
      return total.toFixed(2);
    },
    // 新增去重后的动物类型
    uniqueAnimalTypes() {
      const seen = new Set()
      return this.animalTypes.filter(item => {
        const duplicate = seen.has(item.name)
        seen.add(item.name)
        return !duplicate
      })
    },
    // 新增动态获取品系列表的方法
    filteredStrains() {
      return (animalType) => {
        const typeInfo = this.animalTypeMap.get(animalType);
        const typeId = typeInfo && typeInfo.id;
        if (!typeId) return [];
        return this.animalStrains.filter(
          strain => strain.animal_type_id === typeId
        );
      };
    },
    totalCageNums() {
      let total = 0
      this.submitform.animals.forEach(animal => {
        const typeInfo = this.animalTypeMap.get(animal.animalType)
        const capacity = (typeInfo && typeInfo.capacity) || 1;
        const count = Number(animal.count) || 0
        if (capacity > 0) {
          total += Math.ceil(count / capacity)
        }
      })
      return total
    },
    filteredFeedServices() {
      // 如果没有选择动物，显示所有服务
      if (!this.submitform.animals[0].animalType) {
        return this.feedServiceList;
      }
      // 根据选中的动物类型过滤服务
      return this.feedServiceList.filter(
        service => service.animal_type === this.submitform.animals[0].animalType
      );
    }
  },
  created() {
    this.init();
    this.loadAnimalTypes();
    this.loadAnimalStrains();
    this.getResearchGroupList();
    this.getCageBoxList();
    this.getFeedPrice();
    this.getFeedServiceList();
    
    get_a_AnimalOrder({ id: this.$route.params.id })
      .then((res) => {
        res.data = [{ ...res.data }];
        const promises = res.data.map((item) =>
          get_a_Animal({ id: item.animal_id }).then((ress) => {
            return {
              ...item,
              name: `${ress.data.name} ${ress.data.supplier_id} ${ress.data.level} ${item.gender} ${item.age} ${item.weight}`,
              price: ress.data.price,
            };
          })
        );

        Promise.all(promises).then((data) => {
          this.list = data;
          this.submitform.animals[0].age = this.list[0].age;
          this.submitform.animals[0].count = this.list[0].count;
          this.submitform.animals[0].gender = this.list[0].gender;
          this.submitform.animals[0].name = this.list[0].name;
          this.submitform.animals[0].supplier = this.list[0].supplier;
          this.submitform.animals[0].weight = this.list[0].weight;
        });
      })
      .catch(() => {});
  },
  methods: {
    // 新增动物品系加载方法
    async loadAnimalStrains() {
      try {
        const res = await getAnimalStrain({
          pageNo: 1,
          pageSize: 1000
        })
        if (res.status === 1) {
          this.animalStrains = res.data.records
        }
      } catch (error) {
        console.error('获取动物品系失败:', error)
      }
    },

    async loadAnimalTypes() {
      try {
        const res = await getAnimalType()
        if (res.status === 1) {
          this.animalTypes = res.data;
          res.data.forEach(item => {
            this.animalTypeMap.set(item.name,
              {
                id: item.id,
                capacity: item.default_capacity
              })
          })
        }
      } catch (error) {
        console.error('获取动物类型失败:', error)
      }
    },

    // 获取课题组列表
    async getResearchGroupList() {
      try {
        const res = await getResearchGroupName({ user_id: store.getters.member.id })
        if (res.status === 1) {
          this.researchGroupList = res.data
        }
      } catch (error) {
        console.error('获取课题组列表失败:', error)
      }
    },

    // 获取笼盒列表
    async getCageBoxList() {
      try {
        const res = await getCageBoxList();
        if (res.status === 1) {
          this.cageBoxList = res.data;
        }
      } catch (error) {
        console.error('获取笼盒列表失败:', error);
      }
    },

    // 处理笼盒类型变化
    handleCageBoxTypeChange(value) {
      const selectedBox = this.cageBoxList.find(item => item.box_type === value);
      if (selectedBox) {
        this.submitform.cage_box_type = selectedBox.box_type;
        this.submitform.cage_box_price = selectedBox.cage_box_price;
      }
    },

    // 计算总天数
    calculateTotalDays() {
      if (!this.submitform.start_time || !this.submitform.end_time) {
        return 0;
      }
      const startDate = new Date(this.submitform.start_time);
      const endDate = new Date(this.submitform.end_time);
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    },

    // 计算总价格
    calculateTotalPrice() {
      // 笼盒总价 = 预计需要笼子数 * 笼盒价格
      const cageBoxTotal = this.totalCageNums * this.submitform.cage_box_price;
      
      // 饲养总价 = 总天数 * 笼子数 * 饲养价格
      const feedTotal = this.calculateTotalDays() * this.submitform.count * this.feedPrice;
      
      // 总价格 = 笼盒总价 + 饲养总价
      return cageBoxTotal + feedTotal;
    },

    // 获取饲养价格
    async getFeedPrice() {
      try {
        const id = this.$route.params.id;
        if (!id) {
          console.error('未找到路由参数id');
          return;
        }
        const res = await get_a_Feed({ id });
        if (res.status === 1) {
          this.feedPrice = res.data.price;
        }
      } catch (error) {
        console.error('获取饲养价格失败:', error);
        this.feedPrice = 0;
      }
    },

    // 监听日期变化
    watchDateChange() {
      this.$forceUpdate();
    },

    // 添加一行
    addRow() {
      this.submitform.animals.push({
        animalType: this.defaultAnimalType,
        breed: '',
        weight: '',
        age: '',
        gender: '',
        count: '',
        supplier: '',
      });
    },

    // 删除一行
    deleteRow(index) {
      this.submitform.animals.splice(index, 1);
    },

    handleSubmit() {
      // 将品系的值赋给name字段
      this.submitform.animals.forEach(animal => {
        animal.name = animal.breed;
      });
      
      // 设置动物订单ID
      this.submitform.animal_order_id = this.$route.params.id;
      
      // 提交表单
      editFeed(this.submitform).then((res) => {
        editAnimalOrder({
          id: this.$route.params.id,
          care_order_id: res.data,
          count: this.list[0].count,
        }).then(() => {
          this.$router.push('/personal/shopping/cart');
        });
      }).catch(() => {});
    },

    selectOnly(row) {
      // 遍历所有数据行，确保只有当前行被选中
      this.tableData.forEach((item) => {
        item.selected = item === row; // 仅当前行为 true，其他行为 false
      });
      this.selectedItem = row.selected ? row.pro_name : null; // 更新选中的项目名称
      this.submitform.project_name = this.selectedItem;
    },
    handleCampusChange() {
      this.submitform.building_id = '';
      if (this.submitform.campus_name) {
        // 根据选择的校区更新楼宇列表
        this.tenementList = this.AlltenementList.filter(
          (item) => item.campus_name === this.submitform.campus_name
        );
      } else {
        // 如果没有选择校区，清空楼宇列表
        this.tenementList = [];
      }
    },

    handleBuildingChange() {
      this.submitform.laboratory_id = '';
      // this.submitform.cage_id = '';
      // this.cageList = [];
      const selectedBuilding = this.AlltenementList.find(
        (item) => item.id === this.submitform.building_id
      );
      if (selectedBuilding) {
        // 根据楼宇的 campus_id 自动更新对应的校区
        this.submitform.campus_name = selectedBuilding.campus_name;

        // 根据选择的楼宇更新实验室列表
        this.laboratoryList = this.AlllaboratoryList.filter(
          (item) =>
            item.building_name ===
            this.AlltenementList.find((item) => item.id === this.submitform.building_id).name
        );
      } else {
        // 如果没有选择楼宇，清空实验室列表
        this.laboratoryList = [];
      }
    },
    handleLaboratoryChange() {
      this.submitform.rack_id = '';
      if (this.submitform.laboratory_id) {
        // 根据选择的实验室更新笼架列表
        this.getRackList(this.submitform.laboratory_id);
        this.cageList = this.AllcageList.filter(
          (item) => item.room_id === this.submitform.laboratory_id
        );
      } else {
        // 如果没有选择实验室，清空笼架列表
        this.cageList = [];
      }
      const res = this.AlllaboratoryList.find((item) => item.id === this.submitform.laboratory_id);
      this.submitform.campus_name = res.campus_name;
      this.submitform.building_id = res.building_name;
    },
    handleRackChange() {
      // 清空之前的选择
      this.activeCells = [];
      this.submitform.cage_number = [];
      this.submitform.count = 0;
      
      this.rows = this.cageList.find((item) => item.id === this.submitform.rack_id).height;
      this.columns = [];
      const j = this.cageList.find((item) => item.id === this.submitform.rack_id).width;
      for (let i = 1; i <= j; i++) {
        this.columns.push(String.fromCharCode(64 + i));
      }
      this.generateTableData();
      
      // 如果是自持笼位，获取用户的自持笼位
      if (this.submitform.type === 'false') {
        this.getReservedCageNumbers(this.submitform.rack_id).then(() => {
          // 渲染自持笼位
          for (let i = 0; i < this.reservedCageNumbers.length; i++) {
            const cageNumber = this.reservedCageNumbers[i];
            const row = this.tableData[Math.floor(cageNumber / this.columns.length)];
            const column = this.columns.find(
              (col) =>
                col === String.fromCharCode(64 + (cageNumber % this.columns.length) + 1)
            );
            this.handleReservedCellClick(row, { property: column });
          }
        });
      } else {
        // 按顺序获取和渲染笼位状态
        this.getCageUsed(this.submitform.rack_id).then(() => {
          this.getReservedCageNumbers(this.submitform.rack_id).then(() => {
            this.getLockedCageNumbers(this.submitform.rack_id).then(() => {
              // 渲染已使用的笼位
              for (let i = 0; i < this.activecage.length; i++) {
                const row = this.tableData[Math.floor(this.activecage[i] / this.columns.length)];
                const column = this.columns.find(
                  (col) =>
                    col === String.fromCharCode(64 + (this.activecage[i] % this.columns.length) + 1)
                );
                this.handleUsedCellClick(row, { property: column });
              }
              
              // 渲染自持笼位
              for (let i = 0; i < this.reservedCageNumbers.length; i++) {
                const cageNumber = this.reservedCageNumbers[i];
                const row = this.tableData[Math.floor(cageNumber / this.columns.length)];
                const column = this.columns.find(
                  (col) =>
                    col === String.fromCharCode(64 + (cageNumber % this.columns.length) + 1)
                );
                
                if (!this.activecage.includes(cageNumber)) {
                  this.handleReservedCellClick(row, { property: column });
                }
              }
              
              // 渲染锁定笼位
              for (let i = 0; i < this.lockedCageNumbers.length; i++) {
                const cageNumber = this.lockedCageNumbers[i];
                const row = this.tableData[Math.floor(cageNumber / this.columns.length)];
                const column = this.columns.find(
                  (col) =>
                    col === String.fromCharCode(64 + (cageNumber % this.columns.length) + 1)
                );
                
                if (!this.activecage.includes(cageNumber) && !this.reservedCageNumbers.includes(cageNumber)) {
                  this.handleLockedCellClick(row, { property: column });
                }
              }
            });
          });
        });
      }
    },

    handleCellClick(row, column) {
      let cellKey = { row: row.row, column: column.property };
      if (!row.row) {
        cellKey = { row: row, column: column };
      }
      
      // 计算当前单元格的编号
      const cageNumber = (row.row - 1) * this.columns.length + column.property.charCodeAt(0) - 'A'.charCodeAt(0);
      
      // 检查是否是已使用的笼位（黄色高亮）
      const isUsed = this.activecage && this.activecage.includes(cageNumber);
      
      // 检查是否是自持笼位（蓝色高亮）
      const isReserved = this.reservedCageNumbers && this.reservedCageNumbers.includes(cageNumber);
      
      // 检查是否是锁定笼位（灰色高亮）
      const isLocked = this.lockedCageNumbers && this.lockedCageNumbers.includes(cageNumber);
      
      // 如果是自持笼位模式，只能选择自持笼位
      if (this.submitform.type === 'false' && !isReserved) {
        return;
      }
      
      // 如果单元格已经被渲染了颜色（已使用、自持或锁定），则不允许选择
      if (isUsed || isLocked) {
        return;
      }
      
      // 检查单元格是否已被选中
      const cellIndex = this.activeCells.findIndex(
        (cell) => cell.row === cellKey.row && cell.column === cellKey.column
      );
      
      if (cellIndex === -1) {
        // 如果单元格不在 activeCells 中，添加并设置为红色高亮
        this.activeCells.push(cellKey);
        // 添加到已选笼子编号数组
        this.submitform.cage_number.push(cageNumber);
        // 增加已选笼子数量
        this.submitform.count++;
      } else {
        // 如果单元格已被选中，移除
        this.activeCells.splice(cellIndex, 1);
        // 从已选笼子编号数组中移除
        const numberIndex = this.submitform.cage_number.indexOf(cageNumber);
        if (numberIndex !== -1) {
          this.submitform.cage_number.splice(numberIndex, 1);
          // 减少已选笼子数量，但确保不会小于0
          this.submitform.count = Math.max(0, this.submitform.count - 1);
        }
      }
    },

    handleUsedCellClick(row, column) {
      let cellKey = { row: row.row, column: column.property };
      if (!row.row) {
        cellKey = { row: row, column: column };
      }
      this.activeCells.push({ ...cellKey, type: 'used' });
    },

    handleReservedCellClick(row, column) {
      let cellKey = { row: row.row, column: column.property };
      if (!row.row) {
        cellKey = { row: row, column: column };
      }
      this.activeCells.push({ ...cellKey, type: 'reserved' });
    },

    handleLockedCellClick(row, column) {
      let cellKey = { row: row.row, column: column.property };
      if (!row.row) {
        cellKey = { row: row, column: column };
      }
      this.activeCells.push({ ...cellKey, type: 'locked' });
    },

    getCellClassName({ row, columnIndex, column }) {
      // 确保columnIndex有效且this.columns数组不为空
      if (columnIndex <= 0 || !this.columns || this.columns.length === 0) {
        return 'default-cell';
      }
      
      const colKey = this.columns[columnIndex - 1]; // 列名，从索引获取
      if (!colKey) {
        return 'default-cell';
      }
      
      // 计算当前单元格的编号
      const cageNumber = (row.row - 1) * this.columns.length + (colKey.charCodeAt(0) - 'A'.charCodeAt(0));
      
      // 检查是否是自持笼位
      const isReserved = this.reservedCageNumbers && this.reservedCageNumbers.includes(cageNumber);
      
      // 检查是否是锁定笼位
      const isLocked = this.lockedCageNumbers && this.lockedCageNumbers.includes(cageNumber);
      
      // 检查是否被选中（红色高亮）
      const isSelected = this.activeCells.some(
        (cell) => cell.row === row.row && cell.column === colKey
      );
      
      // 检查是否是已使用的笼位（黄色高亮）
      const isUsed = this.activecage && this.activecage.includes(cageNumber);
      
      // 如果是自持笼位模式
      if (this.submitform.type === 'false') {
        if (isReserved) {
          // 如果是自持笼位，根据是否被选中显示不同颜色
          return isSelected ? 'highlight-red' : 'highlight-blue';
        }
        // 非自持笼位显示默认样式
        return 'default-cell';
      }
      
      // 如果是自持笼位，返回蓝色高亮样式
      if (isReserved) {
        return 'highlight-blue';
      }
      
      // 如果是锁定笼位，返回灰色高亮样式
      if (isLocked) {
        return 'highlight-gray';
      }
      
      // 如果是已使用的笼位，返回黄色高亮样式
      if (isUsed) {
        return 'highlight';
      }
      
      // 如果被选中，返回红色高亮样式
      if (isSelected) {
        return 'highlight-red';
      }
      
      // 否则返回默认样式
      return 'default-cell';
    },

    generateTableData() {
      this.tableData = [];
      this.activeCells = [];
      for (let i = 1; i <= this.rows; i++) {
        let rowData = { row: i };
        this.columns.forEach((col) => {
          rowData[col] = `${col}${i}`;
        });
        this.tableData.push(rowData);
      }
    },

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
    getCageUsed(id) {
      try {
        return new Promise((resolve, reject) => {
          getCageused({ cage_rack_id: id })
            .then((res) => {
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

    getTenementList() {
      return new Promise((resolve, reject) => {
        getTenement({ page: 1, pageSize: 1000 })
          .then((res) => {
            this.tenementList = res.data.content;
            resolve();
          })
          .catch(() => {});
      });
    },

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

    async getRackList(id) {
      try {
        const res = await getRack({ roomId: id, page: 1, pageSize: 1000 });
        this.cageList = res.data.content;
      } catch (error) {
        console.error(error);
      }
    },

    async init() {
      try {
        await Promise.all([this.getCampusList(), this.getTenementList(), this.getLaboratoryList()]);
        // console.log(this.campusList, this.tenementList, this.laboratoryList);
        this.AllcampusList = this.campusList;
        this.AlltenementList = this.tenementList;
        this.AlllaboratoryList = this.laboratoryList;
        this.AllcageList = this.cageList;
      } catch (error) {
        this.loading = false;
        console.error(error);
      }
    },

    // 获取自持笼位编号
    getReservedCageNumbers(id) {
      try {
        return new Promise((resolve, reject) => {
          getReservedCage2({ 
            cage_rack_id: id,
            user_id: store.getters.member.id 
          })
            .then((res) => {
              this.reservedCageNumbers = res.data;
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

    // 获取锁定笼位编号
    getLockedCageNumbers(id) {
      try {
        return new Promise((resolve, reject) => {
          getLockedCageNumber({ cage_rack_id: id })
            .then((res) => {
              this.lockedCageNumbers = res.data;
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

    // 获取饲养服务列表
    async getFeedServiceList() {
      try {
        const res = await getFeedService({
          page_size: 100,
          area_type: '区',
          no_deleted: true,
          page: 1
        });
        if (res.status === 1) {
          this.feedServiceList = res.data.content;
        }
      } catch (error) {
        console.error('获取饲养服务列表失败:', error);
      }
    },

    handleCareServiceChange(value) {
      const selectedService = this.feedServiceList.find(service => service.id === value);
      if (selectedService) {
        // 更新饲养价格
        this.feedPrice = selectedService.price;
        // 强制更新总价计算
        this.$forceUpdate();
      }
    }
  },
};
</script>
        
      <style>
/* 默认单元格样式 */
.default-cell {
  background-color: #f9f9f9 !important;
  /* 浅灰色 */
}

.el-table tbody tr:hover>td {
  background: #f9f9f9 !important;
}

/* 高亮单元格样式 */
.highlight {
  background-color: #ffd04b !important;
  /* 黄色 */
  color: #ffffff !important;
  /* 白色文字 */
}

/* 红色高亮 */
.highlight-red {
  background-color: red !important;
  /* 设置背景为红色 */
  color: white !important;
  /* 可选，设置文本颜色为白色，保证红色背景下文字清晰可见 */
}

/* 蓝色高亮 */
.highlight-blue {
  background-color: #409EFF !important;
  /* 设置背景为蓝色 */
  color: white !important;
  /* 设置文本颜色为白色，保证蓝色背景下文字清晰可见 */
}

/* 灰色高亮 */
.highlight-gray {
  background-color: #909399 !important;
  /* 设置背景为灰色 */
  color: white !important;
  /* 设置文本颜色为白色，保证灰色背景下文字清晰可见 */
}
</style>