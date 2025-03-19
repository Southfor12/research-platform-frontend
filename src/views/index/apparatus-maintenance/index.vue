<template>
  <div>
    <el-card class="search-box">
      <div slot="header" class="search-box-header">
        <span>设备搜索</span>
        <el-button @click="submit" style="float: right" size="small" type="primary">查找</el-button>
      </div>
      <div>
        <el-form :inline="true" :model="queryForm">
          <el-form-item label="名称">
            <el-input
              size="small"
              class="max-width-150"
              v-model="queryForm.name"
              clearable
              placeholder="设备名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="仪器状态">
            <el-select
              v-model="queryForm.status"
              size="small"
              clearable
              class="max-width-150"
              filterable
            >
              <el-option label="维修" :value="2" />
              <!-- <el-option label="维护" :value="2" /> -->
              <!-- <el-option label="损坏" :value="3" /> -->
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="search-box">
      <div slot="header" class="search-box-header">
        <span>设备列表</span>
      </div>
      <div
        v-loading="loading"
        element-loading-text="数据查询中..."
        element-loading-spinner="el-icon-loading"
      >
        <el-table :data="list" border style="width: 100%">
          <el-table-column type="index" :index="indexDdMethod" label="序号" width="50" />
          <el-table-column prop="name" label="仪器名称">
            <template slot-scope="scope">
              <a href="#" @click="tryOpen('/appointment/detail/' + scope.row.id)">{{
                scope.row.name
              }}</a>
            </template>
          </el-table-column>
          <el-table-column prop="model" label="仪器型号" />
          <el-table-column prop="address" label="仪器位置" />
          <el-table-column label="仪器状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status === 2">维修</el-tag>
              <el-tag v-if="scope.row.status === 3">维修</el-tag>
              <!-- <el-tag v-if="scope.row.status === 2">维护</el-tag>
              <el-tag v-if="scope.row.status === 3">损坏</el-tag> -->
            </template>
          </el-table-column>
          <!-- <el-table-column prop="breakdown_cause" label="维护/损坏原因" />
          <el-table-column prop="breakdown_at" label="维护/损坏时间" width="180" /> -->
          <div slot="empty">
            <empty />
          </div>
        </el-table>
        <el-pagination
          class="dl-pagination"
          :hide-on-single-page="true"
          background
          layout="total, prev, pager, next, jumper"
          :total="total"
          :current-page="queryForm.page"
          :page-size="queryForm.size"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import { apparatusIndexFrontList, apparatusTypeAll } from '@/api/apparatus';
import { platformIndexFrontList } from '@/api/platform';
import { userIndexFrontList } from '@/api/user';
import Empty from '@/components/Empty';
import { mapGetters } from 'vuex';

export default {
  components: {
    Empty,
  },
  computed: {
    ...mapGetters(['member']),
  },
  data() {
    return {
      loading: false,
      queryForm: {
        page: 1,
        size: 10,
        sort: 'created_at',
        sort_type: 'desc',
        statusgta: 1,
        status: '',
        no: '',
        name: '',
        admin_id: '',
        platform_id: '',
        type_id: '',
      },
      total: 0,
      platforms: [],
      users: [],
      list: [],
      types: [],
      domain: process.env.VUE_APP_DOMAIN,
      searchPlatformForm: {
        page: 1,
        size: 100,
        is_deleted: 0,
        name: '',
      },
      searchUserForm: {
        page: 1,
        size: 30,
        status: 1,
        name: '',
      },
    };
  },
  created() {
    let platform = this.$route.query.platform ? this.$route.query.platform : '';
    if (this.$route.query.search) this.queryForm.name = this.$route.query.search;
    if (this.$route.query.type) this.queryForm.type_id = parseInt(this.$route.query.type);
    this.queryApparatusType();
    this.queryList();
    this.getUsers();
    this.getPlatforms(platform, true);
  },
  methods: {
    tryOpen(url) {
      if (this.checkAudit('仪器维修')) {
        this.navOpen(url);
      }
    },
    queryList() {
      this.loading = true;
      apparatusIndexFrontList(this.queryForm)
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
    queryApparatusType() {
      apparatusTypeAll().then((res) => {
        if (res.status === 200) {
          this.types = res.data;
        }
      });
    },
    submit() {
      this.queryForm.page = 1;
      this.queryList();
    },
    getShareTypes(type) {
      var text = [];
      type = type.split(',');
      type.forEach((element) => {
        if (element == '1') {
          text.push('自主测样');
        }
        if (element == '2') {
          text.push('送样检测');
        }
      });
      return text.join(',');
    },
    getUsers(query = '') {
      this.searchUserForm.name = query;
      userIndexFrontList(this.searchUserForm).then((res) => {
        if (res.status === 200) {
          this.users = res.data.data;
        }
      });
    },
    getPlatforms(query = '', first = false) {
      this.searchPlatformForm.name = query;
      platformIndexFrontList(this.searchPlatformForm).then((res) => {
        if (res.status === 200) {
          if (first && res.data.data.length > 0 && this.$route.query.platform) {
            this.queryForm.platform_id = res.data.data[0].id;
            this.queryList();
          }
          this.platforms = res.data.data;
        }
      });
    },
    indexDdMethod(index) {
      return index + (this.queryForm.page - 1) * this.queryForm.size + 1;
    },
    handleCurrentChange(val) {
      this.queryForm.page = val;
      this.queryList();
    },
  },
};
</script>
<style lang="scss" scoped>
.apparatus-info {
  border-bottom: 1px solid #dfdfdf;
  display: flex;
  padding: 15px 10px;

  &__pic {
    width: 102px;
    text-align: center;

    img {
      width: 100px;
      height: 81px;
      vertical-align: middle;
      border: 1px solid #dfdfdf;
    }
  }

  &__content {
    width: 633px;
    padding: 0 10px;
  }

  &__item {
    display: flex;
    font-size: 13px;
    padding-top: 10px;
  }

  &__title {
    width: 72px;
    color: #bfbfbf;
    white-space: nowrap;
    text-align: right;
  }

  &__desc {
    width: 136px;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    -o-text-overflow: ellipsis;
    -moz-text-overflow: ellipsis;
    -webkit-text-overflow: ellipsis;
    text-overflow: ellipsis;
  }

  &__operate {
    width: 90px;

    button {
      width: 100%;
      margin: 0 0 5px 0;
    }

    a:last-child button {
      margin: 0;
    }
  }
}
</style>
