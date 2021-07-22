export function i18n(key: I18N_KEY, lang: string = "zh-cn"): string {
    const result = CONST_STRING[I18N_KEY[key]]
    if (result) return result;
    else return ''
}
export enum I18N_KEY {
    LOGIN_SUCCESS,
    AUTHORIZE_SUCCESS,
    NEED_LOGIN_TO_CONTINUE,
    PERMISSION_DENY,
    NEED_INIT,
    NOT_FOUND,
    NEED_LOGIN_TO_UPLOAD
}

export default interface I18N_MAP {
    [key: string]: string
}

const CONST_STRING: I18N_MAP = {
    LOGIN_SUCCESS: "登录成功",
    AUTHORIZE_SUCCESS: "认证成功",
    NEED_LOGIN_TO_CONTINUE: "需要登录账户才能继续使用",
    PERMISSION_DENY: "缺少相关权限",
    NEED_INIT: "需要初始化",
    NOT_FOUND: "没有找到",
    NEED_LOGIN_TO_UPLOAD: "需要登录才能上传文件"
}