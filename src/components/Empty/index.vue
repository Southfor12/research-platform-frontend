<template>
  <div class="edl-empty">
    <div class="edl-empty-image">
      <img :src="imgPath" :alt="description" />
    </div>
    <p class="edl-empty-description">{{ description }}</p>
  </div>
</template>
<script>
export default {
  name: 'Empty',
  props: {
    description: {
      type: String,
      default: '暂无数据',
    },
    icon: {
      type: String,
      default: 'empty-data',
    },
  },
  computed: {
    imgPath() {
      return '/imgs/' + this.icon + '.svg';
    },
  },
};
</script>
<style lang="scss" scoped>
.edl-empty {
  margin: 32px 0;
  font-size: 14px;
  line-height: 22px;
  text-align: center;
  color: rgba(0, 0, 0, 0.5);

  .edl-empty-image {
    height: 40px;
    margin-bottom: 8px;

    img {
      height: 100%;
      vertical-align: middle;
      border-style: none;
    }
  }

  .edl-empty-description {
    margin: 0;
  }
}
</style>
