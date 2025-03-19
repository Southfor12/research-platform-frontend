<template>
  <div>
    <div class="news-title">{{ newsInfo.name }}</div>
    <div class="news-time">发布时间： {{ getDate(newsInfo.created_at) }}</div>
    <div v-if="newsInfo.type === 2">
      <video class="width-100-percent height-100-percent" controls>
        <source :src="domain + newsInfo.url" type="video/mp4" />
        您的浏览器不支持 video 标签
      </video>
    </div>
    <div class="news-content" v-else v-html="newsInfo.content"></div>
    <div class="download" v-if="newsInfo.url && newsInfo.type !== 2">
      <a @click="downloadFile">
        <span class="download-title">下载附件</span>
      </a>
    </div>
  </div>
</template>
<script>
import { trainDocInfo } from '@/api/security';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      newsInfo: {},
      domain: process.env.VUE_APP_DOMAIN,
    };
  },
  computed: {
    ...mapGetters(['member']),
  },
  created() {
    if (this.$route.params.id) {
      trainDocInfo({
        id: this.$route.params.id,
        is_deleted: '0',
      }).then((res) => {
        if (res.status === 200) {
          this.newsInfo = res.data;
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
    downloadFile() {
      if (!this.member.id) {
        this.$message('请先登录！');
        return false;
      }
      var url = process.env.VUE_APP_DOMAIN + this.newsInfo.url;
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
}

.download {
  width: auto;
  text-align: center;
}

.download-title {
  font-weight: bold;
}
</style>
