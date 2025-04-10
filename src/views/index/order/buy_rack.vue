<template>
  <div class="app-container">
    <div style="font-weight: bolder">笼位预约</div>
    <hr />
    <br />
    <br />
    <br />
    
    <el-form ref="form" :model="form" :rules="rules" label-width="120px" style="width: 500px; margin: 0 auto;">
      <el-form-item label="房间ID" prop="room_id">
        <el-input-number v-model="form.room_id" :min="1"></el-input-number>
      </el-form-item>
      <el-form-item label="用户ID" prop="user_id">
        <el-input-number v-model="form.user_id" :min="1"></el-input-number>
      </el-form-item>
      <el-form-item label="课题组ID" prop="research_group_id">
        <el-input-number v-model="form.research_group_id" :min="1"></el-input-number>
      </el-form-item>
      <el-form-item label="申请数量" prop="requested_count">
        <el-input-number v-model="form.requested_count" :min="1"></el-input-number>
      </el-form-item>
      <el-form-item label="使用时长(天)" prop="time">
        <el-input-number v-model="form.time" :min="1"></el-input-number>
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input type="textarea" v-model="form.remarks" :rows="3"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交预约</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { addCageOrder2 } from '@/api/order';

export default {
  name: 'BuyRack',
  data() {
    return {
      form: {
        room_id: 27,
        user_id: 3,
        research_group_id: 1,
        requested_count: 2,
        remarks: '无',
        time: 180
      },
      rules: {
        room_id: [
          { required: true, message: '请输入房间ID', trigger: 'blur' },
          { type: 'number', message: '房间ID必须为数字', trigger: 'blur' }
        ],
        user_id: [
          { required: true, message: '请输入用户ID', trigger: 'blur' },
          { type: 'number', message: '用户ID必须为数字', trigger: 'blur' }
        ],
        research_group_id: [
          { required: true, message: '请输入课题组ID', trigger: 'blur' },
          { type: 'number', message: '课题组ID必须为数字', trigger: 'blur' }
        ],
        requested_count: [
          { required: true, message: '请输入申请数量', trigger: 'blur' },
          { type: 'number', message: '申请数量必须为数字', trigger: 'blur' }
        ],
        time: [
          { required: true, message: '请输入使用时长', trigger: 'blur' },
          { type: 'number', message: '使用时长必须为数字', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    submitForm() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          try {
            const response = await addCageOrder2(this.form);
            if (response.status === 1) {
              this.$message.success('预约成功');
            } else {
              this.$message.error(response.msg || '预约失败');
            }
          } catch (error) {
            console.error('预约失败:', error);
            this.$message.error('预约失败');
          }
        }
      });
    }
  }
};
</script>

<style scoped>
.app-container {
  padding: 20px;
}
</style>