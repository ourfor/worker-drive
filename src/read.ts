import { Config } from "./config"
import { DriveAllData, DriveDataType, log, DriveDataInfo } from "./enum"
import { TokenData } from "./type"
import { render, Table } from './html'

export async function read(path: string, req: Request): Promise<Response> {
    const url = `https://graph.microsoft.com/v1.0/me/drive/root:${path}`
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
                        const check: {[key: string]: string|number} = {}
                        const cookie = req.headers.get('cookie')!
                        cookie.split('; ').forEach(item => {
                            const [key,value] = item.split('=')
                            check[key] = value
                        })
                        if('ourfor'==check['id']) result = read(path+':/children',req)
                        else throw new Error('Permission deny')
                    } catch(error) {
                        result = new Response(error)
                    }
                    break;
                }
                case DriveDataType.ITEMS: {
                    const { value: items } = data;
                    const href = path.replace(':/children','')                    
                    const props = { data: items, href }
                    result = new Response(render(Table(props)),{
                        headers: {
                            'content-type': 'text/html'
                        }
                    })
                    break;
                }
                case DriveDataType.ERROR: {
                    if(path.endsWith('/')) result = read(path+'/index.html',req)
                    else result = new Response(data.error.message)
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