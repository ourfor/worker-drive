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
    NEED_LOGIN_TO_UPLOAD,
    LOGIN_USERNAME,
    LOGIN_PASSWORD,
    LOGIN_SUBMIT,
    LOGIN_TITLE,
    PLAYER_TITLE,
    PLAYER_SOURCE,
    PLAYER_POSTER,
    PLAYER_THUMBNAILS,
    PLAYER_CAPTION,
    PLAYER_NAME,
    PLAYER_START,
    UNKNOWN
}

export default interface I18N_MAP {
    [key: string]: string
}

const CONST_STRING: I18N_MAP = {
    PLAYER_TITLE: "📺 看什么看",
    PLAYER_START: "🔥 点火",
    PLAYER_SOURCE: "片源",
    PLAYER_POSTER: "封面图",
    PLAYER_THUMBNAILS: "预览图",
    PLAYER_CAPTION: "字幕",
    PLAYER_NAME: "看的什么",
    LOGIN_TITLE: "🌸 秘密花园",
    LOGIN_USERNAME: "👤 用户名",
    LOGIN_PASSWORD: "🙈 密码",
    LOGIN_SUBMIT: "登录",
    LOGIN_SUCCESS: "🎉 登录成功",
    AUTHORIZE_SUCCESS: "👏 认证成功",
    NEED_LOGIN_TO_CONTINUE: "需要登录账户才能继续使用",
    PERMISSION_DENY: "缺少相关权限",
    NEED_INIT: "需要初始化",
    NOT_FOUND: "没有找到",
    NEED_LOGIN_TO_UPLOAD: "需要登录才能上传文件",
    UNKNOWN: "🧱 未知错误"
}