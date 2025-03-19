<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="一卡通号">
        <el-input
          v-model="queryForm.card_no"
          class="max-width-150"
          size="small"
          clearable
          placeholder="一卡通号"
        />
      </el-form-item>
      <el-form-item label="有无开大门权限">
        <el-select
          v-model="queryForm.main_gate"
          size="small"
          class="max-width-150"
          placeholder="是否有打开大门权限"
        >
          <el-option label="有" :value="1"></el-option>
          <el-option label="无" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户">
        <el-select
          v-model="queryForm.user_id"
          :filterable="true"
          :clearable="true"
          size="small"
          class="max-width-150"
          placeholder="用户"
        >
          <el-option
            v-for="(user, userIndex) in allUsers"
            :key="userIndex"
            :label="user.name"
            :value="user.id"
          />
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
          <el-option
            :label="factory.name"
            :value="factory.id"
            :key="idx"
            v-for="(factory, idx) in getSelectableFactories()"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button round size="small" @click="resetQuery">查询</el-button>
      </el-form-item>
      <el-form-item v-if="checkNode('add_card')" class="right">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-unlock"
          @click="
            (_) => {
              getUnlock();
              unlockVisible = true;
            }
          "
          >万能解锁卡</el-button
        >
        <el-button type="primary" size="small" icon="el-icon-plus" @click="toAdd(0)"
          >添加新卡</el-button
        >
      </el-form-item>
    </el-form>
    <el-table :header-cell-style="{ background: '#fafafa' }" :data="list" style="width: 100%">
      <el-table-column width="100px" type="index" :index="indexMethod" label="序号" />
      <el-table-column prop="card_no" label="一卡通号" />
      <el-table-column prop="user_name" label="绑定用户" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.user_name != '-'">
            {{ scope.row.user_name }}<br />
            <el-button type="danger" size="mini" @click="deleteUserBind(scope.row)"
              >解除绑定</el-button
            >
          </div>
          <el-tag v-else type="warning" size="small">未绑定</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="大门权限">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.main_gate == 1">有权限</el-tag>
          <el-tag type="danger" v-else>无权限</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="授权科研组室">
        <template slot-scope="scope">
          <el-tag
            class="room-tag"
            @close="cancelAuth(item.id)"
            v-for="(item, index) in scope.row.permissions"
            :key="index"
            closable
            >{{ item.platform_room_name }}</el-tag
          >
          <span v-if="scope.row.permissions.length === 0">无</span>
        </template>
      </el-table-column>
      <el-table-column prop="expired_at" label="过期时间" />
      <el-table-column prop="factory_id" label="单位">
        <template slot-scope="scope">
          {{ getFactoryName(scope.row.factory_id) }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="checkNode('door_auth') || checkNode('edit_card') || checkNode('delete_card')"
        fixed="right"
        width="220"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button v-if="checkNode('door_auth')" size="mini" @click="doorAuth(scope.row)"
            >授权</el-button
          >
          <el-button
            v-if="checkNode('edit_card')"
            size="mini"
            type="primary"
            @click="toAdd(scope.row.id)"
            >修改</el-button
          >
          <el-button
            v-if="checkNode('delete_card') && scope.row.is_deleted === 0"
            size="mini"
            type="danger"
            @click="handleDelete(scope.row, 1)"
            >删除</el-button
          >
          <el-button
            v-if="checkNode('delete_card') && scope.row.is_deleted === 1"
            size="mini"
            type="info"
            @click="handleDelete(scope.row, 0)"
            >恢复</el-button
          >
        </template>
      </el-table-column>
      <div slot="empty">
        <empty />
      </div>
    </el-table>
    <el-pagination
      class="dl-pagination"
      :hide-on-single-page="true"
      background
      :page-sizes="[10, 30, 50]"
      layout="total, prev, pager, next, sizes, jumper"
      :total="total"
      :current-page="queryForm.page"
      :page-size="queryForm.size"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-dialog title="门禁授权" :visible.sync="dialogFormVisible">
      <el-form ref="addForm" :model="addForm" :rules="rules">
        <el-form-item label="一卡通号">
          {{ current.card_no }}
        </el-form-item>
        <el-form-item label="授权门禁" prop="platform_room_id">
          <el-select v-model="addForm.platform_room_id" size="small" placeholder="请选择授权门禁">
            <el-option
              v-for="item in roomList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="过期时间" prop="expired_at">
          <el-date-picker
            size="small"
            v-model="addForm.expired_at"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions"
            placeholder="选择有效截止日期"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAuth('addForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="万能解锁卡" :visible.sync="unlockVisible">
      <el-form>
        <el-form-item label="一卡通号">
          <el-input class="max-width-300" v-model="unlockForm.value" size="small"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="unlockVisible = false">取 消</el-button>
        <el-button type="primary" @click="setUnlock()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  cardList,
  deleteCard,
  addPermission,
  deletePermission,
  unbindCard,
  updateUnlockAdmin,
} from '@/api/card';
import { platformRoomList } from '@/api/platform';
import { allUsers } from '@/api/user.js';
import { checkNode } from '@/utils/validate';
import { settingInfo, settingUpdate } from '@/api/system';
import Empty from '@/components/Empty';

export default {
  components: {
    Empty,
  },
  data() {
    return {
      loading: false,
      checked: false,
      dialogFormVisible: false,
      unlockVisible: false,
      current: {},
      allUsers: [],
      queryForm: {
        page: 1,
        size: 10,
        user_id: '',
        sort: 'created_at',
        sort_type: 'desc',
        card_no: '',
        main_gate: '',
        factory_id: '',
      },
      addForm: {
        card_id: '',
        platform_room_id: '',
        expired_at: '',
      },
      unlockForm: {
        type: 'admin_card',
        value: '',
      },
      rules: {
        platform_room_id: [
          {
            required: true,
            message: '请选择授权门禁',
            trigger: 'change',
          },
        ],
        expired_at: [
          {
            required: true,
            message: '请选择过期时间',
            trigger: 'change',
          },
        ],
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        },
      },
      list: [],
      roomList: [],
      total: 0,
    };
  },
  created() {
    this.queryForm.factory_id = this.currentFactoryId;
    this.queryList();
    this.queryRoomList();
    this.loadUsers();
    this.getUnlock();
  },
  methods: {
    loadUsers() {
      // console.log('load users')
      allUsers().then((res) => {
        if (res.status == 200) {
          this.allUsers = res.data.users;
        }
      });
    },
    queryList() {
      this.loading = true;
      cardList(this.queryForm)
        .then((res) => {
          this.loading = false;
          if (res.status === 200) {
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
    queryRoomList() {
      platformRoomList({
        page: 1,
        size: 1000,
        sort: 'created_at',
        sort_type: 'desc',
        is_deleted: 0,
      }).then((res) => {
        if (res.status === 200) this.roomList = res.data.data;
      });
    },
    deleteUserBind(card) {
      this.$confirm('确定解除用户' + card.user_name + ' 的 ' + card.card_no + ' 卡吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        unbindCard({
          id: card.id,
        }).then((response) => {
          if (response.status === 1) {
            this.queryList();
          }
        });
      });
    },
    handleDelete(row, status) {
      const text = status === 0 ? '恢复' : '删除';
      this.$confirm('确定要' + text + '一卡通"' + row.card_no + '"吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deleteCard({
          id: row.id,
          is_deleted: status,
        }).then((response) => {
          if (response.status === 1) {
            this.queryList();
          }
        });
      });
    },
    cancelAuth(id) {
      const loading = this.$loading({
        lock: true,
        text: '解除授权中...',
        spinner: 'el-icon-loading',
        background: 'rgba(255,255,255,0.8)',
      });
      deletePermission({
        id,
      }).then((res) => {
        loading.close();
      });
    },
    addAuth(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: '授权中...',
            spinner: 'el-icon-loading',
            background: 'rgba(255,255,255,0.8)',
          });
          addPermission(this.addForm).then((res) => {
            loading.close();
            if (res.status === 1) {
              this.dialogFormVisible = false;
            }
            this.queryList();
          });
        }
      });
    },
    doorAuth(item) {
      this.current = item;
      this.addForm.card_id = item.id;
      this.addForm.platform_room_id = '';
      this.addForm.expired_at = '';
      this.dialogFormVisible = true;
    },
    getUnlock() {
      settingInfo(this.unlockForm).then((res) => {
        if (res.status === 200) {
          this.unlockForm.value = res.data.value;
        }
      });
    },
    setUnlock() {
      updateUnlockAdmin(this.unlockForm).then((res) => {
        this.unlockVisible = false;
      });
    },
    toAdd(id = '') {
      if (!id) {
        this.$router.push({
          path: '/system/card/add',
        });
      } else {
        this.$router.push({
          path: '/system/card/edit/' + id,
        });
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
    indexMethod(index) {
      return index + (this.queryForm.page - 1) * this.queryForm.size + 1;
    },
    checkNode(node) {
      return checkNode(node);
    },
  },
};
</script>
<style scoped>
.room-tag {
  margin-bottom: 5px;
}

.room-tag:last-child {
  margin-bottom: 0;
}
</style>
