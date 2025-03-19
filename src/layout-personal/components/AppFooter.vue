<template>
  <div class="app-footer">
    <div class="clear" />
    <div class="copyright">Copyright ©{{ currentYear }} 上海市肿瘤研究所</div>
  </div>
</template>
<script>
export default {
  name: 'AppFooter',
  computed: {
    currentYear() {
      return new Date().getFullYear();
    },
  },
};
</script>
<style lang="scss" scoped>
.app-footer {
  text-align: center;
  color: rgba(0, 0, 0, 0.5);
  padding-bottom: 30px;
  font-size: 14px;
}
</style>
