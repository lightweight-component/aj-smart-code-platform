const PROJECT_PREFIX: RegExp = /{project_prefix}/i;
const IAM_PREFIX: RegExp = /{iam_prefix}/i;

export function getRealUrl(url: string): string {
    if (PROJECT_PREFIX.test(url))
        return url.replace(PROJECT_PREFIX, window.config.dsApiRoot);
    else if (IAM_PREFIX.test(url))
        return url.replace(IAM_PREFIX, window.config.iamApi);
    else
        if ((url.indexOf(window.config.dsApiRoot) != -1) || url.indexOf(window.config.iamApi) != -1)
            return url;
        else
            return window.config.dsApiRoot + url;
}

/**
 * 格式化日期时间
 * 
 * @param {string} format 日期格式化模板
 * @returns {string} 格式化后的日期字符串
 * @this {Date} 调用此方法的Date对象
 * @example
 * // 返回类似 "2023-12-25 14:30:00"
 * new Date().format("yyyy-MM-dd hh:mm:ss");
 * // 返回类似 "23-12-25"
 * new Date().format("yy-MM-dd");
 * // 返回类似 "2023年12月25日"
 * new Date().format("yyyy年MM月dd日");
 * 
 * 格式化模板说明：
 * - yyyy: 四位年份
 * - yy: 两位年份
 * - MM: 两位月份（01-12）
 * - M: 一位月份（1-12）
 * - dd: 两位日期（01-31）
 * - d: 一位日期（1-31）
 * - hh: 两位小时（00-23）
 * - h: 一位小时（0-23）
 * - mm: 两位分钟（00-59）
 * - m: 一位分钟（0-59）
 * - ss: 两位秒钟（00-59）
 * - s: 一位秒钟（0-59）
 * - q: 季度（1-4）
 * - S: 毫秒（000-999）
 */
export function formatDate(this: Date, format: string = 'yyyy-MM-dd hh:mm'): string {
    let $1, o = {
        "M+": this.getMonth() + 1,		// 月份，从0开始算
        "d+": this.getDate(),   		// 日期
        "h+": this.getHours(),   		// 小时
        "m+": this.getMinutes(), 		// 分钟
        "s+": this.getSeconds(), 		// 秒钟
        // 季度 quarter
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()	// 千秒
    };
    let key: string, value: string;

    if (/(y+)/.test(format)) {
        $1 = RegExp.$1,
            format = format.replace($1, String(this.getFullYear()).substr(4 - $1));
    }

    for (key in o) { // 如果没有指定该参数，则子字符串将延续到 stringvar 的最后。
        if (new RegExp("(" + key + ")").test(format)) {
            $1 = RegExp.$1,
                // @ts-ignore
                value = String(o[key]),
                value = $1.length == 1 ? value : ("00" + value).substr(value.length),
                format = format.replace($1, value);
        }
    }

    return format;
}

/**
 * 日期格式化
 * 
 * @param {date} 
 * @param {string} format 日期格式化模板
 * @returns {string} 格式化后的日期字符串
 */
export function dateFormat(date: string, format: string = 'yyyy-MM-dd hh:mm'): string {
    return formatDate.call(new Date(date), format);
}

export function now(format: string = 'yyyy-MM-dd hh:mm'): string {
    return formatDate.call(new Date(), format);
}