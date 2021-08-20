import { Cors } from "@config/Cors"
import { i18n, I18N_KEY } from "@lang/i18n"
import { DriveAllData, DriveDataInfo, DriveDataType, HttpStatus, ContentType } from "@src/enum"
import { WebDAV } from "@type/XML"
import { API_PREFIX } from "../OneDriveAdapter"
import { auth } from "./auth"

export async function stat(path: string, req: Request, contentType?: ContentType, isRoot?: boolean): Promise<Response> {
    path = path.endsWith("/") ? path.substring(0, path.length - 1) : path
    const url = `${API_PREFIX}/me/drive/root${path}}`
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
            if (contentType == ContentType.XML) {
                if (data.type === DriveDataType.ERROR || data.type === DriveDataType.ITEMS) {
                    throw new Error(i18n(I18N_KEY.UNKNOWN))
                }
                const xml = await req.text()
                const props = WebDAV.xml2js<WebDAV.PropFind>(xml)
                const content = WebDAV.createXMLResponse({
                  href: req.url,
                  createAt: data.createdDateTime!,
                  updateAt: data.lastModifiedDateTime!,
                  length: data.size,
                  status: "HTTP/1.1 200 OK",
                })
                const xmlData: WebDAV.XML = {
                  multistatus: {
                    _attributes: WebDAV.attributes,
                    response: [
                      content
                    ]
                  }
                }
                const wrap = WebDAV.js2xml(xmlData)
                result = new Response(wrap, {
                  status: HttpStatus.Multi_Status,
                  headers: {
                    ...Cors.corsHeaders,
                    "Content-Type": ContentType.XML
                  }
                })
            } else {
                result = new Response(JSON.stringify(data))
            }
        } catch(error: unknown) {
            result = new Response(JSON.stringify(error), {
                status: HttpStatus.Not_Found
            })
        }
    } else {
        result = new Response(i18n(I18N_KEY.NEED_LOGIN_TO_CONTINUE), {
            status: HttpStatus.Unauthorized
        })
    }

    return result
}