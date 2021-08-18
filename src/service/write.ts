import { TokenData } from "@type/TokenData";
import { HttpMethod, HttpStatus } from "@src/enum";
import { i18n, I18N_KEY } from "@lang/i18n";
import { cookies } from "@util/cookie";
import { TOKEN } from "@src/const";

type WriteResponse = { uploadUrl: string }
export async function write(path: string, req: Request): Promise<Response> {
    const url = new URL(`https://graph.microsoft.com/v1.0/me/drive/root:${path}:/createUploadSession`);
    try {
        if(TOKEN.VALUE == cookies(req, TOKEN.KEY)) {
            const json = await STORE.get('auth')
            if (json) {
                const token: TokenData = JSON.parse(json)
                const authorization = `${token.token_type} ${token.access_token}`
                const res = await fetch(url.href, {
                    method: HttpMethod.POST,
                    headers: { authorization }
                })
                const data: WriteResponse = await res.json();
                const { body, headers } = req
                return fetch(data.uploadUrl, {
                    body,
                    method: HttpMethod.PUT,
                    headers: { 
                        authorization,
                        "Content-Length": headers.get("Content-Length")!,
                        "Content-Range": headers.get("Content-Range")!
                    }
                })
            } else {
                return new Response(i18n(I18N_KEY.NEED_LOGIN_TO_UPLOAD),{
                    status: HttpStatus.UNAUTHORIZED
                })
            }
        }
        else throw new Error(i18n(I18N_KEY.PERMISSION_DENY))
    } catch(error) {
        return new Response(error)
    }
}