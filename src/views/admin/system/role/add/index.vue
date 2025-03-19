<template>
  <div v-loading="loading" class="app-container" element-loading-text="数据处理中..."
    element-loading-spinner="el-icon-loading">
    <el-form ref="addRoleForm" :model="addRoleForm" :rules="rules" label-width="80px">
      <el-form-item label="角色名称" prop="role_name">
        <el-input v-model="addRoleForm.role_name" size="small" class="max-width-200" clearable />
      </el-form-item>
      <el-form-item label="单位" v-if="!this.addRoleForm.id">
        <el-select
          v-model="addRoleForm.factory_id"
          :clearable="false"
          size="small"
          class="max-width-200"
          placeholder="类型"
        >
          <el-option v-for="factory in getSelectableFactories()"
            :key="factory.id"
            :label="factory.name"
            :value="factory.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所需权限">
        <el-tabs v-model="firstTab" :tab-position="tabPosition" class="node-list">
          <el-tab-pane v-for="item in nodeData" :key="item.id" :label="item.title" :name="item.code">
            <el-tree ref="nodeTree" :data="item.children" show-checkbox node-key="id" default-expand-all
              :default-checked-keys="defaultCheckedKeys" :props="defaultProps" />
          </el-tab-pane>
        </el-tabs>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="onSubmit()">保 存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import {
    addRole,
    getRole,
    nodeList,
    editRole
  } from '@/api/system';
  import {
    link
  } from 'fs';
  import {
    error
  } from 'util';
  export default {
    name: 'RoleAdd',
    data() {
      return {
        nodeData: [],
        firstTab: '',
        defaultCheckedKeys: [],
        defaultProps: {
          label: 'title',
        },
        addRoleForm: {
          role_name: '',
          factory_id: this.currentFactoryId,
          // role_type: '',
          id: '',
          nodes: [],
        },
        rules: {
          role_name: [{
              required: true,
              message: '请填写角色名称',
              trigger: 'blur',
            },
            {
              min: 2,
              max: 10,
              message: '长度在 2 到 10 个字',
              trigger: 'blur',
            },
          ],
        },
        loading: false,
        tabPosition: 'top',
      };
    },
    computed: {
      roleDisabled() {
        return !!this.addRoleForm.id;
      },
    },
    created() {
      nodeList().then((response) => {
        this.getNodeList(response.data.nodes);
      });
      this.getRole();
    },
    methods: {
      async getRole() {
        this.addRoleForm.id = this.$route.params.id;
        if (this.addRoleForm.id) {
          getRole({
            id: this.addRoleForm.id
          }).then((response) => {
            if (response.status !== 200) {
              this.$router.push({
                path: '/system/role/list'
              });
            } else {
              this.addRoleForm.role_name = response.data.role_name;
              this.addRoleForm.factory_id = response.data.factory_id;

              this.defaultCheckedKeys = response.data.node;
            }
          });
        }
      },
      getNodeList(list) {
        const nodeList = [];
        const top_list = list.filter((item) => {
          return item.pid === 0;
        });
        this.nodeData = this.getNodeChildren(list, top_list);
        if (this.nodeData.length > 0) {
          this.firstTab = this.nodeData[0].code;
        }
      },
      getNodeChildren(list, top_list) {
        const res = [];

        top_list.forEach((element) => {
          const tmp = {
            ...element
          };
          const children = list.filter((item) => {
            return item.pid === tmp.id;
          });
          if (children.length > 0) {
            if (tmp.pid === 0) {
              element.children = [{
                id: tmp.id,
                title: '全部权限',
                children: this.getNodeChildren(list, children),
              }, ];
            } else {
              element.children = this.getNodeChildren(list, children);
            }
          }
          res.push(element);
        });

        return res;
      },
      onSubmit() {
        // console.log(this.addRoleForm)
        // return;

        this.addRoleForm.nodes = [];
        this.$refs['nodeTree'].forEach((item) => {
          this.addRoleForm.nodes = this.addRoleForm.nodes
            .concat(item.getHalfCheckedKeys())
            .concat(item.getCheckedKeys());
        });
        this.$refs['addRoleForm'].validate((valid) => {
          if (valid) {
            this.loading = true;
            if (this.addRoleForm.id) {
              editRole(this.addRoleForm)
                .then((response) => {
                  this.loading = false;
                  if (response.status === 1)
                    this.$router.push({
                      path: '/system/role/list',
                    });
                })
                .catch((error) => {
                  this.loading = false;
                });
            } else {
              addRole(this.addRoleForm)
                .then((response) => {
                  this.loading = false;

                  if (response.status === 1) {
                    this.$router.push({
                      path: '/system/role/list',
                    });
                  }
                })
                .catch((error) => {
                  this.loading = false;
                });
            }
          } else {
            return false;
          }
        });
      },
    },
  };
</script>
<style lang="scss" scoped>
  .node-list {
    width: 100%;
    margin-bottom: 30px;
  }
</style>
