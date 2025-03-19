<template>
  <div>
    <table width="100%" border="0" class="info-table">
      <tbody>
        <tr>
          <td style="background: #fafafa; height: 60px; width: 96px; padding-left: 10px">
            性能指标
          </td>
          <td colspan="3" style="text-align: left; padding: 10px">
            {{ apparatus.performance ? apparatus.performance : '-' }}
          </td>
        </tr>
        <tr>
          <td style="background: #fafafa; height: 60px; width: 96px; padding-left: 10px">
            主要应用
          </td>
          <td colspan="3" style="text-align: left; padding: 10px">
            {{ apparatus.application ? apparatus.application : '-' }}
          </td>
        </tr>
        <tr>
          <td style="background: #fafafa; height: 60px; width: 96px; padding-left: 10px">
            样品要求
          </td>
          <td colspan="3" style="text-align: left; padding: 10px">
            {{ apparatus.sample_require ? apparatus.sample_require : '-' }}
          </td>
        </tr>
        <tr>
          <td style="background: #fafafa; height: 60px; width: 96px; padding-left: 10px">
            仪器说明
          </td>
          <td colspan="3" style="text-align: left; padding: 10px">
            {{ apparatus.introduction ? apparatus.introduction : '-' }}
          </td>
        </tr>
        <tr>
          <td style="background: #fafafa; height: 32px; width: 96px; padding-left: 10px">
            收费标准
          </td>
          <td align="left" style="text-align: left; padding: 10px" colspan="3">
            <div>
              基础费率：<br /><br /><br />
              <div v-for="(item, index) in chargeList" :key="index">
                <div>
                  <span v-if="item.choose" class="not-null">*</span>{{ index + 1 }}.{{
                    item.title
                  }}：
                </div>
                <div v-for="(typeItem, typeIndex) in item.items" :key="typeIndex">
                  {{ typeItem.title }}【院内:{{ typeItem.charge }} 院外:{{
                    typeItem.external_charge
                  }}】元/{{
                    typeItem.type === 1
                      ? '样品'
                      : typeItem.type === 2
                        ? '小时'
                        : typeItem.type === 3
                          ? '次'
                          : typeItem.unit
                  }}
                  <span v-if="typeItem.note">{{ typeItem.note }}</span
                  ><span v-if="typeItem.self_free">(自主检测免费)</span>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'ApparatusDetail',
  props: {
    apparatus: {
      required: true,
      type: Object,
    },
    chargeList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped lang="scss">
.info-table {
  border-collapse: collapse;
}

.info-table td {
  border: 1px solid #cacaca;
  font-size: 12px;
  padding: 3px 4px;
  vertical-align: middle;
  text-align: left;
  height: 24px;
}
</style>
