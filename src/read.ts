import { Config } from "./config"
import { DriveAllData, DriveDataType, log, DriveDataInfo } from "./enum"
import { TokenData } from "./type"
import { render, Table } from './html'
import { cookies } from "./cookie"

export async function read(path: string, req: Request, root: boolean = false): Promise<Response> {
    const url = `https://graph.microsoft.com/v1.0/me/drive/root${root?`/children`:`:${path}`}`
    const json = await STORE.get('auth')
    let result
    if (json) {
        const token: TokenData = JSON.parse(json)
        const authorization = `${token.token_type} ${token.access_token}`
        try {
            const res = await fetch(url, { headers: { authorization } })
            const data: DriveAllData = await res.json()
            DriveDataInfo.info(data)
            log.info(data)
            switch(data.type) {
                case DriveDataType.FILE: {
                    const {
                        '@microsoft.graph.downloadUrl': href,
                        file: { mimeType: type },
                    } = data
                    const origin = await fetch(href, { headers: { authorization } })
                    result = new Response(origin.body, {
                        headers: {
                            ...res.headers,
                            ...Config.corsHeaders,
                            'Content-Type': type,
                        },
                    });
                    break;
                }
                case DriveDataType.FOLDER: {
                    try {
                        if('ourfor'==cookies(req,'id')) result = read(path+':/children',req)
                        else throw new Error('Permission deny')
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
        result = new Response('please login to enable this function')
    }
    return result
}