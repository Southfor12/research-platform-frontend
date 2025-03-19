<template>
  <div v-loading="loading" class="app-container" element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading">
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="姓名">
        <el-input v-model="queryForm.name" class="max-width-150" size="small" clearable />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="queryForm.mobile" class="max-width-150" size="small" clearable />
      </el-form-item>
      <el-form-item label="职工号/学号">
        <el-input v-model="queryForm.no" class="max-width-150" size="small" clearable />
      </el-form-item>
      <el-form-item label="科研组室">
        <el-select v-model="queryForm.platform_id" :clearable="true" size="small" class="max-width-150" placeholder="科研组室"
          filterable>
          <el-option :label="platform.name" :value="platform.id" v-for="(platform, platformIndex) in allPlatforms"
            :key="platformIndex"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="queryForm.is_inner" :clearable="true" size="small" class="max-width-150" placeholder="用户类型">
          <el-option label="院内" value="1"></el-option>
          <el-option label="院外" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="身份">
        <el-select v-model="queryForm.type" :clearable="true" size="small" class="max-width-150" placeholder="用户类型">
          <el-option label="学生" value="2"></el-option>
          <el-option label="导师" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="queryForm.status" :clearable="true" size="small" class="max-width-150" placeholder="状态">
          <el-option label="待审核" value="0"></el-option>
          <el-option label="已通过" value="1"></el-option>
          <el-option label="未通过" value="-1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="单位">
        <el-select
          v-model="queryForm.factory_id"
          :clearable="false"
          size="small"
          class="max-width-150"
          placeholder="单位"
        >
          <el-option :label="factory.name" :value="factory.id" :key="idx" v-for="(factory,idx) in getSelectableFactories()"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button round size="small" @click="resetQuery">查询</el-button>
        <el-button round size="small" @click="exportData">导出</el-button>
      </el-form-item>
    </el-form>
    <el-form :inline="true" :model="queryForm"> </el-form>
    <el-table :header-cell-style="{ background: '#fafafa' }" :data="list" style="width: 100%">
      <el-table-column width="100px" type="index" :index="indexMethod" label="序号" />
      <el-table-column prop="name" label="用户">
        <template slot-scope="scope">
          姓名: {{ scope.row.name }}<br />
          <div v-if="scope.row.is_inner == 1">
            <span v-if="scope.row.type == 1">职工号: {{ scope.row.no }}</span>
            <span v-else>学生号: {{ scope.row.no || '-' }}</span>
            <br />
            <span v-if="scope.row.type == 2">导师: {{ scope.row.mentor_name || '-' }}</span><br />
            <span v-if="scope.row.type == 2">电话: {{ scope.row.mentor_mobile || '-' }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="mobile" label="手机号">
        <template slot-scope="scope">
          <el-link @click="
              editUser.id = scope.row.id;
              editUser.mobile = '';
              showEditMobile = true;
            " v-if="false && checkNode('edit_verify_user') && scope.row.status == 1"
            type="primary">{{ scope.row.mobile }}</el-link>
          <span v-else>{{ scope.row.mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="platform_name" label="科研组室" />

      <el-table-column label="人员类型">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.is_inner == 1 && scope.row.type == 1"><!-- 院内导师 -->
            院内{{ getUserType(scope.row.type) }}
          </el-tag>
          <el-tag v-else-if="scope.row.is_inner == 1 && scope.row.type == 2"><!-- 院内学生 -->
            院内{{ getUserType(scope.row.type) }}
          </el-tag>
          <el-tag v-else type="info">院外人员</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="平台考核" align="center">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.is_trained == 1"> 已通过 </el-tag>
          <el-tag type="danger" v-else>未通过</el-tag>
          <span v-if="scope.row.is_trained == 1 && scope.row.train_expired_at">
            <br />
            有效期至 <br />
            {{ scope.row.train_expired_at.substr(0, 10) }}<br />
            {{ scope.row.train_expired_at.substr(11) }}<br />
          </span>
        </template>
      </el-table-column>
      <el-table-column label="审核状态">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.status === 1">已通过</el-tag>
          <el-tag type="danger" v-if="scope.row.status === -1">未通过</el-tag>
          <div v-if="scope.row.status === 0">
            <el-tag type="info" v-if="scope.row.type === 2 && scope.row.is_join_research_group === 0">待导师审核</el-tag>
            <el-tag type="info" v-else>待审核</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="discount" label="折扣(%)">
        <template slot-scope="scope">
          {{scope.row.discount}}
        </template>
      </el-table-column>
      <el-table-column prop="factory_id" label="单位">
        <template slot-scope="scope">
          {{getFactoryName(scope.row.factory_id)}}
        </template>
      </el-table-column>
      <el-table-column v-if="checkNode('admin_verify_do') || checkNode('edit_verify_user')" width="200" label="操作">
        <template slot-scope="scope">
          <el-form :inline="true">
            <!-- 审核通过的用户才能修改 -->
            <el-form-item v-if="checkNode('edit_verify_user') && scope.row.status == 1" style="margin-bottom: 0">
              <el-button size="mini" type="primary" @click="toEdit(scope.row.id)">修改</el-button>
              <el-button v-if="scope.row.type == 2" size="mini" type="primary" @click="doTransIntoMentor(scope.row)">转导师
              </el-button>
            </el-form-item>
            <!-- 学生必须先通过导师审核，然后才能通过平台审核；平台审核通过钱必须先通过平台考核 -->
            <el-form-item v-if="checkNode('admin_verify_do') && scope.row.status != 1" style="margin-bottom: 0">
              <!-- <el-button v-if="scope.row.type === 2 && scope.row.status === 0 && scope.row.is_join_research_group === 0" size="mini" type="primary" @click="auditForMentor(scope.row)">代导师审核
              </el-button> -->
              <el-button v-if="
                  !(
                    scope.row.type === 2 &&
                    scope.row.status === 0 &&
                    scope.row.is_join_research_group === 0
                  )
                " size="mini" type="primary" @click="audit(scope.row)" :disabled="scope.row.is_trained == 0">平台审核
              </el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="danger" size="mini" @click="showDeleteUser(scope.row)">注销</el-button>
            </el-form-item>
            <el-form-item>
              <el-button :type="scope.row.booking_status == 1 ? 'danger' : 'success'" size="mini"
                @click="editBookingStatus(scope.row)">{{ scope.row.booking_status == 1 ? '禁止预约' : '恢复预约' }}</el-button>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <div slot="empty">
        <empty />
      </div>
    </el-table>
    <el-pagination class="dl-pagination" :hide-on-single-page="true" background :page-sizes="[10, 30, 50]"
      layout="total, prev, pager, next, sizes, jumper" :total="total" :current-page="queryForm.page"
      :page-size="queryForm.size" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    <el-dialog :title="queryScoreForm.user_name + '的信用分记录'" :fullscreen="true" :visible.sync="dialogScoreVisible">
      <el-table :header-cell-style="{ background: '#fafafa' }" :data="scoreList" style="width: 100%">
        <el-table-column width="100px" type="index" :index="scoreIndexMethod" label="序号" />
        <el-table-column width="100px" prop="user_name" label="姓名" />
        <el-table-column width="100px" prop="score" label="分值" />
        <el-table-column width="100px" label="类型">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type === 1">奖励</el-tag>
            <el-tag v-else type="danger">扣分</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="note" min-width="200px" label="描述" />
        <el-table-column prop="created_at" label="时间" />
        <div slot="empty">
          <empty />
        </div>
      </el-table>
      <el-pagination class="dl-pagination" :hide-on-single-page="true" background
        layout="total, prev, pager, next, jumper" :total="scoreTotal" :current-page="queryScoreForm.page"
        :page-size="queryScoreForm.size" @current-change="handleScoreChange" />
    </el-dialog>

    <el-dialog title="用户审核" :visible.sync="showAudit" width="80%">
      <el-form ref="audit_form" label-width="80px">
        <el-form-item label="姓名">
          {{ user.name }}
        </el-form-item>
        <el-form-item label="手机号">
          <span>{{ user.mobile }}</span>
        </el-form-item>
        <el-form-item label="用户来源">
          <el-tag>{{ user.is_inner == 1 ? '院内人员' : '院外人员' }}</el-tag>
        </el-form-item>
        <el-form-item label="用户类型" v-if="user.is_inner">
          <el-tag>{{ user.type == 1 ? '职工' : '学生' }}</el-tag>
        </el-form-item>
        <el-form-item :label="user.type == 1 ? '职工号' : '学生号'" v-if="user.is_inner == 1">
          <span>{{ user.no }}</span>
        </el-form-item>
        <!-- <el-form-item label="课题名称" v-if="user.type != 2">
          <span>{{user.research_group_name}}</span>
        </el-form-item> -->
        <el-form-item label="所属科研组室" v-if="user.is_inner == 1">
          <span>{{ user.platform_name }}</span>
        </el-form-item>
        <el-form-item label="单位" v-if="user.is_inner == 0">
          <span>{{ user.unit }}</span>
        </el-form-item>
        <el-form-item label="部门" v-if="user.is_inner == 0">
          <span>{{ user.department }}</span>
        </el-form-item>

        <el-form-item label="备注">
          <el-input v-model="note" type="textarea" :rows="5"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="doAudit(-1)">拒绝</el-button>
        <el-button type="primary" @click="doAudit(1)">通过</el-button>
      </span>
    </el-dialog>

    <el-dialog title="重置手机号（仅用于换导师用户）" :visible.sync="showEditMobile" width="30%">
      <el-form ref="audit_form" label-width="100px">
        <el-form-item label="手机号">
          <el-input v-model="editUser.mobile" size="small" clearable />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showEditMobile = false">取消</el-button>
        <el-button type="primary" @click="editMobile">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {
    platformScoreRecordList,
    allPlatforms
  } from '@/api/platform';
  import {
    researchGroupAuditByAdmin
  } from '@/api/research';
  import {
    userList,
    userScoreList,
    audit,
    userInfo,
    transIntoMentor,
    deleteUser,
    userExport,
    editBookingStatus,
    editMobile,
  } from '@/api/user';
  import {
    checkNode
  } from '@/utils/validate';
  import Empty from '@/components/Empty';

  export default {
    components: {
      Empty,
    },
    data() {
      return {
        user: {},
        note: '',
        showAudit: false,
        loading: false,
        showEditMobile: false,
        dialogScoreVisible: false,
        allPlatforms: [],
        queryForm: {
          type: '', //身份，1导师，2学生
          page: 1,
          size: 10,
          sort: 'created_at',
          sort_type: 'desc',
          mobile: '',
          name: '',
          no: '',
          is_inner: '',
          mentor_name: '',
          status: '',
          factory_id: '',
        },
        queryScoreForm: {
          page: 1,
          size: 10,
          platform_id: '',
          user_id: '',
          user_name: '',
          is_deleted: 0,
        },
        list: [],
        scoreList: [],
        verifyArr: new Array(),
        total: 0,
        scoreTotal: 0,
        editUser: {
          id: 0,
          mobile: ''
        },
      };
    },
    created() {
      this.queryForm.factory_id = this.currentFactoryId;
      this.queryList();
      this.loadAllPlatforms();
    },
    methods: {
      showDeleteUser(user) {
        this.$confirm(
          `确定要注销用户[${user.name}]吗？\n一旦注销，用户数据不可恢复，跟用户相关的所有数据都会清空，请谨慎操作！`,
          '注销提醒', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          },
        ).then(() => {
          deleteUser({
            id: user.id,
            is_deleted: 1,
          }).then((res) => {
            this.queryList();
          });
        });
      },
      auditForMentor(row) {
        this.$confirm('确定要代替导师审核通过吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          researchGroupAuditByAdmin({
            user_id: row.id,
          }).then((res) => {
            this.queryList();
          });
        });
      },
      doTransIntoMentor(row) {
        this.$confirm(
          '确定要把' + row.name + '的身份从学生转变成导师(院内职工)？该操作不可逆，请谨慎操作！',
          '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          },
        ).then(() => {
          this.$confirm(
            '你是否100%清晰你正在进行的操作，并明确此行为会产生的后果?你将对此操作承担一切责任。',
            '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'error',
            },
          ).then(() => {
            transIntoMentor({
              user_id: row.id,
            }).then((res) => {
              this.queryList();
            });
          });
        });
      },
      loadAllPlatforms() {
        allPlatforms().then((res) => {
          if (res.status == 200) {
            this.allPlatforms = res.data.platforms;
          }
        });
      },
      queryList() {
        this.loading = true;
        userList(this.queryForm)
          .then((res) => {
            this.loading = false;
            if (res.status === 200) {
              this.verifyArr = new Array(res.data.data.length);
              this.list = res.data.data;
              this.total = res.data.total;
            }
          })
          .catch((_) => {
            this.loading = false;
          });
      },
      resetQuery() {
        this.queryForm.page = 1;
        this.queryList();
      },
      //导出数据为excel
      exportData() {
        let vm = this;
        let params = Object.keys(this.queryForm)
          .map(function(key) {
            return encodeURIComponent(key) + '=' + encodeURIComponent(vm.queryForm[key]);
          })
          .join('&');
        let url = process.env.VUE_APP_BASE_API + '/user/export?from=fronted&' + params;
        window.open(url);
      },
      //点击审核按钮触发的函数
      audit(user) {
        this.user = user;
        this.showAudit = true;
        this.note = user.note;
      },
      //审核通过或拒绝触发函数
      doAudit(status) {
        const text = status == 1 ? '通过' : '拒绝';
        this.$confirm('确定要审核' + text + this.user.name + '的账号吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
          .then(() => {
            audit({
              user_id: this.user.id,
              status: status,
              note: this.note,
            }).then((response) => {
              if (response.status === 1) {
                this.showAudit = false;
                this.user = {};
                this.note = '';
                this.queryList();
              }
            });
          })
          .catch((e) => {
            //取消
          });
      },
      editMobile() {
        editMobile(this.editUser).then((res) => {
          if (res.status == 1) {
            this.showEditMobile = false;
            this.queryList();
          }
        });
      },
      handleAudit(flag, scope) {
        if (!flag && this.verifyArr[scope.$index]) {
          const status = this.verifyArr[scope.$index];
          const text = status === '1' ? '通过' : '拒绝';
          this.$confirm('确定要' + text + scope.row.name + '的请求吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            audit({
              user_id: scope.row.id,
              status: status,
            }).then((response) => {
              if (response.status === 1) {
                this.queryList();
              }
            });
          });
        }
      },
      editBookingStatus(row) {
        let status = row.booking_status == 1 ? 0 : 1;
        editBookingStatus({
          id: row.id,
          status: status
        }).then((res) => {
          if (res.status === 1) {
            row.booking_status = status;
          }
        });
      },
      toEdit(id) {
        this.$router.push({
          path: '/system/verify/edit/' + id,
        });
      },
      toScoreList(row) {
        this.scoreList = [];
        this.queryScoreForm.user_name = row.name;
        this.queryScoreForm.user_id = row.id;
        this.queryScoreForm.page = 1;
        this.queryScoreList();
        this.dialogScoreVisible = true;
      },
      queryScoreList() {
        userScoreList(this.queryScoreForm).then((res) => {
          if (res.status === 200) {
            this.scoreList = res.data.data;
            this.scoreTotal = res.data.total;
          }
        });
      },
      getUserType(type) {
        switch (type) {
          case 1:
            return '职工';
          case 2:
            return '学生';
        }
      },
      handleSizeChange(val) {
        this.queryForm.size = val;
        this.queryList();
      },
      handleCurrentChange(val) {
        this.queryForm.page = val;
        this.queryList();
      },
      handleScoreChange(val) {
        this.queryScoreForm.page = val;
        this.queryScoreList();
      },
      indexMethod(index) {
        return index + (this.queryForm.page - 1) * this.queryForm.size + 1;
      },
      scoreIndexMethod(index) {
        return index + (this.queryScoreForm.page - 1) * this.queryScoreForm.size + 1;
      },
      checkNode(node) {
        return checkNode(node);
      },
    },
  };
</script>
