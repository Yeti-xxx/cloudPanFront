// 正则
// 验证用户名
export const regPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/  //密码8-16包含字母和数字
export const regUserName = /^[a-zA-Z0-9_-]{4,8}$/    //用户名4至8位 字母或数字即可

// 获取文件类型 展示对应图标
export const fileLogo = (type) => {
    const imageRegex = /^(jpg|jpeg|png|gif|bmp)$/
    const mp4Regex = /^mp4$/
    const textRegex = /^(doc|docx|pdf|ppt|pptx|txt)$/
    const zipRegex = /^(zip|rar|tar|gz|7z)$/

    return imageRegex.test(type) ? 'img.png' : mp4Regex.test(type) ? 'mp4.png' : textRegex.test(type) ? 'text.png' : zipRegex.test(type) ? 'zip.png' : 'no'
}