import { Cors } from "@config/Cors"
import { i18n, I18N_KEY } from "@lang/i18n"
import { render } from "@page/render"
import { FileList } from "@page/FileList"
import { TOKEN } from "@src/const"
import { DriveAllData, DriveDataInfo, DriveDataType, DriveFileData, HttpMethod, HttpStatus, ResponseContentType } from "@src/enum"
import { TokenData } from "@type/TokenData"
import { cookies } from "@util/cookie"
import { DriveAdapter } from "@src/interface/DriveAdapter"
import { WebDAV } from "@type/XML"

type WriteResponse = { uploadUrl: string }

const API_PREFIX = "https://graph.microsoft.com/v1.0"


export class OneDriveAdapter implements DriveAdapter {
    async auth(): Promise<string | null> {
        const json = await STORE.get('auth')
        if (json) {
            const token: TokenData = JSON.parse(json)
            return `${token.token_type} ${token.access_token}`
        }
        return null
    }
    /**
     * 
     * @param path 
     * @param request 
     * 
     * @see https://docs.microsoft.com/en-us/graph/api/driveitem-post-children?view=graph-rest-1.0&tabs=http
     */
    async mkdir(path: string, request: Request, contentType?: ResponseContentType): Promise<Response> {
        return new Response()
    }

    /**
     * 
     * @param path 
     * @param request 
     * 
     * @see https://docs.microsoft.com/en-us/graph/api/driveitem-copy?view=graph-rest-1.0&tabs=http
     */
    async delete(path: string, request: Request, contentType?: ResponseContentType): Promise<Response> {
        return new Response()
    }

    /**
     * 
     * @param path 
     * @param name 
     * @param request 
     * @returns 
     * 
     * @see https://docs.microsoft.com/en-us/graph/api/driveitem-search?view=graph-rest-1.0&tabs=http
     */
    async search(path: string, name: string, request: Request, contentType?: ResponseContentType): Promise<Response> {
        const authorization = await this.auth()
        if (!authorization) {
            throw new Error(HttpStatus.Unauthorized.toLocaleString())
        }
        const url = `${API_PREFIX}/me/drive/root/search(q='${name}')`
        return new Response()
    }

    /**
     * 
     * @param source 
     * @param destination 
     * @param request 
     * 
     * @see https://docs.microsoft.com/en-us/graph/api/driveitem-move?view=graph-rest-1.0&tabs=http
     */
    async move(source: string, destination: string, request: Request, contentType?: ResponseContentType): Promise<Response> {
        return new Response()
    }

    /**
     * 
     * @param source 
     * @param destination 
     * @param request 
     * 
     * @see https://docs.microsoft.com/en-us/graph/api/driveitem-copy?view=graph-rest-1.0&tabs=http
     */
    async copy(source: string, destination: string, request: Request, contentType?: ResponseContentType): Promise<Response> {
        return new Response()
    }

    /**
     * 
     * @param path 
     * @param req 
     * @param isRoot 
     * @returns 
     * 
     * @see https://docs.microsoft.com/en-us/graph/api/driveitem-get-content?view=graph-rest-1.0&tabs=http
     */
    async read(path: string, req: Request, contentType?: ResponseContentType, isRoot?: boolean): Promise<Response> {
        const url = `${API_PREFIX}/me/drive/root${isRoot ? `/children` : `:${path}`}`
        const authorization = await this.auth()
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
                                result = this.read(`${path}:/children`, req, contentType)
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
                            case ResponseContentType.JSON: {
                                body = JSON.stringify(props)
                                break;
                            }
                            case ResponseContentType.HTML: {
                                body = render(FileList(props))
                                break;
                            }
                            case ResponseContentType.XML: {
                                const status = "HTTP/1.1 200 OK"
                                const data: WebDAV.XML = {
                                    multistatus: {
                                        response: props.data.map((item) => WebDAV.createXMLResponse({
                                            href: `${path}/${item.name}`,
                                            length: item.size,
                                            status,
                                            createAt: (item as DriveFileData).createdDateTime!.toString(),
                                            updateAt: (item as DriveFileData).createdDateTime!.toString(),
                                            type: (item as DriveFileData).type,
                                            name: item.name,
                                            etag: item.name
                                        }))
                                    }
                                }
                                body = WebDAV.js2xml(data)
                                break;
                            }
                        }
                        result = new Response(body, {
                            headers: {
                                'content-type': contentType ?? ResponseContentType.HTML
                            }
                        })
                        break;
                    }
                    case DriveDataType.ERROR: {
                        if(path.endsWith('/')) {
                            if(TOKEN.VALUE === cookies(req, TOKEN.KEY)) {
                                if (path === "/") {
                                    result = this.read('/', req, contentType, true)
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
    
    /**
     * 
     * @param path 
     * @param req 
     * @returns 
     * 
     * @see https://docs.microsoft.com/en-us/graph/api/driveitem-put-content?view=graph-rest-1.0&tabs=http
     */
    async write(path: string, req: Request, contentType?: ResponseContentType): Promise<Response> {
        const url = new URL(`${API_PREFIX}/me/drive/root:${path}:/createUploadSession`);
        try {
            if(TOKEN.VALUE == cookies(req, TOKEN.KEY)) {
                const authorization = await this.auth()
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
}

const onedrive = new OneDriveAdapter()

export {
    onedrive
}