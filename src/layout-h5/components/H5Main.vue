<template>
  <section class="index-main">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
export default {
  name: 'H5Main',
  computed: {
    key() {
      return this.$route.fullPath;
    },
  },
};
</script>
