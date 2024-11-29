const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  agencyId: state => state.user.agencyId,
  name: state => state.user.name,
  mobile: state => state.user.mobile,
  introduction: state => state.user.introduction,
  sRoleId: state => state.user.sRoleId,
  roles: state => state.user.roles,
  email: state => state.user.email,
  userId: state => state.user.userId,
  loginCode: state => state.user.loginCode,
  myHeader: state => state.user.myHeader, // 上传文件所需要的请求头
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,
  fileUpload: state => state.api.fileUpload,
  routes: state => state.permission.routes
}
export default getters
