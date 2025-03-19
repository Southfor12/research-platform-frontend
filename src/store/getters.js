const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  member: state => state.user.member,
  pub_key: state => state.user.pub_key,
  nodes: state => state.user.nodes,
  auth: state => state.user.auth,
  permission_routes: state => state.permission.routers,
  personal_permission_routes: state => state.personal_permission.routers
}
export default getters
