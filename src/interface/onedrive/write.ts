import { i18n, I18N_KEY } from "@lang/i18n";
import { TOKEN } from "@src/const";
import { HttpMethod, HttpStatus, ContentType } from "@src/enum";
import { cookies } from "@util/cookie";
import { API_PREFIX } from "../OneDriveAdapter";
import { auth } from "./auth";

type WriteResponse = { uploadUrl: string }
export async function write(path: string, req: Request, contentType?: ContentType): Promise<Response> {
    const url = new URL(`${API_PREFIX}/me/drive/root:${path}:/createUploadSession`);
    try {
        if(TOKEN.VALUE == cookies(req, TOKEN.KEY)) {
            const authorization = await auth()
            if (authorization) {
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
                    status: HttpStatus.Unauthorized
                })
            }
        }
        else throw new Error(i18n(I18N_KEY.PERMISSION_DENY))
    } catch(error) {
        return new Response(error)
    }
}