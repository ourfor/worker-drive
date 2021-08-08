import { Cors } from "@config/Cors"
import { DriveAllData, DriveDataType, log, DriveDataInfo } from "@src/enum"
import { render, Table } from '@page/Html'
import { TokenData } from "@type/TokenData"
import { cookies } from "@util/cookie"
import { i18n, I18N_KEY } from "@lang/i18n"

export async function read(path: string, req: Request, root: boolean = false): Promise<Response> {
    const url = `https://graph.microsoft.com/v1.0/me/drive/root${root?`/children`:`:${path}`}`
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
                        if('ourfor'==cookies(req,'id')) result = read(path+':/children',req)
                        else throw new Error(i18n(I18N_KEY.PERMISSION_DENY))
                    } catch(error) {
                        result = new Response(error)
                    }
                    break;
                }
                case DriveDataType.ITEMS: {
                    const { value: items } = data;
                    const href = path.replace(':/children','')                    
                    const props = { data: items, href: href==="/"?"":href }
                    result = new Response(render(Table(props)),{
                        headers: {
                            'content-type': 'text/html'
                        }
                    })
                    break;
                }
                case DriveDataType.ERROR: {
                    if(path.endsWith('/')) {
                        if('ourfor'===cookies(req,'id')) {
                            if (path==="/") result = read('/',req,true)
                            else result = read(path+':/children',req)
                        } else result = read(path+'/index.html',req)
                    }
                    else result = new Response(JSON.stringify({
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