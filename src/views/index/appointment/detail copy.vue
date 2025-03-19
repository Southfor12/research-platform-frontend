<template>
  <div>
    <ul class="info">
      <li style="text-align: left; min-height: 300px">
        <el-image style="width: 91%; height: 240px" :src="domain + apparatus.picture"></el-image>
        <el-table
          :data="apparatusLeftProperties"
          style="width: 100%"
          stripe
          size="medium"
          :show-header="false"
        >
          <el-table-column prop="name" label="属性" align="left"> </el-table-column>
          <el-table-column prop="desc" label="说明" align="left"> </el-table-column>
        </el-table>
      </li>
      <li style="width: 48%; display: table; padding-top: 8px">
        <h1 class="cname">
          <span style="vertical-align: center">{{ apparatus.name }}</span>
          <el-tag type="success" v-if="apparatus.status == 1">正常</el-tag>
          <el-tag type="warning" v-if="apparatus.status == 2">维护</el-tag>
          <el-tag type="danger" v-if="apparatus.status == 3">损坏</el-tag>
        </h1>
        <el-table
          :data="apparatusRightProperties"
          style="width: 100%; margin-left: 0px"
          stripe
          size="medium"
          :show-header="false"
        >
          <el-table-column prop="name" label="属性" width="180" align="left"> </el-table-column>
          <el-table-column prop="desc" label="说明" width="180" align="left"> </el-table-column>
        </el-table>
      </li>
    </ul>
    <div class="clearfix"></div>
    <el-tabs
      @tab-click="tabClick"
      v-model="activeName"
      type="border-card"
      class="index-common-table-container"
    >
      <el-tab-pane label="设备详情" name="apparatus-info">
        <div class="tab-container">
          <ApparatusDetail :apparatus="apparatus" :chargeList="chargeList"></ApparatusDetail>
        </div>
      </el-tab-pane>
      <el-tab-pane
        v-if="
          apparatus.status === 1 && apparatus.is_sharing === 1 && member && member.is_trained == 1
        "
        name="appointment"
        label="设备预约"
      >
        <div class="tab-container">
          <div class="device-info" style="padding-top: 22px; padding-left: 30px">
            <el-form :inline="true" label-width="55px">
              <el-form-item label="编号">
                <div class="apparatus-info">
                  {{ apparatus.no }}
                </div>
              </el-form-item>
              <el-form-item label="名称">
                <div class="apparatus-info">
                  {{ apparatus.name }}
                </div>
              </el-form-item>
              <el-form-item label="类型">
                <div class="apparatus-info">
                  {{ apparatus.type_name }}
                </div>
              </el-form-item>
            </el-form>
            <el-form :inline="true" label-width="55px">
              <el-form-item label="负责人">
                <div class="apparatus-info">
                  {{ apparatus.admin_name }}
                  {{ apparatus.admin_mobile }}
                </div>
              </el-form-item>
              <el-form-item label="归属">
                <div class="apparatus-info">
                  {{ apparatus.platform_name }}
                </div>
              </el-form-item>
              <el-form-item label="状态">
                <div class="apparatus-info">
                  <el-tag v-if="apparatus.is_sharing" type="success">已共享</el-tag>
                  <el-tag v-else type="danger">未共享</el-tag>
                </div>
              </el-form-item>
            </el-form>
          </div>
          <el-radio-group
            v-if="member.id"
            v-model="form.type"
            style="margin-bottom: 30px; margin-left: 30px"
            @change="checkForAppointment"
          >
            <el-radio-button v-if="apparatus.share_type.split(',').indexOf('1') > -1" label="1"
              >自主检测</el-radio-button
            >
            <el-radio-button v-if="apparatus.share_type.split(',').indexOf('2') > -1" label="2"
              >送样检测</el-radio-button
            >
          </el-radio-group>
          <!-- 选择日期的日历表 -->
          <full-calendar
            v-show="showMonth && member.id"
            id="schedulerCalendar"
            ref="calendar"
            style="margin-bottom: 30px"
            :events="events"
            :config="config"
          ></full-calendar>
          <el-form
            v-loading="loading"
            element-loading-text="正在计算费用..."
            element-loading-spinner="el-icon-loading"
            v-show="member.id"
            ref="form"
            :model="form"
            :rules="rules"
            label-width="150px"
          >
            <div v-show="!showMonth && member.id">
              <div class="full-calendar-container">
                <full-calendar
                  id="agendaDayCalendar"
                  ref="agendaDayCalendar"
                  :events="agendaDayEvents"
                  :config="agendaDayConfig"
                ></full-calendar>
                <div
                  style="position: absolute; right: 10px; top: 5px; cursor: pointer; color: #2068b0"
                  @click="reSelectDate"
                >
                  <i class="el-icon-refresh-left"></i>重新选择日期
                </div>
              </div>
              <el-row>
                <el-col :span="10">
                  <el-form-item label="样品名称" prop="sample_name">
                    <el-input
                      class="width-200"
                      type="text"
                      :min="0"
                      v-model="form.sample_name"
                      size="small"
                      placeholder="请填写样品名称"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="14">
                  <el-form-item label="样品数量" prop="sample_num">
                    <el-input-number
                      v-model="form.sample_num"
                      class="width-200"
                      @change="
                        (currentValue, oldValue) => {
                          priceNumberChange(currentValue, oldValue, 0, 1);
                        }
                      "
                      size="small"
                      :min="0"
                      :step="1"
                      :precision="0"
                    >
                    </el-input-number>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-form-item label="检测项目">
                <el-table :data="chargeList" stripe style="width: 95%">
                  <el-table-column prop="title" label="分类(带星号的必须选)" width="200">
                    <template slot-scope="scope">
                      <span
                        style="color: #ff4949; font-size: 16px; font-weight: 500; margin-right: 4px"
                        v-if="scope.row.choose"
                        >*</span
                      >
                      {{ scope.row.title }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="id" label="检测项目(请勾选需要做检测的项目)">
                    <template slot-scope="scope">
                      <el-checkbox-group
                        @change="
                          (value) => {
                            countBookCharge();
                          }
                        "
                        v-model="checkedCharge"
                      >
                        <el-checkbox
                          style="display: block"
                          v-for="(typeItem, typeIndex) in scope.row.items"
                          :key="typeIndex"
                          :label="typeItem.id"
                          :checked="scope.row.choose == 1"
                        >
                          {{ typeItem.title }}【院内:{{ typeItem.charge }} 院外:{{
                            typeItem.external_charge
                          }}】元/{{
                            typeItem.type === 1
                              ? '样品'
                              : typeItem.type === 2
                              ? '小时'
                              : typeItem.type === 3
                              ? '次'
                              : typeItem.unit
                          }}
                          <span v-if="typeItem.note">{{ typeItem.note }}</span
                          ><span v-if="typeItem.self_free">(自主检测免费)</span>
                        </el-checkbox>
                      </el-checkbox-group>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
              <el-row>
                <el-col :span="10">
                  <el-form-item label="预约费用">
                    <div>
                      <span style="font-size: 16px">{{ totalPrice }} 元</span>
                      <!-- <span style="color: red;margin-left: 10px;">(原价 {{  }} 元，现免费开放)</span> -->
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="14">
                  <el-form-item label="预约时长">
                    {{ durationDesc }}
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <!-- <el-col :span="10">
                  <el-form-item label="实验操作人" v-if="form.type == 1" prop="user_id">
                    <el-select
                      v-model="form.user_id"
                      size="small"
                      class="width-200"
                      filterable
                      placeholder="请选择做实验人员"
                    >
                      <el-option
                        v-for="user in allUsers"
                        :key="user.id"
                        :label="user.name"
                        :value="user.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col> -->
                <el-col :span="14">
                  <el-form-item label="付款账号" prop="research_group_account_id">
                    <el-select
                      v-model="form.research_group_account_id"
                      size="small"
                      @change="accountChange"
                      class="width-200"
                      filterable
                      reserve-keyword
                      placeholder="请选择付款账号"
                    >
                      <el-option
                        v-for="item in accounts"
                        :key="item.research_group_account_id"
                        :label="item.research_group_account_name"
                        :value="item.research_group_account_id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <!-- 发票信息暂时去掉 -->
              <!-- <el-form-item v-if="form.research_group_account_id" class="invoice-info" label="发票信息">
                <el-radio-group v-model="form.invoice_id">
                  <el-radio style="display: block; margin-top: 10px;" v-for="(item, index) in invoices" :key="index"
                    :label="item.id">
                    <div style="display: inline-block;">
                      发票类型：{{ item.type === 1 ? '增值税普通发票' : (item.type === 2 ? '增值税专用发票' : '组织（非企业）增值税普通发票') }}<br />
                      发票抬头：{{ item.head }}<br />
                      识别号：{{ item.no }}<br />
                      开户银行：{{ item.bank }}<br />
                      银行账户：{{ item.bank_no }}<br />
                      地址：{{ item.address }}<br />
                      电话：{{ item.mobile }}
                    </div>
                  </el-radio>
                </el-radio-group>
                <span v-if="invoices.length === 0">暂无发票信息</span>
              </el-form-item> -->
              <el-form-item v-if="form.type == 2" label="报告类型">
                <el-select
                  v-model="report_type"
                  @change="reportTypeChange"
                  size="small"
                  placeholder="请选择"
                  class="width-200"
                >
                  <el-option label="原始数据" :value="0" />
                  <el-option label="数据报告" :value="1" />
                </el-select>
                <el-select
                  v-if="report_type == 1"
                  @change="
                    (value) => {
                      countBookCharge();
                    }
                  "
                  v-model="form.report_type"
                  size="small"
                  placeholder="请选择"
                >
                  <el-option label="中文" :value="1" />
                  <el-option label="英文" :value="2" />
                  <el-option label="中英文" :value="3" />
                </el-select>
              </el-form-item>
              <el-form-item v-if="form.type == 2" label="报告发送方式">
                <el-select
                  v-model="form.reposrt_send_type"
                  size="small"
                  placeholder="请选择"
                  class="width-200"
                >
                  <el-option label="自取" :value="1" />
                  <el-option v-if="!member.is_inner" label="寄送" :value="2" />
                </el-select>
              </el-form-item>
              <el-form-item label="检测要求" prop="note">
                <el-input
                  type="textarea"
                  class="width-500"
                  :rows="5"
                  v-model="form.note"
                  size="small"
                />
              </el-form-item>
            </div>
            <div v-if="!showMonth && member.id">
              <el-card
                v-if="reagent.length > 0 && form.type == 1"
                class="common-box-card index-common-table-container"
              >
                <div slot="header" class="index-box-card-header">
                  <span>耗材</span>
                </div>
                <div class="tab-container">
                  <el-table :data="reagent" border style="width: 100%">
                    <el-table-column prop="reagent_name" label="名称"> </el-table-column>
                    <el-table-column prop="price_number" label="最小使用量"> </el-table-column>
                    <el-table-column prop="price" label="价格（元/最小使用量"> </el-table-column>
                    <el-table-column label="预约使用量">
                      <template slot-scope="scope">
                        <el-input-number
                          @change="
                            (currentValue, oldValue) => {
                              priceNumberChange(currentValue, oldValue, scope.$index, 2);
                            }
                          "
                          size="small"
                          :min="0"
                          :step="1"
                          :precision="0"
                          v-model="scope.row.price_number_num"
                        ></el-input-number>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </el-card>
              <!-- <el-form-item v-if="form.type === '1'" label="是否自带耗材">
                <el-select
                  v-model="form.is_carry_reagents"
                  size="small"
                  class="width-200"
                  filterable
                  reserve-keyword
                >
                  <el-option label="是" value="1"></el-option>
                  <el-option label="否" value="0"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                v-if="form.type === '1' && form.is_carry_reagents === '1'"
                label="自带耗材"
                prop="carry_reagents_arr"
              >
                <el-select
                  v-model="form.carry_reagents_arr"
                  size="small"
                  class="width-200"
                  allow-create
                  multiple
                  filterable
                  default-first-option
                >
                </el-select>
              </el-form-item>
              <el-card
                v-if="hcses.length > 0 && form.type == 1"
                class="common-box-card index-common-table-container"
              >
                <div slot="header" class="index-box-card-header">
                  <div>
                    危化品 (<span class="hcs-process" @click="showProcess = true"
                      >危化品在线领用流程</span
                    >)
                  </div>
                </div>
                <div class="tab-container">
                  <el-table :data="hcses" border @row-click="authHcs" style="width: 100%">
                    <el-table-column prop="name" label="名称"> </el-table-column>
                    <el-table-column prop="price_number" label="最小使用量"> </el-table-column>
                    <el-table-column prop="price" label="价格（元/最小使用量"> </el-table-column>
                    <el-table-column label="等级">
                      <template slot-scope="scope">
                        <el-select size="small" v-model="scope.row.level" placeholder="请选择等级">
                          <el-option
                            v-for="item in scope.row.levels"
                            :key="item"
                            :label="item"
                            :value="item"
                          >
                          </el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column label="规格">
                      <template slot-scope="scope">
                        <el-select
                          size="small"
                          v-model="scope.row.specification"
                          placeholder="请选择规格"
                        >
                          <el-option
                            v-for="item in scope.row.specifications"
                            :key="item"
                            :label="item"
                            :value="item"
                          >
                          </el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column label="预约使用量" width="150px">
                      <template slot-scope="scope">
                        <el-input-number
                          @change="
                            (currentValue, oldValue) => {
                              priceNumberChange(currentValue, oldValue, scope.$index, 3);
                            }
                          "
                          size="small"
                          :min="0"
                          :step="1"
                          :precision="0"
                          v-model="scope.row.price_number_num"
                        ></el-input-number>
                      </template>
                    </el-table-column>
                    <el-table-column label="负责人">
                      <template slot-scope="scope">
                        {{ scope.row.admin1_name }}
                        <br />
                        {{ scope.row.admin2_name }}
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </el-card>
              <el-form-item v-if="form.type === '1'" label="是否自带危化品">
                <el-select
                  v-model="form.is_carry_hcses"
                  size="small"
                  class="width-200"
                  filterable
                  reserve-keyword
                >
                  <el-option label="是" value="1"></el-option>
                  <el-option label="否" value="0"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                v-if="form.type === '1' && form.is_carry_hcses === '1'"
                label="自带危化品"
                prop="carry_hcses_arr"
              >
                <el-select
                  v-model="form.carry_hcses_arr"
                  size="small"
                  class="width-200"
                  allow-create
                  multiple
                  filterable
                  default-first-option
                >
                </el-select>
              </el-form-item>
               -->
            </div>
            <el-form v-if="!showMonth" :inline="true" label-width="150px">
              <div style="text-align: center; margin-top: 20px; margin-bottom: 50px">
                <el-button type="primary" size="small" @click="submit('form')">预约</el-button>
              </div>
            </el-form>
          </el-form>
          <div v-if="!member.id" style="padding: 30px 100px; text-align: center">
            <el-button type="primary" @click="toIndex">请先登录</el-button>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="设备培训">
        <div class="tab-container">
          <ApparatusTrain :apparatusId="this.apparatusId"></ApparatusTrain>
        </div>
      </el-tab-pane>
      <el-tab-pane label="使用记录">
        <div class="tab-container" style="min-height: 300px; padding-bottom: 15px">
          <ApparatusUseRecord :apparatusId="this.apparatusId"></ApparatusUseRecord>
        </div>
      </el-tab-pane>
      <el-tab-pane label="学习资料">
        <div class="tab-container" style="min-height: 300px; padding-bottom: 15px">
          <ApparatusData :apparatusId="this.apparatusId"></ApparatusData>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      title="说明书"
      :close-on-click-modal="false"
      :show-close="false"
      :visible.sync="dialogVisible"
    >
      <div v-html="currentHcs.msds_content"></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="passAuth">已学习</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="危化品在线领用流程"
      :close-on-click-modal="false"
      :show-close="false"
      :visible.sync="showProcess"
    >
      <div v-html="hcsStatement"></div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showProcess = false">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="`仪器 [${apparatus.name}] 使用注意事项`"
      :close-on-click-modal="false"
      :show-close="false"
      :visible.sync="showNotice"
    >
      <div v-html="apparatus.notice"></div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showNotice = false">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="仪器使用考试"
      @close="clearAnswer"
      :close-on-click-modal="false"
      :show-close="false"
      :visible.sync="showExam"
    >
      <div>
        <div v-if="judgmentList.length > 0" class="question-type">一、判断题</div>
        <div v-for="(item, index) in judgmentList" :key="item.id">
          <div class="question-title">{{ index + 1 }}. {{ item.name }}</div>
          <div class="question-answer">
            <el-radio v-model="item.answer" label="1">正确</el-radio>
            <el-radio v-model="item.answer" label="0">错误</el-radio>
          </div>
        </div>
        <div v-if="singleChoose.length > 0" class="question-type">二、单选题</div>
        <div
          class="question-answer single-question"
          v-for="(item, index) in singleChoose"
          :key="item.id"
        >
          <div class="question-title">{{ index + 1 }}. {{ item.name }}</div>
          <div>
            <el-radio-group v-model="item.answer">
              <el-radio
                v-for="item1 in item.items"
                v-show="item1.content"
                :key="item1.name"
                :label="item1.name"
              >
                <div class="question-answer-item" style="display: inline-block">
                  {{ item1.name }}.
                </div>
                <div
                  class="question-answer-content"
                  style="display: inline-block; white-space: normal"
                >
                  {{ item1.content }}
                </div>
              </el-radio>
            </el-radio-group>
          </div>
        </div>
        <div v-if="multiChoose.length > 0" class="question-type">三、选择题</div>
        <div
          class="question-answer single-question"
          v-for="(item, index) in multiChoose"
          :key="item.id"
        >
          <div class="question-title">{{ index + 1 }}. {{ item.name }}</div>
          <div>
            <el-checkbox-group v-model="item.answer">
              <el-checkbox
                v-for="item1 in item.items"
                v-show="item1.content"
                :key="item1.name"
                :label="item1.name"
                >{{ item1.name }}. {{ item1.content }}</el-checkbox
              >
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelExam">取消</el-button>
        <el-button type="primary" @click="commitExam">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { invoiceList } from '@/api/invoice';
import { sampleDeliverList } from '@/api/charge';
import { hcsAuth } from '@/api/hcs';
import {
  apparatusIndexFrontInfo,
  apparatusReagentList,
  booking,
  bookableTime,
  examQuestions,
  submitExam,
  checkTrain,
} from '@/api/apparatus';
import { countMoney } from '@/api/booking';
import { settingInfo } from '@/api/system';
import { researchGroupAccountAuthList } from '@/api/research';
import { allUsers } from '@/api/user';
import { mapGetters } from 'vuex';
import mailTable from '@/components/Table';
import { FullCalendar } from 'vue-full-calendar';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlulgin from '@fullcalendar/timegrid';
import '@fullcalendar/core/locales/zh-cn'; // 支持中文
import momentPlugin from '@fullcalendar/moment';
import interactionPlugin from '@fullcalendar/interaction';
import 'fullcalendar/dist/fullcalendar.css';
import dataFormat from 'js-dateformat';
import Empty from '@/components/Empty';
import { timestampFormat } from '@/utils/index';
import moment from 'moment';
import ApparatusDetail from './components/ApparatusDetail.vue';
import ApparatusTrain from './components/ApparatusTrain.vue';
import ApparatusUseRecord from './components/ApparatusUseRecord.vue';
import ApparatusData from './components/ApparatusData.vue';

export default {
  components: {
    Empty,
    mailTable,
    FullCalendar,
    ApparatusDetail,
    ApparatusTrain,
    ApparatusUseRecord,
    ApparatusData,
  },
  data() {
    let that = this;
    let dateFormat = dataFormat.dateFormat;
    return {
      nowTime: 0,
      apparatusId: 0,
      apparatusLeftProperties: [],
      apparatusRightProperties: [],
      activeName: '',
      dialogVisible: false,
      showProcess: false,
      showNotice: false,
      showExam: false,
      isTrain: false,
      loading: false,
      selectMonth: '',
      appointmentTotal: 0,
      totalPrice: 0,
      report_type: 0,
      appointments: [],
      chargeList: [],
      invoices: [],
      checkedCharge: [],
      allUsers: [],
      form: {
        booking_times: [],
        duration: 0,
        apparatus_id: '',
        date: '',
        type: '',
        note: '',
        invoice_id: '',
        sample_name: '',
        sample_num: 0,
        report_type: 0,
        reposrt_send_type: 1,
        expected_finish_date: '',
        research_group_account_id: 0,
        sample_deliver_item_ids: '',
        reagent_ids: [],
        hcs_ids: [],
        price: '',
        user_id: 0,
        is_carry_reagents: '0',
        is_carry_hcses: '0',
        carry_reagents: '',
        carry_reagents_arr: [],
        carry_hcses: '',
        carry_hcses_arr: [],
      },
      countForm: {
        apparatus_id: '',
        type: '',
        date: '',
        research_group_account_id: '',
        duration: '',
        reagent_ids: '',
        hcs_ids: '',
        sample_deliver_item_ids: '',
        sample_num: '',
        report_type: 0,
      },
      submitForm: {
        apparatus_id: '',
        answers: [],
      },
      hcsStatement: '',
      currentHcs: {},
      hcses: [],
      bookableTime: {
        booked_time: [],
      },
      costPrice: 0,
      queryAccountForm: {
        page: 1,
        size: 100,
        user_id: '',
        is_deleted: 0,
      },
      rules: {
        type: [
          {
            required: true,
            message: '请选择检测类型',
            trigger: 'change',
          },
        ],
        carry_reagents_arr: [
          {
            required: true,
            message: '请输入自带耗材',
            trigger: 'change',
          },
        ],
        carry_hcses_arr: [
          {
            required: true,
            message: '请输入自带危化品',
            trigger: 'change',
          },
        ],
        expected_finish_date: [
          {
            required: true,
            message: '请选择期望完成时间',
            trigger: 'change',
          },
        ],
        sample_name: [
          {
            required: true,
            message: '请填写样品名称',
            trigger: 'blur',
          },
        ],
        sample_num: [
          {
            required: true,
            message: '请填写样品数量',
            trigger: 'blur',
          },
        ],
        // note: [{
        //   required: true,
        //   message: '请填写检测要求',
        //   trigger: 'blur'
        // }],
        // research_group_account_id: [{
        //   required: true,
        //   message: '请选择付款账号',
        //   trigger: 'change'
        // }]
      },
      queryReagentForm: {
        page: 1,
        size: 100,
        apparatus_id: '',
        is_deleted: 0,
      },
      chosedTimes: [
        // {
        //   start:'0830',
        //   end:'1130'
        // }
      ],
      autonomous: false,
      sample: false,
      currentDate: '',
      canAppointment: [],
      cantNotAppointment: [],
      accounts: [],
      reagent: [],
      judgmentList: [],
      singleChoose: [],
      multiChoose: [],
      booking_limit: 0,
      booking_start_at: '00:00',
      booking_end_at: '24:00',
      //start config
      config: {
        locale: 'zh-cn',
        defaultView: 'month',
        selectAllow: function (clickInfo) {
          var start = clickInfo.start.unix() - 8 * 3600;
          var end = clickInfo.end.unix() - 8 * 3600;
          var canSelect = false;
          that.canAppointment.forEach((item) => {
            if (start >= item.start && end <= item.end) {
              canSelect = true;
            }
          });
          return canSelect;
        },
        // weekends: false,
        //点击后检测是否有预约仪器的权限；然后跳转到议程选择页面，设置好能够选择的时间和不能选择的时间
        dayClick(date, allDay, jsEvent, view) {
          if (that.apparatus.need_train && !that.isTrain) {
            that.$message.info('请先参加该仪器的培训');
            return false;
          }
          if (jsEvent.type === 'month') {
            let selectDate = dateFormat(date._d, 'yyyy-mm-dd');
            let canSelect = false;
            that.canAppointment = [];
            that.cantNotAppointment = [];
            for (let bookableDate in that.bookableTime.bookable_time) {
              if (
                bookableDate === selectDate &&
                that.bookableTime.bookable_time[bookableDate].length > 0
              ) {
                that.canAppointment = that.bookableTime.bookable_time[bookableDate];
                that.form.date = selectDate;
                that.selectMonth = '' + selectDate.split('-')[0] + '-' + selectDate.split('-')[1];
                canSelect = true;
                break;
              }
            }
            if (
              that.bookableTime.booked_time[selectDate] &&
              that.bookableTime.booked_time[selectDate].length > 0
            ) {
              that.cantNotAppointment = that.bookableTime.booked_time[selectDate];
            }
            if (!canSelect) {
              that.$message({
                message: dateFormat(date._d, 'yyyy年mm月dd日') + '未开放预约',
                type: 'error',
              });
            } else {
              if (that.booking_limit == 1) {
                var a = that.booking_start_at;
                var b = that.booking_end_at;
                // 获取当前时间
                var currentTime = new Date();
                // 将当前时间转换为与给定字符串格式相同的格式
                var currentFormattedTime =
                  ('0' + currentTime.getHours()).slice(-2) +
                  ':' +
                  ('0' + currentTime.getMinutes()).slice(-2);
                // 比较当前时间是否在指定范围之间
                if (currentFormattedTime >= a && currentFormattedTime <= b) {
                } else {
                  that.$message.error(
                    '当前时间不可进行预约，请在 ' + a + '~' + b + ' 内进行操作。'
                  );
                  return;
                }
              }

              that.showMonth = false;

              setTimeout(function () {
                that.$refs.agendaDayCalendar.fireMethod(
                  'changeView',
                  'agendaDay',
                  moment(new Date().getFullYear() + 1 + '-01-01')
                );
                that.$refs.agendaDayCalendar.fireMethod('changeView', 'agendaDay', date);
              }, 50);
            }
          }
        },
        //点击后检测是否有预约仪器的权限；然后跳转到议程选择页面，设置好能够选择的时间和不能选择的时间
        eventClick(event, jsEvent, view) {
          if (that.apparatus.need_train && !that.isTrain && that.form.tye == 1) {
            //自主检测的情况下需要判断
            that.$message.info('请先参加该仪器的培训');
            return false;
          }
          let selectDate = dateFormat(event.start._d, 'yyyy-mm-dd');
          that.canAppointment = [];
          that.form.date = selectDate;
          that.selectMonth = '' + selectDate.split('-')[0] + '-' + selectDate.split('-')[1];
          for (let bookableDate in that.bookableTime.bookable_time) {
            if (bookableDate === selectDate) {
              that.canAppointment = that.bookableTime.bookable_time[bookableDate];
              break;
            }
          }
          if (
            that.bookableTime.booked_time[selectDate] &&
            that.bookableTime.booked_time[selectDate].length > 0
          ) {
            that.cantNotAppointment = that.bookableTime.booked_time[selectDate];
          }

          if (that.booking_limit == 1) {
            var a = that.booking_start_at;
            var b = that.booking_end_at;
            // 获取当前时间
            var currentTime = new Date();
            // 将当前时间转换为与给定字符串格式相同的格式
            var currentFormattedTime =
              ('0' + currentTime.getHours()).slice(-2) +
              ':' +
              ('0' + currentTime.getMinutes()).slice(-2);
            // 比较当前时间是否在指定范围之间
            if (currentFormattedTime >= a && currentFormattedTime <= b) {
            } else {
              that.$message.error('当前时间不可进行预约，请在 ' + a + '~' + b + ' 内进行操作。');
              return;
            }
          }

          that.showMonth = false;
          setTimeout(function () {
            that.$refs.agendaDayCalendar.fireMethod(
              'changeView',
              'agendaDay',
              moment(new Date().getFullYear() + 1 + '-01-01')
            );
            that.$refs.agendaDayCalendar.fireMethod('changeView', 'agendaDay', selectDate);
          }, 50);
        },
        allDaySlot: false,
        isDragging: false,
        header: {
          left: 'prev,next myCustomButton',
          center: 'title',
          right: '',
        },
      },
      //end config
      //start config
      agendaDayConfig: {
        locale: 'zh-cn',
        defaultView: 'agendaDay',
        allDaySlot: false,
        // slotDuration: '00:30:00',
        slotDuration: '00:10:00',
        // slotLabelFormat: 'h(:mm)a',
        slotLabelFormat: 'HH:mm',
        minTime: '00:00:00',
        maxTime: '23:59:59',
        slotEventOverlap: false, //事件是否允许重叠
        scrollTime: '08:00:00',
        header: {
          left: '',
          center: 'title',
          right: '',
        },
        selectAllow: function (clickInfo) {
          let start = clickInfo.start.unix() - 8 * 3600;
          let end = clickInfo.end.unix() - 8 * 3600;

          //不能预约以前的时间
          if (start <= that.nowTime || end <= that.nowTime) {
            return false;
          }
          let canSelect = false;
          that.canAppointment.forEach((item) => {
            if (start >= item.start && end <= item.end) {
              canSelect = true;
            }
          });

          if (!canSelect) {
            return false;
          }

          if (that.cantNotAppointment.length > 0) {
            that.cantNotAppointment.forEach((item) => {
              if (
                (start > item.start && start < item.end) ||
                (end > item.start && end <= item.end)
              ) {
                canSelect = false;
              }
            });
          }

          if (!canSelect) {
            return false;
          }

          that.chosedTimes.forEach((item) => {
            if (
              (start >= item.start && start < item.end) ||
              (end > item.start && end <= item.end) ||
              (end >= item.end && start <= item.start)
            ) {
              canSelect = false;
            }
          });
          return canSelect;
        },
        select: function (startDate, endDate, allDay, jsEvent, view) {
          let start = startDate._i;
          let end = endDate._i;
          if (jsEvent.type === 'agendaDay') {
            let startAt = '' + that.getFulldate(start[3]) + that.getFulldate(start[4]);
            let endAt = '' + that.getFulldate(end[3]) + that.getFulldate(end[4]);
            that.form.start = startAt;
            that.form.end = endAt;
            that.chosedTimes.push({
              start: startDate.unix() - 8 * 3600,
              end: endDate.unix() - 8 * 3600,
            });

            that.agendaDayEvents.push({
              flag: 'book_time',
              resourceId: new Date().getTime(),
              title: '已选择时间段 (点击取消选择)',
              start: startDate,
              end: endDate,
              color: 'blue',
              textColor: '#ffffff',
              editable: false,
              selectable: false,
            });
            that.countBookCharge();
          }
        },
        eventClick(event, jsEvent, view) {
          if (event.flag && event.flag == 'not_open_time') {
            //不可预约的时间段，不做任何处理
            return false;
          }
          let start = event.start.unix() - 8 * 3600;
          let end = event.end.unix() - 8 * 3600;

          let canDelete = true;
          //已经被预约的时间
          that.cantNotAppointment.forEach((item) => {
            if ((start > item.start && start < item.end) || (end > item.start && end <= item.end)) {
              canDelete = false;
            }
          });
          if (!canDelete) return;

          //再次点击取消预约时间选择
          that.agendaDayEvents.forEach((item, index) => {
            if (item.resourceId === event.resourceId) {
              that.agendaDayEvents.splice(index, 1);
              that.chosedTimes.forEach((time, timeIndex) => {
                if (time.start == start && time.end == end) {
                  // console.log('remove 1')
                  that.chosedTimes.splice(timeIndex, 1);
                }
              });
            }
          });
          that.countBookCharge();
        },
      },
      //end config
      showMonth: true,
      events: [], //日历工具
      agendaDayEvents: [], //一天内的时间选择，议程
      queryForm: {
        id: '',
        is_deleted: 0,
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() <= Date.now();
        },
      },
      apparatus: {},
      domain: process.env.VUE_APP_DOMAIN,
      monthData: [],
      calendarPlugins: [dayGridPlugin, timeGridPlulgin, momentPlugin, interactionPlugin],
      handlerSeelctAllow: (info) => {
        const currentDate = new Date();
        const start = info.start;
        const end = info.end;
        return start <= end && start >= currentDate;
      },
    };
  },
  computed: {
    ...mapGetters(['member']),
    durationDesc: function () {
      let duration = this.form.duration;
      if (duration == 0) {
        return '0 小时';
      }
      let hours = Math.floor(duration / 60);
      let minutes = duration % 60;
      let desc = hours + ' 小时';
      if (minutes > 0) {
        desc += ' ' + minutes + ' 分钟';
      }

      return desc;
    },
    book_times: function () {
      let bookTimes = [];
      this.chosedTimes.forEach((time) => bookTimes.push(time));
      bookTimes.sort(function (a, b) {
        return a.start - b.start;
      });
      let merge = true;
      while (merge) {
        merge = this.mergeTime(bookTimes);
      }

      return bookTimes;
    },
  },
  created() {
    this.nowTime = moment().unix();
    if (this.member.id) {
      this.queryAccountForm.user_id = this.member.id;
      this.getAccounts();
      this.form.user_id = this.member.id;
      this.loadAllUsers();
    }
    this.activeName = 'apparatus-info';
    if (this.$route.query.appointment) {
      this.activeName = 'appointment';
    }
    this.apparatusId = Number(this.$route.params.id);
    this.queryForm.id = this.apparatusId;
    this.queryReagentForm.apparatus_id = this.apparatusId;
    this.form.apparatus_id = this.apparatusId;
    this.countForm.apparatus_id = this.apparatusId;
    apparatusIndexFrontInfo(this.queryForm).then((res) => {
      if (res.status === 200) {
        this.apparatus = res.data;
        this.updateApparatusProperties();
        this.hcses = [];
        if (this.apparatus.status !== 1 || this.apparatus.is_sharing !== 1) {
          return false;
        }
        if (this.member.id) this.getBookingTime();
        this.apparatus.hcses.forEach((item) => {
          this.hcses.push({
            hcs_id: item.id,
            name: item.name,
            is_auth: item.is_auth,
            admin1_name: item.admin1_name,
            admin2_name: item.admin2_name,
            price_number_num: '',
            price_number: item.price_number,
            price: item.price,
            msds_content: item.msds_content,
            level: '',
            levels: item.levels.split(','),
            specification: '',
            specifications: item.specifications.split(','),
          });
        });
        if (this.apparatus.share_type.split(',').indexOf(this.$route.query.type) !== -1) {
          this.form.type = this.$route.query.type;
        }
        this.apparatus.share_type.split(',').forEach((item, index) => {
          if (index === 0 && !this.form.type) {
            this.form.type = item;
          }
          if (item == 1) {
            this.autonomous = true;
          }
          if (item == 2) {
            this.sample = true;
          }
        });
        if (this.activeName === 'appointment') {
          if (this.member.id && this.apparatus.is_auth == 0 && this.form.type === '1') {
            this.getExam();
            this.showExam = true;
          } else {
            this.showNotice = true;
          }
        }
      } else {
        this.$router.push({
          path: '/',
        });
      }
    });
    settingInfo({
      type: 'hcs_statement',
    }).then((res) => {
      if (res.status === 200) {
        this.hcsStatement = res.data.value;
      }
    });
    if (this.member.id) {
      checkTrain(this.queryForm).then((res) => {
        if (res.status === 200) {
          this.isTrain = res.data.is_train;
        }
      });
    }
    this.getReagentList();
    this.getChargeList();
  },
  methods: {
    loadAllUsers() {
      allUsers().then((res) => {
        this.allUsers = res.data.users;
      });
    },
    mergeTime(bookTimes) {
      let start = -1;
      let startTime = 0;
      let endTime = 0;
      for (let i = 0; i < bookTimes.length; i++) {
        if (i == bookTimes.length - 1) {
          break;
        }
        if (bookTimes[i].end == bookTimes[i + 1].start) {
          start = i;
          startTime = bookTimes[i].start;
          endTime = bookTimes[i + 1].end;
          break;
        }
      }
      if (start != -1) {
        bookTimes.splice(start, 2);
        bookTimes.push({
          start: startTime,
          end: endTime,
        });
        bookTimes.sort(function (a, b) {
          return a.start - b.start;
        });
        return true;
      }

      return false;
    },
    authHcs(row) {
      if (!row.is_auth) {
        var that = this;
        setTimeout(function () {
          row.price_number_num = '';
          row.level = '';
          row.specification = '';
        }, 100);
        this.currentHcs = row;
        this.dialogVisible = true;
        return false;
      }
    },
    getChargeList() {
      sampleDeliverList({
        apparatus_id: this.queryForm.id,
        size: 100,
      }).then((res) => {
        if (res.status === 200) {
          this.chargeList = res.data.data;
          this.chargeList.forEach((item, index) => {
            this.chargeList[index].checked = [];
          });
        }
      });
    },
    getExam() {
      if (this.apparatus.need_auth) {
        examQuestions({
          platform_id: 0,
          apparatus_id: this.$route.params.id,
        }).then((res) => {
          if (res.status === 200) {
            var that = this;
            that.singleChoose = [];
            that.judgmentList = [];
            that.multiChoose = [];
            res.data.questions.forEach((item) => {
              if (item.type === 1) {
                item.answer = '';
                that.singleChoose.push(item);
              } else if (item.type === 2) {
                item.answer = '';
                that.judgmentList.push(item);
              } else if (item.type === 3) {
                item.answer = [];
                that.multiChoose.push(item);
              }
            });
          }
        });
      } else {
        this.apparatus.is_auth = 1;
      }
    },
    commitExam() {
      let msg = '',
        checkPass = true,
        that = this;
      this.submitForm.answers = [];
      this.judgmentList.forEach((item, index) => {
        that.submitForm.answers.push({
          question_id: item.id,
          answer: item.answer,
        });
        if (!item.answer) msg += index + 1 + '，';
      });
      if (msg) {
        checkPass = false;
        this.$message.error('判断题第' + msg.slice(0, msg.length - 1) + '题未作答');
      }
      msg = '';
      this.singleChoose.forEach((item, index) => {
        that.submitForm.answers.push({
          question_id: item.id,
          answer: item.answer,
        });
        if (item.answer.length === 0) msg += index + 1 + '，';
      });
      if (msg) {
        if (checkPass) {
          checkPass = false;
          that.$message.error('单选题第' + msg.slice(0, msg.length - 1) + '题未作答');
        } else {
          setTimeout(function () {
            that.$message.error('单选题第' + msg.slice(0, msg.length - 1) + '题未作答');
          }, 500);
        }
      }
      msg = '';
      this.multiChoose.forEach((item, index) => {
        that.submitForm.answers.push({
          question_id: item.id,
          answer: item.answer.join(','),
        });
        if (item.answer.length === 0) msg += index + 1 + '，';
      });
      if (msg) {
        if (checkPass) {
          checkPass = false;
          that.$message.error('多选题第' + msg.slice(0, msg.length - 1) + '题未作答');
        } else {
          setTimeout(function () {
            that.$message.error('多选题第' + msg.slice(0, msg.length - 1) + '题未作答');
          }, 500);
        }
      }
      if (!checkPass) {
        return false;
      }
      this.submitForm.apparatus_id = this.apparatus.id;
      this.submitForm.answers = JSON.stringify(this.submitForm.answers);
      submitExam(this.submitForm).then((res) => {
        if (res.status === 1) {
          this.apparatus.is_auth = 1;
          this.showExam = false;
          this.showNotice = true;
        } else if (res.status === 200) {
          that
            .$confirm(res.msg + ',是否重新开始考试?', '提示', {
              confirmButtonText: '重新考试',
              cancelButtonText: '不考了',
              type: 'warning',
            })
            .then(() => {
              that.clearAnswer();
            })
            .catch(() => {
              this.showExam = false;
              this.showNotice = false;
              this.activeName = 'apparatus-info';
            });
        }
      });
    },
    clearAnswer() {
      this.singleChoose.forEach((item) => {
        item.answer = '';
      });
      this.multiChoose.forEach((item) => {
        item.answer = [];
      });
      this.judgmentList.forEach((item) => {
        item.answer = '';
      });
      this.submitForm.answers = [];
    },
    cancelExam() {
      this.showExam = false;
      if (this.apparatus.share_type.split(',').indexOf('2') > -1) {
        this.form.type = '2';
      } else {
        this.activeName = 'apparatus-info';
      }
    },
    //点击预约按钮触发的函数
    submit(form) {
      if (!this.checkAudit('预约仪器')) {
        return false;
      }

      this.$refs[form].validate((valid) => {
        if (valid) {
          var pass = true,
            that = this;
          if (this.chosedTimes.length < 1) {
            this.$message.error('请选择预约时间');
            return false;
          }
          if (this.form.sample_num < 1) {
            this.$message.error('请填写样品数量');
            return false;
          }
          try {
            this.chargeList.forEach((item) => {
              pass = false;
              if (item.choose) {
                item.items.forEach((typeItem) => {
                  if (that.checkedCharge.indexOf(typeItem.id) > -1) pass = true;
                });
                if (!pass) throw '请选择检测项目' + item.title;
              }
            });
            that.form.sample_deliver_item_ids = that.checkedCharge.join(',');
            pass = true;
          } catch (error) {
            that.$message.error(error);
            return false;
          }
          if (this.form.type == '1') {
            this.form.hcs_ids = [];
            this.form.reagent_ids = [];
            this.hcses.forEach((item) => {
              if (item.is_auth && item.price_number_num) {
                if (!item.level || !item.specification) {
                  that.$message.error('请选择危化品"' + item.name + '"的等级、规格');
                  pass = false;
                } else {
                  this.form.hcs_ids.push({
                    hcs_id: item.hcs_id,
                    price_number_num: item.price_number_num,
                    level: item.level,
                    specification: item.specification,
                  });
                }
              }
            });
            if (!pass) return false;
            this.form.hcs_ids = JSON.stringify(this.form.hcs_ids);
            this.reagent.forEach((item) => {
              if (item.price_number_num) {
                this.form.reagent_ids.push({
                  reagent_id: item.reagent_id,
                  price_number_num: item.price_number_num,
                });
              }
            });
            this.form.reagent_ids = JSON.stringify(this.form.reagent_ids);
            if (this.form.is_carry_reagents === '1') {
              this.form.carry_reagents = this.form.carry_reagents_arr.join(',');
            }
            if (this.form.is_carry_hcses === '1') {
              this.form.carry_hcses = this.form.carry_hcses_arr.join(',');
            }
            this.form.reagent_ids = this.form.reagent_ids !== '[]' ? this.form.reagent_ids : '';
            this.form.hcs_ids = this.form.hcs_ids !== '[]' ? this.form.hcs_ids : '';
          } else {
            this.form.is_carry_reagents = '0';
            this.form.is_carry_hcses = '0';
            this.form.hcs_ids = '';
            this.form.reagent_ids = '';
          }
          this.form.booking_times = this.chosedTimes;
          this.loading = true;
          booking(this.form).then((res) => {
            this.loading = false;
            if (res.status === 1) {
              //预约成功跳转到个人中的预约记录页面
              this.$router.push('/info-center/my-booking');
            }
          });
        } else {
          return false;
        }
      });
    },
    accountChange(value) {
      this.invoices = [];
      this.form.invoice_id = '';
      if (value) {
        this.loading = true;
        this.accounts.forEach((item) => {
          this.loading = false;
          if (item.research_group_account_id === value) {
            invoiceList({
              research_group_id: item.research_group_id,
              size: 100,
            }).then((res) => {
              this.invoices = res.data.data;
            });
          }
        });
      }
    },
    //计算预约费用
    countBookCharge() {
      this.countForm.type = this.form.type;
      this.countForm.research_group_account_id = this.form.research_group_account_id;
      this.countForm.sample_num = this.form.sample_num;
      this.countForm.sample_deliver_item_ids = this.checkedCharge.join(',');
      let duration = 0;
      this.chosedTimes.forEach((time) => {
        duration += time.end - time.start;
      });
      duration = Math.ceil(duration / 60); //转化成分钟
      this.form.duration = duration;

      this.countForm.date = this.form.date;
      this.countForm.duration = this.form.duration;
      this.countForm.report_type = this.form.report_type;
      if (this.countForm.type == 1) {
        this.countForm.hcs_ids = [];
        this.countForm.reagent_ids = [];
        this.hcses.forEach((item) => {
          if (item.is_auth && item.price_number_num) {
            this.countForm.hcs_ids.push({
              hcs_id: item.hcs_id,
              price_number_num: item.price_number_num,
              level: item.level,
              specification: item.specification,
            });
          }
        });
        this.countForm.hcs_ids =
          this.countForm.hcs_ids.length === 0 ? '' : JSON.stringify(this.countForm.hcs_ids);
        this.reagent.forEach((item) => {
          if (item.price_number_num) {
            this.countForm.reagent_ids.push({
              reagent_id: item.reagent_id,
              price_number_num: item.price_number_num,
            });
          }
        });
        this.countForm.reagent_ids =
          this.countForm.reagent_ids.length === 0 ? '' : JSON.stringify(this.countForm.reagent_ids);
      } else {
        this.countForm.reagent_ids = '';
        this.countForm.hcs_ids = '';
      }
      this.loading = true;
      countMoney(this.countForm).then((res) => {
        this.loading = false;
        if (res.status === 200) {
          this.totalPrice = res.data.total_charge;
        }
      });
    },
    getBookingTime() {
      let currentDay = new Date();
      let params = {
        apparatus_id: this.$route.params.id,
        start_date:
          '' +
          currentDay.getFullYear() +
          '-' +
          this.getFulldate(currentDay.getMonth() + 1) +
          '-' +
          currentDay.getDate(),
        end_date: timestampFormat(
          'Y-m-d',
          parseInt(currentDay.setDate(currentDay.getDate() + 40) / 1000)
        ),
      };
      bookableTime(params).then((res) => {
        if (res.status === 200) {
          let that = this;
          let remainTime = [];
          this.bookableTime = res.data;
          if (res.data.booking_limit) {
            this.booking_limit = res.data.booking_limit;
            this.booking_start_at = res.data.booking_start_at;
            this.booking_end_at = res.data.booking_end_at;
          }
          for (let key in this.bookableTime.bookable_time) {
            let start = new Date(key + ' 00:00:00').getTime() / 1000;
            let end = new Date(key + ' 23:59:59').getTime() / 1000;

            if (this.bookableTime.bookable_time[key].length > 0) {
              let totalTime = 0;
              let bookedTime = 0;
              let canBooking = true;
              this.bookableTime.bookable_time[key].forEach((item) => {
                totalTime += item.end - item.start;
              });
              remainTime[key] = totalTime;
              if (this.bookableTime.booked_time[key]) {
                this.bookableTime.booked_time[key].forEach((item) => {
                  bookedTime += item.end - item.start;
                });
                if (totalTime <= bookedTime) {
                  canBooking = false;
                }
                remainTime[key] = totalTime - bookedTime;
              }
              let seconds = remainTime[key];
              let hours = Math.floor(seconds / 3600);
              let minute = Math.floor((seconds % 3600) / 60);
              remainTime[key] = hours + '小时';
              if (minute) {
                remainTime[key] += minute + '分钟';
              }
              if (canBooking) {
                that.events.push({
                  title: '可预约',
                  start: key,
                  color: '#669900',
                  textColor: '#ffffff',
                  editable: false,
                  selectable: false,
                });
              } else {
                that.events.push({
                  title: '已约满',
                  start: key,
                  color: 'gray',
                  textColor: '#ffffff',
                  editable: false,
                  selectable: false,
                });
              }
            }
            // 设置不可预约的时间
            this.bookableTime.bookable_time[key].forEach((item, index) => {
              if (this.bookableTime.not_open_time[key].length > 0) {
                this.bookableTime.not_open_time[key].forEach((item1, index1) => {
                  that.agendaDayEvents.push({
                    flag: 'not_open_time',
                    title: '未开放预约',
                    start: timestampFormat('Y-m-dTH:i:s', item1.start),
                    end: timestampFormat('Y-m-dTH:i:s', item1.end),
                    color: '#dee2e6',
                    textColor: '#999',
                    selectable: false,
                    editable: false,
                  });
                });
              }
              if (this.bookableTime.bookable_time[key].length === 1) {
                if (item.end !== end) {
                  // that.agendaDayEvents.push({
                  //   flag: 'not_open_time',
                  //   title: '未开放预约',
                  //   start: timestampFormat('Y-m-dTH:i:s', item.end),
                  //   end: timestampFormat('Y-m-dTH:i:s', end),
                  //   color: '#dee2e6',
                  //   textColor: '#999',
                  //   selectable: false,
                  //   editable: false
                  // })
                }
              } else {
                if (index === 0) {
                  if (item.start !== start) {
                    // that.agendaDayEvents.push({
                    //   flag: 'not_open_time',
                    //   title: '未开放预约',
                    //   start: timestampFormat('Y-m-dTH:i:s', start),
                    //   end: timestampFormat('Y-m-dTH:i:s', item.start),
                    //   color: '#dee2e6',
                    //   textColor: '#999',
                    //   selectable: false,
                    //   editable: false
                    // })
                  }
                } else if (index === this.bookableTime.bookable_time[key].length - 1) {
                  if (item.end !== end) {
                    // that.agendaDayEvents.push({
                    //   flag: 'not_open_time',
                    //   title: '未开放预约',
                    //   start: timestampFormat('Y-m-dTH:i:s', item.end),
                    //   end: timestampFormat('Y-m-dTH:i:s', end),
                    //   color: '#dee2e6',
                    //   textColor: '#999',
                    //   selectable: false,
                    //   editable: false
                    // })
                  }
                } else {
                  that.agendaDayEvents.push({
                    flag: 'not_open_time',
                    title: '未开放预约',
                    start: timestampFormat(
                      'Y-m-dTH:i:s',
                      this.bookableTime.bookable_time[key][index - 1].end
                    ),
                    end: timestampFormat('Y-m-dTH:i:s', item.start),
                    color: '#dee2e6',
                    textColor: '#999',
                    selectable: false,
                    editable: false,
                  });
                }
              }
            });
          }
          for (let date in this.bookableTime.booked_detail) {
            if (
              this.bookableTime.bookable_time[date] &&
              this.bookableTime.bookable_time[date].length > 0
            ) {
              if (remainTime[date] != '0小时') {
                that.events.push({
                  title: '剩余' + remainTime[date],
                  start: date,
                  color: '#669900',
                  textColor: '#ffffff',
                  editable: false,
                  selectable: false,
                });
              }
            }
          }
          for (let date in this.bookableTime.booked_time) {
            if (
              this.bookableTime.bookable_time[date] &&
              this.bookableTime.bookable_time[date].length > 0
            ) {
              this.bookableTime.booked_time[date].forEach((item, index) => {
                let title = '预约人: ' + item.creator_name + ' ' + item.creator_mobile;
                // title +='  操作人:'+item.user_name;
                that.agendaDayEvents.push({
                  flag: 'not_open_time',
                  title: title,
                  start: timestampFormat('Y-m-dTH:i:s', item.start),
                  end: timestampFormat('Y-m-dTH:i:s', item.end),
                  color: '#4ecdc4',
                  textColor: '#333',
                  selectable: false,
                  editable: false,
                });
              });
            }
          }
        }
      });
    },
    passAuth() {
      hcsAuth({
        hcs_id: this.currentHcs.hcs_id,
      }).then((res) => {
        if (res.status === 200) {
          this.dialogVisible = false;
          this.currentHcs.is_auth = 1;
        }
      });
    },
    priceNumberChange(current, pre, index, type) {
      if (current !== 0 && !current) {
        if (type === 1) {
          this.form.sample_num = -1;
        } else if (type === 2) {
          this.reagent[index].price_number_num = -1;
        } else {
          this.hcses[index].price_number_num = -1;
        }
      }
      this.countBookCharge();
    },
    getChargeType(type) {
      switch (type) {
        case 1:
          return '小时';
        case 2:
          return '次';
        case 3:
          return '样品';
      }
    },
    reportTypeChange(value) {
      this.form.report_type = 1;
      this.countBookCharge();
    },
    monthDays(year, month) {
      var now = new Date(year, month, 0);
      return now.getDate();
    },
    getFulldate(time) {
      if (time < 10) {
        time = '0' + time;
      }
      return time;
    },
    getAccounts() {
      researchGroupAccountAuthList(this.queryAccountForm).then((res) => {
        if (res.status === 200) {
          this.accounts = res.data.data;
          if (this.accounts.length > 0) {
            this.form.research_group_account_id = this.accounts[0].research_group_account_id;
          }
        }
      });
    },
    getReagentList() {
      apparatusReagentList(this.queryReagentForm).then((res) => {
        if (res.status === 200) {
          this.reagent = [];
          res.data.data.forEach((item) => {
            item.price_number_num = 0;
            this.reagent.push(item);
          });
        }
      });
    },
    tabClick(tab) {
      // var vm = this
      // this.agendaDayEvents.forEach((item, index) => {
      //   if (item.flag && item.flag == 'not_open_time') {
      //     vm.agendaDayEvents.splice(index, 1)
      //   }
      // })

      if (tab.name === 'appointment') {
        this.checkForAppointment();
      }
    },
    checkForAppointment() {
      let vm = this;
      this.showMonth = true;
      this.chosedTimes = [];
      this.form.duration = 0;
      this.form.report_type = 0;
      if (this.member.id && this.apparatus.is_auth == 0 && this.form.type === '1') {
        this.getExam();
        this.showExam = true;
      } else {
        if (this.member.id && this.form.type === '1') {
          this.showNotice = true;
        }
      }
      this.agendaDayEvents.forEach((item, index) => {
        // if (item.flag && item.flag == 'not_open_time') {
        //   vm.agendaDayEvents.splice(index, 1)
        // } else if (item.flag && item.flag == 'book_time') {
        //   vm.agendaDayEvents.splice(index, 1)
        // }
        //已选时间取消掉
        if (item.flag && item.flag == 'book_time') {
          vm.agendaDayEvents.splice(index, 1);
        }
      });
      if (!this.showExam) {
        this.countBookCharge();
      }

      this.$refs.agendaDayCalendar.fireMethod('refetchEvents');

      this.$forceUpdate();
    },
    reSelectDate() {
      let that = this,
        events = JSON.parse(JSON.stringify(this.agendaDayEvents));
      this.showMonth = true;
      this.form.report_type = 0;
      this.form.date = '';
      this.form.duration = 0;
      this.form.booking_times = [];
      this.chosedTimes = [];
      events.forEach((item, index) => {
        if (item.flag && item.flag == 'book_time') {
          that.agendaDayEvents.forEach((item1, index1) => {
            if (item.resourceId === item1.resourceId) that.agendaDayEvents.splice(index1, 1);
          });
        }
      });
      this.countBookCharge();
    },
    toIndex() {
      this.$router.push({
        path: '/',
      });
    },
    updateApparatusProperties() {
      this.apparatusLeftProperties.push({
        name: '资产编号',
        desc: this.apparatus.no ? this.apparatus.no : '-',
      });
      this.apparatusLeftProperties.push({
        name: '放置地点',
        desc: this.apparatus.address ? this.apparatus.address : '-',
      });
      this.apparatusRightProperties.push({
        name: '生产厂商',
        desc: this.apparatus.factory ? this.apparatus.factory : '-',
      });
      this.apparatusRightProperties.push({
        name: '设备国别',
        desc: this.apparatus.country ? this.apparatus.country : '-',
      });
      this.apparatusRightProperties.push({
        name: '设备型号',
        desc: this.apparatus.model ? this.apparatus.mode : '-',
      });
      this.apparatusRightProperties.push({
        name: '设备价格',
        desc: this.apparatus.price ? this.apparatus.price : '-',
      });
      this.apparatusRightProperties.push({
        name: '所属单位',
        desc: this.apparatus.platform_name ? this.apparatus.platform_name : '-',
      });
      this.apparatusRightProperties.push({
        name: '负责人',
        desc: this.apparatus.admin_name + ' ' + this.apparatus.admin_mobile,
      });
    },
  },
};
</script>
<style scoped>
.info {
  padding: 0;
  margin: 0;
  list-style-type: none;
  margin: 15px 0;
}

