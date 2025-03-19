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
              clearable
              v-model="queryForm.name"
              placeholder="请输入名称"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="仪器类型">
            <el-select
              v-model="queryForm.type_id"
              size="small"
              clearable
              class="max-width-150"
              filterable
            >
              <el-option
                v-for="item in types"
                :key="item.type_id"
                :label="item.type_name"
                :value="item.type_id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="品牌">
            <el-input
              size="small"
              class="max-width-150"
              v-model="queryForm.factory"
              placeholder="请输入品牌"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-form :inline="true" :model="queryForm">
          <el-form-item label="型号">
            <el-input
              size="small"
              class="max-width-150"
              v-model="queryForm.model"
              placeholder="请输入型号"
            ></el-input>
          </el-form-item>
          <el-form-item label="负责人">
            <el-select
              v-model="queryForm.admin_id"
              size="small"
              clearable
              class="max-width-150"
              filterable
              remote
              reserve-keyword
              :remote-method="getUsers"
              placeholder="输入姓名搜索选择"
            >
              <el-option v-for="item in users" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="所属子平台">
            <el-select
              v-model="queryForm.platform_id"
              size="small"
              clearable
              class="max-width-150"
              filterable
              remote
              reserve-keyword
              :remote-method="getPlatforms"
              placeholder="输入名称搜索选择"
            >
              <el-option
                v-for="item in platforms"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
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
        <div v-for="(item, index) in list" :key="index" class="apparatus-info">
          <div class="apparatus-info__pic">
            <span class="common-link" @click="navOpen('/appointment/detail/' + item.id)">
              <img :src="domain + item.picture" />
            </span>
          </div>
          <div class="apparatus-info__content">
            <div>
              <a
                class="common-link"
                href="#"
                @click="navOpen('/appointment/detail/' + item.id)"
                :title="item.name"
                >{{ item.name }}</a
              >
            </div>
            <div class="apparatus-info__item">
              <div class="apparatus-info__title">归属：</div>
              <div class="apparatus-info__desc">
                {{ item.platform_name }}
              </div>
              <div class="apparatus-info__title">放置地点：</div>
              <div class="apparatus-info__desc">
                {{ item.address }}
              </div>
              <div class="apparatus-info__title">类型：</div>
              <div class="apparatus-info__desc">
                {{ item.type_name }}
              </div>
            </div>
            <div class="apparatus-info__item">
              <div class="apparatus-info__title">负责人：</div>
              <div class="apparatus-info__desc">
                {{ item.admin_name }}
              </div>
              <div class="apparatus-info__title">共享状态：</div>
              <div class="apparatus-info__desc">
                {{ item.is_sharing ? '已共享' : '未共享' }}
              </div>
              <div class="apparatus-info__title">设备状态：</div>
              <div class="apparatus-info__desc">
                {{ item.status === 1 ? '正常' : item.status === 2 ? '维护' : '损坏' }}
              </div>
            </div>
            <div class="apparatus-info__item">
              <div class="apparatus-info__title">共享方式：</div>
              <div v-html="getShareTypes(item.share_type)" class="apparatus-info__desc"></div>
              <div class="apparatus-info__title">型号：</div>
              <div class="apparatus-info__desc">
                {{ item.model }}
              </div>
              <div class="apparatus-info__title">品牌：</div>
              <div class="apparatus-info__desc">
                {{ item.factory }}
              </div>
            </div>
          </div>
          <div class="apparatus-info__operate">
            <span class="common-link" @click="tryOpen('/appointment/detail/' + item.id)">
              <el-button type="primary" size="small" icon="el-icon-document">仪器详情</el-button>
            </span>
            <span
              v-if="
                item.status === 1 &&
                item.is_sharing === 1 &&
                item.share_type.split(',').indexOf('1') > -1
              "
              class="common-link"
              @click="tryOpen('/appointment/detail/' + item.id + '?appointment=y&type=1')"
            >
              <el-button type="danger" size="small" icon="el-icon-alarm-clock">自主操作</el-button>
            </span>
            <el-button v-else type="info" size="small" icon="el-icon-alarm-clock"
              >自主操作</el-button
            >
            <span
              v-if="
                item.status === 1 &&
                item.is_sharing === 1 &&
                item.share_type.split(',').indexOf('2') > -1
              "
              class="common-link"
              @click="tryOpen('/appointment/detail/' + item.id + '?appointment=y&type=2')"
            >
              <el-button type="warning" size="small" icon="el-icon-coordinate">送样检测</el-button>
            </span>
            <el-button v-else type="info" size="small" icon="el-icon-coordinate"
              >送样检测</el-button
            >
          </div>
        </div>
        <div v-if="list.length === 0" slot="empty">
          <empty />
        </div>
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
        name: '',
        factory: '',
        model: '',
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
      if (this.checkAudit('仪器预约')) {
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
    // width: 633px;
    width: 70%;
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
    margin-left: auto;

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
