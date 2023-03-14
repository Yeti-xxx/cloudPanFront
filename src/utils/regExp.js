// 正则
// 验证用户名
export const regPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/  //密码8-16包含字母和数字
export const regUserName = /^[a-zA-Z0-9_-]{4,8}$/    //用户名4至8位 字母或数字即可