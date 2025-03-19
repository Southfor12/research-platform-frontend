<template>
  <div
    style="height: auto"
    v-loading="loading"
    class="app-container"
    element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-tabs v-model="activeTab" @keydown.native="handleTabSwitch" @tab-click="handleTabChange">
      <el-tab-pane label="动物订单" name="animal_list">
        <el-form :model="animal_list" label-width="100px">
          <div style="font-weight: bolder">动物订单</div>
          <hr />

          <el-table
            :header-cell-style="{ background: '#fafafa' }"
            :data="animal_list"
            style="width: 100%"
          >
            <el-table-column prop="name" label="产品规格" />

            <el-table-column prop="price" label="单价" />
            <el-table-column prop="count" label="数量" header-align="left">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <span>{{ scope.row.count }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="description" label="描述" />

            <el-table-column width="180" label="操作" header-align="center">
              <template v-slot="scope">
                <el-badge>
                  <el-button type="primary" @click="toAdd(scope.row.id)">编辑</el-button>
                  <el-button
                    icon="el-icon-remove"
                    @click="handleDelete(1, scope.row.id)"
                  ></el-button>
                </el-badge>
              </template>
            </el-table-column>
          </el-table>
          <div style="font-size: 18px; color: #333; margin-top: 20px; float: right">
            订单总额:
            <span style="color: red; font-weight: bold; font-size: 22px">{{
              totalAnimalPrice
            }}</span>
          </div>
          <br />
          <br />
          <br />
          <br />

          <el-row gutter="20" style="text-align: right">
            <el-col>
              <el-button type="primary" @click="handleSubmitAnimal">同意条款并提交订单</el-button>
            </el-col>
          </el-row>

          <el-row gutter="20" style="text-align: right; margin-top: 20px">
            <el-col>
              <span style="font-size: 15px; cursor: pointer" @click="handleBackAnimal"
                >继续购物</span
              >
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="物品订单" name="item_list">
        <el-form :model="item_list" label-width="100px">
          <div style="font-weight: bolder">物品订单</div>
          <hr />

          <el-table
            :header-cell-style="{ background: '#fafafa' }"
            :data="item_list"
            style="width: 100%"
          >
            <el-table-column prop="name" label="产品规格" />

            <el-table-column prop="price" label="单价" />
            <el-table-column prop="count" label="数量" header-align="left">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-button
                    size="mini"
                    icon="el-icon-minus"
                    @click="if (scope.row.count > 1) scope.row.count--;"
                  ></el-button>
                  <span style="margin: -10px 10px">{{ scope.row.count }}</span>
                  <el-button size="mini" icon="el-icon-plus" @click="scope.row.count++"></el-button>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="description" label="描述" />

            <el-table-column width="180" label="操作" header-align="left">
              <template v-slot="scope">
                <el-badge>
                  <el-button
                    icon="el-icon-remove"
                    @click="handleDelete(2, scope.row.id)"
                  ></el-button>
                </el-badge>
              </template>
            </el-table-column>
          </el-table>
          <div style="font-size: 18px; color: #333; margin-top: 20px; float: right">
            订单总额:
            <span style="color: red; font-weight: bold; font-size: 22px">{{ totalItemPrice }}</span>
          </div>
          <br />
          <br />
          <br />
          <br />

          <el-row gutter="20" style="text-align: right">
            <el-col>
              <el-button type="primary" @click="handleSubmitItem">同意条款并提交订单</el-button>
            </el-col>
          </el-row>

          <el-row gutter="20" style="text-align: right; margin-top: 20px">
            <el-col>
              <span style="font-size: 15px; cursor: pointer" @click="handleBackItem">继续购物</span>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="饲养订单" name="feed_list">
        <el-form :model="feed_list" label-width="100px">
          <div style="font-weight: bolder">饲养订单</div>
          <hr />

          <el-table
            :header-cell-style="{ background: '#fafafa' }"
            :data="feed_list"
            style="width: 100%"
          >
            <el-table-column prop="source" label="动物来源" />
            <el-table-column prop="animal_type" label="动物类型" />
            <el-table-column prop="area_type" label="区域" />
            <el-table-column prop="count" label="数量" />

            <el-table-column prop="description" label="描述" />

            <el-table-column width="180" label="操作" header-align="left">
              <template v-slot="scope">
                <el-badge>
                  <el-button
                    icon="el-icon-remove"
                    @click="handleDelete(3, scope.row.id)"
                  ></el-button>
                </el-badge>
              </template>
            </el-table-column>
          </el-table>
          <!-- <div style="font-size: 18px; color: #333; margin-top: 20px; float: right">
            订单总额:
            <span style="color: red; font-weight: bold; font-size: 22px">{{ totalFeedPrice }}</span>
          </div> -->
          <br />
          <br />
          <br />
          <br />

          <el-row gutter="20" style="text-align: right">
            <el-col>
              <el-button type="primary" @click="handleSubmitFeed">同意条款并提交订单</el-button>
            </el-col>
          </el-row>

          <el-row gutter="20" style="text-align: right; margin-top: 20px">
            <el-col>
              <span style="font-size: 15px; cursor: pointer" @click="handleBackFeed">继续购物</span>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="技术订单" name="tech_list">
        <el-form :model="tech_list" label-width="100px">
          <div style="font-weight: bolder">技术订单</div>
          <hr />

          <el-table
            :header-cell-style="{ background: '#fafafa' }"
            :data="tech_list"
            style="width: 100%"
          >
            <el-table-column prop="name" label="技术服务" />
            <el-table-column prop="count" label="数量" />
            <el-table-column prop="create_time" label="创建时间" />
            <el-table-column prop="info" label="描述" />

            <el-table-column width="180" label="操作" header-align="left">
              <template v-slot="scope">
                <el-badge>
                  <el-button
                    icon="el-icon-remove"
                    @click="handleDelete(4, scope.row.id)"
                  ></el-button>
                </el-badge>
              </template>
            </el-table-column>
          </el-table>
          <div style="font-size: 18px; color: #333; margin-top: 20px; float: right">
            订单总额:
            <span style="color: red; font-weight: bold; font-size: 22px">{{ totalTechPrice }}</span>
          </div>
          <br />
          <br />
          <br />
          <br />

          <el-row gutter="20" style="text-align: right">
            <el-col>
              <el-button type="primary" @click="handleSubmitTech">同意条款并提交订单</el-button>
            </el-col>
          </el-row>

          <el-row gutter="20" style="text-align: right; margin-top: 20px">
            <el-col>
              <span style="font-size: 15px; cursor: pointer" @click="handleBackTech">继续购物</span>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
  
<script>
import Empty from '@/components/Empty';
import {
  getItemOrder,
  delItemOrder,
  editItemOrder,
  getAnimalOrder,
  buyAnimalOrder,
  delAnimalOrder,
  getFeedOrder,
  delFeedOrder,
  buyFeedOrder,
  getTechOrder,
  delTechOrder,
  buyTechOrder,
} from '@/api/order';
import { get_a_Animal, get_a_Feed } from '@/api/product';
import store from '@/store';
export default {
  components: {
    Empty,
  },
  data() {
    return {
      activeTab: 'animal_list', // 初始选中的标签页
      tabNames: ['animal_list', 'item_list', 'feed_list', 'tech_list'], // 标签页的 name 顺序

      project_list: [
        {
          pro_id: '1',
          pro_name: '动物园',
          pro_from: '动物园',
        },
      ], // 项目列表

      animal_list: [],

      item_list: [],

      feed_list: [],

      tech_list: [],
    };
  },

  computed: {
    totalAnimalPrice() {
      let total = 0;
      this.animal_list.forEach((item) => {
        total += item.price * item.count;
      });
      return total.toFixed(2);
    },

    totalItemPrice() {
      let total = 0;
      this.item_list.forEach((item) => {
        total += item.price * item.count;
      });
      return total.toFixed(2);
    },
    totalFeedPrice() {
      let total = 0;
      this.feed_list.forEach((item) => {
        total += item.price * item.count;
      });
      return total.toFixed(2);
    },
    totalTechPrice() {
      let total = 0;
      this.tech_list.forEach((item) => {
        total += item.price * item.count;
      });
      return total.toFixed(2);
    },
  },

  created() {
    // this.queryList();
    // Promise.all([this.getItemList(), this.getAnimalList(), this.getFeedList(), this.getTechList()])
    //   .then(() => {
    //     this.$forceUpdate(); // 进行视图层重新渲染
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //   });

    this.getAnimalList();
  },
  methods: {
    handleTabChange(newTab, oldTab) {
      if (newTab.name == 'animal_list') this.getAnimalList();
      if (newTab.name == 'item_list') this.getItemList();
      if (newTab.name == 'feed_list') this.getFeedList();
      if (newTab.name == 'tech_list') this.getTechList();
    },

    //tab键切换
    handleTabSwitch(event) {
      if (event.key === 'Tab') {
        event.preventDefault(); // 防止默认的 Tab 行为
        const currentIndex = this.tabNames.indexOf(this.activeTab);

        if (!event.shiftKey) {
          // Tab 键，切换到下一个标签
          const nextIndex = (currentIndex + 1) % this.tabNames.length;
          this.activeTab = this.tabNames[nextIndex];
        } else {
          // Shift + Tab，切换到上一个标签
          const prevIndex = (currentIndex - 1 + this.tabNames.length) % this.tabNames.length;
          this.activeTab = this.tabNames[prevIndex];
        }
      }
    },

    handleDelete(type, id) {
      if (type == 1) {
        delAnimalOrder({ id: id })
          .then(() => {
            this.getAnimalList();
          })
          .catch(() => {});
      }
      if (type == 2) {
        delItemOrder({ id: id })
          .then(() => {
            this.getItemList();
          })
          .catch(() => {});
      }
      if (type == 3) {
        delFeedOrder({ id: id })
          .then(() => {
            this.getFeedList();
          })
          .catch(() => {});
      }
      if (type == 4) {
        delTechOrder({ id: id })
          .then(() => {
            this.getTechList();
          })
          .catch(() => {});
      }
    },

    getItemList(id = '0') {
      this.item_list = [];
      this.item_list_all = [];
      getItemOrder({ user_id: store.getters.member.id })
        .then((res) => {
          this.item_list = res.data;
          if (this.item_list.length)
            this.item_list.forEach((item) => {
              item.name = item.name + ' ' + item.supplier_name + ' ' + item.specification;
            });
        })
        .catch(() => {});
    },

    getFeedList(id = '0') {
      this.feed_list = [];
      getFeedOrder({ user_id: store.getters.member.id })
        .then((res) => {
          const promises = res.data.map((item) =>
            get_a_Feed({ id: item.care_id }).then((ress) => {
              return {
                ...item,
                animal_type: ress.data.animal_type,
                room_id: ress.data.room_id,
                area_type: ress.data.area_type,
              };
            })
          );

          Promise.all(promises).then((data) => {
            this.feed_list = data; // 确保所有数据加载完成后再赋值
          });
        })
        .catch(() => {});
    },

    getAnimalList(id = '0') {
      this.animal_list = [];
      getAnimalOrder({ user_id: store.getters.member.id })
        .then((res) => {
          const promises = res.data.map((item) =>
            get_a_Animal({ id: item.animal_id }).then((ress) => {
              return {
                ...item,
                name: `${ress.data.name} ${ress.data.supplier_id} ${ress.data.level} ${item.gender} ${item.age} ${item.weight}`,
                price: ress.data.price,
              };
            })
          );

          Promise.all(promises).then((data) => {
            this.animal_list = data; // 确保所有数据加载完成后再赋值
            this.$forceUpdate(); // 强制更新视图
          });
        })
        .catch(() => {});
    },

    getTechList(id = '0') {
      console.log(store.getters.member.id);
      getTechOrder({ user_id: store.getters.member.id })
        .then((res) => {
          this.tech_list = [];
          this.tech_list = res.data;
          console.log(this.tech_list);
        })
        .catch(() => {});
    },

    handleSubmitAnimal() {
      let animals = [];
      for (let i = 0; i < this.animal_list.length; i++) {
        animals.push(this.animal_list[i].id);
      }
      buyAnimalOrder(animals)
        .then(() => {
          this.$router.push('/personal/shopping/order/success');
        })
        .catch(() => {});
    },

    handleSubmitItem() {
      let form = [];

      for (let i = 0; i < this.item_list.length; i++) {
        form.push({ id: this.item_list[i].id, count: this.item_list[i].count });
      }
      editItemOrder(form)
        .then(() => {
          this.getItemList();
          this.$router.push('/personal/shopping/order/success');
        })
        .catch(() => {});
    },

    handleSubmitFeed() {
      let Feed = [];
      for (let i = 0; i < this.feed_list.length; i++) {
        Feed.push(this.feed_list[i].id);
      }
      buyFeedOrder(Feed)
        .then(() => {
          this.$router.push('/personal/shopping/order/success');
        })
        .catch(() => {});
    },

    handleSubmitTech() {
      let Tech = [];
      for (let i = 0; i < this.tech_list.length; i++) {
        Tech.push(this.tech_list[i].id);
      }
      buyTechOrder(Tech)
        .then(() => {
          this.$router.push('/personal/shopping/order/success');
        })
        .catch(() => {});
    },

    handleBackAnimal() {
      this.$router.push('/buy-animal');
    },

    handleBackItem() {
      this.$router.push('/buy-instrument');
    },

    handleBackFeed() {
      this.$router.push('/buy-feed');
    },
    handleBackTech() {
      this.$router.push('/buy-tech');
    },

    toAdd(id) {
      this.$router.push({ path: '/personal/shopping/order/animal/' + id });
    },
  },
  watch: {
    activeTab(newVal, oldVal) {
      this.handleTabSwitch(newVal, oldVal);
    },
  },
};
</script>
  
<style>
/* 默认单元格样式 */
.default-cell {
  background-color: #f9f9f9; /* 浅灰色 */
}
.el-table tbody tr:hover > td {
  background: #f9f9f9 !important;
}

/* 高亮单元格样式 */
.highlight {
  background-color: #ffd04b; /* 黄色 */
  color: #ffffff; /* 白色文字 */
}
</style>