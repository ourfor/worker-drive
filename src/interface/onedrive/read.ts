import { Cors } from "@config/Cors"
import { i18n, I18N_KEY } from "@lang/i18n"
import { render } from "@page/render"
import { TOKEN } from "@src/const"
import { DriveAllData, DriveDataInfo, DriveDataType, HttpStatus, ContentType } from "@src/enum"
import { WebDAV } from "@type/XML"
import { cookies } from "@util/cookie"
import { API_PREFIX } from "../OneDriveAdapter"
import { FileTable } from "@page/FileTable"
import { auth } from "./auth"

export async function read(path: string, req: Request, contentType?: ContentType, isRoot?: boolean): Promise<Response> {
    path = path.length !== 1 && path.endsWith("/") ? path.substring(0, path.length - 1) : path
    const url = `${API_PREFIX}/me/drive/root${isRoot ? `/children` : `:${path}`}`
    const authorization = await auth()
    let result
    if (authorization) {
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
                            result = read(`${path}:/children`, req, contentType)
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
                    let body;
                    switch (contentType) {
                        case ContentType.JSON: {
                            body = JSON.stringify(props)
                            break;
                        }
                        case ContentType.HTML: {
                            body = render(FileTable(props))
                            break;
                        }
                        case ContentType.XML: {
                            const status = "HTTP/1.1 200 OK"
                            const origin = new URL(req.url).origin
                            const base = origin + path.replace(":/children", "/")
                            const items = props.data
                            const data: WebDAV.XML = {
                                _declaration: WebDAV.declaration,
                                multistatus: {
                                    _attributes: WebDAV.attributes,
                                    response: items.map((item) => WebDAV.createXMLResponse({
                                        href: `${base}${item.name}`,
                                        length: item.size,
                                        status,
                                        createAt: item.createdDateTime ?? "",
                                        updateAt: item.createdDateTime ?? "",
                                        type: item.hasOwnProperty('file') ? DriveDataType.FILE: DriveDataType.FOLDER,
                                        name: item.name,
                                        etag: item.type == DriveDataType.FILE ? item.eTag : null
                                    }))
                                }
                            }
                            body = WebDAV.js2xml(data)
                            break;
                        }
                    }
                    result = new Response(body, {
                        status: contentType == ContentType.XML ? HttpStatus.Multi_Status : HttpStatus.Ok,
                        headers: {
                            'content-type': contentType ?? ContentType.HTML
                        }
                    })
                    break;
                }
                case DriveDataType.ERROR: {
                    if(path.endsWith('/')) {
                        if(TOKEN.VALUE === cookies(req, TOKEN.KEY)) {
                            if (path === "/") {
                                result = read('/', req, contentType, true)
                            } else {
                                result = read(path+':/children', req)
                            }
                        } else {
                            result = read(path+'/index.html', req)
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