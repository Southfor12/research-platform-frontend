<template>
  <div class="intro-container" v-html="content"></div>
</template>

<script>
import { settingInfo } from '@/api/system';
export default {
  data() {
    return {
      content: '',
    };
  },
  created() {
    let type = 'platform_intro';

    if (this.$route.path.endsWith('zhongxinshiyanshi')) {
      type = 'zhongxinshiyanshi';
    } else if (this.$route.path.endsWith('shiyandongwuzhongxin')) {
      type = 'shiyandongwuzhongxin';
    } else if (this.$route.path.endsWith('shengwuziyuanzhongxin')) {
      type = 'shengwuziyuanzhongxin';
    } else if (this.$route.path.endsWith('gmpxibaozhongxin')) {
      type = 'gmpxibaozhongxin';
    } else if (this.$route.path.endsWith('shujufenxizhongxin')) {
      type = 'shujufenxizhongxin';
    } else if (this.$route.path.endsWith('privacy-agreement')) {
      type = 'privacy_agreement';
    }

    settingInfo({
      type: type,
    }).then((res) => {
      if (res.status === 200) {
        this.content = res.data.value;
      }
    });
  },
};
</script>

<style lang="scss" scoped>
.intro-container {
  font-family: Arial;
  line-height: 1.5;
  word-wrap: break-word;

  table {
    display: table;
    border-collapse: separate;
    border-spacing: 2px;
    border-color: grey;
  }

  p {
    text-align: left;
    text-indent: 2em;
  }
}
</style>
