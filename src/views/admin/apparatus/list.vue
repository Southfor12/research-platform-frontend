<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="仪器名称" >
        <el-input v-model="queryForm.name" class="max-width-150 max-width-120" size="small" clearable />
      </el-form-item>
      <el-form-item label="刷卡器地址">
        <el-input v-model="queryForm.ip_address" class="max-width-150 max-width-120" size="small" clearable />
      </el-form-item>
      <el-form-item label="仪器负责人">
        <el-select
          :filterable="true"
          v-model="queryForm.admin_id"
          :clearable="true"
          size="small"
          class="max-width-150 max-width-120"
          placeholder="仪器负责人"
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
          class="max-width-150 max-width-120"
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
        <!-- <el-button round size="small" @click="exportData">导出</el-button> -->
      </el-form-item>
      <el-form-item v-if="checkNode('add_apparatus')" class="right">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="toAdd(0)"
          >添加仪器</el-button
        >
      </el-form-item>
    </el-form>
    <el-table :header-cell-style="{ background: '#fafafa' }" :data="list" style="width: 100%">
      <el-table-column width="100px" type="index" :index="indexMethod" label="序号">
      </el-table-column>
      <el-table-column prop="no" label="编号" />
      <el-table-column label="图片">
        <template slot-scope="scope">
          <img
            v-clipboard:copy="'ID: ' + scope.row.id + ' 仪器名称: ' + scope.row.name"
            :src="domain + scope.row.picture"
            style="height: 50px; vertical-align: middle"
          />
          <div style="color: #aaa; font-size: 10px">
            {{ scope.row.id }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称">
        <template slot-scope="scope">
          {{ scope.row.name }}<br />
          刷卡器: <span style="color:blue;">{{ scope.row.ip_address }}</span> <br />
          <!-- <el-button
            size="small"
            v-if="scope.row.camera_ip"
            type="primary"
            icon="el-icon-camera"
            @click="viewCamera(scope.row)"
            >监控</el-button
          > -->
         <!-- <el-button size="small" v-else icon="el-icon-camera" @click="viewCamera(scope.row)"
            >监控</el-button
          > -->
        </template>
      </el-table-column>
      <el-table-column prop="type_name" label="类型" />
      <el-table-column label="重要性">
        <template slot-scope="scope">
          {{ getImportance(scope.row.importance) }}
        </template>
      </el-table-column>
      <el-table-column prop="admin_name" label="负责人" />
      <el-table-column label="归属">
        <template slot-scope="scope">
          {{ scope.row.platform_name }}
          <!-- - {{ scope.row.platform_room_name }} -->
        </template>
      </el-table-column>
      <el-table-column label="共享方式">
        <template slot-scope="scope">
          <span v-html="getShareTypes(scope.row.share_type)"></span>
        </template>
      </el-table-column>
      <el-table-column prop="factory_id" label="单位">
        <template slot-scope="scope">
          {{ getFactoryName(scope.row.factory_id) }}
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        v-if="checkNode('edit_apparatus') || checkNode('delete_apparatus_type')"
        width="180"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            v-if="checkNode('edit_apparatus')"
            size="mini"
            type="primary"
            @click="toAdd(scope.row.id)"
            >修改</el-button
          >
          <el-button
            v-if="checkNode('delete_apparatus_type') && scope.row.is_deleted === 0"
            size="mini"
            type="danger"
            @click="handleDelete(scope.row, 1)"
            >删除</el-button
          >
          <el-button
            v-if="checkNode('delete_apparatus_type') && scope.row.is_deleted === 1"
            size="mini"
            type="info"
            @click="handleDelete(scope.row, 0)"
            >恢复</el-button
          >
          <br />
          <br />
          <el-button type="primary" size="mini" plain @click="showZiLiaoListView(scope.row)"
            >资料管理</el-button
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
    <el-dialog :title="apparatus.name" :visible.sync="dialogVisible" width="50%">
      <div v-show="loadingImg" style="width: 100%; padding: 50px; text-align: center">
        <i class="el-icon-loading" style="font-size: 60px"></i>
        <span>图片获取中，请耐心等待。</span>
      </div>
      <el-image
        v-show="!loadingImg"
        style="width: 100%"
        :src="apparatusCameraImgUrl"
        @load="loadOk"
        @error="loadError"
      >
        <div slot="error" class="image-slot">
          <i class="el-icon-picture-outline"></i>
        </div>
      </el-image>
      <span slot="footer" class="dialog-footer" style="width: 80%">
        <el-button type="primary" @click="onClickRefreshImg">刷新图片</el-button>
      </span>
    </el-dialog>

    <el-dialog width="80%" :visible.sync="showZiLiaoList" :close-on-click-modal="false">
      <template #title>
        {{ '仪器 “' + currentApparatusName + '” 资料管理' }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <el-button type="primary" size="small" plain @click="doShowUploadForm">资料上传</el-button>
      </template>
      <el-table :header-cell-style="{ background: '#fafafa' }" :data="files" style="width: 100%">
        <el-table-column width="100px" type="index" :index="indexMethod2" label="序号" />
        <el-table-column label="资料名称">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="上传时间" />
        <el-table-column fixed="right" width="180" label="操作">
          <template slot-scope="scope">
            <div class="top-10">
              <el-button size="mini" type="success" @click="startDownLoad(scope.row)"
                >下载</el-button
              >

              <el-button size="mini" type="danger" @click="startDelete(scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
        <!-- <div slot="empty">
          <empty />
        </div> -->
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="size"
        @current-change="handleCurrentChange2"
        :total="total"
      >
      </el-pagination>
    </el-dialog>

    <!-- 选择文件上传表单 -->
    <el-dialog
      title="选择文件上传  (拖拽或鼠标单击图标)"
      width="30%"
      :visible.sync="showUploadForm"
      :close-on-click-modal="false"
    >
      <el-upload
        class="upload-demo"
        drag
        :headers="authHeader"
        :action="this.myUp"
        :file-list="fileList"
        :on-change="onFileChange"
        :multiple="false"
      >
        <i class="el-icon-upload"></i>
      </el-upload>
      <el-button
        type="primary"
        style="margin-top: 10px; margin-bottom: 10px; margin-left: 390px"
        @click="onClickSaveUpload"
      >
        保存
      </el-button>
    </el-dialog>
  </div>
</template>
<script>
import { uploadUrl } from '@/api/public';
import { apparatusList, deleteApparatus } from '@/api/apparatus';
import { createApparatusData, listApparatusData, deleteApparatusData } from '@/api/apparatusdata';
import { allUsers } from '@/api/user.js';
import { checkNode } from '@/utils/validate';
import Empty from '@/components/Empty';

export default {
  components: {
    Empty,
  },
  data() {
    return {
      allUsers: [],
      loadingImg: false,
      apparatusCameraImgUrl: '',
      loading: false,
      dialogVisible: false,
      apparatus: {
        name: '仪器',
      },
      queryForm: {
        page: 1,
        size: 10,
        sort: 'created_at',
        sort_type: 'desc',
        name: '',
        ip_address: '',
        factory_id: '',
      },
      domain: process.env.VUE_APP_DOMAIN,
      list: [],
      total: 0,
      myUp: uploadUrl,
      showZiLiaoList: false,
      currentApparatusId: 0,
      currentApparatusName: '',
      page: 1,
      size: 8,
      total: 0,
      files: [],
      fileList: [], //前端文件上传列表
      showUploadForm: false, //是否显示文件上传表单
      newFiles: [],
    };
  },
  created() {
    this.queryForm.factory_id = this.currentFactoryId;

    this.queryList();
    allUsers().then((res) => {
      if (res.status == 200) {
        this.allUsers = res.data.users;
      }
    });
  },
  methods: {
    onFileChange(file, fileList) {
      if (file.response && file.response.status == 200) {
        this.newFiles.push({
          name: file.name,
          url: file.response.data.url,
        });
      }
    },
    //开始下载
    startDownLoad(apparatusData) {
      window.open(
        process.env.VUE_APP_DOMAIN + 'api/download-apparatus-data?id=' + apparatusData.id
      );
    },
    handleCurrentChange2(
      val //仪器资料列表翻页
    ) {
      this.page = val;
      this.loadApparatusData();
    },
    startDelete(apparatusData) {
      this.$confirm(`你确定要删除"${apparatusData.name}"吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deleteApparatusData({
          id: apparatusData.id,
        }).then((res) => {
          if (res.status == 200) {
            this.$message.success('删除成功');
            this.loadApparatusData();
          }
        });
      });
    },
    //点击保存按钮
    onClickSaveUpload() {
      //请下上传文件
      if (this.newFiles.length < 1) {
        this.$message.error('请上传文件');
        return;
      }

      createApparatusData({
        apparatus_id: this.currentApparatusId,
        data: JSON.stringify(this.newFiles),
      }).then((res) => {
        //上传结果
        if (res.status == 1) {
          //上传成功
          this.loadApparatusData();
        }
      });
    },
    //显示上传资料的表单
    doShowUploadForm() {
      //清空列表
      this.fileList = [];
      this.newFiles = [];

      this.showUploadForm = true;
      this.showZiLiaoList = false;
    },
    //显示仪器的资料列表
    showZiLiaoListView(apparatus) {
      this.currentApparatusId = apparatus.id;
      this.currentApparatusName = apparatus.name;

      this.page = 1;

      this.loadApparatusData();
    },
    //加载仪器资料数据
    loadApparatusData() {
      this.showUploadForm = false;
      this.showZiLiaoList = true;

      listApparatusData({
        apparatus_id: this.currentApparatusId,
        page: this.page,
        size: this.size,
        sort_type: 'DESC',
      }).then((res) => {
        this.files = res.data.data;
        this.total = res.data.total;
      });
    },
    //点击刷新仪器图片的按钮
    onClickRefreshImg() {
      if (this.loadingImg == true) {
        this.$message.success('正在截取图片，请耐心等待');
        return;
      }
      this.loadNewestImg(this.apparatus);
    },
    //图片加载成功
    loadOk() {
      this.loadingImg = false;
    },
    //图片加载失败
    loadError() {
      this.loadingImg = false;
    },
    //点击仪器列表查看仪器监控的按钮
    viewCamera(apparatus) {
      if (!apparatus.camera_ip) {
        this.$message.error('该仪器未设置摄像头');
        return;
      }
      this.dialogVisible = true;
      this.apparatus = apparatus;
      this.loadNewestImg(this.apparatus);
    },
    loadNewestImg(apparatus) {
      this.loadingImg = true;
      //后面加上随机数图片才会刷新
      this.apparatusCameraImgUrl =
        this.domain +
        'api/get-apparatus-picture?camera_ip=' +
        apparatus.camera_ip +
        '&ffgg=' +
        Math.random() * 100;
      console.log('loading ' + this.apparatusCameraImgUrl);
    },
    queryList() {
      this.loading = true;
      apparatusList(this.queryForm)
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
    //导出数据为excel
    exportData() {
      window.open(process.env.VUE_APP_BASE_API + '/apparatus/export');
    },
    handleDelete(row, status) {
      const text = status === 0 ? '恢复' : '删除';
      this.$confirm('确定要' + text + '"' + row.name + '"吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deleteApparatus({
          id: row.id,
          is_deleted: status,
        }).then((response) => {
          if (response.status === 1) {
            this.queryList();
          }
        });
      });
    },
    getImportance(importance) {
      switch (importance) {
        case 1:
          return '一般';
        case 2:
          return '特殊';
        case 3:
          return '贵重';
      }
    },
    getShareTypes(type) {
      var text = '';
      type = type.split(',');
      type.forEach((element) => {
        if (element == '1') {
          text += '自主测样';
        }
        if (element == '2') {
          text += '<br />送样检测';
        }
      });
      return text;
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
    indexMethod2(index) {
      return index + (this.page - 1) * this.size + 1;
    },
    checkNode(node) {
      return checkNode(node);
    },
  },
};
</script>

<style scoped lang="scss">
.max-width-120{
  width: 110px !important;
}
</style>
