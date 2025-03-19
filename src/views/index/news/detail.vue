<template>
  <div>
    <div class="news-title">{{ newsInfo.name }}</div>
    <div class="news-time">发布时间： {{ getDate(newsInfo.created_at) }}</div>
    <div class="news-content" v-html="newsInfo.content"></div>
    <div class="download" v-if="newsInfo.source_url_arr.length > 0">
      <div class="download-title">下载附件:</div>
      <div
        v-for="(item, index) in newsInfo.source_url_arr"
        style="padding-top: 8px"
        :key="index"
        @click="downloadFile(item.url)"
      >
        <a>{{ item.name }}</a>
      </div>
    </div>
  </div>
</template>
<script>
import { newsInfo } from '@/api/news';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      newsInfo: {
        source_url_arr: [],
      },
    };
  },
  computed: {
    ...mapGetters(['member']),
  },
  created() {
    if (this.$route.params.id) {
      newsInfo({
        id: this.$route.params.id,
        is_deleted: '0',
      }).then((res) => {
        if (res.status === 200) {
          this.newsInfo = res.data;
          console.log('news info is')
          console.log(this.newsInfo)
        } else {
          this.$router.push({
            path: '/',
          });
        }
      });
    } else {
      this.$router.push({
        path: '/',
      });
    }
  },
  methods: {
    downloadFile(url) {
      if (!this.member.id) {
        this.$message('请先登录！');
        return false;
      }
      var url = process.env.VUE_APP_DOMAIN + url;
      window.open(url);
    },
  },
};
</script>
<style lang="scss">
.news-title {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
}

.news-time {
  text-align: center;
  font-size: 12px;
  color: gray;
  margin: 15px 0 20px;
}

.news-content {
  padding: 0 10px;
  min-height: 300px;

  image {
    max-width: 100%;
  }

  ol {
    display: block;
    list-style-type: decimal;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 40px;
  }
}

.download {
  width: auto;
  text-align: center;
}

.download-title {
  font-weight: bold;
}
</style>
