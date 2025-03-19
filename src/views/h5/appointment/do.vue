<template>
  <div>
    <van-nav-bar
      :title="form.type == '1' ? '自主操作' : '送样检测'"
      left-text="返回"
      left-arrow
      @click-left="returnTo"
    />
    <div class="apparatus-title">设备信息：</div>
    <van-card
      :desc="'类型：' + apparatus.type_name"
      :title="apparatus.name"
      :thumb="domain + apparatus.picture"
      style="margin-bottom: 18px"
    >
      <div slot="tags" class="apparatus-descibe">负责人： {{ apparatus.admin_name }}</div>
      <div slot="tags" class="apparatus-descibe">仪器归属： {{ apparatus.platform_name }}</div>
      <div slot="tags" class="apparatus-descibe">
        共享方式：
        <van-tag v-if="checkType(apparatus.share_type, '1')" plain type="primary">自主操作</van-tag>
        <van-tag v-if="checkType(apparatus.share_type, '2')" plain type="primary">送样检测</van-tag>
      </div>
      <div slot="tags" class="apparatus-descibe">
        仪器状态：
        <van-tag v-if="apparatus.is_sharing === 1" plain type="primary">已共享</van-tag>
        <van-tag v-else plain type="warning">未共享</van-tag>
        <van-tag v-if="apparatus.status === 1" plain type="success">正常</van-tag>
        <van-tag v-if="apparatus.status === 2" plain>维护</van-tag>
        <van-tag v-if="apparatus.status === 3" plain type="danger">损坏</van-tag>
      </div>
    </van-card>
    <!-- <van-steps v-if="form.type === '1'" :active="activeStep" class="appointment-step">
            <van-step>选择预约类型</van-step>
            <van-step>选择预约日期</van-step>
            <van-step>预约</van-step>
        </van-steps> -->
    <div>
      <div v-if="form.date" class="selected-date">
        <el-form label-width="120px">
          <el-form-item label="预约日期">
            {{ form.date }}
            <van-button
              plain
              style="vertical-align: middle"
              size="mini"
              type="info"
              @click="showCanAppointmentTime = true"
              >查看预约详细</van-button
            >
          </el-form-item>
        </el-form>
        <!-- 预约日期：  -->
      </div>
      <!-- <div v-if="activeStep === 2 && form.type === '1'" class="selected-date">
                预计时长: {{ form.duration }} 分钟
            </div> -->
      <!-- <div v-if="activeStep === 2 && form.type === '1'" class="selected-date">
                基本费用: {{ apparatus.charge_rule && apparatus.admin_id !== member.id ? (member.is_inner ? apparatus.charge_rule.charge : apparatus.charge_rule.external_charge) : 0 }} 元/{{ getChargeType(apparatus.charge_rule ? apparatus.charge_rule.charge_type : 0) }}
            </div>
            <div v-if="activeStep === 2 && form.type === '2'" class="selected-date">
                基本费用: {{ apparatus.charge_rule && apparatus.admin_id !== member.id ? (member.is_inner ? apparatus.charge_rule.charge : apparatus.charge_rule.external_charge) : 0 }} 元/样品
            </div>
            <div v-if="activeStep === 2" class="selected-date">
                开机费用: {{ apparatus.charge_rule && apparatus.admin_id !== member.id ? apparatus.charge_rule.boot_charge : 0 }} 元
            </div>
            <div v-if="activeStep === 2" class="selected-date">
                服务费用: {{ apparatus.charge_rule && apparatus.admin_id !== member.id ? apparatus.charge_rule.service_charge : 0 }} 元
            </div>
            <div v-if="activeStep === 2" class="selected-date">
                您的折扣: 
                <span v-if="apparatus.admin_id === member.id">您是该仪器的管理员，免基本费、开机费、服务费</span>
                <span v-else>{{ apparatus.discount === 100 ? '无折扣' : (apparatus.discount / 10).toFixed(1) + '折' }}</span>
            </div> -->
      <div v-if="activeStep === 2" class="selected-date">
        预计费用: <span style="color: #ff0000">{{ getPrice }} 元</span>
        <span v-if="apparatus.admin_id !== member.id && apparatus.discount < 100"
          >(原价<s>{{ costPrice }}</s
          >)</span
        >
      </div>
      <div v-if="!form.date" class="month-calendar">
        <full-calendar
          id="schedulerCalendar"
          ref="calendar"
          style="margin-bottom: 30px"
          :events="events"
          :config="config"
        ></full-calendar>
      </div>
      <div v-else class="select-type">
        <!-- <van-radio-group v-model="form.type">
                    <van-cell-group>
                        <van-cell title="自主操作" clickable @click="radio = '1'">
                            <van-radio slot="right-icon" name="1" @click="showCanAppointmentTime = true" />
                        </van-cell>
                        <van-cell title="送样检测" clickable @click="radio = '2'">
                            <van-radio slot="right-icon" name="2" />
                        </van-cell>
                    </van-cell-group>
                </van-radio-group> -->
        <div class="full-calendar-container">
          <div class="selected-date">
            <el-form label-width="120px">
              <el-form-item label="预约时间">
                <van-tag
                  v-for="(item, index) in form.booking_times"
                  class="right-10"
                  closeable
                  @close="unSelectTime(index)"
                  :key="index"
                  color="#7232dd"
                  >{{ timeFormat(item[0]) }} - {{ timeFormat(item[1]) }}</van-tag
                >
                <van-button size="small" type="info" class="block" @click="toSelectTime(true)"
                  >选择预约时间</van-button
                >
              </el-form-item>
            </el-form>
          </div>
          <!-- <div class="selected-date">
                        开始时间： {{ form.start_at ? timeFormat(form.start_at) : '' }}
                        <van-button size="small" type="info" @click="toSelectTime(true)">选择开始时间</van-button>
                    </div>
                    <div class="selected-date">
                        结束时间： {{ form.end_at ? timeFormat(form.end_at) : '' }}
                        <van-button size="small" type="info" @click="toSelectTime(false)">选择结束时间</van-button>
                    </div> -->
          <!-- <div class="selected-date">
                        <van-button plain size="small" type="info" @click="showCanAppointmentTime = true">查看预约详细</van-button>
                    </div> -->
        </div>
        <!-- <div class="step-btn-container">
                    <van-button @click="toBook" type="info">选好了</van-button>
                </div> -->
      </div>
      <div v-if="form.date" class="form-container">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-form-item label="样品名称" prop="sample_name">
            <el-input
              v-model="form.sample_name"
              class="width-80-percent"
              type="text"
              :min="0"
              size="small"
            />
          </el-form-item>
          <el-form-item label="样品数量" prop="sample_num">
            <el-input-number
              @change="
                (currentValue, oldValue) => {
                  priceNumberChange(currentValue, oldValue, 0, 1);
                }
              "
              size="small"
              :min="0"
              :step="1"
              :precision="0"
              v-model="form.sample_num"
            ></el-input-number>
            份
          </el-form-item>
          <el-form-item
            :label="item.title"
            v-for="(item, index) in chargeList"
            :key="index"
            class="check-charge"
            :class="item.choose ? 'charge_required' : ''"
          >
            <el-checkbox-group
              @change="
                (value) => {
                  getPrice();
                }
              "
              v-model="checkedCharge"
            >
              <el-checkbox
                style="display: block"
                v-for="(typeItem, typeIndex) in item.items"
                :key="typeIndex"
                :label="typeItem.id"
                :checked="item.choose == 1"
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
                {{ typeItem.note }}{{ typeItem.self_free ? '(自主检测免费)' : '' }}
              </el-checkbox>
            </el-checkbox-group>
            <!-- <el-input-number size="small" :min="0" :step="1" :precision="0" v-model="form.sample_num"></el-input-number> 份 -->
          </el-form-item>
          <!-- <el-form-item label="期望完成时间" v-if="form.type == 2" prop="expected_finish_date">
                        <el-date-picker
                            v-model="form.expected_finish_date"
                            type="date"
                            size="small"
                            :picker-options="pickerOptions"
                            placeholder="选择期望完成时间">
                            </el-date-picker>
                    </el-form-item> -->
          <el-form-item label="预计费用">
            <div style="color: #ff0000">
              {{ totalPrice }} 元
              <!-- <span v-if="apparatus.admin_id !== member.id && apparatus.discount < 100">(原价<s>{{ costPrice }}</s>)</span> -->
            </div>
          </el-form-item>
          <el-form-item label="预计时长">
            {{ durationDesc }}
          </el-form-item>
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
          <el-form-item label="付款账号" prop="research_group_account_id">
            <el-select
              v-model="form.research_group_account_id"
              size="small"
              @change="accountChange"
              class="max-width-200"
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
          <!-- <el-form-item v-if="form.research_group_account_id" class="invoice-info" label="发票信息">
                        <el-radio-group v-model="form.invoice_id">
                            <el-radio style="display: block; margin-top: 10px;" v-for="(item, index) in invoices" :key="index" :label="item.id">
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
            >
              <el-option label="原始数据" :value="1" />
              <el-option label="数据报告" :value="2" />
            </el-select>
            <el-select
              v-if="report_type === 2"
              @change="
                (value) => {
                  getPrice();
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
            <el-select v-model="form.reposrt_send_type" size="small" placeholder="请选择">
              <el-option label="自取" :value="1" />
              <el-option v-if="!member.is_inner" label="寄送" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="检测要求" prop="note">
            <el-input type="textarea" class="width-80-percent" v-model="form.note" size="small" />
          </el-form-item>
          <el-card
            v-if="reagent.length > 0 && form.type == 1"
            class="common-box-card index-common-table-container"
          >
            <div slot="header" class="index-box-card-header">
              <span>耗材</span>
            </div>
            <div class="tab-container">
              <el-table :data="reagent" border style="width: 100%">
                <el-table-column label="名称">
                  <template slot-scope="scope">
                    {{ scope.row.name }} <br />
                    ({{ scope.row.price }}元/最小使用量)
                  </template>
                </el-table-column>
                <!-- <el-table-column
                                prop="price_number"
                                label="最小使用量">
                                </el-table-column> -->
                <!-- <el-table-column
                                prop="price"
                                label="价格（元/最小使用量">
                                </el-table-column> -->
                <el-table-column label="预约使用量">
                  <template slot-scope="scope">
                    <!-- <el-input type="number" :min="0" class="max-width-100" v-model="scope.row.price_number_num" size="small" /> -->
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
          <el-form-item v-if="form.type === '1'" label="是否自带耗材">
            <el-select
              v-model="form.is_carry_reagents"
              size="small"
              class="max-width-200"
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
              class="max-width-200"
              allow-create
              multiple
              filterable
              default-first-option
            >
              <el-option
                v-for="item in reagentOptions"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              >
              </el-option>
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
              <el-table :data="hcses" @row-click="authHcs" border style="width: 100%">
                <el-table-column label="名称" width="100px">
                  <template slot-scope="scope">
                    {{ scope.row.name }} <br />
                    ({{ scope.row.price }}元/最小使用量，最小使用量为{{ scope.row.price_number }})
                  </template>
                </el-table-column>
                <!-- <el-table-column
                                prop="price_number"
                                label="最小使用量">
                                </el-table-column> -->
                <!-- <el-table-column
                                prop="price"
                                label="价格（元/最小使用量">
                                </el-table-column> -->
                <!-- <el-table-column
                                label="等级">
                                    <template slot-scope="scope">
                                        <el-select size="small" v-model="scope.row.level" placeholder="请选择等级">
                                            <el-option
                                                v-for="item in scope.row.levels"
                                                :key="item"
                                                :label="item"
                                                :value="item">
                                            </el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                label="规格">
                                    <template slot-scope="scope">
                                        <el-select size="small" v-model="scope.row.specification" placeholder="请选择规格">
                                            <el-option
                                                v-for="item in scope.row.specifications"
                                                :key="item"
                                                :label="item"
                                                :value="item">
                                            </el-option>
                                        </el-select>
                                    </template>
                                </el-table-column> -->
                <el-table-column label="等级/规格/预约使用量">
                  <template slot-scope="scope">
                    <el-form abel-width="55px">
                      <el-form-item label="等级">
                        <el-select size="small" v-model="scope.row.level" placeholder="请选择等级">
                          <el-option
                            v-for="item in scope.row.levels"
                            :key="item"
                            :label="item"
                            :value="item"
                          >
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="规格">
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
                      </el-form-item>
                      <el-form-item label="预约使用量">
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
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column label="负责人" width="100px">
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
              class="max-width-200"
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
              class="max-width-200"
              allow-create
              multiple
              filterable
              default-first-option
            >
              <el-option
                v-for="item in hcsOptions"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <div class="step-btn-container">
            <el-button @click="submit('form')" type="primary">预约</el-button>
          </div>
        </el-form>
      </div>
    </div>
    <van-popup v-model="showTime" :style="{ height: '100%' }" position="bottom">
      <van-datetime-picker
        v-model="currentTime"
        type="time"
        :title="'选择' + (chooseStart ? '开始' : '结束') + '时间'"
        @cancel="selectTimeCancel"
        @confirm="selectTime"
        :filter="filter"
      />
    </van-popup>
    <van-popup v-model="showCanAppointmentTime" position="right">
      <div class="can-appointment-time">
        <div class="selected-date">开放预约时间段：</div>
        <div class="selected-date" v-for="(item, index) in openTime" :key="index">
          <van-tag plain>{{ item }}</van-tag>
        </div>
        <div class="selected-date">已约时间段：</div>
        <div class="selected-date" v-for="(item, index) in bookedTime" :key="index">
          <van-tag type="danger">{{ item }}</van-tag>
        </div>
        <div v-if="bookedTime.length === 0" class="selected-date">
          <van-tag>暂无人预约该设备</van-tag>
        </div>
      </div>
    </van-popup>
    <el-dialog
      title="说明书"
      :fullscreen="true"
      :close-on-click-modal="false"
      :show-close="false"
      :visible.sync="dialogVisible"
    >
      <div class="hcs-statement" v-html="currentHcs.msds_content"></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="passAuth">已学习</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="危化品在线领用流程"
      :fullscreen="true"
      :close-on-click-modal="false"
      :show-close="false"
      :visible.sync="showProcess"
    >
      <div class="hcs-statement" v-html="hcsStatement"></div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showProcess = false">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="仪器使用注意事项"
      :fullscreen="true"
      :close-on-click-modal="false"
      :show-close="false"
      :visible.sync="showNotice"
    >
      <div class="hcs-statement" v-html="apparatus.notice"></div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showNotice = false">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="仪器使用考试"
      :fullscreen="true"
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
        <el-button @click="cancleExam">返回</el-button>
        <el-button type="primary" @click="commitExam">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  apparatusInfo,
  apparatusReagentList,
  booking,
  bookableTime,
  examQuestions,
  checkTrain,
  submitExam,
} from '@/api/apparatus';
import { invoiceList } from '@/api/invoice';
import { countMoney } from '@/api/booking';
import { sampleDeliverList } from '@/api/charge';
import { researchGroupAccountAuthList } from '@/api/research';
import { hcsAuth } from '@/api/hcs';
import { settingInfo } from '@/api/system';
import { allUsers } from '@/api/user';
import { timestampFormat, timeFormat } from '@/utils/index';
import { FullCalendar } from 'vue-full-calendar';
import { Toast, Notify, Dialog } from 'vant';
import { mapGetters } from 'vuex';
import moment from 'moment';
import dataFormat from 'js-dateformat';
import 'fullcalendar/dist/fullcalendar.css';
import Item from '../../../layout/components/Sidebar/Item.vue';

