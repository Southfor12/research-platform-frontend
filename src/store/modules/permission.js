import { asyncRoutes, constantRoutes } from '@/router'

function hasPermission(nodes, route) {
  if (route.meta && route.meta.node) {
    return nodes.some(node => route.meta.node === node)
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, nodes) {
  const res = []
  
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(nodes, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, nodes)
        tmp.children.some(child => {
          // 重新指定父级跳转的地址，指向第一个子菜单
          if (!child.hidden) {
            tmp.redirect = child.path
            return true
          }
        })
      }
      res.push(tmp)
    } else {
      tmp.redirect = '/401'
      tmp.hidden = true
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, nodes)
      }
      res.push(tmp)
    }
  })

  return res
}

const permission = {
  namespaced: true,
  state: {
    routers: constantRoutes,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRoutes.concat(routers)
    }
  },
  actions: {
    generateRoutes({ commit }, nodes) {
      return new Promise(resolve => {
        const accessedRouters = filterAsyncRoutes(asyncRoutes, nodes)
        commit('SET_ROUTERS', accessedRouters)
        resolve(accessedRouters)
      })
    }
  }
}

export default permission
