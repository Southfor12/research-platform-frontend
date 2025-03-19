<template>
  <div
    style="overflow: hidden"
    v-loading="loading"
    class="app-container"
    element-loading-text="数据处理中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-container style="height: 600px">
      <!-- 左侧侧边栏 -->
      <el-aside width="200px">
        <el-menu default-active="section1" :router="false" @select="scrollToSection">
          <el-menu-item index="section1"><i class="el-icon-menu"></i>基础信息</el-menu-item>
          <el-menu-item index="section2"><i class="el-icon-menu"></i>人员信息</el-menu-item>
          <el-menu-item index="section3"><i class="el-icon-menu"></i>资质/危险源/防护</el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 右侧滚动区域，设置为局部滚动 -->
      <el-main ref="mainContent" style="overflow-y: scroll; height: 100%; padding: 20px">
        <div id="section1" style="border-bottom: 1px solid #eaeaea">
          <h2>基础信息</h2>
          <!-- 校区、楼宇、房间号、二级单位 -->
          <el-form ref="form" :model="form" :rules="rules" label-width="150px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="实验室名称" prop="name">
                  <el-input v-model="form.name" size="big" class="width-200" />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="校区" prop="number">
                  <el-select
                    v-model="form.campus_name"
                    placeholder="请选择校区"
                    @change="handleCampusChange"
                  >
                    <el-option
                      v-for="item in campusList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.name"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="楼宇" prop="name">
                  <el-select
                    v-model="form.building_id"
                    placeholder="请选择楼宇"
                    @change="handleBuildingChange"
                  >
                    <el-option
                      v-for="item in tenementList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="楼层" prop="name">
                  <el-input v-model="form.floor_number" size="big" class="width-200" />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="房间号" prop="name">
                  <el-input v-model="form.room_number" size="big" class="width-200" />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="二级单位" prop="number">
                  <el-input v-model="form.unit" size="big" class="width-200" />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="是否用于实验" prop="number">
                  <el-select v-model="form.is_lab" size="big" class="width-200">
                    <el-option label="实验室" value="1"></el-option>
                    <el-option label="非实验室" value="0"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="分类" prop="number">
                  <el-select v-model="form.category" size="big" class="width-200">
                    <el-option label="生物（医学）类" value="生物（医学）类"></el-option>
                    <el-option label="化学类" value="化学类"></el-option>
                    <el-option label="辐射类" value="辐射类"></el-option>
                    <el-option label="机械类" value="机械类"></el-option>
                    <el-option label="电子（电气）类" value="电子（电气）类"></el-option>
                    <el-option label="其他类" value="其他类"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="安全风险等级" prop="number">
                  <el-select v-model="form.risk_level" size="big" class="width-200">
                    <el-option label="一级" value="1"></el-option>
                    <el-option label="二级" value="2"></el-option>
                    <el-option label="三级" value="3"></el-option>
                    <el-option label="四级" value="4"></el-option>
                    <el-option label="五级" value="5"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="用途" prop="number">
                  <el-select v-model="form.purpose" size="big" class="width-200">
                    <el-option label="教学" value="教学"></el-option>
                    <el-option label="科研" value="科研"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="使用面积" prop="number">
                  <el-input v-model="form.area" size="big" class="width-200" />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="使用状态" prop="number">
                  <el-select v-model="form.status" size="big" class="width-200">
                    <el-option label="开启" value="开启"></el-option>
                    <el-option label="停用" value="停用"></el-option>
                    <el-option label="整改中" value="整改中"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="级别" prop="number">
                  <el-select v-model="form.level" size="big" class="width-200">
                    <el-option label="一级" value="1"></el-option>
                    <el-option label="二级" value="2"></el-option>
                    <el-option label="三级" value="3"></el-option>
                    <el-option label="四级" value="4"></el-option>
                    <el-option label="五级" value="5"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col>
                <el-form-item label="实验室简介" prop="number">
                  <el-input
                    v-model="form.description"
                    type="textarea"
                    size="big"
                    class="width-500"
                    :rows="7"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div id="section2" style="height: 600px; border-bottom: 1px solid #eaeaea">
          <h2>人员信息</h2>

          <el-form ref="form" :model="form" :rules="rules" label-width="150px">
            <el-button type="primary" size="small" icon="el-icon-plus" @click="toAdd(0)"
              >绑定人员</el-button
            >

            <el-table
              :header-cell-style="{ background: '#fafafa' }"
              :data="form.manager"
              style="width: 100%"
            >
              <el-table-column width="100px" type="index" :index="indexMethod" label="编号" />
              <el-table-column prop="name" label="姓名" />
              <el-table-column prop="user_name" label="用户名" />
              <el-table-column prop="identity" label="身份" />
              <el-table-column prop="description" label="系统角色" />
              <el-table-column prop="mobile" label="电话" />
              <el-table-column prop="email" label="邮箱" />

              <el-table-column width="180" label="操作">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" @click="toEdit(scope.$index)"
                    >修改</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </div>
        <div id="section3" style="border-bottom: 1px solid #eaeaea">
          <h2>资质/危险源/防护</h2>
          <el-form ref="form" :model="form" :rules="rules" label-width="150px">
            <el-form-item class="right">
              <el-button
                type="primary"
                size="small"
                icon="el-icon-plus"
                @click="toAdd_(0)"
                style="background-color: chocolate"
                >编辑</el-button
              >
            </el-form-item>
          </el-form>

          <h4
            style="color: blue"
            v-if="
              dangerSource.radiation.length > 0 ||
              dangerSource.mechanical.length > 0 ||
              dangerSource.chemistry.length > 0 ||
              dangerSource.other.length > 0 ||
              dangerSource.biomedical.length > 0 ||
              dangerSource.electronic.length > 0
            "
          >
            危险源
          </h4>

          <div
            v-if="dangerSource.radiation.length > 0"
            style="
              display: inline-block;
              border: 1px solid darkgrey;
              border-radius: 10px;
              padding: 10px;
            "
          >
            <div style="background-color: aliceblue; padding: 5px">
              <span style="color: red; font-size: 18px; font-weight: bold; display: inline-block"
                >辐射类</span
              >
            </div>
            <list style="list-style-type: decimal">
              <li v-for="item in dangerSource.radiation" :key="item" style="margin-top: 10px">
                {{ item }};
              </li>
            </list>
          </div>

          <div
            v-if="dangerSource.mechanical.length > 0"
            style="
              display: inline-block;
              border: 1px solid darkgrey;
              border-radius: 10px;
              padding: 10px;
            "
          >
            <div style="background-color: aliceblue; padding: 5px">
              <span style="color: red; font-size: 18px; font-weight: bold; display: inline-block"
                >机械类</span
              >
            </div>
            <list style="list-style-type: decimal">
              <li v-for="item in dangerSource.mechanical" :key="item" style="margin-top: 10px">
                {{ item }};
              </li>
            </list>
          </div>

          <div
            v-if="dangerSource.electronic.length > 0"
            style="
              display: inline-block;
              border: 1px solid darkgrey;
              border-radius: 10px;
              padding: 10px;
            "
          >
            <div style="background-color: aliceblue; padding: 5px">
              <span style="color: red; font-size: 18px; font-weight: bold; display: inline-block"
                >电子(电气)类</span
              >
            </div>
            <list style="list-style-type: decimal">
              <li v-for="item in dangerSource.electronic" :key="item" style="margin-top: 10px">
                {{ item }};
              </li>
            </list>
          </div>

          <div
            v-if="dangerSource.biomedical.length > 0"
            style="
              display: inline-block;
              border: 1px solid darkgrey;
              border-radius: 10px;
              padding: 10px;
            "
          >
            <div style="background-color: aliceblue; padding: 5px">
              <span style="color: red; font-size: 18px; font-weight: bold; display: inline-block"
                >生物医学类</span
              >
            </div>
            <list style="list-style-type: decimal">
              <li v-for="item in dangerSource.biomedical" :key="item" style="margin-top: 10px">
                {{ item }};
              </li>
            </list>
          </div>

          <div
            v-if="dangerSource.chemistry.length > 0"
            style="
              display: inline-block;
              border: 1px solid darkgrey;
              border-radius: 10px;
              padding: 10px;
            "
          >
            <div style="background-color: aliceblue; padding: 5px">
              <span style="color: red; font-size: 18px; font-weight: bold; display: inline-block"
                >化学类</span
              >
            </div>
            <list style="list-style-type: decimal">
              <li v-for="item in dangerSource.chemistry" :key="item" style="margin-top: 10px">
                {{ item }};
              </li>
            </list>
          </div>

          <div
            v-if="dangerSource.other.length > 0"
            style="
              display: inline-block;
              border: 1px solid darkgrey;
              border-radius: 10px;
              padding: 10px;
            "
          >
            <div style="background-color: aliceblue; padding: 5px">
              <span style="color: red; font-size: 18px; font-weight: bold; display: inline-block"
                >其他类</span
              >
            </div>
            <list style="list-style-type: decimal">
              <li v-for="item in dangerSource.other" :key="item" style="margin-top: 10px">
                {{ item }};
              </li>
            </list>
          </div>

          <h4
            style="color: blue"
            v-if="dangerSource.note.length > 0 || dangerSource.fire.length > 0"
          >
            防护要点
          </h4>

          <div
            v-if="dangerSource.fire.length > 0"
            style="
              display: inline-block;
              border: 1px solid darkgrey;
              border-radius: 10px;
              padding: 10px;
            "
          >
            <div style="background-color: aliceblue; padding: 5px">
              <span style="color: red; font-size: 18px; font-weight: bold; display: inline-block"
                >灭火要点(注意:CO2灭火器限实验室内有单价30万元及以上贵重精密仪器设备)</span
              >
            </div>
            <list style="list-style-type: decimal">
              <li v-for="item in dangerSource.fire" :key="item" style="margin-top: 10px">
                {{ item }};
              </li>
            </list>
          </div>

          <div
            v-if="dangerSource.note.length > 0"
            style="
              display: inline-block;
              border: 1px solid darkgrey;
              border-radius: 10px;
              padding: 10px;
            "
          >
            <div style="background-color: aliceblue; padding: 5px">
              <span style="color: red; font-size: 18px; font-weight: bold; display: inline-block"
                >重要提示</span
              >
            </div>
            <list style="list-style-type: decimal">
              <li v-for="item in dangerSource.note" :key="item" style="margin-top: 10px">
                {{ item }};
              </li>
            </list>
          </div>
        </div>

        <div
          id="section4"
          style="height: 600px; border-bottom: 1px solid #eaeaea; margin-top: 100px"
        >
          <el-form ref="form" :model="form" :rules="rules" label-width="150px">
            <el-form-item>
              <el-button type="primary" size="small" @click="submit('form')">保 存</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-main>
    </el-container>
  </div>
