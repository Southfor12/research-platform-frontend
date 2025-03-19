<template>
  <div>
    <el-table :header-cell-style="{ background: '#fafafa' }" :data="list" style="width: 100%">
      <el-table-column type="index" label="序号" width="50" />
      <el-table-column label="名称">
        <template slot-scope="scope">
          {{ scope.row.name }} {{ scope.row.reagent_name }}
          {{ scope.row.hcs_name }}
        </template>
      </el-table-column>
      <el-table-column label="数量">
        <template slot-scope="scope">
          {{ scope.row.number }} {{ scope.row.price_number_num }}
        </template>
      </el-table-column>
      <el-table-column prop="price" label="单价/元" />
      <el-table-column prop="factory_name" label="厂家" />
      <el-table-column prop="platform" label="存放地点" />
      <div slot="empty">
        <empty />
      </div>
    </el-table>
  </div>
</template>
<script>
import Empty from '@/components/Empty';

export default {
  name: 'ChemicalBookingInfo',
  components: {
    Empty,
  },
  props: {
    list: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      train: [],
      apparatusTrain: [],
      serviceTrain: [],
    };
  },
  methods: {},
};
</script>
