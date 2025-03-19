<template>
  <div
    class="apply-container"
    v-loading="loading"
    element-loading-text="数据处理中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-steps :active="activeIndex" simple style="margin-bottom: 22px">
      <el-step title="提交申请" icon="el-icon-edit"></el-step>
      <el-step title="等待审批" icon="el-icon-user"></el-step>
      <!-- <el-step title="在线考试" icon="el-icon-data-board"></el-step> -->
      <el-step title="平台审核" icon="el-icon-coordinate"></el-step>
    </el-steps>
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <div v-if="activeIndex === 0">
        <el-form-item label="项目信息" prop="projects" required>
          <div
            style="border: 1px solid #eeeeee; width: 100%; border-radius: 10px"
            v-for="(project, pIndex) in form.projects"
            :key="pIndex"
          >
            <el-button plain size="small" style="margin-left: 30px">项目{{ pIndex + 1 }}</el-button>
            <el-form label-width="150px">
              <el-form-item label="项目名称" required>
                <el-input
                  size="small"
                  class="width-300"
                  v-model="project.name"
                  placeholder="请填写项目名称"
                ></el-input>
              </el-form-item>
              <el-form-item label="起止时间" required>
                <el-date-picker
                  v-model="project.project_range"
                  size="small"
                  type="daterange"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="(value) => onProjectTimeChange(project, value)"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="项目负责人" required>
                <el-input
                  size="small"
                  class="width-300"
                  v-model="project.admin_name"
                  placeholder="请填写项目负责人姓名"
                ></el-input>
                <!-- <el-select v-model="project.admin_id" size="small" filterable class="width-300">
                  <el-option v-for="(user,uIndex) in all_users" :label="user.name" :value="user.id" :key="uIndex" />
                </el-select> -->
              </el-form-item>
              <el-form-item label="项目编号" required>
                <el-input
                  size="small"
                  class="width-300"
                  v-model="project.no"
                  placeholder="请填写项目编号"
                ></el-input>
              </el-form-item>
              <el-form-item label="内部编号">
                <el-input
                  size="small"
                  class="width-300"
                  v-model="project.inter_no"
                  placeholder="请填写项目内部编号"
                ></el-input>
              </el-form-item>
              <el-form-item label="支出经费" required>
                <el-input
                  size="small"
                  class="width-300"
                  type="text"
                  v-model="project.charge"
                  placeholder="请填写本项目支出经费"
                ></el-input>
              </el-form-item>
              <el-form-item label="项目来源" required>
                <el-input
                  size="small"
                  type="textarea"
                  :rows="3"
                  class="width-450"
                  v-model="project.source"
                  placeholder="请填写项目来源"
                ></el-input>
              </el-form-item>
              <el-form-item label="项目负责人证明图片" required>
                <el-image
                  v-if="project.img_url != ''"
                  style="height: 150px; width: 150px; margin: 10px"
                  :src="generateImgUrl(project)"
                ></el-image>
                <el-upload
                  :multiple="false"
                  :show-file-list="false"
                  :headers="authHeader"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :on-success="
                    (response, file, fileList) => handleSuccess(project, response, file, fileList)
                  "
                  accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PNG,.GIF,.BMP"
                  class="editor-slide-upload"
                  :action="action"
                  :auto-upload="true"
                >
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
              </el-form-item>
              <div
                style="
                  text-align: right;
                  padding-right: 100px;
                  padding-top: 10px;
                  padding-bottom: 10px;
                "
              >
                <el-button size="small" type="danger" plain @click="form.projects.splice(pIndex, 1)"
                  >删除该项目</el-button
                >
              </div>
            </el-form>
          </div>
          <el-button size="small" type="primary" @click="addNewProject">+ 添加项目</el-button>
        </el-form-item>
        <el-form-item label="仪器培训需求">
          <el-table :data="apparatusTrains" style="width: 100%">
            <el-table-column prop="name" label="培训名称" />
            <el-table-column label="培训项目">
              <template slot-scope="scope">
                <el-checkbox-group
                  class="apparatus-project"
                  v-model="scope.row.checkItem"
                  @change="appratusItemChange"
                >
                  <el-checkbox
                    v-for="(item, index) in JSON.parse(scope.row.config)"
                    :key="index"
                    :label="item.title"
                  >
                    {{ item.title }}（院内用户{{ item.charge }}元，院外用户{{
                      item.external_charge
                    }}元）
                  </el-checkbox>
                </el-checkbox-group>
              </template>
            </el-table-column>
            <el-table-column label="期望培训时间">
              <template slot-scope="scope">
                <el-date-picker
                  size="small"
                  style="width: 150px"
                  v-model="scope.row.train_time"
                  type="date"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd"
                  placeholder="选择期望培训时间"
                >
                </el-date-picker>
              </template>
            </el-table-column>
            <el-table-column label="预计使用仪器时间">
              <template slot-scope="scope">
                <el-date-picker
                  size="small"
                  style="width: 150px"
                  v-model="scope.row.use_time"
                  type="date"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd"
                  placeholder="选择预计使用仪器时间"
                >
                </el-date-picker>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="技术培训需求">
          <el-table
            ref="multipleTable"
            :data="otherTrains"
            tooltip-effect="dark"
            @selection-change="serviceSelectionChange"
            style="width: 100%"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="name" label="培训名称">
              <template slot-scope="scope">
                {{ scope.row.name }}（院内用户{{ scope.row.charge }}元，院外用户{{
                  scope.row.external_charge
                }}元）
              </template>
            </el-table-column>
            <el-table-column label="期望培训时间">
              <template slot-scope="scope">
                <el-date-picker
                  size="small"
                  v-model="scope.row.train_time"
                  type="date"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd"
                  placeholder="选择期望培训时间"
                >
                </el-date-picker>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="实验桌米数" prop="stage_number">
          <el-input-number
            @change="
              (currentValue, oldValue) => {
                numberChange(currentValue, oldValue, 1);
              }
            "
            size="small"
            :min="0"
            :precision="1"
            :step="1.5"
            :step-strictly="true"
            v-model="form.stage_number"
          />
          米（院内用户{{ platform.stage_price }}元/1.5 米/月，院外用户{{
            platform.stage_price_external
          }}元/1.5 米/月）
        </el-form-item>
        <el-form-item label="PI办公桌个数" prop="pi_stage_number">
          <el-input-number
            @change="
              (currentValue, oldValue) => {
                numberChange(currentValue, oldValue, 1);
              }
            "
            size="small"
            :min="0"
            :precision="0"
            :step="1"
            :step-strictly="true"
            v-model="form.pi_stage_number"
          />
          个（院内用户{{ platform.pi_stage_price }}元/个/月，院外用户{{
            platform.pi_stage_price_external
          }}元/个/月）
        </el-form-item>
        <el-form-item label="入室起止时间" prop="range">
          <el-date-picker
            v-model="form.range"
            size="small"
            type="daterange"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="onDateRangeChange"
          >
          </el-date-picker>
          <span>已选 {{ this.months }} 个月</span>
        </el-form-item>
        <el-form-item label="预计费用">
          <span style="font-weight: bolder; font-size: large; color: #ff0000"
            >{{ totalPrice }}元</span
          >
        </el-form-item>
        <!-- 这里不要删除，有危化品填写的逻辑 -->
        <!-- <el-form-item label="是否携带危化品" prop="has_hcs">
          <el-select v-model="form.has_hcs" size="small">
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item> -->
        <el-form-item v-if="form.has_hcs === '1'" label="危化品">
          <el-button size="small" icon="el-icon-plus" @click="addHcs(false)">添加危化品</el-button>
          <el-table :data="hcsList" border style="width: 100%">
            <el-table-column label="危化品名称">
              <template slot-scope="scope">
                <el-input v-model="scope.row.name" size="small" class="max-width-200" clearable />
              </template>
            </el-table-column>
            <el-table-column label="危化品数量" width="160">
              <template slot-scope="scope">
                <el-input-number size="small" :min="1" :precision="0" v-model="scope.row.num" />
              </template>
            </el-table-column>
            <el-table-column label="实验内容">
              <template slot-scope="scope">
                <el-input
                  type="textarea"
                  v-model="scope.row.content"
                  size="small"
                  :rows="3"
                  placeholder="实验内容"
                  clearable
                />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80">
              <template slot-scope="scope">
                <el-button type="danger" size="small" @click="removeItem('hcs', scope.$index)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="实验室条款">
          <div class="platform-promise" v-html="platform.promise"></div>
          <el-checkbox v-model="form.agree">同意实验室条款</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="medium" @click="submit('form')">提交申请</el-button>
        </el-form-item>
      </div>
    </el-form>
    <div v-if="activeIndex === 1" style="text-align: center; margin-top: 30px">
      <div v-if="form.mentor_audit === 0">
        <div
          style="border: 1px solid #eeeeee; width: 100%; border-radius: 10px"
          v-for="(project, pIndex) in form.projects"
          :key="pIndex"
        >
          <!-- 展示项目审批情况 -->
          <div style="text-align: left; padding: 10px">项目{{ pIndex + 1 }}</div>
          <el-table
            :show-header="false"
            :data="generateProjectInfo(project)"
            stripe
            style="width: 100%"
          >
            <el-table-column prop="v1" label="属性" align="left"> </el-table-column>
            <el-table-column prop="v2" label="值" align="left"> </el-table-column>
            <el-table-column prop="v3" label="属性" align="left"> </el-table-column>
            <el-table-column prop="v4" label="值" align="left">
              <template slot-scope="scope">
                <div v-if="scope.row.v4 == '未通过'">
                  <el-popover
                    placement="top-start"
                    title="原因"
                    width="200"
                    trigger="hover"
                    :content="project.reason || '未填写'"
                  >
                    <el-tag size="small" type="danger" slot="reference">未通过</el-tag>
                  </el-popover>
                </div>
                <div v-else-if="scope.row.v4 == '审核中'">
                  <el-tag size="small" type="warning">审核中</el-tag>
                </div>
                <div v-else-if="scope.row.v4 == '已通过'">
                  <el-tag size="small" type="success">已通过</el-tag>
                </div>
                <div v-else>
                  {{ scope.row.v4 }}
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div v-if="form.projects.every((project) => project.status == 1)">
        <img src="/imgs/pass.png" />
        <p>已审核通过</p>
        <el-button type="primary" size="small" @click="activeIndex = 3">下一步</el-button>
      </div>
      <div
        style="text-align: center; padding: 20px"
        v-else-if="form.projects.some((project) => project.status == -1)"
      >
        <p style="color: #999">很遗憾有项目未通过审核</p>
        <el-button type="primary" size="small" @click="activeIndex = 0">重新申请</el-button>
      </div>
      <div v-else>
        <p style="color: #999">请等待所有项目负责人审核完成</p>
      </div>
    </div>

    <!-- #######################    在线考试start    ####################### -->
    <div v-if="activeIndex === 2">
      <el-steps :active="examActiveIndex" finish-status="success" style="margin-bottom: 18px">
        <el-step title="规章制度"></el-step>
        <el-step title="学习资料"></el-step>
        <el-step title="参加考试"></el-step>
        <el-step title="考试通过"></el-step>
      </el-steps>
      <div v-show="examActiveIndex === 0">
        <el-table :data="regulationsList" border style="width: 100%">
          <el-table-column type="index" :index="indexDdMethod" label="序号" width="50" />
          <el-table-column prop="name" label="标题">
            <template slot-scope="scope">
              <a
                href="#"
                @click="
                  navOpen('/' + getNewsTypes(scope.row.type).code + '/detail/' + scope.row.id)
                "
                >{{ scope.row.name }}</a
              >
            </template>
          </el-table-column>
          <el-table-column label="类型">
            <template slot-scope="scope">
              {{ getNewsTypes(scope.row.type).title }}
            </template>
          </el-table-column>
          <el-table-column label="发布时间" width="180">
            <template slot-scope="scope">{{ getDate(scope.row.created_at) }}</template>
          </el-table-column>
          <div slot="empty">
            <empty />
          </div>
        </el-table>
        <el-pagination
          class="dl-pagination"
          :hide-on-single-page="true"
          background
          layout="total, prev, pager, next, jumper"
          :total="regulationsTotal"
          :current-page="regulationsQueryForm.page"
          :page-size="regulationsQueryForm.size"
          @current-change="regulationsCurrentChange"
        />
      </div>
      <div v-show="examActiveIndex === 1">
        <el-table :data="learningList" border style="width: 100%">
          <el-table-column type="index" :index="indexDdMethod1" label="序号" width="50" />
          <el-table-column label="标题">
            <template slot-scope="scope">
              <a href="#" @click="navOpen('/learning/detail/' + scope.row.id)">{{
                scope.row.name
              }}</a>
            </template>
          </el-table-column>
          <el-table-column label="类型">
            <template slot-scope="scope">
              {{ getTypes(scope.row.type) }}
            </template>
          </el-table-column>
          <el-table-column label="发布时间" width="180">
            <template slot-scope="scope">{{ getDate(scope.row.created_at) }}</template>
          </el-table-column>
          <div slot="empty">
            <empty />
          </div>
        </el-table>
        <el-pagination
          class="dl-pagination"
          :hide-on-single-page="true"
          background
          layout="total, prev, pager, next, jumper"
          :total="learningTotal"
          :current-page="learningQueryForm.page"
          :page-size="learningQueryForm.size"
          @current-change="learningCurrentChange"
        />
      </div>
      <div
        v-if="examActiveIndex === 2"
        v-loading="loading"
        element-loading-text="提交中..."
        element-loading-spinner="el-icon-loading"
      >
        <div v-if="form.pass_exam" style="padding: 30px 100px">
          <el-alert
            title="恭喜你已经通过考试"
            :closable="false"
            show-icon
            center
            effect="dark"
            type="success"
          >
          </el-alert>
        </div>
        <div v-else>
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
          <div v-if="multiChoose.length > 0" class="question-type">三、多选题</div>
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
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <el-button @click="submitExam" class="step-botton" size="small" type="primary"
            >提交</el-button
          >
        </div>
      </div>
      <div v-if="information_time > 0 && examActiveIndex === 0" style="margin-top: 18px">
        您的规章制度剩余需学习时间：
        <remain-time :time="information_time" :update_time.sync="information_time" />
        <span class="tips">(请务必停留在本页面学习，否则不计学时)</span>
      </div>
      <div v-if="learning_time > 0 && examActiveIndex === 1" style="margin-top: 18px">
        您的学习资料剩余需学习时间：
        <remain-time :time="learning_time" :update_time.sync="learning_time" />
        <span class="tips">(请务必停留在本页面学习，否则不计学时)</span>
      </div>
      <el-button
        style="margin-top: 18px"
        v-if="examActiveIndex !== 0 && examActiveIndex !== 3"
        @click="examActiveIndex--"
        class="step-botton"
        round
        >上一步</el-button
      >
      <el-button
        v-if="
          (information_time <= 0 && examActiveIndex === 0) ||
          (learning_time <= 0 && examActiveIndex === 1)
        "
        style="margin-top: 18px"
        @click="examActiveIndex++"
        class="step-botton"
        round
        >下一步</el-button
      >
    </div>
    <!-- #######################    在线考试 end    ####################### -->

    <div v-if="activeIndex === 3" style="text-align: center; margin-top: 80px">
      <div v-if="form.status === 0">
        <img src="/imgs/waiting.png" />
        <p>平台审核中</p>
        <!-- <el-button type="primary" size="small" @click="activeIndex = 0">修改资料</el-button> -->
      </div>
      <div v-if="form.status === 1">
        <img src="/imgs/pass.png" />
        <p>平台已审核通过</p>
        <p>请联系平台管理员完成账户充值并开通门禁</p>
      </div>
      <div v-if="form.status === -1">
        <img src="/imgs/reject.png" />
        <p>平台已拒绝你的申请</p>
        <p>原因：{{ form.reason }}</p>
        <el-button type="primary" size="small" @click="activeIndex = 0">重新申请</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { uploadUrl } from '@/api/public';
