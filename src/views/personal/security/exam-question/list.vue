<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form :inline="true" :model="queryForm">
      <!-- <el-form-item label="仪器">
                <el-select v-model="queryForm.apparatus_id" :clearable="true" size="small" class="max-width-150" placeholder="仪器">
                    <el-option
                        v-for="item in apparatusList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    />
                </el-select>
            </el-form-item> -->
      <el-form-item label="平台/实验室">
        <el-select
          v-model="queryForm.platform_id"
          size="small"
          clearable
          class="max-width-150"
          filterable
          placeholder="平台/实验室"
        >
          <el-option v-for="item in platforms" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="题目">
        <el-input v-model="queryForm.name" class="max-width-150" size="small" clearable />
      </el-form-item>
      <el-form-item>
        <el-button round size="small" @click="resetQuery">查询</el-button>
      </el-form-item>
      <el-form-item class="right">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="importVisible = true"
          >批量导入</el-button
        >
        <el-button type="primary" size="small" icon="el-icon-plus" @click="toAdd(0)"
          >添加考试题目</el-button
        >
      </el-form-item>
    </el-form>
    <el-table :header-cell-style="{ background: '#fafafa' }" :data="list" style="width: 100%">
      <el-table-column width="100px" type="index" :index="indexMethod" label="序号" />
      <el-table-column prop="name" label="题目" width="200" />
      <el-table-column label="类型">
        <template slot-scope="scope">
          {{ getTypes(scope.row.type) }}
        </template>
      </el-table-column>
      <el-table-column label="选项">
        <template slot-scope="scope">
          <span v-if="scope.row.type == 2">-</span>
          <div v-else>
            <p v-for="(item, index) in scope.row.items" :key="index">
              {{ item.name }}. {{ item.content }}
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="答案">
        <template slot-scope="scope">
          <span v-if="scope.row.type == 2">{{ scope.row.answer == 1 ? '正确' : '错误' }}</span>
          <span v-else>{{ scope.row.answer }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分值">
        <template slot-scope="scope"> {{ scope.row.score }}分 </template>
      </el-table-column>
      <el-table-column prop="creator_name" label="创建人" />
      <!-- <el-table-column label="状态">
            <template slot-scope="scope">
                <el-tag type="success" v-if="scope.row.is_deleted === 0">正常</el-tag>
                <el-tag type="danger" v-if="scope.row.is_deleted === 1">已删除</el-tag>
            </template>
        </el-table-column> -->
      <el-table-column prop="factory_id" label="单位">
        <template slot-scope="scope">
          {{getFactoryName(scope.row.factory_id)}}
        </template>
      </el-table-column>
      <el-table-column fixed="right" width="180" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="toAdd(scope.row.id)">修改</el-button>
          <el-button
            v-if="scope.row.is_deleted === 0"
            size="mini"
            type="danger"
            @click="handleDelete(scope.row, 1)"
            >删除</el-button
          >
          <el-button
            v-if="scope.row.is_deleted === 1"
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
    <el-dialog title="批量导入题目" :visible.sync="importVisible">
      <el-form ref="importForm" :rules="rules" label-width="150px" :model="importForm">
        <el-form-item label="实验室" prop="platform_id">
          <el-select
            v-model="importForm.platform_id"
            size="small"
            clearable
            class="max-width-150"
            filterable
            placeholder="实验室"
          >
            <el-option
              v-for="item in platforms"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Excel文件">
          <el-upload
            v-show="percent === 0"
            :action="uploadUrl"
            accept=".xls,.xlsx"
            :headers="authHeader"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :on-progress="handleUploadProgress"
            :on-success="handleUploadSuccess"
          >
            <el-button size="small">点击上传</el-button>
          </el-upload>
          <el-alert
            v-if="importForm.file_url"
            :title="importForm.file_url"
            type="success"
            :closable="false"
          />
          <!-- <i v-if="importForm.file_url && percent === 0" @click="form.source_url = ''" class="el-icon-delete common-icon"></i> -->
          <span v-if="percent > 0" class="bottom-30">附件上传中</span>
          <el-progress
            v-if="percent > 0"
            :text-inside="true"
            :stroke-width="26"
            :percentage="percent"
          ></el-progress>
        </el-form-item>
        <el-form-item label="模板">
          <a href="/files/exam_question_templete.xlsx">批量添加模板</a>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="importVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitExam('importForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { frontExamQuestionList, deleteExamQuestion, importExam } from '@/api/security';
import { frontApparatusList } from '@/api/apparatus';
import { frontPlatformList } from '@/api/platform';
import { checkNode } from '@/utils/validate';
import { uploadUrl } from '@/api/public';
import Empty from '@/components/Empty';

export default {
  components: {
    Empty,
  },
  data() {
    return {
      loading: false,
      importVisible: false,
      uploadUrl: uploadUrl,
      percent: 0,
      queryForm: {
        page: 1,
        size: 10,
        sort: 'created_at',
        sort_type: 'desc',
        platform_id: '',
        apparatus_id: '0',
        name: '',
      },
      importForm: {
        platform_id: '',
        file_url: '',
      },
      rules: {
        platform_id: [
          {
            required: true,
            message: '请选择实验室',
            trigger: 'change',
          },
        ],
      },
      list: [],
      platforms: [],
      apparatusList: [],
      total: 0,
    };
  },
  created() {
    this.queryList();
    this.getPlatforms();
  },
  methods: {
    queryList() {
      this.loading = true;
      frontExamQuestionList(this.queryForm)
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
    getTypes(type) {
      switch (type) {
        case 1:
          return '选择题';
        case 2:
          return '判断题';
      }
    },
    getPlatforms() {
      frontPlatformList({ page: 1, size: 100 }).then((res) => {
        if (res.status === 200) {
          this.platforms = res.data.data;
        }
      });
    },
    queryApparatusList() {
      frontApparatusList({
        page: 1,
        size: 100,
        is_deleted: 0,
        is_admin: 1,
      }).then((res) => {
        if (res.status === 200) {
          this.apparatusList = res.data.data;
        }
      });
    },
    resetQuery() {
      this.queryForm.page = 1;
      this.queryList();
    },
    handleDelete(row, status) {
      const text = status === 0 ? '恢复' : '删除';
      this.$confirm('确定要' + text + '"' + row.name + '"吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deleteExamQuestion({ id: row.id, is_deleted: status }).then((response) => {
          if (response.status === 1) {
            this.queryList();
          }
        });
      });
    },
    toAdd(id = '') {
      if (!id) {
        this.$router.push({ path: '/personal/exam-question/add' });
      } else {
        this.$router.push({
          path: '/personal/exam-question/edit/' + id,
        });
      }
    },
    submitExam(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          if (!this.importForm.file_url) {
            this.$message.error('请上传excel文件');
            return false;
          }
          importExam(this.importForm).then((res) => {
            if (res.status === 1) {
              this.importVisible = false;
              this.queryList();
            }
          });
        }
      });
    },
    beforeUpload(file) {
      console.log(file);
      if (file.type.indexOf('excel') > -1 || file.type.indexOf('sheet') > -1) return true;
      this.$message.error('请上传excel文件');
      return false;
    },
    handleUploadSuccess(res, file) {
      res = this.decrypt(res);
      if (res.status === 200) {
        this.importForm.file_url = res.data.url;
      }
    },
    handleUploadProgress(event, file, fileList) {
      if (event.percent < 100) {
        this.percent = parseInt(event.percent);
      } else {
        this.percent = 0;
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
