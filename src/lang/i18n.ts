export function i18n(key: I18N_KEY, lang: string = "zh-cn"): string {
    const result = CONST_STRING[I18N_KEY[key]]
    if (result) return result;
    else return ''
}
export enum I18N_KEY {
    LOGIN_SUCCESS,
    AUTHORIZE_SUCCESS
}

export default interface I18N_MAP {
    [key: string]: string
}

const CONST_STRING: I18N_MAP = {
    LOGIN_SUCCESS: "登录成功",
    AUTHORIZE_SUCCESS: "认证成功"
}