</template>


<script>
import {
  addLaboratory,
  editLaboratory,
  get_a_Laboratory,
  getCourtyard,
  getTenement,
} from '@/api/colleges';
import { frontPlatformList, platformUserList } from '@/api/platform';
import { uploadUrl } from '@/api/public';
import { checkImgFile } from '@/utils/index';
import Tinymce from '@/components/Tinymce';
import List from '../../admin/apparatus/list.vue';

export default {
  components: {
    Tinymce,
  },
  data() {
    return {
      list: [],
      campusList: [],
      tenementList: [],
      allTenements: [],
      loading: false,
      dialogImageUrl: '',
      dialogVisible: false,
      uploadUrl: uploadUrl,
      form: {
        name: '',
        number: '',
        id: '',
        platform_id: '',
        campus_name: '',
        building_id: '',
        floor_number: '',
        room_number: '',
        unit: '',
        purpose: '',
        is_lab: '',
        area: '',
        status: '',
        description: '',
        category: '',
        risk_resource: '',
        risk_level: '',
        protection_points: '',
        level: '',
        manager: [],
        risk_resource: '',
        protection_points: '',
      },
      dangerSource: {
        radiation: [],
        mechanical: [],
        note: [],
        fire: [],
        chemistry: [],
        other: [],
        biomedical: [],
        electronic: [],
      },
      risk_resource_: {
        radiation: [],
        mechanical: [],
        chemistry: [],
        other: [],
        biomedical: [],
        electronic: [],
      },
      protection_points_: {
        note: [],
        fire: [],
      },
      users: [],
      types: [],
      platforms: [],
      rooms: [],
      rules: {
        // name: [
        //   {
        //     required: true,
        //     message: '请输入名称',
        //     trigger: 'blur',
        //   },
        // { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        // ],
      },
    };
  },
  created() {
    this.getTenementList();
    this.getcampusList();
    // console.log(this.dangerSource);
    if (
      this.$route.params.id &&
      !this.$route.query.form &&
      !this.$route.query.form_ &&
      !this.$route.query.danger
    )
      this.getInfo();
    // console.log(1111, this.dangerSource);
    if (this.$route.query.form_) {
      const form = JSON.parse(this.$route.query.form_);

      this.form = form;
    }

    console.log(333, this.$route.query.form);
    console.log(333, this.$route.query.form_);
    if (this.$route.query.form) {
      const form = JSON.parse(this.$route.query.form);

      this.form.manager = form;
    }
    if (this.$route.query.danger) {
      const danger = JSON.parse(this.$route.query.danger);

      this.dangerSource = danger;
      console.log(2222, this.dangerSource);
    }
    this.risk_resource_ = this.dangerSource;
    this.protection_points_ = this.dangerSource;
    this.form.risk_resource = JSON.stringify(this.risk_resource_);
    this.form.protection_points = JSON.stringify(this.protection_points_);
  },
  methods: {
    // 选择校区时更新楼宇列表
    handleCampusChange() {
      this.form.building_id = '';
      if (this.form.campus_name) {
        // 根据选择的校区更新楼宇列表
        this.tenementList = this.allTenements.filter(
          (item) => item.campus_name === this.form.campus_name
        );
      } else {
        // 如果没有选择校区，清空楼宇列表
        this.tenementList = [];
      }
    },

    // 选择楼宇时更新校区
    handleBuildingChange() {
      const selectedBuilding = this.allTenements.find((item) => item.id === this.form.building_id);
      if (selectedBuilding) {
        // 根据楼宇的 campus_id 自动更新对应的校区
        this.form.campus_name = selectedBuilding.campus_name;
      }
    },
    getTenementList() {
      this.loading = true;
      getTenement({ page: 1, pageSize: 1000 })
        .then((res) => {
          this.loading = false;
          this.tenementList = res.data.content;
          this.allTenements = this.tenementList;
        })
        .catch((_) => {
          this.loading = false;
        });
    },

    getcampusList() {
      this.loading = true;
      getCourtyard({ page: 1, pageSize: 1000 })
        .then((res) => {
          this.loading = false;
          this.campusList = res.data.content;
        })
        .catch((_) => {
          this.loading = false;
        });
    },

    toAdd(id = '') {
      if (this.$route.params.id)
        this.$router.push({
          name: 'adminLaboratoryAddPerson',
          params: { id: id + 1 },
          query: {
            danger: JSON.stringify(this.dangerSource),
            form: JSON.stringify(this.form),
            manager: JSON.stringify(this.form.manager),
          },
        });
      else
        this.$router.push({
          name: 'adminLaboratoryAddPerson',
          query: {
            danger: JSON.stringify(this.dangerSource),
            form: JSON.stringify(this.form),
            manager: JSON.stringify(this.form.manager),
          },
        });
    },

    toEdit(id) {
      if (this.$route.params.id)
        this.$router.push({
          name: 'adminLaboratoryEditPerson',
          params: { id: this.$route.params.id },
          query: {
            danger: JSON.stringify(this.dangerSource),
            form: JSON.stringify(this.form),
            id: id + 1,
            manager: JSON.stringify(this.form.manager),
          },
        });
      else
        this.$router.push({
          name: 'adminLaboratoryEditPerson',
          query: {
            danger: JSON.stringify(this.dangerSource),
            form: JSON.stringify(this.form),
            id: id + 1,
            manager: JSON.stringify(this.form.manager),
          },
        });
    },

    toAdd_(id = '') {
      if (this.$route.params.id)
        this.$router.push({
          name: 'adminLaboratoryEditDanger',
          params: { id: this.$route.params.id },
          query: {
            form: JSON.stringify(this.form),
            danger: JSON.stringify(this.dangerSource),
          },
        });
      else
        this.$router.push({
          name: 'adminLaboratoryEditDanger',
          query: { form: JSON.stringify(this.form), danger: JSON.stringify(this.dangerSource) },
        });
    },

    // 滚动到指定分类
    scrollToSection(sectionId) {
      const section = document.getElementById(sectionId);
      section.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    },
    // 处理右侧滚动，动态激活左侧菜单项
    handleScroll() {
      const sections = ['section1', 'section2', 'section3'];
      for (let sectionId of sections) {
        const section = document.getElementById(sectionId);
        const rect = section.getBoundingClientRect();

        if (rect.top >= 0 && rect.top <= 100) {
          // 移除旧的激活项
          const activeItem = this.$refs.menu.querySelector('.is-active');
          if (activeItem) {
            activeItem.classList.remove('is-active');
          }

          // 为当前项添加激活状态
          const newItem = this.$refs.menu.querySelector(`[index="${sectionId}"]`);
          if (newItem) {
            newItem.classList.add('is-active');
          }
          break;
        }
      }
    },

    // 修改
    getInfo() {
      this.form.id = this.$route.params.id;
      if (this.form.id) {
        get_a_Laboratory({
          id: this.form.id,
        }).then((response) => {
          const data = response.data;
          this.form = data;
          this.handleBuildingChange();
          this.dangerSource = JSON.parse(data.risk_resource);
          this.dangerSource = JSON.parse(data.protection_points);
        });
      } else {
        this.returnToList();
      }
    },
    submit(form) {
      if (this.$route.params.id || this.$route.query.id) {
        editLaboratory(this.form)
          .then((response) => {
            this.loading = false;
            if (response.status === 1) {
              this.returnToList();
            }
          })
          .catch((error) => {
            this.loading = false;
          });

        return;
      }
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.loading = true;
          addLaboratory(this.form)
            .then((response) => {
              this.loading = false;
              if (response.status === 1) {
                this.returnToList();
              }
            })
            .catch((error) => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
    returnToList() {
      this.$router.push({
        path: '/admin/colleges/laboratory',
      });
    },
    indexMethod(index) {
      return index + 1;
    },
  },
};
</script>
<style>
/* 强制 el-main 高度 100% */
.el-main {
  height: 100%;
}
</style>