import { allUsers } from '@/api/user';
import { trainList } from '@/api/train';
import { newsList } from '@/api/news';
import { trainDocList, examInfo } from '@/api/security';
import {
  platformList,
  applyPlatformInfo,
  addApplyPlatform,
  editApplyPlatform,
  latestApply,
  updateLearningTime,
  examQuestions,
  submitExam,
  applyMoney,
} from '@/api/platform';
import { apparatusList } from '@/api/apparatus';
import { checkGtZero, checkInt } from '@/utils/validate';
import { mapGetters } from 'vuex';
import Empty from '@/components/Empty';
import CommonMixin from '@/mixins/common';
import RemainTime from '@/components/RemainTime';

export default {
  components: {
    Empty,
    RemainTime,
  },
  mixins: [CommonMixin],
  data() {
    return {
      action: '',
      months: 0,
      all_users: [],
      information_time: 0,
      learning_time: 0,
      examActiveIndex: 0,
      totalPrice: 0,
      activeIndex: -1,
      loading: false,
      form: {
        platform_id: 0,
        range: [],
        projects: [],
        effective_at: '',
        expired_at: '',
        stage_number: 0, //实验桌米数
        pi_stage_number: 0, //PI办公桌个数
        // stage_month: '',
        train_info: '',
        task_name: '',
        task_no: '',
        task_plan: '',
        task_design: '',
        fund_description: '',
        fund_from: '',
        task_period: '',
        has_hcs: '0',
        has_biological: '0',
        hcs_names_arr: [],
        hcs_names: '',
        biological_sample: '',
        agree: '',
        start_date: '',
        end_date: '',
        agree: false,
      },
      platform: {},
      formId: '',
      rules: {
        task_period: [
          {
            required: true,
            message: '请输入课题周期',
            trigger: 'blur',
          },
        ],
        platform_id: [
          {
            required: true,
            message: '请选择实验室',
            trigger: 'change',
          },
        ],
        has_hcs: [
          {
            required: true,
            message: '请选择是否携带危化品',
            trigger: 'change',
          },
        ],
        has_biological: [
          {
            required: true,
            message: '请选择是否携带传染性样品',
            trigger: 'change',
          },
        ],
        hcs_names_arr: [
          {
            required: true,
            message: '请输入危化品',
            trigger: 'change',
          },
        ],
        range: [
          {
            required: true,
            message: '请选择有效期',
            trigger: 'change',
          },
        ],
        agree: [
          {
            required: true,
            message: '不同意实验室条款无法进行入室申请',
            trigger: 'change',
          },
        ],
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        },
      },
      regulationsQueryForm: {
        page: 1,
        size: 10,
        types: '13,14,15',
        platform_id: '',
        sort: 'created_at',
        is_deleted: 0,
        sort_type: 'desc',
      },
      learningQueryForm: {
        page: 1,
        size: 10,
        is_deleted: 0,
        is_published: 1,
        platform_id: '',
        sort: 'created_at',
        sort_type: 'desc',
      },
      submitForm: {
        platform_apply_id: '',
        answers: [],
      },
      platforms: [],
      apparatus: [],
      hcsOptions: [],
      apparatusTrains: [],
      otherTrains: [],
      apparatusTrainsSelected: [],
      otherTrainsSelected: [],
      hcsList: [],
      biologicalList: [],
      regulationsList: [],
      learningList: [],
      judgmentList: [],
      singleChoose: [],
      multiChoose: [],
      regulationsTotal: 0,
      learningTotal: 0,
    };
  },
  computed: {
    ...mapGetters(['member']),
  },
  watch: {
    information_time(val) {
      if (val >= 0 && val % 10 === 0) {
        updateLearningTime({
          id: this.formId,
          information_time: val,
        });
      }
    },
    learning_time(val) {
      if (val >= 0 && val % 10 === 0) {
        updateLearningTime({
          id: this.formId,
          learning_time: val,
        });
      }
    },
  },
  created() {
    this.action = uploadUrl;
    //初始化表单
    this.formInit('');

    this.getPlatforms();
    this.getApparatus(7); //7是危化品管理库
    this.loadAllUsers();
  },
  methods: {
    //项目图片上传
    handleSuccess(project, response, file, fileList) {
      let url = response.data.url;
      project.img_url = url;
    },
    handleRemove(file, fileList) {
      // console.log('handle remove')
      // console.log(file, fileList);
    },
    handlePreview(file) {
      // console.log('handle preview');
      // console.log(file);
    },
    generateImgUrl(project) {
      let imgUrl = process.env.VUE_APP_DOMAIN + project.img_url;
      return imgUrl;
    },
    onProjectTimeChange(project, value) {
      project.start_date = value[0];
      project.end_date = value[1];
    },
    onDateRangeChange(value) {
      this.form.start_date = value[0];
      this.form.end_date = value[1];
      this.getPrice();
    },
    loadAllUsers() {
      allUsers().then((res) => {
        this.all_users = res.data.users;
      });
    },
    addNewProject() {
      this.form.projects.push({
        id: 0,
        name: '',
        admin_name: '',
        img_url: '',
        no: '',
        inter_no: '',
        source: '',
        charge: '',
        start_date: '',
        end_date: '',
        project_range: [],
      });
    },
    addHcs(check) {
      var hcs = {
        name: '',
        num: '',
        content: '',
      };
      var pass = true;
      this.hcsList.forEach((item) => {
        if (!item.name || item.num === undefined || !item.content) {
          pass = false;
        }
      });
      if (!pass) {
        this.$message.error('还有未填写完整的危化品，请先填写完整');
        return false;
      }
      if (!check) this.hcsList.push(hcs);
      return true;
    },
    addBiological(check) {
      var biological = {
        name: '',
        origin: '',
        infection: '',
      };
      var pass = true;
      this.biologicalList.forEach((item) => {
        if (!item.name || !item.origin || !item.infection) {
          pass = false;
        }
      });
      if (!pass) {
        this.$message.error('还有未填写完整的传染性样品，请先填写完整');
        return false;
      }
      if (!check) this.biologicalList.push(biological);
      return true;
    },
    appratusSelectionChange(val) {
      // console.log(val)
    },
    serviceSelectionChange(val) {
      this.otherTrainsSelected = val;
      this.getPrice();
    },
    appratusItemChange(val) {
      this.getPrice();
    },
    removeItem(type, index) {
      if (type === 'hcs') {
        this.hcsList.splice(index, 1);
      } else {
        this.biologicalList.splice(index, 1);
      }
    },
    getApparatus(platform_id) {
      apparatusList({
        page: 1,
        size: 1000,
        is_deleted: 0,
        platform_id,
      }).then((res) => {
        if (res.status === 200) this.apparatus = res.data.data;
      });
    },
    getPlatforms() {
      platformList({
        page: 1,
        size: 100,
        type: 2,
        is_deleted: 0,
        is_default: 1,
      }).then((res) => {
        if (res.status === 200) {
          this.platforms = res.data.data;
          if (this.platforms.length === 0) {
            this.$message.error('请先联系平台管理员，设置默认实验室');
            this.activeIndex = -1;
          } else {
            this.form.platform_id = this.platforms[0].id;
            this.getInfo(this.form.platform_id);
            this.activeIndex = 0;
          }
        }
      });
    },
    getTrains(platform_id) {
      trainList({
        page: 1,
        size: 100,
        permanent: 1,
        is_published: 1,
        platform_id,
      }).then((res) => {
        if (res.status === 200) {
          this.apparatusTrains = [];
          this.otherTrains = [];
          res.data.data.forEach((item) => {
            item.train_time = '';
            if (item.type === 1) {
              item.use_time = '';
              item.checkItem = [];
              this.apparatusTrains.push(item);
            } else {
              this.otherTrains.push(item);
            }
          });
          // console.log(this.apparatusTrains, this.otherTrains)
        }
      });
    },
    numberChange(current, pre, type) {
      // if (current !== 0 && !current) {
      //   if (type === 1) {
      //     this.form.stage_number = -1
      //   } else if (type === 2) {
      //     this.form.stage_month = -1
      //   }
      // }
      this.getPrice();
    },
    getPrice() {
      if (!this.form.start_date || !this.form.end_date) {
        return false;
      }
      let countForm = {
        platform_id: this.platform.id,
        stage_number: this.form.stage_number,
        pi_stage_number: this.form.pi_stage_number,
        start_date: this.form.start_date,
        end_date: this.form.end_date,
        train_info: '',
      };
      let train_info = [];
      this.apparatusTrains.forEach((item) => {
        if (item.checkItem.length > 0) {
          let temp = {
            train_id: item.id,
            items: item.checkItem.map((title) => {
              return {
                title,
              };
            }),
          };
          train_info.push(temp);
        }
      });
      this.otherTrainsSelected.forEach((item) => {
        train_info.push({
          train_id: item.id,
        });
      });
      if (train_info.length > 0) {
        countForm.train_info = JSON.stringify(train_info);
      }
      this.loading = true;
      applyMoney(countForm).then((res) => {
        this.loading = false;
        if (res.status === 200) {
          this.totalPrice = res.data.total_charge;
          this.months = res.data.months;
        }
      });
    },
    getInfo(platform_id) {
      var that = this;
      if (!platform_id) {
        this.activeIndex = -1;
        return false;
      }
      this.singleChoose = [];
      this.judgmentList = [];
      this.multiChoose = [];
      this.regulationsQueryForm.platform_id = platform_id;
      this.learningQueryForm.platform_id = platform_id;
      this.queryNewsList();
      this.queryLearningList();
      // this.getTrains(platform_id)
      this.platforms.forEach((item) => {
        if (item.id === platform_id) that.platform = item;
      });
      this.hcsList = [];
      this.biologicalList = [];
      latestApply({
        platform_id: platform_id,
      }).then((res) => {
        if (res.status === 200) {
          if (res.data.length === 0) {
            this.activeIndex = 0;
            //没有申请记录的情况下，创建一条新的记录
            this.addNewProject();
          } else {
            //有申请记录的情况下
            //初始化表单
            this.formInit(platform_id);

            Object.assign(this.form, res.data);

            if (this.form.projects.length > 0) {
              for (let i = 0; i < this.form.projects.length; i++) {
                let project = this.form.projects[i];
                this.form.projects[i].project_range = [project.start_date, project.end_date];
              }
            }

            this.form.range = [res.data.effective_at, res.data.expired_at];

            this.form.start_date = res.data.effective_at;
            this.form.end_date = res.data.expired_at;

            this.formId = this.form.id;
            this.submitForm.platform_apply_id = this.form.id;
            this.form.has_hcs = this.form.hcs_names ? '1' : '0';
            this.form.has_biological = this.form.biological_sample ? '1' : '0';
            this.information_time = this.form.information_time;
            this.learning_time = this.form.learning_time;
            this.hcsList = this.form.hcs_names ? JSON.parse(this.form.hcs_names) : [];
            this.biologicalList = this.form.biological_sample
              ? JSON.parse(this.form.biological_sample)
              : [];
            if (this.form.id == 0) {
              this.activeIndex = 0;
            } else if (this.form.projects.some((item) => item.status != 1)) {
              //申请的项目都必须通过审核才能进行下一步，否则要展示审核中页面
              this.activeIndex = 1; //审核中
            } else {
              // if (this.form.pass_exam) {
              //   if (this.form.platform_audit === 1) {
              //     this.activeIndex = 3;
              //   } else {
              //     this.activeIndex = 3;
              //   }
              // } else {
              //   this.queryExamQuestions(platform_id);
              this.activeIndex = 3;
              // }
            }
            this.form.agree = true;
            //计算费用
            this.getPrice();
          }
        }
      });
    },
    submitExam() {
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
      this.submitForm.answers = JSON.stringify(this.submitForm.answers);
      this.loading = true;
      submitExam(this.submitForm)
        .then((res) => {
          var that = this;
          this.loading = false;
          if (res.status === 1) {
            this.activeIndex = 3;
            this.form.pass_exam = 1;
          } else if (res.status === -1) {
            this.examActiveIndex = 0;
            this.queryExamQuestions(this.platform.id);
          }
        })
        .catch((_) => {
          this.loading = false;
        });
    },
    submit(form) {
      if (!this.form.agree) {
        this.$message.error('需要 同意实验室条款 才能发起申请');
        return;
      }

      this.$refs[form].validate((valid) => {
        if (valid) {
          if (this.form.projects.length < 1) {
            this.$message.error('请填写项目信息');
            return;
          }
          for (let i = 0; i < this.form.projects.length; i++) {
            let project = this.form.projects[i];
            if (!project.name) {
              this.$message.error('请填写项目名称');
              return;
            }
            if (!project.start_date || !project.end_date) {
              this.$message.error('请填写项目起止时间');
              return;
            }
            if (!project.admin_name) {
              this.$message.error('请填写项目负责人');
              return;
            }
            if (!project.img_url) {
              this.$message.error('请上传证明资料');
              return;
            }

            if (!project.no) {
              this.$message.error('请填写项目编号');
              return;
            }
            if (!project.charge) {
              this.$message.error('请填写项目经费');
              return;
            }

            if (!project.source) {
              this.$message.error('请填写项目来源');
              return;
            }
          }
          this.form.hcs_names = '';
          this.form.biological_sample = '';
          this.form.effective_at = this.form.range[0];
          this.form.expired_at = this.form.range[1];
          if (this.form.has_hcs === '1') {
            if (this.hcsList.length === 0) {
              this.$message.error('请添加危化品');
              return false;
            }
            if (!this.addHcs(true)) return false;
            this.form.hcs_names = JSON.stringify(this.hcsList);
          }
          try {
            var train_info = [];
            this.apparatusTrains.forEach((item) => {
              if (item.checkItem.length > 0) {
                if (!item.train_time) {
                  throw item.name + '预计培训时间未选择';
                }
                if (!item.use_time) {
                  throw item.name + '预计使用仪器时间未选择';
                }
                var temp = {
                  train_id: item.id,
                  items: item.checkItem.map((title) => {
                    return {
                      title,
                    };
                  }),
                  train_time: item.train_time,
                  use_time: item.use_time,
                };
                train_info.push(temp);
              }
            });
            this.otherTrainsSelected.forEach((item) => {
              if (!item.train_time) {
                throw item.name + '预计培训时间未选择';
              }
              train_info.push({
                train_id: item.id,
                train_time: item.train_time,
              });
            });
            this.form.train_info = JSON.stringify(train_info);
          } catch (error) {
            this.$message.error(error);
            return false;
          }
          this.form.expired_at = this.form.expired_at.substring(0, 11) + ' 23:59:59';
          this.loading = true;
          addApplyPlatform(this.form)
            .then((response) => {
              this.loading = false;
              if (response.status === 1) {
                this.getInfo(this.form.platform_id);
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
    formInit(platform_id) {
      this.form.platform_id = platform_id;
      this.form.range = [];
      this.form.projects = [];
      this.form.effective_at = '';
      this.form.expired_at = '';
      this.form.stage_number = 0;
      this.form.pi_stage_number = 0;
      //this.form.stage_month = '';
      this.form.train_info = '';
      this.form.task_name = '';
      this.form.task_no = '';
      this.form.task_plan = '';
      this.form.task_design = '';
      this.form.fund_description = '';
      this.form.fund_from = '';
      this.form.task_period = '';
      this.form.has_hcs = '0';
      this.form.has_biological = '0';
      this.form.hcs_names_arr = [];
      this.form.hcs_names = '';
      this.form.biological_sample = '';
      this.form.agree = '';
      this.form.start_at = '';
      this.form.end_at = '';
    },
    getTypes(type) {
      switch (type) {
        case 1:
          return '在线文档资料';
        case 2:
          return '视频资料';
        case 3:
          return '下载资料';
      }
    },
    queryNewsList() {
      newsList(this.regulationsQueryForm).then((res) => {
        if (res.status === 200) {
          this.regulationsList = res.data.data;
          this.regulationsTotal = res.data.total;
        }
      });
    },
    queryLearningList() {
      trainDocList(this.learningQueryForm).then((res) => {
        if (res.status === 200) {
          this.learningList = res.data.data;
          this.learningTotal = res.data.total;
        }
      });
    },
    queryExamQuestions(platform_id) {
      this.judgmentList = [];
      this.singleChoose = [];
      this.multiChoose = [];
      examQuestions({
        platform_id,
      }).then((res) => {
        if (res.status === 200) {
          var that = this;
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
    },
    regulationsCurrentChange(val) {
      this.regulationsQueryForm.page = val;
      this.queryNewsList();
    },
    learningCurrentChange(val) {
      this.learningQueryForm.page = val;
      this.queryLearningList();
    },
    indexDdMethod(index) {
      return index + (this.regulationsQueryForm.page - 1) * this.regulationsQueryForm.size + 1;
    },
    indexDdMethod1(index) {
      return index + (this.learningQueryForm.page - 1) * this.learningQueryForm.size + 1;
    },
    returnToList() {
      this.$router.push({
        path: '/info-center/my-platform-apply/list',
      });
    },
    generateProjectInfo(project) {
      let data = [];
      data.push({
        v1: '项目名称',
        v2: project.name,
        v3: '起止时间',
        v4: project.start_date + '-' + project.end_date,
      });
      let user = this.all_users.find((user) => user.id == project.admin_id);
      data.push({
        v1: '项目负责人',
        v2: user ? user.name : '-',
        v3: '状态',
        v4: project.status == 1 ? '已通过' : project.status == 0 ? '审核中' : '未通过',
      });
      data.push({
        v1: '项目编号',
        v2: project.no,
        v3: '内部编号',
        v4: project.inter_no,
      });

      data.push({
        v1: '项目经费',
        v2: project.charge,
        v3: '项目来源',
        v4: project.source,
      });
      return data;
    },
  },
};
</script>
<style scoped>
.platform-promise {
  max-height: 300px;
  overflow: overlay;
  border: 1px solid #ccc;
  padding: 5px;
  border-radius: 5px;
}

.question-answer-item {
  display: inline-block;
  font-weight: bolder;
  vertical-align: top;
}

.question-answer-content {
  display: inline-block;
  white-space: normal;
  word-break: break-all;
}

.apply-container >>> .el-step.is-simple:not(:last-of-type) .el-step__title {
  max-width: 80%;
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

.apparatus-project >>> .el-checkbox__input {
  vertical-align: top;
}

.apparatus-project >>> .el-checkbox__label {
  word-break: break-all;
  white-space: normal;
}

.apply-prop {
  text-align: left;
  padding: 10px;
}

.apply-value {
  text-align: left;
  padding: 10px;
  text-decoration: underline;
}

.width-450{
  width: 400px !important;
  /* width: 80% !important; */
}
</style>
