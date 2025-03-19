<template>
  <div class="apparatus-container">
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="queryList">
      <van-dropdown-menu class="select-menu">
        <van-dropdown-item
          @change="
            (value) => {
              return resetQuery(value, 1);
            }
          "
          v-model="queryForm.platform_id"
          :options="platformOptions"
        />
        <van-dropdown-item
          @change="
            (value) => {
              return resetQuery(value, 2);
            }
          "
          v-model="queryForm.type_id"
          :options="typeOptions"
        />
      </van-dropdown-menu>
      <van-card
        v-for="(item, index) in list"
        :class="{ 'top-50': index === 0 }"
        :key="index"
        :desc="'类型：' + item.type_name"
        :title="item.name"
        :thumb="domain + item.picture"
      >
        <div slot="tags" class="apparatus-descibe">负责人： {{ item.admin_name }}</div>
        <div slot="tags" class="apparatus-descibe">仪器归属： {{ item.platform_name }}</div>
        <div slot="tags" class="apparatus-descibe">
          共享方式：
          <van-tag v-if="checkType(item.share_type, '1')" plain type="primary">自主操作</van-tag>
          <van-tag v-if="checkType(item.share_type, '2')" plain type="primary">送样检测</van-tag>
        </div>
        <div slot="tags" class="apparatus-descibe">
          仪器状态：
          <van-tag v-if="item.is_sharing === 1" plain type="primary">已共享</van-tag>
          <van-tag v-else plain type="warning">未共享</van-tag>
          <van-tag v-if="item.status === 1" plain type="success">正常</van-tag>
          <van-tag v-if="item.status === 2" plain>维护</van-tag>
          <van-tag v-if="item.status === 3" plain type="danger">损坏</van-tag>
        </div>
        <div slot="footer">
          <van-button
            size="mini"
            :type="
              item.status === 1 &&
              item.is_sharing === 1 &&
              item.share_type.split(',').indexOf('1') > -1
                ? 'danger'
                : 'gray'
            "
            @click="toAppointment(item.id, 1)"
            :disabled="
              !(
                item.status === 1 &&
                item.is_sharing === 1 &&
                item.share_type.split(',').indexOf('1') > -1
              )
            "
          >
            自主操作
          </van-button>
          <van-button
            size="mini"
            :type="
              item.status === 1 &&
              item.is_sharing === 1 &&
              item.share_type.split(',').indexOf('2') > -1
                ? 'warning'
                : 'gray'
            "
            @click="toAppointment(item.id, 2)"
            :disabled="
              !(
                item.status === 1 &&
                item.is_sharing === 1 &&
                item.share_type.split(',').indexOf('2') > -1
              )
            "
          >
            送样检测
          </van-button>
        </div>
      </van-card>
    </van-list>
  </div>
</template>
<script>
import { apparatusList, apparatusTypeAll } from '@/api/apparatus';
import { platformList } from '@/api/platform';

export default {
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      domain: process.env.VUE_APP_DOMAIN,
      queryForm: {
        page: 1,
        size: 10,
        sort: 'created_at',
        sort_type: 'desc',
        no: '',
        name: '',
        admin_id: '',
        platform_id: '',
        type_id: '',
      },
      platformOptions: [{ text: '所有子平台/实验室', value: '' }],
      typeOptions: [{ text: '所有类型', value: '' }],
    };
  },
  created() {
    this.getPlatforms();
    this.queryApparatusType();
  },
  methods: {
    resetQuery(value, type = 1) {
      this.queryForm.page = 1;
      if (type === 1) this.queryForm.platform_id = value;
      else this.queryList.type_id = value;
      this.list = [];
      this.finished = false;
      this.queryList();
    },
    queryList() {
      this.loading = true;
      apparatusList(this.queryForm)
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
    queryApparatusType() {
      apparatusTypeAll().then((res) => {
        if (res.status === 200) {
          res.data.forEach((item) => {
            this.typeOptions.push({
              text: item.type_name,
              value: item.type_id,
            });
          });
        }
      });
    },
    getPlatforms() {
      var searchPlatformForm = {
        page: 1,
        size: 100,
        idgta: 0,
        is_deleted: 0,
      };
      platformList(searchPlatformForm).then((res) => {
        if (res.status === 200) {
          res.data.data.forEach((item) => {
            this.platformOptions.push({
              text: item.name,
              value: item.id,
            });
          });
        }
      });
    },
    toAppointment(id, type) {
      this.$router.push({
        path: '/h5/appointment/do/' + id + '?type=' + type,
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
  },
};
</script>
<style lang="scss">
.apparatus-container {
  .van-card__title {
    font-size: 16px;
    font-weight: bolder;
    line-height: 30px;
  }
}
</style>
<style lang="scss" scoped>
.van-card__desc {
  margin-bottom: 8px;
}
.apparatus-descibe {
  margin-bottom: 8px;
}
.select-menu {
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 99;
  border-bottom: 1px solid #efefef;
}
.van-card__footer .van-button {
  height: auto;
  padding: 5px;
}
</style>
