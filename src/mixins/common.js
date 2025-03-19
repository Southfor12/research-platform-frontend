import store from '../store'
import {
  getToken
} from '@/utils/auth'

export default {
  data() {
    return {
      authHeader: {
        'Authorization': getToken()
      }
    }
  },
  methods: {
    log(content) {
      console.log(content)
    },
    checkAudit(title, redirect) {
      localStorage.setItem('login-redirect', redirect);

      let member = store.state.user.member;

      if (!member || !member.id || member.id < 1) {
        //用户未登录，提示登录

        this.$confirm('提示', title + '需要先登录，是否立即登录？', {
          confirmButtonText: '去登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then((res) => {
          if (res == 'confirm') {
            this.$router.push('/login')
          }
        }).catch(() => {});
        return false;
      }

      if (!member.is_trained) {
        //用户未通过平台考核，提示用户参加平台考核
        this.$confirm(title + '需要先通过平台考核，是否马上学习参加考核？', '提示', {
          confirmButtonText: '开始考核',
          cancelButtonText: '取消',
          type: 'warning'
        }).then((res) => {
          if (res == 'confirm') {
            this.$router.push('/security')
          }
        }).catch(() => {});
        return false;
      }

      if (member.status == 0) {
        //用户审核中
        this.$alert('您的账号正在审核中，请等待管理员审核通过再进行下一步操作', '提醒', {
          confirmButtonText: '确定',
          callback: action => {
            // this.$message({
            //   type: 'info',
            //   message: `action: ${ action }`
            // });
          }
        });
        return false;
      }

      if (member.status == -1) {
        //审核未通过
        this.$alert('抱歉您的账号未通过审核，请联系管理员查看具体原因', '提醒', {
          confirmButtonText: '确定',
          callback: action => {
            // this.$message({
            //   type: 'info',
            //   message: `action: ${ action }`
            // });
          }
        });
        return false;
      }

      return true;
    },
    getNewsTypes(type) {
      switch (type) {
        case 1:
          return {
            title: '规章制度',
              code: 'regulations'
          }
          case 2:
            return {
              title: '通知公告',
                code: 'notes'
            }
            case 3:
              return {
                title: '新闻动态',
                  code: 'news'
              }
              case 4:
                return {
                  title: '经验交流',
                    code: 'communication'
                }
                case 5:
                  return {
                    title: '文档下载',
                      code: 'doc-download'
                  }
                  case 6:
                    return {
                      title: '科学研究',
                        code: 'science'
                    }
                    case 7:
                      return {
                        title: '教育教学',
                          code: 'education'
                      }
                      case 8:
                        return {
                          title: '生物资源中心',
                            code: 'organisms'
                        }
                        case 9:
                          return {
                            title: '实验动物研究中心',
                              code: 'animal'
                          }
                          case 10:
                            return {
                              title: '中心实验室',
                                code: 'sharing'
                            }
                            case 11:
                              return {
                                title: 'GMP细胞技术中心',
                                  code: 'gmp'
                              }
                              case 12:
                                return {
                                  title: '仪器共享和技术服务中心',
                                    code: 'publab'
                                }
                                case 13:
                                  return {
                                    title: '危化品管理',
                                      code: 'hcsmng'
                                  }
                                  case 14:
                                    return {
                                      title: '安全教育',
                                        code: 'securityedu'
                                    }
                                    case 15:
                                      return {
                                        title: '入室制度',
                                          code: 'inrules'
                                      }
                                      case 16:
                                        return {
                                          title: '入室流程',
                                            code: 'inprocess'
                                        }
                                        case 17:
                                          return {
                                            title: '仪器培训',
                                              code: 'apparatustrain'
                                          }
                                          case 18:
                                            return {
                                              title: '技术培训',
                                                code: '技术培训'
                                            }
                                            case 19:
                                              return {
                                                title: '收费标准',
                                                  code: 'rechargeinfo'
                                              }
      }
    },
    getDate(datetime) {
      if (datetime == undefined) {
        return '-'
      }
      // console.log('get date ' + datetime)
      return datetime.substr(0, 11)
    }
  }
}
