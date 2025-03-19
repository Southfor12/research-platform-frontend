<template>
  <div>
    <el-tabs tab-position="left" style="min-height: 200px" @tab-click="tabChange">
      <el-tab-pane v-for="(item, index) in platforms" :key="index" :label="item.name">
        <el-tabs type="border-card" class="index-common-table-container">
          <el-tab-pane label="平台简介">
            <div class="intro-container" v-html="item.note"></div>
          </el-tab-pane>
          <el-tab-pane label="设备预览">
            <div class="intro-container">
              <div
                @click="toApparatus(item.id)"
                v-for="(item, index) in apparatus"
                :key="index"
                class="apparatus-container"
              >
                <div class="apparatus-image-container">
                  <el-image :src="domain + item.picture"></el-image>
                  <div class="apparatus-imagr-title">
                    {{ item.name }}
                  </div>
                </div>
                <div class="apparatus-params">设备编号： {{ item.no }}</div>
                <div class="apparatus-params">
                  存放地点：
                  {{ item.address ? item.address : '-' }}
                </div>
              </div>
            </div>
          </el-tab-pane>
          <!-- <el-tab-pane label="师资力量">
                        <div class="intro-container">
                            
                        </div>
                    </el-tab-pane> -->
          <el-tab-pane label="规章制度">
            <div class="intro-container">
              <el-form :inline="true" class="search-form">
                <el-form-item>
                  <el-input
                    size="small"
                    v-model="queryNewsForm.name"
                    :clearable="true"
                    placeholder="搜索内容"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button size="small" type="primary" @click="submit">搜索</el-button>
                </el-form-item>
              </el-form>
              <el-table :data="newsList" border style="width: 100%">
                <el-table-column type="index" :index="indexDdMethod" label="序号" width="50" />
                <el-table-column prop="name" label="标题">
                  <template slot-scope="scope">
                    <a href="#" @click="navOpen('/regulations/detail/' + scope.row.id)">{{
                      scope.row.name
                    }}</a>
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
                :total="total"
                :current-page="queryNewsForm.page"
                :page-size="queryNewsForm.size"
                @current-change="handleCurrentChange"
              />
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { platformList } from '@/api/platform';
import { apparatusList } from '@/api/apparatus';
import { newsList } from '@/api/news';
import Empty from '@/components/Empty';

export default {
  components: {
    Empty,
  },
  data() {
    return {
      currentIndex: 0,
      platforms: [],
      apparatus: [],
      domain: process.env.VUE_APP_DOMAIN,
      total: 0,
      newsList: [],
      queryApparatusForm: {
        page: 1,
        size: 10,
        sort: 'created_at',
        sort_type: 'desc',
        platform_id: '',
        is_deleted: '0',
      },
      queryPlatformForm: {
        page: 1,
        size: 100,
        sort: 'created_at',
        sort_type: 'desc',
        type: '2',
        is_deleted: '0',
      },
      queryNewsForm: {
        page: 1,
        size: 10,
        type: '1',
        name: '',
        platform_id: '',
        sort: 'created_at',
        is_deleted: 0,
        sort_type: 'desc',
      },
    };
  },
  created() {
    this.getPlatformList();
  },
  methods: {
    getNewsList() {
      newsList(this.queryNewsForm).then((res) => {
        if (res.status === 200) {
          this.newsList = res.data.data;
          this.total = res.data.total;
        }
      });
    },
    submit() {
      this.queryNewsForm.page = 1;
      this.getNewsList();
    },
    handleCurrentChange(val) {
      this.queryNewsForm.page = val;
      this.getNewsList();
    },
    getPlatformList() {
      platformList(this.queryPlatformForm).then((res) => {
        if (res.status === 200) {
          this.platforms = res.data.data;
          if (this.platforms.length > 0) {
            this.queryApparatusForm.platform_id = this.platforms[0].id;
            this.queryNewsForm.platform_id = this.platforms[0].id;
            this.queryNewsForm.name = '';
            this.getApparatusList();
            this.getNewsList();
          }
        }
      });
    },
    getApparatusList() {
      apparatusList(this.queryApparatusForm).then((res) => {
        if (res.status === 200) {
          this.apparatus = res.data.data;
        }
      });
    },
    tabChange(tab, event) {
      if (tab.index !== this.currentIndex) {
        this.currentIndex = tab.index;
        this.queryApparatusForm.platform_id = this.platforms[tab.index].id;
        this.queryNewsForm.platform_id = this.platforms[tab.index].id;
        this.queryNewsForm.page = 1;
        this.getNewsList();
        this.getApparatusList();
      }
    },
    toApparatus(id) {
      let routeData = this.$router.resolve({
        name: 'appointmentDetail',
        params: { id: id },
      });
      this.navOpen(routeData.href);
    },
    indexDdMethod(index) {
      return index + (this.queryNewsForm.page - 1) * this.queryNewsForm.size + 1;
    },
  },
};
</script>
<style lang="scss" scoped>
.intro-container {
  padding: 15px;
  min-height: 300px;
}

.intro-title {
  color: #3a3a3a;
  font-weight: bold;
}

.intro-content {
  margin: 15px 0;
  min-height: 200px;
}

.apparatus-container {
  width: 30%;
  height: 220px;
  float: left;
  margin-right: 3.33%;
  cursor: pointer;
}

.apparatus-params {
  font-size: 14px;
  color: #333333;
  margin-top: 10px;
}

.apparatus-image-container {
  position: relative;

  .el-image {
    width: 100%;
    height: 150px;
  }

  .apparatus-imagr-title {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    color: #ffffff;
    text-align: center;
    background: rgba(0, 0, 0, 0.65);
  }
}
</style>
