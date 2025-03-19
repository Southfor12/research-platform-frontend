<template>
  <div>
    <el-form label-width="130px">
      <el-form-item label="项目信息">
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
            <el-table-column prop="v4" label="值" align="left"> </el-table-column>
          </el-table>
          <div>
            <a
              :href="generateImage(project)"
              target="_blank"
              style="padding-left: 10px; color: #0077aa"
              >证明材料</a
            >
          </div>
        </div>
      </el-form-item>
      <el-form-item label="仪器培训">
        <span style="display: none">{{ getTrain(form.train_info) }}</span>
        <el-table v-if="apparatusTrain.length > 0" :data="apparatusTrain" style="width: 100%">
          <el-table-column label="培训名称" prop="name" />
          <el-table-column label="培训项目">
            <template slot-scope="scope">
              <div v-for="(item, index) in scope.row.items" :key="index">
                {{ item.title }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="期望培训时间" prop="train_time" />
          <el-table-column label="预计使用仪器时间" prop="use_time" />
        </el-table>
        <span v-else>未选择仪器培训</span>
      </el-form-item>
      <el-form-item label="技术培训">
        <el-table
          v-if="serviceTrain.length > 0"
          :data="serviceTrain"
          tooltip-effect="dark"
          style="width: 100%"
        >
          <el-table-column prop="name" label="培训名称" />
          <el-table-column label="期望培训时间" prop="train_time" />
        </el-table>
        <span v-else>未选择技术培训</span>
      </el-form-item>
      <el-form-item label="危化品">
        <el-table
          v-if="form.hcs_names"
          :data="JSON.parse(form.hcs_names)"
          border
          style="width: 100%"
        >
          <el-table-column label="危化品名称" prop="name" />
          <el-table-column label="危化品数量" prop="num" width="160" />
          <el-table-column label="实验内容" prop="content" />
        </el-table>
        <span v-else>未携带危化品</span>
      </el-form-item>
    </el-form>
    <el-form :inline="true" label-width="130px">
      <el-form-item label="开始时间" prop="effective_at">{{ form.effective_at }}</el-form-item>
      <el-form-item label="结束时间" prop="expired_at">{{ form.expired_at }}</el-form-item>
      <el-form-item label="实验桌(数)" prop="stage_number">{{ form.stage_number }}</el-form-item>
      <el-form-item label="PI办公桌(个)" prop="pi_stage_number">{{
        form.pi_stage_number
      }}</el-form-item>
    </el-form>
    <el-form :inline="true" label-width="130px">
      <el-form-item label="合计费用"
        ><span style="font-weight: bolder; font-size: large"
          >{{ form.total_charge }}元</span
        ></el-form-item
      >
    </el-form>
  </div>
</template>
<script>
import { trainList } from '@/api/train';
import { allUsers } from '@/api/user';

export default {
  name: 'ApplyInfo',
  props: {
    form: {
      type: Object,
      default: {},
    },
  },
  created() {
    allUsers().then((res) => {
      this.all_users = res.data.users;
    });
  },
  data() {
    return {
      train: [],
      apparatusTrain: [],
      serviceTrain: [],
      all_users: [],
    };
  },
  methods: {
    generateImage(project) {
      return process.env.VUE_APP_DOMAIN + project.img_url;
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
        v2: project.admin_name,
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
        v1: '支出经费',
        v2: project.charge,
        v3: '项目来源',
        v4: project.source,
      });
      return data;
    },
    getTrain(train) {
      if (!train || this.apparatusTrain.length > 0 || this.serviceTrain > 0) return [];
      train = JSON.parse(train);
      var trainIds = train.map((item) => {
        return item.train_id;
      });
      var apparatusTrain = train.filter((item) => {
        if (item.use_time) return true;
        return false;
      });
      var serviceTrain = train.filter((item) => {
        if (!item.use_time) return true;
        return false;
      });
      trainList({
        page: 1,
        size: 30,
        ids: trainIds.join(','),
      }).then((res) => {
        var that = this;
        res.data.data.forEach((item) => {
          apparatusTrain.forEach((v, k) => {
            if (item.id === v.train_id) {
              apparatusTrain[k].name = item.name;
            }
          });
          serviceTrain.forEach((v, k) => {
            if (item.id === v.train_id) {
              serviceTrain[k].name = item.name;
            }
          });
        });
      });
      var that = this;
      setTimeout((_) => {
        that.apparatusTrain = apparatusTrain;
        that.serviceTrain = serviceTrain;
      }, 1500);
      return '';
    },
  },
};
</script>
