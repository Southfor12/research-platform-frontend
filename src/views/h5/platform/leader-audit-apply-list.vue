<template>
  <div>
    <van-sticky>
      <van-nav-bar title="学生入室审核" left-text="返回" left-arrow @click-left="returnTo" />
      <van-dropdown-menu>
        <van-dropdown-item
          @change="resetQuery"
          v-model="queryForm.mentor_audit"
          :options="statusOptions"
        />
      </van-dropdown-menu>
    </van-sticky>
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="queryList">
      <div>
        <van-panel
          v-for="(item, index) in list"
          :key="index"
          :title="'申请人：' + item.user_name"
          :desc="'实验室：' + item.platform_name"
          :class="getStatus(item).class"
          :status="getStatus(item).title"
        >
          <div slot="footer" class="book-footer">
            <van-button
              size="small"
              @click="
                current = item;
                infoDialogVisible = true;
              "
              >入室信息</van-button
            >
            <van-button
              v-if="item.mentor_audit === 0"
              size="small"
              type="primary"
              @click="handleAudit(item, 1)"
              >通过</van-button
            >
            <van-button
              v-if="item.mentor_audit === 0"
              size="small"
              type="danger"
              @click="handleAudit(item, -1)"
              >拒绝</van-button
            >
          </div>
        </van-panel>
      </div>
    </van-list>
    <!-- <van-dialog
            v-model="auditDialogVisible"
            title="提示"
            show-cancel-button
            :before-close="comfirmAudit"
        >
            <van-cell-group v-if="auditForm.status == '2'">
                <van-field
                    v-model="auditForm.reason"
                    label="拒绝理由"
                    type="textarea"
                    placeholder="请输入拒绝理由"
                    rows="2"
                    autosize
                />
            </van-cell-group>
            <div class="tips-container" v-else>确定要通过预约吗？</div>
        </van-dialog> -->
    <el-dialog
      title="实验完成并扣费"
      :fullscreen="true"
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
      :fullscreen="true"
      :title="auditText"
      :visible.sync="auditDialogVisible"
      :close-on-click-modal="false"
    >
      <el-form v-if="auditForm.status == '-1'" ref="form" :rules="rules" :model="auditForm">
        <el-form-item label="理由">
          <el-input type="textarea" v-model="auditForm.reason" size="small" :rows="3" clearable />
        </el-form-item>
      </el-form>
      <div v-else>
        <div>确定要通过入室申请吗?</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="auditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="comfirmAudit('form')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="入室信息"
      width="80%"
      :fullscreen="true"
      :visible.sync="infoDialogVisible"
      :close-on-click-modal="false"
    >
      <apply-info v-if="infoDialogVisible" :form="current" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="infoDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mentorAuditList, mentorAudit } from '@/api/platform';
import { bookingList, bookableUpdate } from '@/api/apparatus';
import { bookingCharge, bookingCancle } from '@/api/booking';
import { checkNode } from '@/utils/validate';
import { timeFormat } from '@/utils/index';
import { mapGetters } from 'vuex';
import { debtDetail } from '@/api/research';
import Empty from '@/components/Empty';
import ApplyInfo from '@/components/ApplyInfo';
import { Toast, Notify, Dialog } from 'vant';

