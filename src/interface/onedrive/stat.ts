import { Cors } from "@config/Cors"
import { i18n, I18N_KEY } from "@lang/i18n"
import { DriveAllData, DriveDataInfo, DriveDataType, HttpStatus, ContentType, DriveFileData, DriveFolderData, HttpMethod } from "@src/enum"
import { WebDAV } from "@type/XML"
import { API_PREFIX } from "../OneDriveService"
import { auth } from "./auth"

export async function stat(path: string, req: Request, contentType?: ContentType, isRoot?: boolean): Promise<Response> {
  const xml = await req.text()
  const { propfind } = WebDAV.xml2js<WebDAV.XMLPropFind>(xml)
  isRoot = isRoot ?? path === "/"
  const isQuota = propfind.prop?.quota ||
    propfind.prop?.quotaused ||
    propfind.prop?.["quota-available-bytes"] ||
    propfind.prop?.["quota-used-bytes"]
  path = path.length !== 1 && path.endsWith("/") ? path.substring(0, path.length - 1) : path
  const url = `${API_PREFIX}/me/drive${isQuota ? '' : isRoot ? '/root' : `/root:${path}`}`
  const authorization = await auth()
  let result
  if (authorization) {
    try {
      const request = new Request(url, { method: HttpMethod.GET })
      const headers = request.headers
      headers.set("Authorization", authorization)
      const res = await fetch(request)
      const data: DriveAllData = await res.json()
      DriveDataInfo.info(data)
      if (contentType == ContentType.XML) {
        if (data.type === DriveDataType.ERROR || data.type === DriveDataType.ITEMS) {
          throw new Error(i18n(I18N_KEY.UNKNOWN))
        }
        let content
        if (isQuota) {
          const quota = (data as DriveFolderData).quota
          const quotaKey = propfind.prop!
          const quotaValue: WebDAV.QuotaData = {}
          quotaKey.quota ? quotaValue.quota = quota?.total : null
          quotaKey.quotaused ? quotaValue.quotaused = quota?.used : null
          quotaKey["quota-available-bytes"] ? quotaValue["quota-available-bytes"] = quota?.remaining : null
          quotaKey["quota-used-bytes"] ? quotaValue["quota-used-bytes"] = quota?.used : null

          content = WebDAV.createXMLResponse({
            name: data.name,
            href: req.url,
            createAt: data.createdDateTime!,
            updateAt: data.lastModifiedDateTime!,
            status: WebDAV.Status.OK,
            quota: quotaValue
          })
        } else {
          content = WebDAV.createXMLResponse({
            name: data.name,
            href: req.url,
            createAt: data.createdDateTime!,
            updateAt: data.lastModifiedDateTime!,
            length: data.size,
            status: WebDAV.Status.OK,
          })
        }
        const xmlData: WebDAV.XML = {
          _declaration: WebDAV.declaration,
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
    } catch (error: unknown) {
      console.error(error)
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