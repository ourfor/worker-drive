import { Cors } from "@config/Cors"
import { i18n, I18N_KEY } from "@lang/i18n"
import { render } from "@page/render"
import { FileList } from "@page/FileList"
import { TOKEN } from "@src/const"
import { DriveAllData, DriveDataInfo, DriveDataType, HttpMethod, HttpStatus, ResponseContentType } from "@src/enum"
import { TokenData } from "@type/TokenData"
import { cookies } from "@util/cookie"

type WriteResponse = { uploadUrl: string }

class OneDriveAdapter implements DriveAdapter {
    async read(path: string, req: Request, isRoot?: boolean): Promise<Response> {
        const url = `https://graph.microsoft.com/v1.0/me/drive/root${isRoot ? `/children` : `:${path}`}`
        const json = await STORE.get('auth')
        let result
        if (json) {
            const token: TokenData = JSON.parse(json)
            const authorization = `${token.token_type} ${token.access_token}`
            try {
                const request = new Request(url, req)
                const headers = request.headers
                headers.set("Authorization", authorization)
                const res = await fetch(request)
                const data: DriveAllData = await res.json()
                DriveDataInfo.info(data)
                switch(data.type) {
                    case DriveDataType.FILE: {
                        const {
                            '@microsoft.graph.downloadUrl': href
                        } = data
                        const origin = await fetch(href, { headers })
                        result = new Response(origin.body, origin);
                        Cors.withOrigin(req.headers.get("origin"), result.headers)
                        const params = new URL(req.url).searchParams
                        const disposition = params.get("disposition")
                        if (disposition) {
                            if (disposition !== "attachment") {
                                result.headers.set("Content-Disposition", disposition)
                            }
                        } else {
                            result.headers.delete("Content-Disposition")
                        }
                        break;
                    }
                    case DriveDataType.FOLDER: {
                        try {
                            if(TOKEN.VALUE == cookies(req, TOKEN.KEY)) {
                                result = this.read(`${path}:/children`, req)
                            } else {
                                throw new Error(i18n(I18N_KEY.PERMISSION_DENY))
                            }
                        } catch(error) {
                            result = new Response(error)
                        }
                        break;
                    }
                    case DriveDataType.ITEMS: {
                        const { value: items } = data;
                        const href = path.replace(':/children','')                    
                        const props = { data: items, href: href === "/" ? "" : href }
                        result = new Response(render(FileList(props)),{
                            headers: {
                                'content-type': ResponseContentType.HTML
                            }
                        })
                        break;
                    }
                    case DriveDataType.ERROR: {
                        if(path.endsWith('/')) {
                            if(TOKEN.VALUE === cookies(req, TOKEN.KEY)) {
                                if (path === "/") {
                                    result = this.read('/', req, true)
                                } else {
                                    result = this.read(path+':/children', req)
                                }
                            } else {
                                result = this.read(path+'/index.html', req)
                            }
                        } else result = new Response(JSON.stringify({
                            details: data.error,
                            path
                        }))
                        break;
                    }
                }
            } catch (error) {
                result = new Response(error)
            }
        } else {
            result = new Response(i18n(I18N_KEY.NEED_LOGIN_TO_CONTINUE))
        }
        return result
    }
    
    async write(path: string, req: Request): Promise<Response> {
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
}