export default {
  components: {
    Empty,
    ApplyInfo,
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      infoDialogVisible: false,
      auditDialogVisible: false,
      chargeDialogVisible: false,
      auditText: '',
      current: {},
      activeNames: [],
      debtList: [],
      queryForm: {
        page: 1,
        size: 10,
        sort: 'created_at',
        sort_type: 'desc',
        parent_id_lte: '0',
        name: '',
        mentor_audit: '',
        platform_id: '',
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
          return (
            new Date(timeFormat(time, 'yyyy-MM-dd hh:mm:ss').replace(/-/g, '/')).getTime() >
            Date.now()
          );
        },
      },
      currentBooking: { discount_charge: 0 },
      auditForm: { id: '', status: '', reason: '' },
      statusOptions: [
        { text: '所有状态', value: '' },
        { text: '待导师审核', value: '0' },
        { text: '导师已通过', value: '1' },
        { text: '导师已拒绝', value: '-1' },
      ],
    };
  },
  computed: {
    ...mapGetters(['member']),
    getPrice() {
      return (
        Number(this.currentBooking.discount_charge) +
        Number(this.chargeForm.append_charge) -
        Number(this.chargeForm.subtract_charge)
      );
    },
  },
  methods: {
    resetQuery(value) {
      this.queryForm.page = 1;
      this.queryForm.mentor_audit = value;
      this.list = [];
      this.finished = false;
      this.queryList();
    },
    queryList() {
      this.loading = true;
      mentorAuditList(this.queryForm)
        .then((res) => {
          this.loading = false;
          if (res.status === 200) {
            res.data.data.forEach((item) => {
              this.list.push(item);
            });
            if (this.list.length === res.data.total) {
              this.finished = true;
            } else {
              this.queryForm.page++;
            }
          }
        })
        .catch((_) => {
          this.loading = false;
        });
    },
    handleCancleBooking(row) {
      Dialog.confirm({
        title: '提示',
        message: '确定要取消预约吗？',
      }).then(() => {
        bookingCancle({ id: row.id }).then((res) => {
          if (res.status === 1) {
            this.list.forEach((item) => {
              if (item.id === row.id) {
                item.status = 3;
              }
            });
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
    comfirmAudit(form) {
      if (this.auditForm.status === -1) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            // this.auditForm.expired_at = this.auditForm.expired_at.substring(0, 11) + ' 23:59:59'
            mentorAudit(this.auditForm).then((response) => {
              if (response.status === 1) {
                this.list = [];
                this.auditDialogVisible = false;
                this.queryList();
              }
            });
          }
        });
      } else {
        mentorAudit(this.auditForm).then((response) => {
          if (response.status === 1) {
            this.list = [];
            this.auditDialogVisible = false;
            this.queryList();
          }
        });
      }
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
    handleAudit(item, status) {
      this.auditText = status === -1 ? '确定要拒绝申请吗？' : '确定要通过申请吗？';
      this.auditForm.id = item.id;
      this.auditForm.status = status;
      this.auditForm.reason = '';
      this.auditDialogVisible = true;
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
    getStatus(item) {
      var data = { title: '', class: 'check-pending' };
      switch (item.mentor_audit) {
        case 0:
          data.title = '待导师审核';
          break;
        case 1:
          if (!item.pass_exam) {
            data.title = '待入室考试';
          } else {
            if (item.platform_audit === 0) {
              data.title = '待实验室审核';
            } else if (item.platform_audit === -1) {
              data.title = '实验室已拒绝';
              data.class = 'cancle-booking';
            } else {
              if (item.status === 0) {
                data.title = '待平台审核';
              } else if (item.status === 1) {
                data.title = '已通过';
                data.class = 'check-pass';
              } else {
                data.title = '平台已拒绝';
                data.class = 'cancle-booking';
              }
            }
          }
          break;
        case -1:
          data.title = '导师已拒绝';
          data.class = 'cancle-booking';
          break;
      }
      return data;
    },
    checkNode(node) {
      return checkNode(node);
    },
    returnTo() {
      this.$router.push({ path: '/h5/info-center' });
    },
  },
};
</script>
<style lang="scss">
.check-pending {
  .van-panel__header-value {
    color: #006699;
  }
}
.check-pass {
  .van-panel__header-value {
    color: #397919;
  }
}
.cancle-booking {
  .van-panel__header-value {
    color: #888888;
  }
}
</style>
<style lang="scss" scoped>
.van-panel {
  margin-bottom: 10px;
}
// .select-menu {
//     position: fixed;
//     width: 100%;
//     top: 0;
//     z-index: 99;
//     border-bottom: 1px solid #efefef;
// }
.book-container {
  padding: 0 16px;
}
.book-title {
  color: #060606;
}
.book-item {
  font-size: 14px;
  margin-bottom: 8px;

  span {
    color: #666666;
  }
}
.book-item:first-child {
  margin-top: 10px;
}
.book-item:last-child {
  padding-bottom: 10px;
}
.book-footer {
  text-align: right;
}
.tips-container {
  padding: 15px;
  font-size: 14px;
  color: #666;
}
</style>
