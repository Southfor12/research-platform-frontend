<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="仪器">
        <el-select
          v-model="queryForm.apparatus_id"
          size="small"
          clearable
          class="max-width-150"
          filterable
          remote
          reserve-keyword
          :remote-method="getApparatus"
          placeholder="输入名称搜索选择"
        >
          <el-option v-for="item in apparatus" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="审核状态">
        <el-select
          v-model="queryForm.status"
          :clearable="true"
          size="small"
          class="max-width-150"
          placeholder="审核状态"
        >
          <el-option label="待审核" value="0"></el-option>
          <el-option label="已通过" value="1"></el-option>
          <el-option label="已拒绝" value="2"></el-option>
          <el-option label="已取消" value="3"></el-option>
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
      </el-form-item>
    </el-form>
    <el-table :header-cell-style="{ background: '#fafafa' }" :data="list" style="width: 100%">
      <el-table-column width="100px" type="index" :index="indexMethod" label="序号" />
      <el-table-column prop="creator_name" label="预约人" />
      <el-table-column prop="user_name" label="实验操作人" />
      <el-table-column prop="apparatus_name" label="设备" />
      <el-table-column label="预约类型">
        <template slot-scope="scope">
          {{ scope.row.type === 1 ? '自主检测' : '送样检测' }}
        </template>
      </el-table-column>
      <el-table-column prop="discount_charge" label="预计费用" />
      <el-table-column label="实际费用">
        <template slot-scope="scope">
          {{ scope.row.is_charge === 1 ? scope.row.total_amount : '未结算' }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="预约时间段">
            <template slot-scope="scope">
                {{ scope.row.type === 1 ? scope.row.booking_time : '' }}
            </template>
        </el-table-column>
        <el-table-column label="耗材">
            <template slot-scope="scope">
                <span v-for="(item, index) in scope.row.reagents" :key="index">
                    {{ item.reagent_name }}{{ (scope.row.reagents.length - 1) > index ? '，' : '' }}
                </span>
                <span v-if="scope.row.reagents.length === 0">-</span>
            </template>
        </el-table-column>
        <el-table-column label="危化品">
            <template slot-scope="scope">
                <span v-for="(item, index) in scope.row.hcses" :key="index">
                    {{ item.reagent_name }}({{ item.level }}/{{ item.specification }}){{ (scope.row.hcses.length - 1) > index ? '，' : '' }}
                </span>
                <span v-if="scope.row.hcses.length === 0">-</span>
            </template>
        </el-table-column>
        <el-table-column label="自带耗材">
            <template slot-scope="scope">
                {{ scope.row.carry_reagents ? scope.row.carry_reagents : '-' }}
            </template>
        </el-table-column>
        <el-table-column label="自带危化品">
            <template slot-scope="scope">
                {{ scope.row.carry_hcses ? scope.row.carry_hcses : '-' }}
            </template>
        </el-table-column> -->
      <el-table-column label="审核状态" width="150">
        <template slot-scope="scope">
          <div v-if="scope.row.hcses.length > 0 && scope.row.status !== 3">
            <div class="hcs-status">
              <el-tag type="info" v-if="scope.row.auditor_status === 0">设备管理员待审核</el-tag>
              <el-tag type="success" v-if="scope.row.auditor_status === 1">设备管理员已通过</el-tag>
              <el-tag type="danger" v-if="scope.row.auditor_status === 2">设备管理员未通过</el-tag>
            </div>
            <div class="hcs-status">
              <el-tag type="info" v-if="scope.row.admin1_status === 0">负责人1待审核</el-tag>
              <el-tag type="success" v-if="scope.row.admin1_status === 1">负责人1已通过</el-tag>
              <el-tag type="danger" v-if="scope.row.admin1_status === 2">负责人1未通过</el-tag>
            </div>
            <div class="hcs-status">
              <el-tag type="info" v-if="scope.row.admin2_status === 0">负责人2待审核</el-tag>
              <el-tag type="success" v-if="scope.row.admin2_status === 1">负责人2已通过</el-tag>
              <el-tag type="danger" v-if="scope.row.admin2_status === 2">负责人2未通过</el-tag>
            </div>
          </div>
          <div v-else>
            <el-tag v-if="scope.row.status === 0">待审核</el-tag>
            <el-tag type="success" v-if="scope.row.status === 1">已通过</el-tag>
            <el-tag type="danger" v-if="scope.row.status === 2">未通过</el-tag>
            <el-tag type="info" v-if="scope.row.status === 3">已取消</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="管理员">
        <template slot-scope="scope">
          <div v-if="scope.row.hcses.length > 0">
            <div class="hcs-status">
              {{ scope.row.apparatus_admin_name }}
            </div>
            <div class="hcs-status">
              {{ scope.row.admin1_name }}
            </div>
            <div class="hcs-status">
              {{ scope.row.admin2_name }}
            </div>
          </div>
          <div v-else>
            {{ scope.row.apparatus_admin_name }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="factory_id" label="单位">
        <template slot-scope="scope">
          {{getFactoryName(scope.row.factory_id)}}
        </template>
      </el-table-column>
      <el-table-column fixed="right" width="180" label="操作">
        <template slot-scope="scope">
          <!-- <el-button
                    v-if="checkNode('edit_apparatus')"
                    size="mini"
                    type="primary"
                    @click="toAdd(scope.row.id)"
                >修改</el-button> -->
          <el-button
            v-if="checkNode('booking_examine') && scope.row.status === 0"
            size="mini"
            type="danger"
            @click="handleDelete(scope.row, 2)"
            >拒绝</el-button
          >
          <el-button
            v-if="checkNode('booking_examine') && scope.row.status === 0"
            size="mini"
            type="success"
            @click="handleDelete(scope.row, 1)"
            >通过</el-button
          >
          <div class="top-10">
            <el-button
              size="mini"
              @click="
                currentInfo = scope.row;
                infoDialogVisible = true;
              "
              >查看预约详情</el-button
            >
          </div>
          <div class="top-10">
            <el-button
              size="mini"
              @click="showDownload(scope.row)"
              >数据下载</el-button
            >
          </div>
          <!-- <div class="top-10" v-if="checkNode('booking_charge') && scope.row.status === 1 && scope.row.is_charge === 0">
            <el-button size="mini" type="success" @click="handleCharge(scope.row)">实验完成并扣费</el-button>
          </div> -->
          <div
            class="top-10"
            v-if="
              scope.row.user_id === member.id && scope.row.status < 2 && scope.row.can_cancel === 1
            "
          >
            <el-button size="mini" @click="handleCancleBooking(scope.row)">取消预约</el-button>
          </div>
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
    <el-dialog :title="auditText" :visible.sync="auditDialogVisible" :close-on-click-modal="false">
      <el-form v-if="auditForm.status == '2'" :model="auditForm">
        <el-form-item label="理由">
          <el-input
            type="textarea"
            v-model="auditForm.reason"
            size="small"
            :rows="3"
            class="width-50-percent"
            clearable
          />
        </el-form-item>
      </el-form>
      <span v-else>确定要通过预约吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="auditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="comfirmAudit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="实验完成并扣费"
      :visible.sync="chargeDialogVisible"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :rules="rules" :model="chargeForm" label-width="100">
        <el-form-item label="姓名">{{ currentBooking.user_name }}</el-form-item>
        <el-form-item label="设备">{{ currentBooking.apparatus_name }}</el-form-item>
        <el-form-item label="类型">{{
          currentBooking.type === 1 ? '自主检测' : '送样检测'
        }}</el-form-item>
        <el-form-item label="预计费用">{{ getPrice }}</el-form-item>
        <el-form-item label="实验日期" prop="date">
          <el-date-picker
            v-model="chargeForm.date"
            :picker-options="pickerOptions"
            type="date"
            @change="dateChange"
            value-format="yyyy-MM-dd"
            placeholder="请选择实验日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="实验起止时间" prop="timeRange">
          <el-time-picker
            is-range
            v-model="chargeForm.timeRange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择实验起止时间"
          >
          </el-time-picker>
        </el-form-item>
        <el-form-item label="追加金额">
          <el-input
            class="max-width-100"
            @change="appendChargeChange"
            type="number"
            :min="0"
            v-model="chargeForm.append_charge"
            size="small"
          />
        </el-form-item>
        <el-form-item label="优惠金额">
          <el-input
            class="max-width-100"
            @change="subtractChargeChange"
            type="number"
            :min="0"
            v-model="chargeForm.subtract_charge"
            size="small"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="chargeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="comfirmCharge('form')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="预约详细信息"
      width="80%"
      :visible.sync="infoDialogVisible"
      :close-on-click-modal="false"
    >
      <apparatus-info :form="currentInfo" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="infoDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="实验数据"
      width="80%"
      :visible.sync="showdownloading"
      :close-on-click-modal="false"
    >
      <el-table :header-cell-style="{ background: '#fafafa' }" :data="files" style="width: 100%">
        <el-table-column width="100px" type="index" :index="indexMethod" label="序号" />
        <el-table-column label="文件名称" >
            <template slot-scope="scope">
              <span>{{scope.row.name}}</span>
            </template>
        </el-table-column>
        <el-table-column prop="created_at" label="上传时间" />
        <el-table-column fixed="right" width="180" label="操作">
          <template slot-scope="scope">
            <div class="top-10">
              <el-button
                size="mini"
                @click="startDownLoad(scope.row.id)"
                >下载</el-button
              >
            </div>
          </template>
        </el-table-column>
       <!-- <div slot="empty">
          <empty />
        </div> -->
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import { apparatusList, bookingList, bookableUpdate } from '@/api/apparatus';
import { bookingCharge, bookingCancle, getMyBookingFiles } from '@/api/booking';
import { checkNode } from '@/utils/validate';
import { mapGetters } from 'vuex';
import { timeFormat } from '@/utils/index';
import Empty from '@/components/Empty';
import ApparatusInfo from '@/components/ApparatusInfo';

export default {
  components: {
    ApparatusInfo,
    Empty,
  },
  data() {
    return {
      loading: false,
      auditDialogVisible: false,
      chargeDialogVisible: false,
      infoDialogVisible: false,
      currentInfo: {},
      queryForm: {
        page: 1,
        size: 10,
        sort: 'created_at',
        sort_type: 'desc',
        apparatus_id: '',
        status: '',
        user_id: '',
        factory_id: '',
      },
      searchApparatusForm: {
        page: 1,
        size: 30,
        is_deleted: 0,
        name: '',
      },
      chargeForm: {
        id: '',
        apparatus_boot_at: '',
        apparatus_down_at: '',
        append_charge: 0,
        subtract_charge: 0,
        date: '',
        timeRange: [],
      },
      rules: {
        date: [
          {
            required: true,
            message: '请选择实验日期',
            trigger: 'change',
          },
        ],
        timeRange: [
          {
            required: true,
            message: '请选择实验起止时间',
            trigger: 'change',
          },
        ],
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      currentBooking: {
        discount_charge: 0,
      },
      auditText: '',
      auditForm: {
        id: '',
        status: '',
        reason: '',
      },
      domain: process.env.VUE_APP_DOMAIN,
      list: [],
      apparatus: [],
      total: 0,
      files: [],
      showdownloading: false,
    };
  },
  created() {
    this.queryForm.factory_id = this.currentFactoryId;
    this.queryForm.user_id = this.member.id;
    this.queryList();
  },
  computed: {
    ...mapGetters(['member']),
    getPrice() {
      return (
        Number(this.currentBooking.total_charge) +
        Number(this.chargeForm.append_charge) -
        Number(this.chargeForm.subtract_charge)
      );
    },
  },
  methods: {
    startDownLoad(userDataId)
    {
       window.open(process.env.VUE_APP_DOMAIN + "api/download-user-data?id="+userDataId)
    },
    showDownload(booking)
    {
      let booking_id = booking.id;

      this.showdownloading = true;

      getMyBookingFiles({
        booking_id
      }).then(res => {
        this.files = res.data;
      })
    },
    queryList() {
      this.loading = true;
      bookingList(this.queryForm)
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
    getApparatus(query = '') {
      this.searchApparatusForm.name = query;
      apparatusList(this.searchApparatusForm).then((res) => {
        if (res.status === 200) {
          this.apparatus = res.data.data;
        }
      });
    },
    dateChange(date) {
      if (this.currentBooking.type === 2 && date) {
        this.chargeForm.timeRange = [new Date(date + ' 00:00:00'), new Date(date + ' 23:59:59')];
      }
    },
    appendChargeChange(value) {
      if (!value || isNaN(value) || value < 0) {
        this.chargeForm.append_charge = 0;
      }
    },
    subtractChargeChange(value) {
      if (!value || isNaN(value) || value < 0) {
        this.chargeForm.subtract_charge = 0;
      }
    },
    handleCancleBooking(row) {
      this.$confirm('确定要取消预约吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        bookingCancle({
          id: row.id,
        }).then((res) => {
          if (res.status === 1) {
            this.queryList();
          }
        });
      });
    },
    handleCharge(row) {
      this.currentBooking = row;
      this.chargeForm = {
        id: row.id,
        apparatus_boot_at: '',
        apparatus_down_at: '',
        append_charge: 0,
        subtract_charge: 0,
        date: '',
        timeRange: [],
      };
      this.chargeForm.date = row.date;
      if (row.type === 1) {
        this.chargeForm.timeRange = [
          new Date(
            row.date + ' ' + row.start_at.substring(0, 2) + ':' + row.start_at.substring(2) + ':00',
          ),
          new Date(
            row.date + ' ' + row.end_at.substring(0, 2) + ':' + row.end_at.substring(2) + ':00',
          ),
        ];
      }
      this.chargeDialogVisible = true;
    },
    comfirmCharge(form) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.chargeForm.apparatus_boot_at =
            this.chargeForm.date + ' ' + timeFormat(this.chargeForm.timeRange[0], 'hh:mm:ss');
          this.chargeForm.apparatus_down_at =
            this.chargeForm.date + ' ' + timeFormat(this.chargeForm.timeRange[1], 'hh:mm:ss');
          bookingCharge(this.chargeForm).then((res) => {
            if (res.status === 1) {
              this.list.forEach((item) => {
                if (item.id === this.currentBooking.id) {
                  item.is_charge = 1;
                }
              });
              this.chargeDialogVisible = false;
            }
          });
        } else {
          return false;
        }
      });
    },
    handleDelete(row, status) {
      this.auditText = status === 2 ? '确定要拒绝预约吗？' : '提示';
      this.auditForm.id = row.id;
      this.auditForm.status = status;
      this.auditForm.reason = '';
      this.auditDialogVisible = true;
    },
    comfirmAudit() {
      bookableUpdate(this.auditForm).then((response) => {
        if (response.status === 1) {
          this.auditDialogVisible = false;
          this.queryList();
        }
      });
    },
    toAdd(id = '') {
      if (!id) {
        this.$router.push({
          path: '/apparatus/add',
        });
      } else {
        this.$router.push({
          path: '/apparatus/edit/' + id,
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
<style lang="scss" scoped>
.hcs-status {
  margin-bottom: 10px;
}

.hcs-status:last-child {
  margin-bottom: 0;
}
</style>
