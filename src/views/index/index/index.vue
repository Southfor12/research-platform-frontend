<template>
  <div class="index-container">
    <div style="margin-top: 18px;">
      <!-- 第一行 -->
      <div class="news-all">
        <!-- 中间图片轮播区域 -->
        <div class="news-rotation-area">
          <div class="news-show-area">
            <el-image :name="currentAppliance.title" :src="currentAppliance.pic"
              style="width: 100%; height: 100%;cursor: pointer;"
              @click="navTo('/news/detail/' + currentAppliance.id)" />
            <div
              style="position: absolute; display: flex; bottom: 0; width: 100%; height: 42px; line-height: 42px; color: #ffffff; background: url(/imgs/pic_t_bg.png);">
              <span
                style="width: 75%; display: inline-block; padding: 0 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                <strong>
                  <div class="common-link" @click="navTo('/news/detail/' + currentAppliance.id)"
                    :title="currentAppliance.title">{{ currentAppliance.title }}</div>
                </strong>
              </span>
              <div style="text-align: center; margin: 0 auto;">
                <span v-for="index in (newsLists.length > 5 ? 5 : newsLists.length)" :key="index"
                  @mouseover="changeImg(index - 1, 1)"
                  style="margin-left: 6px; margin-bottom: 0px; display: inline-block; width: 10px; height: 10px; background: #d5d2d1; cursor: pointer;"
                  :style="index - 1 === currentNewsIndex ? 'background: #0563b5;' : ''"></span>
              </div>
            </div>

          </div>
          <div class="news-search-area">
            <!-- 搜索区域 -->
            <el-form :inline="true" class="demo-form-inline" style="padding-top: 8px;width: 100%;">
              <el-input class="el-form-input" v-model="search" size="medium" placeholder="填写仪器名称查找"></el-input>
              <el-button icon="el-icon-search" class="retrievalInstrumentBtn" @click="toSearch">检索仪器</el-button>
            </el-form>
          </div>
        </div>
        <!-- 通知公告模块 -->
        <div class="notice-announcement">
          <div slot="header" class="index-box-card-header">
            <span><i class="el-icon-chat-dot-square"></i> 通知公告</span>
            <el-link style="float: right; margin-right: 10px;" @click="navTo('/notes')" type="text">更多 >></el-link>
          </div>
          <div v-for="(item, index) in noticeListLeft" :key="index"
            style="display: flex; margin-top: 10px; margin-left:10px"
            :style="index === 0 ? 'color:#103770;' : 'color: #333333;'">
            <div style="width: 32px;height: 30px; line-height:30px; text-align: center;">
              <span style="margin-left: 6px; margin-bottom: 0px; display: inline-block; width: 8px; height: 8px;"
                :style="index === 0 ? 'background:#103770;' : 'background: #d5d2d1;'"></span>
            </div>
            <div class="specific-news">
              <span class="common-link" @click="navTo('/news/detail/' + item.id)">{{ item.name }}</span>
            </div>
            <div
              style="width: 52px; text-align: right; font-size: 14px; height: 30px; line-height: 30px; font-weight:bold; color:#999; margin-left:20px">
              {{ item.created_at.slice(5,10) }}</div>
          </div>
        </div>
        <!-- 通知公告模块end -->
      </div>

      <!--第二行 仪器预约、智能模块 -->
      <div class="apparatus-info">
        <div class="apparatus-list-info">
          <el-tabs type="border-card" v-model="deviceTab" :stretch="true" class="index-common-table-container"
            style="border: 0;">
            <el-tab-pane name="newAppointment">
              <span @mouseenter="tabEnter(2, 'newAppointment')" @click="toNewTab('indexAppointmentList')" slot="label"
                class="table_name_box" :class="{active:isActive}"><i class="el-icon-bell"></i> 最新仪器预约</span>
              <div class="tab-container ">
                <el-table class="index-common-table" :data="booking.slice(0,6)" border style="width: 100%">
                  <el-table-column prop="user_name" label="预约人" width="120">
                  </el-table-column>
                  <el-table-column label="设备名称" width="160">
                    <template slot-scope="scope">
                      <!-- <span class="common-link" @click="navOpen('/appointment/detail/' + scope.row.apparatus_id)">{{ scope.row.apparatus_name }}</span> -->
                      <span class="common-link"
                        @click="toDetail('/appointment/detail/' + scope.row.apparatus_id)">{{ scope.row.apparatus_name }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="房间" width="160">
                    <template slot-scope="scope">
                      {{scope.row.apparatus_room_name}}
                    </template>
                  </el-table-column>
                  <el-table-column label="预约时间" width="140">
                    <template slot-scope="scope">
                      {{scope.row.created_at}}
                    </template>
                  </el-table-column>
                  <el-table-column prop="apparatus_admin_name" label="管理员">
                  </el-table-column>
                </el-table>
              </div>
            </el-tab-pane>
            <el-tab-pane name="realTime">
              <span @mouseenter="tabEnter(2, 'realTime')" @click="toNewTab('realTime')" slot="label"
                class="table_name_box" :class="{active:isActive2}" style="bacground:#fff"><i
                  class="el-icon-video-camera"></i>
                实时实验</span>
              <div class="tab-container">
                <el-table v-if="real_time_experiment.length > 0" class="index-common-table"
                  :data="real_time_experiment.slice(0,6)" border style="width: 100%">
                  <el-table-column prop="apparatus_no" label="设备编号" width="120">
                  </el-table-column>
                  <el-table-column label="设备名称" width="160">
                    <template slot-scope="scope">
                      <!-- <span class="common-link" @click="navOpen('/appointment/detail/' + scope.row.apparatus_id)">{{scope.row.apparatus_name}}</span> -->
                      <span class="common-link"
                        @click="toDetail('/appointment/detail/' + scope.row.apparatus_id)">{{scope.row.apparatus_name}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column width="150px" prop="platform_name" label="归属">
                  </el-table-column>
                  <el-table-column prop="user_name" label="使用人">
                  </el-table-column>
                  <el-table-column label="实时状况">
                    <template>
                      <el-tag type="success">正在进行</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="apparatus_admin_name" label="管理员">
                  </el-table-column>
                </el-table>
                <empty v-else description="暂无实时实验" />
              </div>
            </el-tab-pane>

            <el-tab-pane name="running">
              <span @mouseenter="tabEnter(2, 'running')" @click="toNewTab('Appointment')" slot="label"
                class="table_name_box" :class="{active:isActive3}"><i class="el-icon-set-up"></i>
                仪器运行状态</span>
              <div class="tab-container">
                <el-table class="index-common-table" :data="runningDevices.slice(0,6)" border style="width: 100%">
                  <el-table-column prop="no" label="设备编号" width="120">
                  </el-table-column>
                  <el-table-column label="设备名称" width="160">
                    <template slot-scope="scope">
                      <!-- <span class="common-link" @click="navOpen('/appointment/detail/' + scope.row.id)">{{ scope.row.name }}</span> -->
                      <span class="common-link"
                        @click="toDetail('/appointment/detail/' + scope.row.id)">{{ scope.row.name }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="model" label="规格型号">
                    <template slot-scope="scope">
                      {{ scope.row.model ? scope.row.model : '-' }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="admin_name" label="管理员">
                  </el-table-column>
                  <el-table-column label="设备状态	">
                    <template slot-scope="scope">
                      <el-tag v-if="scope.row.is_working == 1" type="success">正在运行</el-tag>
                      <el-tag v-else="scope.row.status === 2" type="danger">已停机</el-tag>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>

        <div class="intelligent-management">
          <div slot="header" class="index-box-card-header">
            <span><i class="el-icon-chat-dot-square"></i>&nbsp;智能模块</span>
          </div>
          <div class="shortCut">
            <div class="manage" style="min-height:362px">
              <!-- 1.仪器预约 -->
              <div class="bsdt-item">
                <div class="bsdt-icon" style="background: #fff;"> <!-- #fc7140 -->
                  <span class="common-link" @click="toAppointment()">
                    <img src="/imgs/appointment_blue.png" />
                  </span>
                </div>
                <span class="common-link" @click="toAppointment()">仪器预约</span>
              </div>
              <!-- 5.设备管理 -->
              <div class="bsdt-item">
                <div class="bsdt-icon" style="background: #fff;">
                  <span class="common-link" @click="toApparatus()">
                    <img src="/imgs/EquipmentManagement_blue.png" style="color:#fff" />
                  </span>
                </div>
                <!-- <span class="common-link" @click="toPersonal()">设备管理</span> -->
                <span class="common-link" @click="toApparatus()">设备管理</span>
              </div>
              <!-- 4.危化品管理 -->
              <div class="bsdt-item">
                <div class="bsdt-icon" style="background:#fff ;"> <!-- #ee0a24 -->
                  <span class="common-link" @click="toHcs()">
                    <img src="/imgs/reagent_blue.png" />
                  </span>
                </div>
                <span class="common-link" @click="toHcs()">危化品管理</span>
              </div>
              <!-- 2.仪器培训 -->
              <div class="bsdt-item">
                <div class="bsdt-icon" style="background: #fff;"> <!-- #005c8a -->
                  <span class="common-link" @click="toInstrument_training()">
                    <img src="/imgs/train_blue.png" />
                  </span>
                </div>
                <span class="common-link" @click="toInstrument_trainin()">仪器培训</span>
              </div>
              <!-- 3.入室申请 -->
              <div class="bsdt-item">
                <div class="bsdt-icon" style="background: #fff;"> <!-- #13ce66 -->
                  <span class="common-link" @click="toApply()">
                    <img src="/imgs/apply_blue.png" />
                  </span>
                </div>
                <span class="common-link" @click="toApply()">入室申请</span>
              </div>
              <!-- 11.试剂耗材 -->
              <div class="bsdt-item">
                <div class="bsdt-icon" style="background: #fff;"> <!-- #51c0c6 -->
                  <span class="common-link" @click="toReagent()">
                    <img src="/imgs/ReagentConsumables_blue.png" />
                  </span>
                </div>
                <span class="common-link" @click="toReagent()">试剂耗材</span>
              </div>
              <!-- 12.考试管理 -->
              <div class="bsdt-item">
                <div class="bsdt-icon" style="background: #fff;"> <!-- #fccc2c -->
                  <span class="common-link" @click="toExamination()">
                    <img src="/imgs/Examination_blue.png" />
                  </span>
                </div>
                <span class="common-link" @click="toExamination()">考试管理</span>
              </div>
              <!-- 16.样本预约 -->
              <div class="bsdt-item">
                <div class="bsdt-icon" style="background: #fff;"> <!-- #464928 -->
                  <span class="common-link" @click="toSampleReservation()">
                    <img src="/imgs/SampleReservation_blue.png" />
                  </span>
                </div>
                <span class="common-link" @click="toSampleReservation()">样本预约</span>
              </div>
              <!-- 13.信用分管理 -->
              <div class="bsdt-item">
                <div class="bsdt-icon" style="background: #fff;"> <!-- #a7cfa9 -->
                  <span class="common-link" @click="toCreditScore()">
                    <img src="/imgs/CreditScore_blue.png" />
                  </span>
                </div>
                <span class="common-link" @click="toCreditScore()">信用分管理</span>
              </div>
              <!-- 14.考核管理 -->
              <div class="bsdt-item">
                <div class="bsdt-icon" style="background: #fff;"> <!-- #89c8c0 -->
                  <span class="common-link" @click="toAppraisal_management()">
                    <img src="/imgs/kaoheguanli_blue.png" />
                  </span>
                </div>
                <span class="common-link" @click="toAppraisal_management()">考核管理</span>
              </div>
              <!-- 15.用户管理 -->
              <div class="bsdt-item">
                <div class="bsdt-icon" style="background:#fff;"> <!--  #e3edef -->
                  <span class="common-link" @click="toUser()">
                    <img src="/imgs/yonghuguanli_blue.png" />
                  </span>
                </div>
                <span class="common-link" @click="toUser()">用户管理</span>
              </div>

            </div>


            <!-- <div class="bsdt-item">
                <div class="bsdt-icon" style="background: #1989fa;">
                  <span class="common-link" @click="toPersonal()">
                    <img src="/imgs/info-center.png" />
                  </span>
                </div>
                <span class="common-link" @click="toPersonal()">个人中心</span>
              </div> -->
          </div>
        </div>
      </div>

      <!-- 第三行：仪器设备模块、友情链接 -->
      <div class="instrument-area">
        <!-- 仪器设备模块start -->
        <div class="instrument-equipment">
          <el-card class="common-box-card" style="border: 0;">
            <div slot="header" class="index-box-card-header">
              <span><i class="el-icon-odometer"></i> 仪器设备</span>
              <span style="float: right; margin-right: 10px;" @click="navTo('/appointment')">更多</span>
            </div>
            <div id="marquee" class="card-container apparatus-marquee">
              <div id="marquee1" style="display: flex;">
                <div v-for="(item, index) in apparatus" :key="index">
                  <div class="appliance-img-container">
                    <!-- <span class="common-link" @click="navOpen('/appointment/detail/' + item.id)"> -->
                    <span class="common-link" @click="openApparatusDetail('/appointment/detail/' + item.id)">
                      <img :src="domain + item.picture" />
                    </span>
                  </div>
                  <div class="appliance-title">
                    <span class="common-link"
                      @click="openApparatusDetail('/appointment/detail/' + item.id)">{{ item.name }}</span>
                  </div>
                </div>
              </div>
              <div id="marquee2" style="display: flex;"></div>
            </div>
          </el-card>
        </div>
        <!-- 仪器设备模块end -->

        <!-- 友情链接 -->
        <!-- <div class="friend-link">
          <el-card class="common-box-card" style="border: 0;">
            <div slot="header" class="index-box-card-header">
              <span><i class="el-icon-link"></i> 友情链接</span>
            </div>
            <div class="card-container">
              <div v-for="(item, index) in links" :key="index" style="display: flex; margin-top: 10px; color: #333333;">
                <div style="width: 32px;height: 16px; text-align: center;">
                  <span
                    style="margin-left: 6px; margin-bottom: 0px; display: inline-block; width: 8px; height: 8px; background: #d5d2d1;"></span>
                </div>
                <div
                  style="width: 262px; font-size: 14px; height: 16px; line-height: 20px; font-weight: bold; display: table;">
                  <div class="common-link" :title="item.title" @click="doNavOpen(item.link)">{{ item.title }}</div>
                </div>
              </div>
            </div>
          </el-card>
        </div> -->
      </div>
    </div>
  </div>
  </div>
</template>
<script>
  import {
    getInfo,
    isAuditAPI,
    userScoreList
  } from '@/api/user'
  import {
    settingInfo
  } from '@/api/system'
  import {
    captcha
  } from '@/api/public'
  import {
    newsList
  } from '@/api/news'
  import {
    indexList as platformIndexList
  } from '@/api/platform'
  import {
    relatedLinksList
  } from '@/api/relatedlinks'
  import {
    apparatusRankList,
    bookingIndexList,
    indexList
  } from '@/api/apparatus'
  import {
    mapGetters
  } from 'vuex'
  import {
    validMobile
  } from '@/utils/validate'
  import {
    timeFormat
  } from '@/utils/index'
  import Empty from '@/components/Empty'
  import MarqueeX from '@/components/MarqueeX'

  var speed = 18,
    marquee, marquee1, marquee2, MyMar

  function Marquee() {
    if (marquee2) {
      if (marquee2.offsetWidth - marquee.scrollLeft <= 0)
        marquee.scrollLeft -= marquee1.offsetWidth
      else {
        marquee.scrollLeft++
      }
    }
  }

  export default {
    components: {
      Empty,
      MarqueeX
    },
    data() {
      return {
        isActive: false,
        isActive2: true,
        isActive3: true,
        loginForm: {
          mobile: '',
          password: '',
          captcha: '',
          key: '',
          pub_key: ''
        },
        newsTab: 'news',
        deviceTab: 'newAppointment',
        sortTab: 'monthSort',
        newsLists: [],
        noticeListLeft: [],
        noticeListRight: [],
        booking: [],
        domain: process.env.VUE_APP_DOMAIN,
        trendData: [],
        monthSort: [],
        yearSort: [],
        apparatus: [],
        platforms: [],
        deviceList: [],
        runningDevices: [],
        links: [],
        middleAd: {
          image_url: '',
          link: ''
        },
        queryType: '1',
        search: '',
        currentNewsIndex: 0,
        currentApparatusIndex: 0,
        currentApparatus: {
          name: '',
          picture: ''
        },
        currentAppliance: {
          id: '',
          title: '',
          pic: ''
        },
        currentApplianceTitle: '',
        currentAppliancePicture: '',
        newApplianceList: [],
        real_time_experiment: [],
        codeUrl: '',
        scale: {
          dataKey: 'sales',
          alias: '使用次数',
          tickCount: 6
        },
        baseQueryForm: {
          page: 1,
          sort: 'created_at',
          is_deleted: 0,
          sort_type: 'desc'
        },
        padding: [8, 0, 20, 30],
        weekDay: ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
        today: new Date(),
        currentTime: '',
        timer: null,
        hasStart: false,
      }
    },
    created() {
      this.queryNews({
        size: 6,
        type: '3'
      })
      this.queryNews({
        size: 16,
        type: '2'
      })
      this.queryPlatform()
      this.queryApparatusList()
      this.queryBookingList()
      this.queryRealTimeEquip()
      this.queryCaptcha()
      this.startNewsLamper()
      this.queryApparatusRankList()
      this.queryLinks()
      this.getTime()
      this.timer = setInterval(() => {
        this.getTime()
      }, 1000)
    },
    computed: {
      ...mapGetters([
        'member',
        'pub_key'
      ])
    },
    beforeDestroy() {
      if (this.timer) {
        clearInterval(this.timer)
      }
    },
    methods: {
      openApparatusDetail(url) {
        if (this.checkAudit("仪器设备详情", url)) {
          this.navOpen(url);
        }
      },

      toSubSystem(id) {
        let url = "http://47.92.151.129:9101/#/login?id=" + id;
        console.log('toSubSystem: ' + url)
        window.open(url);
      },
      doNavOpen(link) {
        window.open(link);
      },
      startMarquee() {
        marquee = document.getElementById('marquee')
        marquee1 = document.getElementById('marquee1')
        marquee2 = document.getElementById('marquee2')

        if (MyMar) {
          clearInterval(MyMar);
        }
        setTimeout(_ => {
          marquee2.innerHTML = marquee1.innerHTML
          MyMar = setInterval(Marquee, speed)
          marquee.onmouseover = function() {
            clearInterval(MyMar)
          }
          marquee.onmouseout = function() {
            MyMar = setInterval(Marquee, speed)
          }
        }, 1000)
      },
      queryLinks() {
        relatedLinksList({
          page: 1,
          size: 100
        }).then(res => {
          if (res.status === 200) this.links = res.data.data
        })
        settingInfo({
          type: 'middle_image'
        }).then(res => {
          if (res.status === 200) {
            this.middleAd = JSON.parse(res.data.value)
          }
        })
      },
      queryPlatform() {
        platformIndexList().then(res => {
          if (res.status === 200) {
            this.platforms = res.data.data
          }
        })
      },
      startNewsLamper() {
        var that = this
        setInterval(function() {
          if (that.currentNewsIndex === that.newsLists.length - 1 || that.currentNewsIndex === 4) {
            that.currentNewsIndex = 0
          } else {
            that.currentNewsIndex++
          }
          if (that.currentApparatusIndex === that.apparatus.length - 1) {
            that.currentApparatusIndex = 0
          } else {
            that.currentApparatusIndex++
          }
          that.changeImg(that.currentNewsIndex, 1)
          that.changeImg(that.currentApparatusIndex, 2)
        }, 5000)
      },
      tabEnter(type, name) {
        switch (type) {
          case 1:
            this.newsTab = name;
            break
          case 2:
            this.deviceTab = name;
            if (this.deviceTab == "newAppointment") {
              this.isActive = false;
            } else {
              this.isActive = true;
            }
            if (this.deviceTab == "realTime") {
              this.isActive2 = false;
            } else {
              this.isActive2 = true;
            }
            if (this.deviceTab == "running") {
              this.isActive3 = false;
            } else {
              this.isActive3 = true;
            }
            break
          case 3:
            this.sortTab = name
            break
        }

      },
      queryCaptcha() {
        captcha().then(res => {
          if (res.status === 200) {
            // this.codeUrl = res.data.captcha.img
            this.codeUrl = res.data.img;
            this.loginForm.key = res.data.captcha.key;
          }
        })
      },
      handleLogin() {
        if (!this.loginForm.mobile) {
          this.$message.error('请填写手机号')
          return false
        }
        if (this.loginForm.mobile.length != 11) {
          this.$message.error('请填写正确的手机号')
          return false;
        }
        if (!this.loginForm.password) {
          this.$message.error('请填写密码')
          return false
        }
        if (!this.loginForm.captcha) {
          this.$message.error('请填写验证码')
          return false
        }

        let key = this.loginForm.key;
        if (!key || key.length < 18) {
          this.$message.error('请重新填写验证码');
          this.queryCaptcha()
          return;
        }
        let trueCode = key[2] + '' + key[6] + '' + key[11] + '' + key[17]
        if (trueCode != this.loginForm.captcha) {
          this.$message.error('验证码错误')
          this.queryCaptcha()
          return false;
        }

        this.loginForm.pub_key = this.pub_key

        this.$store.dispatch('user/login', this.loginForm).then((res) => {
          getInfo().then((res) => {
            // window.location.reload()
            if (res.data.member.is_trained == 0) {
              this.$router.push('/security')
            } else {
              window.location.reload()
            }

          })

        }).catch(err => {
          this.queryCaptcha()
        })
      },
      queryRealTimeEquip() {
        bookingIndexList({
          is_working: 1
        }).then(res => {
          if (res.status === 200) {
            res.data.data.forEach(item => {
              this.real_time_experiment.push(item)
            })
          }
        })
      },
      queryBookingList() {
        bookingIndexList({
          is_working: 0
        }).then(res => {
          if (res.status === 200) {
            res.data.data.forEach(item => {
              this.booking.push(item)
            })
          }
        })
      },
      queryApparatusList() {
        if (this.apparatus.length > 1) return;
        indexList().then(res => {
          if (res.status === 200) {
            res.data.data.forEach((item, index) => {
              if (index < 5) {
                this.runningDevices.push(item)
              }
              this.apparatus.push(item)
            })
            if (this.apparatus.length > 0) {
              this.currentApparatus = {
                name: this.apparatus[0].name,
                picture: this.apparatus[0].picture
              }
            }
            if (this.apparatus.length >= 5) this.startMarquee()
          }
        })
      },
      queryApparatusRankList() {
        var currentDate = new Date()
        var month = timeFormat(new Date(currentDate.setDate(currentDate.getDate() - 30)), "yyyy-MM-dd")
        var year = timeFormat(new Date(new Date().setFullYear(new Date().getFullYear() - 1)), "yyyy-MM-dd")
        currentDate = timeFormat(new Date(), "yyyy-MM-dd")
        apparatusRankList({
          page: 1,
          size: 5,
          start_date: month,
          end_date: currentDate
        }).then(res => {
          if (res.status === 200) {
            res.data.forEach((item, index) => {
              this.monthSort.push({
                id: item.apparatus_id,
                name: item.apparatus_name
              })
            })
          }
        })
        apparatusRankList({
          page: 1,
          size: 5,
          start_date: year,
          end_date: currentDate
        }).then(res => {
          if (res.status === 200) {
            res.data.forEach((item, index) => {
              this.yearSort.push({
                id: item.apparatus_id,
                name: item.apparatus_name
              })
            })
          }
        })
      },
      queryNews(params) {
        newsList(Object.assign(params, this.baseQueryForm)).then(res => {
          if (res.status === 200) {
            if (params.type === '2') {
              res.data.data.forEach((item, index) => {
                // item.created_at = item.created_at.replace('' + (new Date()).getFullYear() + '-', '').slice(0, 11)
                if (index < 6) {
                  this.noticeListLeft.push(item)
                } else {
                  this.noticeListRight.push(item)
                }
              })
            } else if (params.type === '3') {
              res.data.data.forEach((item, index) => {
                if (index === 0) {
                  this.currentAppliance = {
                    title: item.name,
                    pic: this.domain + item.image_url,
                    id: item.id
                  }
                }
                // item.created_at = item.created_at.replace('' + (new Date()).getFullYear() + '-', '').slice(0, 11)
                this.newsLists.push(item)
              })
            }
          }
        })
      },
      toSearch() {
        let routeData
        if (this.queryType == 1) {
          // routeData = this.$router.resolve({
          //   name: 'appointment',
          //   query: {
          //     search: this.search

          //   }
          // })
          routeData = this.$router.push({
            path: 'appointment',
            query: {
              search: this.search
            }
          })
        } else if (this.queryType == 2) {
          // routeData = this.$router.resolve({
          //   name: 'newsSearch',
          //   query: {
          //     search: this.search
          //   }
          // })

          routeData = this.$router.resolve({
            path: 'newsSearch',
            query: {
              search: this.search
            }
          })
        }
        this.$router.push(routeData.href)
      },

      toNewTab(name) {
        let routeData = this.$router.resolve({
          name
        })
        this.$router.push(routeData.href)
      },
      toRegister() {
        this.$router.push({
          path: '/register'
        })
      },
      async logout() {
        await this.$store.dispatch('user/logout')
        this.$router.push('/')
      },
      changeImg(index, type) {
        if (type === 1) {
          this.currentNewsIndex = index
          this.currentAppliance = {
            id: this.newsLists[index].id,
            title: this.newsLists[index].name,
            pic: this.domain + this.newsLists[index].image_url
          }
        } else {
          this.currentApparatusIndex = index
          this.currentApparatus = {
            name: this.apparatus[index].name,
            picture: this.apparatus[index].picture
          }
        }
      },
      getTime() {
        var date = new Date()
        var hours = date.getHours()
        var minutes = date.getMinutes()
        var seconds = date.getSeconds()
        this.currentTime = (hours >= 10 ? '' : '0') + hours + ":" + (minutes >= 10 ? '' : '0') + minutes + ":" + (
          seconds >=
          10 ? '' : '0') + seconds
      },
      toApply() {
        if (this.checkAudit('入驻实验室', '/apply-platform')) {
          this.navTo('/apply-platform')
        }
      },
      toAppointment() {
        if (this.checkAudit('仪器预约', '/appointment')) {
          this.navTo('/appointment')
        }
      },
      toDetail(url) {
        if (this.checkAudit('查看详细信息', url)) {
          this.navTo(url)
        }
      },
      toApparatus() {
        if (this.checkAudit('设备管理', '/apparatus/list')) {
          this.navTo('/apparatus/list')
        }
      },
      toHcs() {
        if (this.checkAudit('危化品申领', '/personal/hcs-apply/list')) {
          this.navTo('/personal/hcs-apply/list')
        }
      },
      toInstrument_training() {
        console.log(111112)
        if (this.checkAudit('仪器培训', '/instrument-training')) {
          this.navTo('/instrument-training')
        }
      },
      toApply() {
        if (this.checkAudit('入驻实验室', '/apply-platform')) {
          this.navTo('/apply-platform')
        }
      },
      toReagent() {
        if (this.checkAudit('试剂耗材', '/reagent/list')) {
          this.navTo('/reagent/list')
        }
      },
      toExamination() {
        if (this.checkAudit('考试管理', '/train-doc/list')) {
          this.navTo('/train-doc/list')
        }
      },
      toSampleReservation() {
        if (this.checkAudit('样本预约', '/info-center/my-booking')) {
          this.navTo('/info-center/my-booking')
        }
      },
      toCreditScore() {
        if (this.checkAudit('信用分管理', '/score/list')) {
          this.navTo('/score/list')
        }
      },
      toAppraisal_management() {
        if (this.checkAudit('考核管理', '/examine/platform-list')) {
          this.navTo('/examine/platform-list')
        }
      },
      toUser() {
        if (this.checkAudit('用户管理', '/system/role/list')) {
          this.navTo('/system/role/list')
        }
      },
      async toPersonal() {
        if (this.checkAudit('进入个人中心')) {
          const result = await isAuditAPI(this.$store.getters.member.id)
          localStorage.setItem('isAudit', result.data.isAudit)
          this.navTo('/info-center/my-booking')
        }
      },

    }
  }
</script>
<style lang="scss">
  .index-common-table-container {
    .is-top {
      padding: 0 !important;

      span {
        padding: 0 20px;
        display: inline-block;
        height: 100%;
        width: 100%;
      }
    }

    #tab-newAppointment {
      background-color: #fff;
    }

    #tab-realTime {
      background-color: #fff;
    }

    #tab-running {
      background-color: #fff;
    }

    // .table_name_box{
    //   background-color:#9a7378;
    //   border:none !important;
    // }
    .table_name_box:hover {
      background-color: #fff !important;
    }

    .active {
      // background-color:#9a7378 !important;
      background-color: #89abd2 !important;
      border: none !important;
    }

    .table_name_box {
      border: none !important;
      // border-bottom-color: #9a7378;
      border-bottom-color: #103770;
    }

    .el-tabs__item is-top {
      background: #fff !important;
      border: none;
    }

  }


  .news-container {
    .el-link--inner {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .el-link {
      max-width: 100%;
      text-align: left;
    }
  }

  .index-news-list {
    .el-link {
      max-width: 65%;
    }
  }

  .sort-container {
    img {
      float: right;
      width: 18px;
      margin-top: 3px;
    }
  }

  .bsdt-item {
    margin-top: 10px;
    display: inline-block;
    width: 138px;
    // height: 128px;
    height: 100px;
    text-align: center;
    transition: transform .5s ease-in-out;
    padding-bottom: 10px;

    img {
      width: 48px;
      height: 48px;
    }
  }

  .bsdt-item:hover {
    transform: translate(0px, -5px);
    transition: transform .5s ease-in-out;
    box-shadow: 0 10px 20px 1px rgba(49, 49, 49, 0.2);
    border-radius: 10px;
    // border: 1px solid #FFFFFF;
  }
</style>
<style lang="scss" scoped>
  .index-container {
    position: relative;
    font-size: 14px;
    width: 100%;

    .news-all {
      width: 100%;
      display: flex;
      justify-content: space-between;

      .news-rotation-area {
        width: 64%;
        height: 362px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

        .news-show-area {
          height: 297px;
          flex-shrink: 0;
          position: relative;
          border-radius: 3px;
          overflow: hidden;
        }

        .news-search-area {
          height: 60px;
          width: 100%;
          margin-top: 5px;
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

          .el-form-area {
            width: 71%;

          }

          .el-form-input {
            width: 71%;
            margin-left: 20px;
            font-size: 17px;
            font-weight: 700;
          }
        }
      }

      .notice-announcement {
        margin-left: 16px;
        flex-shrink: 0;
        width: 34%;
        height: 362px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }
    }

    .apparatus-info {
      display: flex;
      justify-content: space-around;
      min-height: 362px;
      margin-top: 18px;

      .apparatus-list-info {
        width: 64%;
        min-height: 382px;
      }

      .intelligent-management {
        width: 34%;
        min-height: 362px;
        margin-left: 20px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      }
    }

    .instrument-area {
      display: flex;
      justify-content: space-around;
      margin-top: 20px;
      min-height: 249px;

      .instrument-equipment {
        width: 100%;
        flex-shrink: 0;
        margin-left: 0;
      }

      .friend-link {
        width: 34%;
        flex-shrink: 0;
        margin-left: 20px;
      }
    }

    .specific-news {
      width: 64%;
      height: 30px;
      font-size: 14px;
      line-height: 30px;
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
    }

    .specific-news:hover {
      color: #103770;
    }

    .shortCut {
      height: 362px;
      overflow-y: scroll;
      overflow-x: hidden;

      .manage {
        // overflow-y:scroll;
        // overflow-x:hidden;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

      }

      // .control{
      //   overflow-y:scroll;
      //   overflow-x:hidden;
      //   box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
      // }
    }

    ::-webkit-scrollbar {
      width: 5px;
      height: 5px;
      background-color: transparent;
    }

    ::-webkit-scrollbar-track {
      background: #fff;
      border-radius: 5px;
    }

    ::-webkit-scrollbar-thumb {
      background: rgb(226, 225, 225);
      border-radius: 10px;
      height: 20px;
    }

    .index-box-card-header {
      // background-color: #9a7378;
      // border-bottom: 1px solid #9a7378;
      background-color: #89abd2;
      border-bottom: 1px solid #89abd2;
    }

    .bsdt-item {
      width: 24%;
      justify-content: space-around;

      .bsdt-icon {
        .common-link {
          img {
            align-items: auto;
            justify-content: center;
            margin-top: 6px;
          }
        }
      }
    }

    .col-block {
      margin-top: 15px;
    }

    .tab-container {
      min-height: 362px;
    }

    .card-container {
      height: 220px;
      overflow: hidden;
    }

    .search-container {
      width: 100%;
      padding: 10px;
      border-bottom: 1px solid #efefef;
    }

    .platform-container {
      width: 100%;
      padding: 10px;
    }

    .apparatus-marquee {
      overflow: hidden;
      min-height: 200px !important;
      // width: 672px;
      width: 100%;
      display: flex;
    }

    .appliance-img-container {
      padding: 8px;
      border: 1px solid #efefef;
      border-radius: 5px;
      width: 150px;
      margin-right: 10px;

      img {
        width: 100%;
        height: 150px;
      }
    }

    .welcome-container {
      padding: 20px 0;

      p:first-child {
        color: #454545;
        font-weight: bold;
        font-size: 16px;
      }

      p:last-child {
        text-align: left;
        text-indent: 2em;
        font-size: 14px;
      }
    }

    .admin-container {
      span {
        margin-right: 10px;
      }
    }

    .common-ul {
      margin: 0;
      list-style: none;
      padding: 0;

      li {
        padding-bottom: 3px;
        margin-bottom: 3px;
        border-bottom: 1px dashed #efefef;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .appliance-title {
      text-align: center;
      font-size: 12px;
      margin-top: 8px;
    }

    .news-time {
      float: right;
      color: #666666;
      height: 100%;
      line-height: 150%;
      font-size: 10px;
    }

    .service-container {
      a img {
        width: 374px;
        height: 76px;
        margin-top: 15px;
        flex-shrink: 0;
      }
    }
  }

  .active-news {
    color: #409eff;
    font-weight: bolder;
  }

  .edl-empty {
    margin: 0;
    padding-top: 50px;
  }

  .bsdt-icon {
    width: 60px;
    height: 60px;
    // line-height: 8.3;
    border-radius: 10px;
    text-align: center;
    margin: 10px auto;
    cursor: pointer;
    border-radius: 2 px;
    box-shadow: 0 10px 20px 1px rgba(49, 49, 49, 0.2);
    border: 1px solid #FFFFFF;
  }

  .primary-working {
    padding: 5px;
    color: #efefef;
    background: #006699;
  }

  .is-working {
    padding: 5px;
    color: #efefef;
    background: #397919;
  }

  .un-working {
    padding: 5px;
    color: #efefef;
    background: #888888;
  }

  .error-working {
    padding: 5px;
    color: #efefef;
    background: #e23031;
  }

  .function-area {
    border-radius: 10px;
    border: 1px solid #ddd;
    transition: transform .5s ease-in-out;

    .tip {
      margin-top: 10px;
      font-size: 15px;
    }
  }

  .function-area:hover {
    transform: translate(0, -5px);
    transition: transform .5s ease-in-out;
    box-shadow: 0 10px 20px 1px rgba(49, 49, 49, 0.2);
    border: 1px solid #FFFFFF;
  }

  .retrievalInstrumentBtn {
    background-color: #103770;
    color: #fff;
    border-width: 0;
    margin-left: auto;
  }

  .retrievalInstrumentBtn:hover {
    background-color: #89abd2;
  }
</style>
