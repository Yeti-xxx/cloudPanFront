import { parseInt } from "lodash";

// 时间戳转日期
export function timer(timeStr) {
    const date = new Date(parseInt(timeStr));

    // 获取具体的年月日时分秒
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');

    // 格式化输出
    const formattedDate = `${year}/${month}/${day} ${hour}:${minute}`;
    return formattedDate
}