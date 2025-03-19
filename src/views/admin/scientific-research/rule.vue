<template>
  <div class="app-container">
    <el-form v-for="(item, index) in types" :key="index" label-width="100px">
      <el-form-item :label="item.title" label-width="200px">
        <el-form v-for="(item1, index1) in item.items" :key="index1" label-width="118px">
          <el-form-item :label="item1.title">
            <el-input-number
              v-model="item1.score"
              size="small"
              :min="0"
              :placeholder="'请输入' + item1.title"
            ></el-input-number>
            分
          </el-form-item>
        </el-form>
      </el-form-item>
    </el-form>
    <el-button type="primary" size="small" style="margin-left: 200px" @click="submit('sci_examine')"
      >保 存</el-button
    >
  </div>
</template>
<script>
import { settingInfo, settingUpdate } from '@/api/system';

export default {
  data() {
    return {
      types: [
        {
          type: 'paper',
          title: '科研论文分值(类型)',
          items: [
            {
              id: 1,
              title: '顶级',
              score: '',
            },
            {
              id: 2,
              title: '特级',
              score: '',
            },
            {
              id: 3,
              title: 'SCI一档',
              score: '',
            },
            {
              id: 4,
              title: 'SCI二档',
              score: '',
            },
            {
              id: 5,
              title: 'SCI三档',
              score: '',
            },
            {
              id: 6,
              title: 'SCI四档',
              score: '',
            },
            {
              id: 7,
              title: 'EI期刊',
              score: '',
            },
            {
              id: 8,
              title: 'EI会议',
              score: '',
            },
            {
              id: 9,
              title: 'CPCS-S',
              score: '',
            },
            {
              id: 10,
              title: 'SSCI',
              score: '',
            },
            {
              id: 11,
              title: 'A_HCI',
              score: '',
            },
            {
              id: 12,
              title: 'CPCS-SSH',
              score: '',
            },
            {
              id: 13,
              title: 'CSSCI',
              score: '',
            },
            {
              id: 14,
              title: 'CSCD',
              score: '',
            },
            {
              id: 15,
              title: 'SCD',
              score: '',
            },
            {
              id: 16,
              title: '一级A',
              score: '',
            },
            {
              id: 17,
              title: '一级B',
              score: '',
            },
            {
              id: 18,
              title: '二级',
              score: '',
            },
            {
              id: 19,
              title: '其他',
              score: '',
            },
            {
              id: 20,
              title: 'SCI',
              score: '',
            },
            {
              id: 21,
              title: '一级',
              score: '',
            },
          ],
        },
        {
          type: 'award',
          title: '科研奖项分值(等级)',
          items: [
            {
              id: 1,
              title: '国家级',
              score: '',
            },
            {
              id: 2,
              title: '省部级',
              score: '',
            },
            {
              id: 3,
              title: '厅局级',
              score: '',
            },
            {
              id: 4,
              title: '社会力量',
              score: '',
            },
            {
              id: 5,
              title: '其他',
              score: '',
            },
          ],
        },
        {
          type: 'project',
          title: '科研项目分值(等级)',
          items: [
            {
              id: 1,
              title: '国家级重大',
              score: '',
            },
            {
              id: 2,
              title: '国家级重点',
              score: '',
            },
            {
              id: 3,
              title: '国家级一般',
              score: '',
            },
            {
              id: 4,
              title: '省部级重大',
              score: '',
            },
            {
              id: 5,
              title: '省部级规划重点',
              score: '',
            },
            {
              id: 6,
              title: '省部级重点',
              score: '',
            },
            {
              id: 7,
              title: '省部级规划一般',
              score: '',
            },
            {
              id: 8,
              title: '省部级一般',
              score: '',
            },
            {
              id: 9,
              title: '厅局级重大',
              score: '',
            },
            {
              id: 10,
              title: '厅局级重点',
              score: '',
            },
            {
              id: 11,
              title: '厅局级一般',
              score: '',
            },
            {
              id: 12,
              title: '其他计划项目',
              score: '',
            },
            {
              id: 13,
              title: '横向',
              score: '',
            },
            {
              id: 14,
              title: '其他',
              score: '',
            },
            {
              id: 15,
              title: '省部级面上重点',
              score: '',
            },
          ],
        },
        {
          type: 'honour',
          title: '科研荣誉分值',
          items: [
            {
              id: 0,
              title: '科研荣誉',
              score: '',
            },
          ],
        },
      ],
    };
  },
  created() {
    this.getInfo('sci_examine');
  },
  methods: {
    getInfo(type) {
      settingInfo({
        type,
      }).then((res) => {
        if (res.status === 200) {
          this.types = JSON.parse(res.data.value);
        }
      });
    },
    submit(type) {
      try {
        this.types.forEach((item) => {
          item.items.forEach((item1) => {
            if (item1.score === undefined) {
              throw item.title + '-' + item1.title + '未填写';
            }
          });
        });
      } catch (e) {
        this.$message.error(e);
        return false;
      }
      settingUpdate({
        type,
        value: JSON.stringify(this.types),
      }).then((res) => {});
    },
  },
};
</script>