export default {
  components: {
    FullCalendar,
    Item,
  },
  data() {
    var that = this;
    var dateFormat = dataFormat.dateFormat;
    return {
      apparatus: { share_type: '' },
      queryForm: {
        id: '',
        is_deleted: 0,
      },
      reagentOptions: [],
      hcsOptions: [],
      chooseStart: true,
      currentTime: '08:00',
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
        research_group_account_id: '',
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
      queryReagentForm: {
        page: 1,
        size: 100,
        apparatus_id: '',
        is_deleted: 0,
      },
      queryAccountForm: {
        page: 1,
        size: 100,
        user_id: '',
        is_deleted: 0,
      },
      pickerOptions: {
        disabledDate(time) {
          return (
            new Date(timeFormat(time, 'yyyy-MM-dd hh:mm:ss').replace(/-/g, '/')).getTime() <=
            Date.now()
          );
        },
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
        sample_num: [
          {
            required: true,
            message: '请填写样品数量',
            trigger: 'blur',
          },
        ],
        sample_name: [
          {
            required: true,
            message: '请填写样品名称',
            trigger: 'blur',
          },
        ],
        // note: [{ required: true, message: '请填写检测要求', trigger: 'blur' }],
        // research_group_account_id: [{ required: true, message: '请选择付款账号', trigger: 'change' }]
      },
      errorMsg: {
        sample_num: '',
        note: '',
      },
      costPrice: 0,
      activeStep: 0,
      totalPrice: 0,
      report_type: 1,
      domain: process.env.VUE_APP_DOMAIN,
      showExam: false,
      showNotice: false,
      showTime: false,
      showCanAppointmentTime: false,
      isTrain: false,
      autonomous: false,
      sample: false,
      showProcess: false,
      dialogVisible: false,
      hcses: [],
      reagent: [],
      events: [],
      accounts: [],
      agendaDayEvents: [],
      judgmentList: [],
      singleChoose: [],
      multiChoose: [],
      chargeList: [],
      invoices: [],
      checkedCharge: [],
      allUsers: [],
      hcsStatement: '',
      currentHcs: {},
      bookableTime: {
        booked_time: [],
      },
      submitForm: {
        apparatus_id: '',
        answers: [],
      },
      selectMonth: '',
      canAppointment: [],
      cantNotAppointment: [],
      openTime: [],
      bookedTime: [],
      config: {
        locale: 'zh-cn',
        defaultView: 'month',
        selectAllow: function (clickInfo) {
          var start = clickInfo.start.unix() - 28800;
          var end = clickInfo.end.unix() - 28800;
          var canSelect = false;
          that.canAppointment.forEach((item) => {
            if (start >= item.start && end <= item.end) {
              canSelect = true;
            }
          });
          return canSelect;
        },
        dayClick(date, allDay, jsEvent, view) {
          if (that.apparatus.need_train && !that.isTrain) {
            that.$message.info('请先参加该仪器的培训');
            return false;
          }
          if (jsEvent.type === 'month') {
            var selectDate = dateFormat(date._d, 'yyyy-mm-dd');
            var canSelect = false;
            that.canAppointment = [];
            that.cantNotAppointment = [];
            for (var key in that.bookableTime.bookable_time) {
              if (key === selectDate && that.bookableTime.bookable_time[key].length > 0) {
                that.canAppointment = that.bookableTime.bookable_time[key];
                that.form.date = selectDate;
                that.selectMonth = '' + selectDate.split('-')[0] + '-' + selectDate.split('-')[1];
                canSelect = true;
              }
            }
            if (
              that.bookableTime.booked_time[selectDate] &&
              that.bookableTime.booked_time[selectDate].length > 0
            ) {
              that.cantNotAppointment = that.bookableTime.booked_time[selectDate];
            }
            if (!canSelect) {
              Notify({
                type: 'warning',
                message: dateFormat(date._d, 'yyyy年mm月dd日') + '未开放预约',
              });
            } else {
              that.setCanAppointmentTime(selectDate);
              that.activeStep = 1;
              if (that.autonomous) that.showCanAppointmentTime = true;
            }
          }
        },
        eventClick(event, jsEvent, view) {
          var selectDate = dateFormat(event.start._d, 'yyyy-mm-dd');
          that.canAppointment = [];
          that.form.date = selectDate;
          that.selectMonth = '' + selectDate.split('-')[0] + '-' + selectDate.split('-')[1];
          for (var key in that.bookableTime.bookable_time) {
            if (key === selectDate) {
              that.canAppointment = that.bookableTime.bookable_time[key];
            }
          }
          if (
            that.bookableTime.booked_time[selectDate] &&
            that.bookableTime.booked_time[selectDate].length > 0
          ) {
            that.cantNotAppointment = that.bookableTime.booked_time[selectDate];
          }
          that.setCanAppointmentTime(selectDate);
          that.activeStep = 1;
          if (that.autonomous) that.showCanAppointmentTime = true;
        },
        allDaySlot: false,
        header: {
          left: 'prev,next myCustomButton',
          center: 'title',
          right: '',
        },
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
  },
  created() {
    this.form.apparatus_id = this.$route.params.id;
    this.countForm.apparatus_id = this.$route.params.id;
    this.queryReagentForm.apparatus_id = this.$route.params.id;
    this.form.type = this.$route.query.type ? this.$route.query.type : '1';
    if (this.member.id) {
      this.queryAccountForm.user_id = this.member.id;
      this.form.user_id = this.member.id;
      checkTrain(this.queryForm).then((res) => {
        if (res.status === 200) {
          this.isTrain = res.data.is_train;
        }
      });
    }
    this.getInfo();
    this.getAccounts();
    this.loadAllUsers();
    this.getChargeList();
    this.getReagentList();
    settingInfo({ type: 'hcs_statement' }).then((res) => {
      if (res.status === 200) {
        this.hcsStatement = res.data.value;
      }
    });
  },
  methods: {
    loadAllUsers() {
      allUsers().then((res) => {
        this.allUsers = res.data.users;
      });
    },
    filter(type, options) {
      if (type === 'minute') {
        return options.filter((option) => option % 30 === 0);
      }
      return options;
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
      if (!checkPass) return false;
      this.submitForm.apparatus_id = this.apparatus.id;
      this.submitForm.answers = JSON.stringify(this.submitForm.answers);
      this.loading = true;
      submitExam(this.submitForm)
        .then((res) => {
          var that = this;
          this.loading = false;
          if (res.status === 1) {
            this.apparatus.is_auth = 1;
            this.showExam = false;
            setTimeout(function () {
              that.showNotice = true;
            }, 2000);
          } else if (res.status === 200) {
            function beforeClose(action, done) {
              done();
              if (action === 'confirm') {
                that.clearAnswer();
              } else {
                that.$router.push({
                  path: '/h5/apparatus/list',
                });
              }
            }
            Dialog.confirm({
              title: '提示',
              cancelButtonText: '不考了',
              confirmButtonText: '重新考试',
              message: res.msg + ',是否重新开始考试?',
              beforeClose,
            });
          }
        })
        .catch((_) => {
          this.loading = false;
        });
    },
    cancleExam() {
      this.$router.push({ path: '/h5/apparatus/list' });
    },
    submit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          var pass = true,
            that = this;
          if (this.form.booking_times.length == 0) {
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
                if (!pass) throw '请选择' + item.title;
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
                  reagent_id: item.id,
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
          Toast.loading({
            mask: true,
            message: '提交中...',
          });
          var form = JSON.parse(JSON.stringify(this.form));
          var bookingTimes = [];
          form.booking_times.forEach((item) => {
            bookingTimes.push({
              start:
                new Date(
                  (form.date + ' ' + this.timeFormat(item[0]) + ':00').replace(/-/g, '/'),
                ).getTime() / 1000,
              end:
                new Date(
                  (form.date + ' ' + this.timeFormat(item[1]) + ':00').replace(/-/g, '/'),
                ).getTime() / 1000,
            });
          });
          form.booking_times = bookingTimes;
          booking(form).then((res) => {
            Toast.clear();
            if (res.status === 1) {
              this.$router.push({ path: '/h5/apparatus/list' });
            }
          });
        } else {
          return false;
        }
      });
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
    toBook() {
      if (this.form.type === '1') {
        if (this.form.start_at === '') {
          Notify({ type: 'warning', message: '请选择开始时间' });
          return false;
        }
        if (this.form.end_at === '') {
          Notify({ type: 'warning', message: '请选择结束时间' });
          return false;
        }
      } else {
        this.form.start_at = '';
        this.form.end_at = '';
        this.form.duration = 0;
      }
      this.activeStep = 2;
    },
    toSelectTime(chooseStart) {
      var that = this;
      // this.chooseStart = chooseStart
      if (this.chooseStart) {
        this.showTime = true;
      } else {
        if (this.form.start_at === '') {
          Notify({ type: 'warning', message: '请先选择开始时间' });
        } else {
          this.showTime = true;
        }
      }
    },
    selectTime(value) {
      var that = this;
      var canSelect = false;
      var timeStr = value.replace(/:/, '');
      if (this.chooseStart) {
        var selectedTime =
          Number(new Date((this.form.date + ' ' + value + ':00').replace(/-/g, '/')).getTime()) /
          1000;
        that.canAppointment.forEach((item) => {
          if (selectedTime >= item.start && selectedTime <= item.end) {
            canSelect = true;
          }
        });
        if (!canSelect) {
          Notify({ type: 'warning', message: '该时间不可预约' });
          return false;
        }
        if (that.cantNotAppointment.length > 0) {
          that.cantNotAppointment.forEach((item) => {
            if (selectedTime >= item.start && selectedTime <= item.end) {
              canSelect = false;
            }
          });
        }
        if (!canSelect) {
          Notify({ type: 'warning', message: '该时间已被预约' });
          return false;
        }
        if (
          this.form.booking_times.length > 0 &&
          Number(value.replace(/:/, '')) <
            Number(this.form.booking_times[this.form.booking_times.length - 1][1])
        ) {
          Notify({
            type: 'warning',
            message: '当前开始时间不能小于前面已选的时间',
          });
          return false;
        }
        var timeNow = new Date();
        var today =
          timeNow.getFullYear() +
          '-' +
          (timeNow.getMonth() + 1 < 10 ? '0' : '') +
          (timeNow.getMonth() + 1) +
          '-' +
          timeNow.getDate();
        if (
          today == this.form.date &&
          timeStr <=
            (timeNow.getHours() < 10 ? '0' : '') +
              timeNow.getHours() +
              (timeNow.getMinutes() < 10 ? '0' : '') +
              timeNow.getMinutes()
        ) {
          Notify({
            type: 'warning',
            message: '开始时间不能小于当前时间',
          });
          return false;
        }
        this.form.booking_times.push([timeStr, '']);
        // this.showTime = false
        this.chooseStart = false;
      } else {
        var startAt = this.form.booking_times[this.form.booking_times.length - 1][0];
        var start =
          new Date(
            (this.form.date + ' ' + this.timeFormat(startAt) + ':00').replace(/-/g, '/'),
          ).getTime() / 1000;
        var end =
          new Date((this.form.date + ' ' + value + ':00').replace(/-/g, '/')).getTime() / 1000;
        var end_at = value.replace(/:/, '');
        if (Number(end_at) <= Number(startAt)) {
          Notify({
            type: 'warning',
            message: '结束时间必须大于开始时间',
          });
          return false;
        }
        that.canAppointment.forEach((item) => {
          if (start >= item.start && end <= item.end) {
            canSelect = true;
          }
        });
        if (!canSelect) {
          Notify({ type: 'warning', message: '该时间段不可预约' });
          return false;
        }
        if (that.cantNotAppointment.length > 0) {
          that.cantNotAppointment.forEach((item) => {
            if (
              (start >= item.start && start <= item.end) ||
              (end >= item.start && end <= item.end) ||
              (start <= item.start && end >= item.end)
            ) {
              canSelect = false;
            }
          });
        }
        if (!canSelect) {
          Notify({
            type: 'warning',
            message: '该时间段包含已预约时间，不可预约',
          });
          return false;
        }
        this.form.booking_times[this.form.booking_times.length - 1][1] = timeStr;
        let duration = 0;
        this.form.booking_times.forEach((time) => {
          duration += time[1] - time[0];
        });
        this.form.duration = duration;
        this.showTime = false;
        this.chooseStart = true;
      }
      this.getPrice();
    },
    unSelectTime(index) {
      this.form.booking_times.splice(index, 1);
    },
    selectTimeCancel() {
      if (!this.chooseStart) this.form.booking_times.pop();
      this.chooseStart = true;
      this.showTime = false;
    },
    getInfo() {
      this.queryForm.id = this.$route.params.id;
      apparatusInfo(this.queryForm).then((res) => {
        if (res.status === 200) {
          this.apparatus = res.data;
          if (this.apparatus.is_auth == 0 && this.apparatus.need_auth == 1) {
            this.showExam = true;
            this.getExam();
          } else {
            this.showNotice = true;
          }
          this.hcses = [];
          if (this.apparatus.status !== 1 || this.apparatus.is_sharing !== 1) {
            return false;
          }
          this.getBookingTime();
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
          this.reagent = [];
          this.apparatus.reagents.forEach((item) => {
            this.reagent.push(Object.assign({ price_number_num: '' }, item));
          });
          this.apparatus.share_type.split(',').forEach((item, index) => {
            // if (index === 0) {
            //     this.form.type = item
            // }
            if (item == 1) {
              this.autonomous = true;
            }
            if (item == 2) {
              this.sample = true;
            }
          });
        } else {
          this.$router.push({ path: '/h5/apparatus/list' });
        }
      });
    },
    getBookingTime() {
      var currentDay = new Date();
      var params = {
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
          parseInt(currentDay.setDate(currentDay.getDate() + 40) / 1000),
        ),
      };
      bookableTime(params).then((res) => {
        if (res.status === 200) {
          var that = this,
            progressArr = [];
          this.bookableTime = res.data;
          for (var key in this.bookableTime.bookable_time) {
            var start = new Date((key + ' 00:00:00').replace(/-/g, '/')).getTime() / 1000;
            var end = new Date((key + ' 23:59:59').replace(/-/g, '/')).getTime() / 1000;
            if (this.bookableTime.bookable_time[key].length > 0) {
              var totalTime = 0,
                bookingTotal = 0;
              var canBooking = true;
              this.bookableTime.bookable_time[key].forEach((item) => {
                totalTime += item.end - item.start;
              });
              progressArr[key] = 100;
              if (this.bookableTime.booked_time[key]) {
                this.bookableTime.booked_time[key].forEach((item) => {
                  bookingTotal += item.end - item.start;
                });
                if (totalTime === bookingTotal) canBooking = false;
                progressArr[key] = parseInt(1 - bookingTotal / totalTime) * 100;
              }
              if (canBooking) {
                that.events.push({
                  title: '可预约',
                  start: key,
                  color: 'green',
                  textColor: 'white',
                });
              } else {
                that.events.push({
                  title: '已约满',
                  start: key,
                  color: 'gray',
                  textColor: 'white',
                });
              }
            }
            this.bookableTime.bookable_time[key].forEach((item, index) => {
              if (index === 0) {
                that.agendaDayEvents.push({
                  title: '不可约',
                  start: timestampFormat('Y-m-dTH:i:s', start),
                  end: timestampFormat('Y-m-dTH:i:s', item.start),
                  color: 'gray',
                  textColor: 'black',
                  selectable: false,
                  editable: false,
                });
              } else {
                that.agendaDayEvents.push({
                  title: '不可约',
                  start: timestampFormat(
                    'Y-m-dTH:i:s',
                    this.bookableTime.bookable_time[key][index - 1].end,
                  ),
                  end: timestampFormat('Y-m-dTH:i:s', item.start),
                  color: 'gray',
                  textColor: 'black',
                  selectable: false,
                  editable: false,
                });
              }
              if (index === this.bookableTime.bookable_time[key].length - 1) {
                that.agendaDayEvents.push({
                  title: '不可约',
                  start: timestampFormat('Y-m-dTH:i:s', item.end),
                  end: timestampFormat('Y-m-dTH:i:s', end),
                  color: 'gray',
                  textColor: 'black',
                  selectable: false,
                  editable: false,
                });
              }
            });
          }
          for (var date in this.bookableTime.booked_detail) {
            if (
              this.bookableTime.bookable_time[date] &&
              this.bookableTime.bookable_time[date].length > 0
            ) {
              that.events.push({
                title: '剩余可约时间：' + progressArr[date] + '%',
                start: date,
              });
            }
          }
          for (var date in this.bookableTime.booked_time) {
            if (
              this.bookableTime.bookable_time[date] &&
              this.bookableTime.bookable_time[date].length > 0
            ) {
              this.bookableTime.booked_time[date].forEach((item, index) => {
                that.agendaDayEvents.push({
                  title: '已约',
                  start: timestampFormat('Y-m-dTH:i:s', item.start),
                  end: timestampFormat('Y-m-dTH:i:s', item.end),
                  selectable: false,
                  editable: false,
                });
              });
            }
          }
        }
      });
    },
    getAccounts() {
      this.queryAccountForm.user_id = this.member.id;
      researchGroupAccountAuthList(this.queryAccountForm).then((res) => {
        if (res.status === 200) {
          this.accounts = res.data.data;
          if (this.accounts.length > 0) {
            this.form.research_group_account_id = this.accounts[0].research_group_account_id;
          }
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
    reportTypeChange(value) {
      if (value === 1) {
        this.form.report_type = 0;
      } else {
        this.form.report_type = 1;
      }
      this.getPrice();
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
      this.getPrice();
    },
    getPrice() {
      this.countForm.type = this.form.type;
      this.countForm.research_group_account_id = this.form.research_group_account_id;
      this.countForm.sample_num = this.form.sample_num;
      this.countForm.sample_deliver_item_ids = this.checkedCharge.join(',');
      if (this.countForm.type == 1) {
        this.countForm.date = this.form.date;
        this.countForm.start_at = this.form.start_at;
        this.countForm.end_at = this.form.end_at;
        this.countForm.duration = this.form.duration;
        this.countForm.report_type = 0;
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
              reagent_id: item.id,
              price_number_num: item.price_number_num,
            });
          }
        });
        this.countForm.reagent_ids =
          this.countForm.reagent_ids.length === 0 ? '' : JSON.stringify(this.countForm.reagent_ids);
      } else {
        this.countForm.date = '';
        this.countForm.start_at = '';
        this.countForm.end_at = '';
        this.countForm.duration = 0;
        this.countForm.reagent_ids = '';
        this.countForm.hcs_ids = '';
        this.countForm.report_type = this.form.report_type;
      }
      this.loading = true;
      countMoney(this.countForm).then((res) => {
        this.loading = false;
        if (res.status === 200) this.totalPrice = res.data.total_charge;
      });
    },
    setCanAppointmentTime(date) {
      this.openTime = [];
      this.bookedTime = [];
      if (this.bookableTime.bookable_time[date]) {
        this.bookableTime.bookable_time[date].forEach((item, index) => {
          this.openTime.push(
            timestampFormat('H:i', item.start) + ' - ' + timestampFormat('H:i', item.end),
          );
        });
      }
      if (this.bookableTime.booked_time[date]) {
        this.bookableTime.booked_time[date].forEach((item, index) => {
          this.bookedTime.push(
            timestampFormat('H:i', item.start) + ' - ' + timestampFormat('H:i', item.end),
          );
        });
      }
    },
    timeFormat(time) {
      return time.slice(0, 2) + ':' + time.slice(2);
    },
    getFulldate(time) {
      if (time < 10) {
        time = '0' + time;
      }
      return time;
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
    passAuth() {
      hcsAuth({ hcs_id: this.currentHcs.hcs_id }).then((res) => {
        if (res.status === 200) {
          this.dialogVisible = false;
          this.currentHcs.is_auth = 1;
        }
      });
    },
    checkType(type, pattern) {
      var pass = false;
      type = type.split(',');
      type.forEach((item) => {
        if (item === pattern) {
          pass = true;
        }
      });
      return pass;
    },
    returnTo() {
      this.$router.push({ path: '/h5/apparatus/list' });
    },
  },
};
</script>
<style scoped>
.check-charge >>> .el-checkbox__input {
  vertical-align: middle;
}
.check-charge >>> .el-checkbox__label {
  width: 90%;
  display: inline-block;
  word-break: break-all;
  white-space: normal;
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
<style lang="scss">
.month-calendar {
  margin-top: 10px;

  .fc-day-grid-container {
    height: 100% !important;
  }
}
.full-calendar-container {
  .fc-scroller {
    height: 100% !important;
    overflow: hidden scroll !important;
  }
}
.van-popup--right {
  width: 50% !important;
  min-height: 100% !important;
}
.hcs-statement img {
  max-width: 100%;
}
</style>
<style lang="scss" scoped>
.apparatus-title {
  font-size: 14px;
  color: #666666;
  margin: 10px 10px;
}
.van-card__desc {
  margin-bottom: 8px;
}
.apparatus-descibe {
  margin-bottom: 8px;
}
.appointment-step {
  margin-top: 10px;
}
.step-btn-container {
  text-align: center;
  padding-bottom: 18px;

  button {
    margin-top: 15px;
    width: 80%;
  }
}
.selected-date {
  margin: 10px;
  font-size: 16px;
  color: #666666;
}
.selected-date >>> .van-tag {
  padding: 6px;
}
.can-appointment-time {
  min-height: 100%;
}
.el-card {
  margin-bottom: 22px;
}
</style>
