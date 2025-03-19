<template>
  <div class="index-container">
    <div class="" style="text-align: center; line-height: 0.81">
      <div class="head-picture">
        <div class="pic-info">
          <img src="../../public/imgs/logo_Institute.png" style="width: 23%; height: 180px" />
          <img src="../../public/imgs/Public.png" style="width: 77%; height: 180px" />
        </div>
      </div>
      <div class="headerNav" style="">
        <!-- <img src="../assets/images/uulab.png" alt=""> -->
        <el-menu
          mode="horizontal"
          background-color="#103770"
          text-color="#d2ecff"
          class="head-title"
          :default-active="activeName"
          active-text-color="#fdcc4c"
        >
          <el-menu-item index="index" @click="menuClick('index')">首页</el-menu-item>
          <el-menu-item index="intro" @click="menuClick('intro')">平台简介</el-menu-item>
          <el-submenu index="3" :popper-append-to-body="false">
            <template slot="title"><span class="menu-sub-title">信息公告</span></template>
            <el-menu-item index="news" @click="menuClick('news')">新闻动态</el-menu-item>
            <el-menu-item index="notes" @click="menuClick('notes')">通知公告</el-menu-item>
          </el-submenu>
          <el-submenu index="4" :popper-append-to-body="false">
            <template slot="title"><span class="menu-sub-title">科研教学</span></template>
            <el-menu-item index="science" @click="menuClick('science')">科学研究</el-menu-item>
            <el-menu-item index="education" @click="menuClick('education')">教育教学</el-menu-item>
          </el-submenu>
          <el-submenu index="5" :popper-append-to-body="false">
            <template slot="title"><span class="menu-sub-title">仪器设备</span></template>
            <el-menu-item index="appointment" @click="menuClick('appointment')"
              >仪器预约</el-menu-item
            >
            <el-menu-item index="instrument_training" @click="menuClick('instrument-training')"
              >仪器培训</el-menu-item
            >
            <!-- <el-menu-item index="apply_training" @click="menuClick('apply-training')">申请培训</el-menu-item> -->
            <el-menu-item index="apparatus_maintenance" @click="menuClick('apparatus-maintenance')"
              >仪器维修</el-menu-item
            >
          </el-submenu>

          <el-submenu index="12" :popper-append-to-body="false">
            <template slot="title"><span class="menu-sub-title">订购管理</span></template>
            <el-menu-item index="buy_animal" @click="menuClick('buy-animal')"
              >动物订购</el-menu-item
            >
            <el-menu-item index="buy_instrument" @click="menuClick('buy-instrument')"
              >物品订购</el-menu-item
            >
            <el-menu-item index="buy_tech" @click="menuClick('buy-tech')">技术订购 </el-menu-item>
            <el-menu-item index="buy_feed" @click="menuClick('buy-feed')">饲养订购 </el-menu-item>
          </el-submenu>

          <el-submenu index="6" :popper-append-to-body="false">
            <template slot="title"><span class="menu-sub-title">服务内容</span></template>
            <el-menu-item index="organisms" @click="menuClick('organisms')"
              >生物资源中心</el-menu-item
            >
            <el-menu-item index="animal" @click="menuClick('animal')"
              >实验动物研究中心</el-menu-item
            >
            <el-menu-item index="sharing" @click="menuClick('sharing')">中心实验室</el-menu-item>
            <el-menu-item index="gmp" @click="menuClick('gmp')">GMP细胞技术中心</el-menu-item>
          </el-submenu>
          <el-submenu index="7" :popper-append-to-body="false">
            <template slot="title"><span class="menu-sub-title">规章制度</span></template>
            <el-menu-item index="hcsmng" @click="menuClick('hcsmng')">危化品管理</el-menu-item>
            <el-menu-item index="securityedu" @click="menuClick('securityedu')"
              >安全教育</el-menu-item
            >
            <el-menu-item index="inrules" @click="menuClick('inrules')">入室制度</el-menu-item>
            <el-menu-item index="apparatusrules" @click="menuClick('apparatusrules')"
              >仪器制度</el-menu-item
            >
          </el-submenu>
          <el-submenu index="8" :popper-append-to-body="false">
            <template slot="title"><span class="menu-sub-title">办事指南</span></template>
            <el-menu-item index="inprocess" @click="menuClick('inprocess')">入室流程</el-menu-item>
            <el-menu-item index="apparatustrain" @click="menuClick('apparatustrain')"
              >仪器培训</el-menu-item
            >
            <el-menu-item index="techtrain" @click="menuClick('techtrain')">技术培训</el-menu-item>
          </el-submenu>
          <el-menu-item index="rechargeinfo" @click="menuClick('rechargeinfo')"
            >收费标准</el-menu-item
          >
          <div>
            <el-dropdown class="user" placement="bottom-start" trigger="click">
              <el-button type="primary">
                <i class="el-icon-user-solid"></i>
              </el-button>
              <el-dropdown-menu
                slot="dropdown"
                style="background-color: #103770; border-color: #103770"
                class="dropdownMenu"
              >
                <el-dropdown-item @click.native="loginIn" style="color: #fff" v-if="!isShowLogout"
                  >用户登录</el-dropdown-item
                >
                <el-dropdown-item @click.native="goHome" style="color: #fff" v-if="isShowLogout"
                  >个人中心</el-dropdown-item
                >
                <el-dropdown-item @click.native="goSystem" style="color: #fff" v-if="isShowLogout"
                  >系统管理</el-dropdown-item
                >
                <el-dropdown-item @click.native="open" style="color: #fff" v-if="isShowLogout"
                  >用户注销</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-menu>
      </div>
    </div>
    <div class="index-wrapper" :style="'min-height:680px;'">
      <index-main v-if="activeName === 'index'" />
      <div v-else style="display: flex">
        <div v-if="activeName !== 'platform_intro'" style="width: 21.5%">
          <div style="margin-bottom: 18px" v-if="activeName === 'intro'">
            <div class="clearfix box-header">
              <i class="el-icon-mouse"></i>
              <span>平台简介</span>
            </div>
            <div class="apparatus-cate">
              <div class="apparatus-cate__link">
                <span class="click-item" @click="navTo('/intro')">平台简介</span>
              </div>
            </div>
          </div>
          <div style="margin-bottom: 18px" v-if="activeName === 'news' || activeName === 'notes'">
            <div class="clearfix box-header">
              <i class="el-icon-mouse"></i>
              <span>信息公告</span>
            </div>
            <div class="apparatus-cate">
              <div class="apparatus-cate__link">
                <span class="click-item" @click="navTo('/news')">新闻动态</span>
              </div>
              <div class="apparatus-cate__link">
                <span class="click-item" @click="navTo('/notes')">通知公告</span>
              </div>
            </div>
          </div>

          <div
            style="margin-bottom: 18px"
            v-if="
              activeName === 'buy_animal' ||
              activeName === 'buy_instrument' ||
              activeName === 'buy_tech' ||
              activeName === 'buy_feed'
            "
          >
            <div class="clearfix box-header">
              <i class="el-icon-mouse"></i>
              <span>订购管理</span>
            </div>
            <div class="apparatus-cate">
              <div class="apparatus-cate__link">
                <span class="click-item" @click="navTo('/buy-animal')">动物订购</span>
              </div>
              <div class="apparatus-cate__link">
                <span class="click-item" @click="navTo('/buy-instrument')">物品订购</span>
              </div>
              <div class="apparatus-cate__link">
                <span class="click-item" @click="navTo('/buy-tech')">技术订购</span>
              </div>
              <div class="apparatus-cate__link">
                <span class="click-item" @click="navTo('/buy-feed')">饲养订购</span>
              </div>
            </div>
          </div>

          <div
            style="margin-bottom: 18px"
            v-if="activeName === 'science' || activeName === 'education'"
          >
            <div class="clearfix box-header">
              <i class="el-icon-mouse"></i>
              <span>科研教学</span>
            </div>
            <div class="apparatus-cate">
              <div class="apparatus-cate__link">
                <span class="click-item" @click="navTo('/science')">科学研究</span>
              </div>
              <div class="apparatus-cate__link">
                <span class="click-item" @click="navTo('/education')">教育教学</span>
              </div>
            </div>
          </div>
          <div
            style="margin-bottom: 18px"
            v-if="
              activeName === 'appointment' ||
              activeName === 'instrument_training' ||
              activeName === 'apply_training' ||
              activeName === 'apparatus_maintenance'
            "
          >
            <div class="clearfix box-header">
              <i class="el-icon-mouse"></i>
              <span>仪器设备</span>
            </div>
            <div class="apparatus-cate">
              <div class="apparatus-cate__link">
                <span class="click-item" @click="navTo('/appointment')">仪器预约</span>
              </div>
              <div class="apparatus-cate__link">
                <span class="click-item" @click="navTo('/instrument-training')">仪器培训</span>
              </div>
              <!-- <div class="apparatus-cate__link">
                                <el-link href="/apply-training">申请培训</el-link>
                            </div> -->
              <div class="apparatus-cate__link">
                <span class="click-item" @click="navTo('/apparatus-maintenance')">仪器维修</span>
              </div>
            </div>
          </div>
          <div
            style="margin-bottom: 18px"
            v-if="
              activeName === 'organisms' ||
              activeName === 'animal' ||
              activeName === 'sharing' ||
              activeName === 'gmp' ||
              activeName === 'publab'
            "
          >
            <div class="clearfix box-header">
              <i class="el-icon-mouse"></i>
              <span>服务内容</span>
            </div>
            <div class="apparatus-cate">
              <div class="apparatus-cate__link">
                <span class="click-item" @click="navTo('/organisms')">生物资源中心</span>
              </div>
              <div class="apparatus-cate__link">
                <span class="click-item" @click="navTo('/animal')">实验动物研究中心</span>
              </div>
              <div class="apparatus-cate__link">
                <span class="click-item" @click="navTo('/sharing')">中心实验室</span>
              </div>
              <div class="apparatus-cate__link">
                <span class="click-item" @click="navTo('/gmp')">GMP细胞技术中心</span>
              </div>
            </div>
          </div>
          <div
            style="margin-bottom: 18px"
            v-if="
              activeName === 'hcsmng' || activeName === 'securityedu' || activeName === 'inrules'
            "
          >
            <div class="clearfix box-header">
              <i class="el-icon-mouse"></i>
              <span>规章制度</span>
            </div>
            <div class="apparatus-cate">
              <div class="apparatus-cate__link">
                <span class="click-item" @click="navTo('/hcsmng')">危化品管理</span>
              </div>
              <div class="apparatus-cate__link">
                <span class="click-item" @click="navTo('/securityedu')">安全教育</span>
              </div>
              <div class="apparatus-cate__link">
                <span class="click-item" @click="navTo('/inrules')">入室制度</span>
              </div>
              <div class="apparatus-cate__link">
                <span class="click-item" @click="navTo('/apparatusrules')">仪器制度</span>
              </div>
            </div>
          </div>
          <div
            style="margin-bottom: 18px"
            v-if="
              activeName === 'inprocess' ||
              activeName === 'apparatustrain' ||
              activeName === 'techtrain'
            "
          >
            <div class="clearfix box-header">
              <i class="el-icon-mouse"></i>
              <span>办事指南</span>
            </div>
            <div class="apparatus-cate">
              <div class="apparatus-cate__link">
                <el-link href="/inprocess">入室流程</el-link>
              </div>
              <div class="apparatus-cate__link">
                <el-link href="/apparatustrain">仪器培训</el-link>
              </div>
              <div class="apparatus-cate__link">
                <el-link href="/techtrain">技术培训</el-link>
              </div>
            </div>
          </div>
          <div style="margin-bottom: 18px" v-if="activeName === 'rechargeinfo'">
            <div class="clearfix box-header">
              <i class="el-icon-mouse"></i>
              <span>收费标准</span>
            </div>
            <div class="apparatus-cate">
              <div class="apparatus-cate__link">
                <span class="click-item" @click="navTo('/rechargeinfo')">收费标准</span>
              </div>
            </div>
          </div>
          <div style="margin-bottom: 18px">
            <div class="clearfix box-header">
              <i class="el-icon-odometer"></i>
              <span>仪器分类</span>
            </div>
            <div class="apparatus-cate">
              <div
                class="apparatus-cate__item"
                v-for="(item, index) in apparatusTypes"
                :key="index"
              >
                <span class="apparatus-cate__title">
                  <span class="click-item" @click="navTo('/appointment?type=' + item.type_id)">{{
                    item.type_name
                  }}</span>
                </span>
                <div class="apparatus-cate__list">
                  <ul>
                    <li v-for="(apparatus, aparatusIndex) in item.apparatuses" :key="aparatusIndex">
                      <!-- <span class="click-item" @click="navOpen('/appointment/detail/' + apparatus.id)">{{apparatus.name}}</span> -->
                      <span
                        class="click-item"
                        @click="
                          OpenClassification_ApparatusDetail('/appointment/detail/' + apparatus.id)
                        "
                        >{{ apparatus.name }}</span
                      >
                    </li>
                  </ul>
                  <empty v-if="item.apparatuses.length === 0" />
                  <span class="apparatus-cate__hide-border"></span>
                </div>
              </div>
            </div>
          </div>
          <div style="margin-bottom: 18px">
            <div slot="header" @click="toNewTab('apparatusMonthSort')" class="clearfix box-header">
              <i class="el-icon-s-data"></i>
              <span>仪器使用月度排行</span>
            </div>
            <div class="apparatus-cate">
              <div
                v-for="(item, index) in monthSort"
                :key="index"
                :title="item.name"
                class="apparatus-cate__link"
              >
                <!-- <span class="click-item" @click="navOpen('/appointment/detail/' + item.id)">{{ (index + 1) + '. ' + item.name }}</span> -->
                <span
                  class="click-item"
                  @click="OpenClassification_ApparatusDetail('/appointment/detail/' + item.id)"
                  >{{ index + 1 + '. ' + item.name }}</span
                >
              </div>
            </div>
          </div>
          <div style="margin-bottom: 18px">
            <div @click="toNewTab('apparatusYearSort')" class="clearfix box-header">
              <i class="el-icon-coin"></i>
              <span>仪器使用年度排行</span>
            </div>
            <div class="apparatus-cate">
              <div
                v-for="(item, index) in yearSort"
                :key="index"
                :title="item.name"
                class="apparatus-cate__link"
              >
                <span class="click-item" @click="navOpen('/appointment/detail/' + item.id)">{{
                  index + 1 + '. ' + item.name
                }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-if="activeName === 'platform_intro'">
          <breadcrumb platformType="index" />
          <index-main />
        </div>
        <div v-if="activeName !== 'platform_intro'" style="width: 75%; margin-left: 18px">
          <breadcrumb platformType="index" />
          <index-main />
        </div>
      </div>
    </div>
    <div class="index-footer">
      <!-- gutter属性用来控制列与列之间的间隔 -->
      <el-row :gutter="0" type="flex" justify="center">
        <el-col :sm="24" :md="24" :lg="24" :xl="24">
          <div class="friendink">
            <span>友情链接：</span>
            <el-divider direction="vertical"></el-divider>
            <a href="https://wsjkw.sh.gov.cn/">上海市卫生健康委员会</a>
            <el-divider direction="vertical"></el-divider>
            <a href="https://www.sjtu.edu.cn/">上海交通大学</a>
            <el-divider direction="vertical"></el-divider>
            <a href="https://gs-shmc.fudan.edu.cn/">复旦上海医学院</a>
            <el-divider direction="vertical"></el-divider>
            <a href="https://www.fudan.edu.cn/">复旦大学</a>
            <el-divider direction="vertical"></el-divider>
            <a href="https://www.renji.com/">仁济医院</a>
            <el-divider direction="vertical"></el-divider>
            <a href="http://mail.shsci.org/">邮箱登录</a>
          </div>
          <el-divider key=""></el-divider>
          <div class="icp">
            <el-link :underline="false" href="https://beian.miit.gov.cn/" target="_blank"
              >沪ICP备15036656号-1</el-link
            >
            &nbsp;&nbsp;版权所有：上海市肿瘤研究所
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="0" class="goverPic">
        <el-col :span="1">
          <el-image class="img-institution" src="/imgs/government.png"></el-image>
        </el-col>
      </el-row>
    </div>
    <!-- <img src="/imgs/sidebtn.png" v-if="!drawer" style="position: fixed; top: 300px; right: 0; cursor: pointer" @click="drawer = true" /> -->
    <!-- <el-drawer title="我是标题" :visible.sync="drawer" :with-header="false">
      <img src="/imgs/sidebtn.png" v-if="drawer" style="position: absolute; top: 300px; left: 0; cursor: pointer; z-index: 99;"
        @click="drawer = false" />
      <div style="position: absolute; top: 0; left: 0; width: 50px; height: 100%; z-index: 90;" @click="drawer = false"></div>
      <div style="position: absolute; top: 0; left: 50px; width: 300px; height: 100%; padding: 10px; background: #ffffff;">
        <div style="text-align: center; margin-top: 30px;">
          <p>{{ weekDay[today.getDay()] }}</p>
          <p>{{ today.getFullYear() + '年' + ((today.getMonth() < 9) ? '0' : '') + (today.getMonth() + 1) + '月' + ((today.getDate() < 10) ? '0' : '') + today.getDate() + '日' }}</p>
        </div>
        <div class="fast-pass">
          <div class="fast-pass__item">
            <a href='#' @click="toApply">
              <svg-icon class='theme-color' icon-class="apply-icon" />
              <span>入室办理</span>
            </a>
          </div>
          <div class="fast-pass__item">
            <a href="#" @click="tryTo('/appointment')">
              <svg-icon class='theme-color' icon-class="apparatus-icon" />
              <span>仪器预约</span>
            </a>
          </div>
          <div class="fast-pass__item">
            <a href="#" @click="tryTo('/appointment?type=1')">
              <svg-icon class='theme-color' icon-class="cell-icon" />
              <span>细胞房预约</span>
            </a>
          </div>
          <div class="fast-pass__item">
            <a href="#" @click="tryTo('/personal/hcs-apply/list')">
              <svg-icon class='theme-color' icon-class="hcs-icon" />
              <span>危化品申领</span>
            </a>
          </div>
        </div>
      </div>
    </el-drawer> -->
  </div>
</template>
<script>
import { settingInfo } from '@/api/system';
import { mapGetters } from 'vuex';
import { apparatusRankList, apparatusTypeAll } from '@/api/apparatus';
import { IndexMain } from './components';
import { timeFormat } from '@/utils/index';
import { logout } from '@/api/user.js';
import Breadcrumb from '@/components/Breadcrumb';
import Empty from '@/components/Empty';
import 'element-ui/lib/theme-chalk/display.css';
import { getToken } from '@/utils/auth';

export default {
  name: 'LayoutIndex',
  components: {
    IndexMain,
    Breadcrumb,
    Empty,
  },
  computed: {
    ...mapGetters(['member']),
  },
  watch: {
    $route() {
      if (this.$route.path === '/') {
        this.activeName = 'index';
        this.currentTitle = this.adImgs[0] && this.adImgs[0].title;
      } else {
        this.activeName = this.$route.meta.tagName;
      }
    },
    screenWidth: function (val) {
      this.carouselHeight = this.screenWidth / (1280 / 450) + 'px';
    },
  },
  mounted() {
    var _this = this;
    window.onresize = function () {
      _this.screenWidth = document.documentElement.clientWidth;
    };
    console.log(document.getElementsByClassName('el-submenu__title'));

    if (getToken() != '') {
      this.isShowLogout = true;
    }
  },
  data() {
    return {
      isShowLogout: false,
      drawer: false,
      activeName: 'index',
      carouselHeight: '0px',
      downIcon: 'el-icon-arrow-down',
      headerImg: '',
      domain: process.env.VUE_APP_DOMAIN,
      monthSort: [],
      apparatusTypes: [],
      yearSort: [],
      currentTitle: '',
      screenWidth: document.documentElement.clientWidth,
      adImgs: [],
      weekDay: ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
      today: new Date(),
    };
  },
  created() {
    this.activeName = this.$route.meta.tagName;
    this.carouselHeight = this.screenWidth / (1280 / 450) + 'px';
    settingInfo({
      type: 'horse_lamp',
    }).then((res) => {
      if (res.status === 200) {
        this.adImgs = JSON.parse(res.data.value);
      }
    });
    settingInfo({
      type: 'logo_image',
    }).then((res) => {
      if (res.status === 200) {
        this.headerImg = res.data.value;
      }
    });
    this.queryApparatusType();
    this.queryApparatusList();
    localStorage.setItem('client-type', 'web');
  },
  methods: {
    OpenClassification_ApparatusDetail(url) {
      if (this.checkAudit('仪器详情', url)) {
        this.navOpen(url);
      }
    },
    loginIn() {
      // this.isShowLogout = true
      this.$router.push('/login');
    },
    async open() {
      await this.$store.dispatch('user/logout');
      this.$router.push(`/login`);
      // logout()
      // this.$router.push('/login')
      // this.isShowLogout = true
    },
    toApply() {
      if (this.checkAudit('入驻实验室', url)) {
        this.navTo('/apply-platform');
      }
    },
    tryTo: function (url) {
      this.drawer = false;
      this.navTo(url);
    },
    tryOpen: function (url) {
      this.drawer = false;
      this.navOpen(url);
    },
    queryApparatusType() {
      apparatusTypeAll().then((res) => {
        if (res.status === 200) {
          this.apparatusTypes = res.data;
        }
      });
    },
    queryApparatusList() {
      var currentDate = new Date();
      var month = timeFormat(
        new Date(currentDate.setDate(currentDate.getDate() - 30)),
        'yyyy-MM-dd'
      );
      var year = timeFormat(
        new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
        'yyyy-MM-dd'
      );
      currentDate = timeFormat(new Date(), 'yyyy-MM-dd');
      apparatusRankList({
        page: 1,
        size: 5,
        start_date: month,
        end_date: currentDate,
      }).then((res) => {
        if (res.status === 200) {
          res.data.forEach((item, index) => {
            this.monthSort.push({
              id: item.apparatus_id,
              name: item.apparatus_name,
            });
          });
        }
      });
      apparatusRankList({
        page: 1,
        size: 5,
        start_date: year,
        end_date: currentDate,
      }).then((res) => {
        if (res.status === 200) {
          res.data.forEach((item, index) => {
            this.yearSort.push({
              id: item.apparatus_id,
              name: item.apparatus_name,
            });
          });
        }
      });
    },
    toNewTab(name) {
      let routeData = this.$router.resolve({
        name,
      });
      window.open(routeData.href, '_blank');
    },
    tabClick(tab, event) {
      if (tab.name === 'index') {
        window.location.href = '/' + tab.name;
      } else {
        this.$router.push({
          path: '/' + tab.name,
        });
      }
    },
    menuClick(name) {
      this.$router.push('/' + name);
      // console.log(this.activeName);
    },
    handleVisibleChange(command) {
      this.downIcon = command ? 'el-icon-arrow-up' : 'el-icon-arrow-down';
    },
    toRegister() {
      this.$router.push({
        path: '/register',
      });
    },
    goHome() {
      this.$router.push({
        path: '/info-center/my-booking',
      });
    },
    goSystem() {
      this.$router.push({
        path: '/home',
      });
    },
    carouselChange(current, pre) {
      this.currentTitle = this.adImgs[current].name;
    },
    async logout() {
      await this.$store.dispatch('user/logout');
      this.$router.push('/');
    },
  },
};
</script>
<style lang="scss">
.friendink {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 0 0 0;
}

.goverPic {
  display: flex;
  align-items: center;
  justify-content: center;
}

.friendink a {
  font-size: 16px;
  font-family: '微软雅黑', 'Arial', Gadget, sans-serif;
}
.el-divider--horizontal {
  margin: 10px 0;
}
.apparatus-cate {
  &__item {
    color: #333333;
    position: relative;
    border-top: none;
    border-left: 1px solid #d9d9d9;
    border-right: 1px solid #d9d9d9;
    border-bottom: 1px solid #d9d9d9;
  }

  &__item:last-child {
    border-bottom: 1px solid #d9d9d9;
  }

  &__link {
    padding: 10px 20px;
    border: 1px solid #d9d9d9;
    border-top: none;
    border-left: 1px solid #d9d9d9;
    border-right: 1px solid #d9d9d9;
    border-bottom: none;
  }

  &__link:last-child {
    border-bottom: 1px solid #d9d9d9;
  }

  &__item:hover &__title {
    // border: 2px solid #2068b0;
    border: 2px solid #3a6ebf;
  }

  &__item:hover &__list {
    display: block;
  }

  &__title {
    padding: 10px 18px;
    width: 100%;
    height: 100%;
    display: inline-block;
    border: 2px solid #ffffff;
  }

  &__list {
    position: absolute;
    top: -39px;
    right: -500px;
    // border: 2px solid #2068b0;
    border: 2px solid #3a6ebf;
    width: 500px;
    min-height: 150px;
    background: #ffffff;
    padding: 10px;
    z-index: 999;
    display: none;
  }

  &__hide-border {
    position: absolute;
    top: 39px;
    left: -5px;
    width: 10px;
    height: 38px;
    background: #ffffff;
  }

  ul li {
    float: left;
    margin: 0 20px 10px 10px;
  }
}

.fast-pass {
  margin-top: 80px;

  &__item {
    border-bottom: 1px solid #e9e9e9;

    a {
      height: 42px;
      display: block;
      text-decoration: none;
      color: #8a8a8a;
      padding: 10px 0;
      position: relative;
      margin-bottom: 6px;
    }

    a:hover {
      color: #ffffff;
      background: #2068b0;
    }

    svg {
      font-size: 23px;
      vertical-align: middle !important;
      margin: 0 3px 0 8px;
    }
  }
}
</style>
<style lang="scss">
.main-tabs .el-tabs__header {
  margin: 0 !important;
}

.banner-tool {
  height: 74px;
  background-color: #2068b0;
}

.banner-bar {
  max-width: 896px;
  margin: 0px auto;
  height: 72px;
  position: relative;
}

.leftt,
.rightt {
  position: absolute;
  top: -10px;
  width: 10px;
  height: 10px;
  z-index: 999;
}

.leftt {
  left: -10px;
  background: url(/imgs/leftt.png);
}

.rightt {
  right: -8px;
  top: -10px;
  background: url(/imgs/rightt.png);
}

.baccc {
  position: absolute;
  max-width: 896px;
  height: 84px;
  background: url(/imgs/baccc.png) no-repeat;
  top: -11px;
  left: 0px;
  right: 0;
  bottom: 0;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  z-index: 999;
}

.c-block {
  float: left;
  width: 14.25%;
  height: 70px;
  position: relative;
  z-index: 999999;
}

.c-item {
  position: absolute;
  top: -12px;
  left: 0px;
  width: 100%;
  height: 81px;
  overflow: hidden;
  padding: 2px 0px;
  text-align: center;
  color: #ffffff;
}

.c-item:hover {
  color: #ffffff;
}

.c-item img {
  width: 45px;
  margin-top: 6px;
}

.cc {
  position: absolute;
  top: 4px;
  left: 28px;
  width: 45px;
  height: 50px;
}

.cc-platform {
  background: url(/imgs/platform.png) no-repeat;
  background-position: -29px 3px;
}

.c-name {
  color: white;
  position: absolute;
  top: 57px;
  width: 100%;
  text-align: center;
}

.box-card {
  // border: 1px solid #2068b0;
  border: 1px solid #103770;
  border-radius: 0 !important;

  .el-card__header {
    padding: 0;
  }
}

.common-box-card {
  border: 1px solid #2068b0;
  border-radius: 0 !important;
}

.common-box-card .el-card__header {
  padding: 0;
  border: none;
}

.login-box-card .el-form {
  max-width: 200px;
  margin: 0 auto;
}

.login-box-card .el-form-item__label {
  font-size: 10px;
}

.login-box-card .el-form-item {
  margin-bottom: 5px !important;
}

.index-common-table {
  width: 100%;
}

.index-common-table-container {
  border: 1px solid #2068b0;

  .el-tabs__header {
    border-color: #2068b0;
    background: #2068b0;

    .el-tabs__item {
      color: #ffffff;
    }

    .el-tabs__item:hover {
      color: #ffffff;
    }
  }
}

.index-common-table-container .el-table th,
.index-common-table-container .el-table td {
  font-size: 12px;
  padding: 6px 0 !important;
}

.index-common-table .cell {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.index-common-table-container .el-tabs__content {
  padding: 0;
}

.index-common-table-container .el-card__body {
  padding: 0;
}

.index-box-card-header {
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  font-weight: 500;
  padding-left: 20px;
  color: #ffffff;
  background: #2068b0;
  border-bottom: 1px solid #2068b0;
}

.search-container .el-form-item {
  margin-bottom: 0;
}

.search-box {
  margin-bottom: 15px;

  .el-card__header {
    padding: 10px 20px;
    background: #eeeeee;

    .el-button--small {
      height: 32px;
      line-height: 32px;
      padding: 0px 15px;
    }
  }

  .el-card__body {
    padding-bottom: 0;
  }

  .search-box-header span {
    display: inline-block;
    height: 32px;
    line-height: 32px;
    font-weight: bold;
  }
}

.search-box:last-child {
  .el-card__body {
    padding: 0 0 20px 0;
  }
}
</style>
<style lang="scss">
body {
  min-height: 100%;
  background: #f4f4f4;
  position: relative;
}

.el-dropdown-menu__item:hover {
  background-color: #3a6ebf !important;
}

// .el-popper[x-placement^="bottom"] .popper__arrow::after {
//   border-bottom-color: rgb(130, 42, 44) !important;
// }

.index-container {
  min-height: 100%;

  .head-picture {
    display: flex;
    justify-content: center;
    margin: 0 auto;
    width: 80%;
    display: flex;

    .pic-info {
      width: 100%;
      max-height: 200px;
      display: flex;
    }
  }

  .el-breadcrumb {
    margin-bottom: 15px;
  }

  .head_logo {
    text-align: center;
  }
  .headerNav {
    // background:#2068b0;
    background: #103770; //修改头部一整行的颜色
    height: 60px;
    position: relative;
    justify-content: space-between;
    .el-submenu .el-menu-item:hover:hover {
      background-color: #144f96 !important;
    }
    .head-title {
      display: flex;
      justify-content: space-between;
      width: 80%;
      margin: 0 auto;
      font-size: 18px;
    }
    img {
      position: absolute;
      width: 130px;
      height: 40px;
      z-index: 99;
      left: 7%;
      top: 10px;
    }

    .el-menu--horizontal {
      .el-menu-item {
        /* width: 120px; */
        width: 98px;
        text-align: center;
        font-size: 16px;
        font-weight: bold;
      }

      .el-submenu .el-submenu__title {
        width: 110px;
      }
      .el-menu--popup-bottom-start {
        // margin-top: 0px;
      }
      .el-submenu .el-menu-item,
      .el-menu--popup {
        min-width: 148px !important;
      }
    }

    // .el-menu-item:hover{
    //   background-color:rgb(156, 85, 93) !important;
    // }

    .user {
      .el-button--primary {
        background-color: #103770;
        border-color: #103770;
        font-size: 30px;
        position: relative;
        height: 100%;
        display: flex;
        align-items: center;
        margin-right: -20px;
      }
      .el-dropdown-menu el-popper:hover {
        background-color: blue;
      }
    }
  }
}

.ad-carousel {
  position: relative;

  &__title {
    position: absolute;
    z-index: 999999;
    bottom: 30px;
    right: 30px;
    color: #ffffff;
    background: #8a8a8a;
    padding: 10px;
  }
}

.index-wrapper {
  // max-width: 1104px;
  max-width: 80%;
  margin: 18px auto;
  background: #ffffff;

  .item {
    margin-bottom: 10px;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .item:last-child {
    margin-bottom: 0;
  }

  .box-card:first-child {
    margin-bottom: 18px;
  }

  .box-header {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    font-weight: 500;
    padding-left: 20px;
    color: #ffffff;
    // background: #2068b0;
    background-color: #103770;
    // border-bottom: 1px solid #2068b0;
    border-bottom: 1px solid #103770;
    cursor: pointer;
  }

  .box-header span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .box-header img {
    vertical-align: middle;
    margin-bottom: 3px;
  }
}

.navbar {
  height: 65px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0px 1px 0px rgba(0, 21, 41, 0.08);

  &__logo {
    width: 32px;
    height: 32px;
    vertical-align: middle;
    margin: 0 0.2rem 0.5rem 0.8rem;
  }

  &__title {
    display: inline-block;
    margin: 0;
    // color: #2068b0;
    color: #103770;
    font-weight: 600;
    line-height: 65px;
    font-size: 20px;
    font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
  }

  &__right-menu {
    float: right;
    height: 65px;
    line-height: 65px;

    &__item {
      display: inline-block;
      padding-left: 0.5rem;
    }

    &__item:last-child {
      padding-right: 0.2rem;
    }
  }

  .member-container {
    margin-right: 15px;

    .el-dropdown-link {
      cursor: pointer;
      color: #303133;
    }

    .demonstration {
      display: block;
      color: #8492a6;
      font-size: 14px;
      margin-bottom: 20px;
    }
  }
}

.index-footer {
  width: 100%;
  // min-width: 1104px;
  min-width: 80%;
  // background: #2068b0;
  background: #103770;
  color: #f4f4f4;
  height: 220px;
  margin-top: 30px;
  flex-shrink: 0;

  .copyright {
    margin: 10px 0 0 30px;
  }

  .icp {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    font-size: 16px;
    margin: 5px 0 0 30px;

    .el-link {
      color: #f4f4f4;
    }
  }

  .footer-img-container {
    text-align: left;
  }

  .img-institution {
    margin: 20px 0 0 0;
  }

  .img-renji {
    width: 80px;
    height: 80px;
    margin: 10px 0 0 0;
  }
}
</style>
<style lang="scss" scoped>
.el-menu-item:hover {
  background-color: #0d2c5a !important;
}
/* .el-submenu__title{

  } */
.el-submenu__title {
  background-color: #103770 !important;
}
.el-submenu__title:hover {
  background-color: #144f96 !important;
}

.el-menu--horizontal > .el-menu-item.is-active {
  color: #fff !important;
  border-bottom-color: #fff !important;
}
.el-menu--horizontal > .el-submenu.is-active .el-submenu__title {
  color: #fff !important;
  border-bottom-color: #fff !important;
}
.el-menu--horizontal .el-menu .el-menu-item.is-active,
.el-menu--horizontal .el-menu .el-submenu.is-active > .el-submenu__title {
  color: #fff !important;
}

.el-menu--horizontal > .el-submenu {
  /* width: 124px; */
  width: 120px;
}

.menu-sub-title {
  font-size: 16px;
  font-weight: bold;
}

.el-menu--horizontal .el-menu .el-menu-item,
.el-menu--horizontal .el-menu .el-submenu__title {
  font-size: 16px;
  /* font-weight: bold; */
}
/* .el-submenu__title:hover{
    background-color: #9c555d !important;
  } */
/* .el-submenu .el-submenu__title:hover{
    background-color: #9c555d !important;
  } */
/* .el-menu--horizontal .el-menu .el-submenu__title:hover{
    background-color: #9c555d !important;
  } */
.index-container >>> .el-drawer__open .el-drawer.rtl {
  width: 350px !important;
  background: none;
  box-shadow: none;
}

.click-item {
  font-size: 14px;
  font-weight: 500;
  -webkit-box-direction: normal;
}

.click-item:hover {
  /* color: #2068b0; */
  color: #103770;
  cursor: pointer;
  text-decoration: underline;
}

.app-breadcrumb.el-breadcrumb {
  margin-top: 15px;
}
</style>

<style lang="scss" >
.popper__arrow::after {
  border-bottom-color: #103770 !important;
}
</style>