.tl {
  font-weight: bold;
}

.info li {
  float: left;
  /* width: 350px; */
  height: 240px;
  width: 35%;
  text-align: center;
  margin-bottom: 18px;
}

h1.cname {
  display: block;
  text-align: left;
  color: #000;
  padding: 0;
  padding-left: 15px;
  font-size: 20px;
}

.info li table {
  width: 100%;
  border-collapse: collapse;
}

.info li table.r_info td {
  border: none;
  padding: 5px 15px;
  font-size: 14px;
}

.charge_required >>> .el-form-item__label:before {
  content: '*';
  color: #ff4949;
  margin-right: 4px;
}

.invoice-info >>> .el-radio__input {
  vertical-align: top;
}

.single-question >>> .el-radio-group {
  width: 100%;
}

.single-question >>> .el-radio {
  width: 40%;
  margin-bottom: 10px;
  margin-right: 50px;
  vertical-align: top;
}

.single-question >>> .el-radio__input {
  vertical-align: top;
}

.single-question >>> .el-checkbox {
  width: 40%;
  margin-bottom: 10px;
  margin-right: 50px;
  vertical-align: top;
}

.single-question >>> .el-checkbox__input {
  vertical-align: top;
}
</style>
<style lang="scss" scoped>
.tab-container {
  min-height: 300px;
  padding: 20px 10px;
  font-size: 14px !important;
}

.apparatus-info {
  width: 150px;
}

.device-info {
  border-bottom: 1px solid #efefef;
  margin-bottom: 15px;
}

.tips {
  font-size: 16px;
  color: #ff0000;
  display: inline-block;
  margin-bottom: 15px;
}

.common-box-card {
  width: 80%;
  margin: 0 auto 15px auto;
}

.tab-container {
  min-height: 0;
  padding: 0;
}

.tab-container td {
  font-size: 14px !important;
}

.hcs-process {
  cursor: pointer;
}
</style>
<style lang="scss">
.full-calendar-container {
  width: 90%;
  margin-left: 30px;
  margin-bottom: 18px;
  position: relative;

  .fc-scroller {
    height: 475px !important;
    overflow: hidden scroll !important;
  }

  .fc-widget-header {
    width: 51px !important;
  }

  .fc-content-col {
    width: 100% !important;
  }
}

.el-calendar-container {
  .el-calendar__button-group {
    display: none;
  }
}

.intro-form {
  .el-form-item__content {
    width: 80%;
  }
}
</style>
<style scoped>
.tab-container >>> .cell {
  font-size: 14px !important;
}
</style>
