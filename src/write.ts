import { HttpMethod, HttpStatus } from "./enum";
import { TokenData } from "./type";

type UploadResponse = { uploadUrl: string }
export async function upload(path: string, req: Request): Promise<Response> {
    const name = path.substring(path.lastIndexOf('/'))
    const url = new URL(`https://graph.microsoft.com/v1.0/me/drive/root:${path}:/createUploadSession`);
    const json = await STORE.get('auth')
    let result
    if (json) {
        const token: TokenData = JSON.parse(json)
        const authorization = `${token.token_type} ${token.access_token}`
        const res = await fetch(url.href,{
            method: HttpMethod.POST,
            headers: { authorization }
        })
        const data: UploadResponse = await res.json();
        const { body, headers } = req
        return fetch(data.uploadUrl,{
            body,
            method: HttpMethod.PUT,
            headers: { 
                authorization,
                "Content-Length": headers.get("Content-Length")!,
                "Content-Range": headers.get("Content-Range")!
            }
        })
    } else {
        return new Response('没有登陆，无法上传文件',{
            status: HttpStatus.UNAUTHORIZED
        })
    }
}