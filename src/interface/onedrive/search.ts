import { Cors } from "@config/Cors"
import { i18n, I18N_KEY } from "@lang/i18n"
import { ContentType, HttpStatus, DriveItemsData, DriveFileData } from "@src/enum"
import { UnauthorizedException } from "@src/exception/Exception"
import { API_PREFIX } from "../OneDriveService"
import { auth } from "./auth"
import { DriveDataInfo, DriveDataType } from "@src/enum"

export async function search(path: string, name: string, request: Request, contentType?: ContentType): Promise<Response> {
    const authorization = await auth()
    if (!authorization) {
        throw new UnauthorizedException(i18n(I18N_KEY.NEED_LOGIN_TO_CONTINUE))
    }
    const reqUrl = new URL(request.url)
    const origin = reqUrl.origin
    const nextToken = reqUrl.searchParams.get("next")
    const url = `${API_PREFIX}/me/drive/root/search(q='${name}')${nextToken ? `?$skiptoken=${nextToken}` : ""}`
    const response = await fetch(url, { headers: { authorization } })
    const items = await response.json() as DriveItemsData
    const proxy = reqUrl.searchParams.get("proxy")
    if (proxy == "false") {
        return new Response(JSON.stringify(items), {
            headers: {
                ...Cors.corsHeaders
            }
        })
    }
    const { value, "@odata.nextLink": nextLink } = items
    const files = value.map(item => {
        const { name, webUrl, size, createdDateTime, lastModifiedDateTime } = item;
        DriveDataInfo.info(item)
        let type = null
        switch (item.type) {
            case DriveDataType.FILE:
                type = item.file.mimeType
                break
            case DriveDataType.FOLDER:
                type = "folder"
                break
            default:
                break
        }
        const str = new URL(webUrl).pathname.replace("/personal/", "")
        const pathname = str.substring(str.indexOf("/")).replace("Documents/", "")
        return {
            name,
            size,
            createAt: createdDateTime,
            updateAt: lastModifiedDateTime,
            path: origin + pathname,
            type
        }
    })
    if (nextLink) {
        const next = new URL(nextLink).searchParams.get("$skiptoken") ?? ""
        reqUrl.searchParams.set("next", next)
    }
    const data = {
        data: files,
        next: nextLink ? reqUrl.href : null
    }
    return new Response(JSON.stringify(data), {
        headers: {
            ...Cors.corsHeaders
        }
    })
}