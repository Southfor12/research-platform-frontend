<template>
  <div v-html="content"></div>
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
    settingInfo({ type: 'contact_us' }).then((res) => {
      if (res.status === 200) {
        this.content = res.data.value;
      }
    });
  },
};
</script>
