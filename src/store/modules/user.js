import {
  login,
  logout,
  getInfo
} from '@/api/user'
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth'
import {
  removeByValue
} from '@/utils/index'
import {
  resetRouter
} from '@/router'
import { randomKey } from "@/api/public"
import { enc, aesDecrypt, aesEncrypt, rsaEncrypt, aesRandomKey } from "@/utils/encrypt"
import sha256 from 'js-sha256'
import { encrypt } from '../../utils/RenJiUtils'

const state = {
  token: getToken(),
  member: {},
  nodes: [],
  auth: [],
  pub_key: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_MEMBER: (state, member) => {
    state.member = member
  },
  SET_NODES: (state, nodes) => {
    state.nodes = nodes
  },
  SET_PERSONAL_NODES: (state, nodes) => {
    state.auth = nodes
  },
  SET_PUB_KEY: (state, pub_key) => {
    state.pub_key = pub_key
  }
}

const actions = {
  // user login
  login({
    commit
  }, userInfo) {
    const {
      mobile,
      password,
      captcha,
      key,
      pub_key
    } = userInfo;
    // console.log('do login')
    // console.log(encrypt(password))
    // console.log('ok')
    return new Promise((resolve, reject) => {
      let randomKey = aesRandomKey() //生成 AES 加密的随机密钥

      login({
        mobile: encrypt(mobile.trim()),
        password: encrypt(password.trim()),
        captcha: captcha,
        key: key,
        random: rsaEncrypt(randomKey, pub_key)
      }).then(response => {
        if (response.status !== 10006) {
          if (response.status !== 200) reject(response.msg)
          const {
            data
          } = response
          commit('SET_TOKEN', data.token)
          setToken(data.token)
          resolve()
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const {
          status,
          msg,
          data
        } = response

        if (status != '200') {
          reject(msg)
        }
        if (!data) {
          reject('Verification failed, please Login again.')
        }

        commit('SET_MEMBER', data.member)
        if (data.member.role_id > 0) data.nodes.push('admin_info')
        if (data.member.status === 1) {

          commit('SET_NODES', data.nodes)
          commit('SET_PERSONAL_NODES', data.auth.split(','))
          // Vue.prototype.currentFactoryId = data.member.factory_id;
          // console.log('set member id = ' + Vue.prototype.currentFactoryId)
        } else {
          data.nodes = []
          data.auth = ''
        }
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_NODES', [])
        commit('SET_PERSONAL_NODES', [])
        commit('SET_MEMBER', {})
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({
    commit
  }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
