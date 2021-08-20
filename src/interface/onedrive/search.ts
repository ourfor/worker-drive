import { Cors } from "@config/Cors"
import { i18n, I18N_KEY } from "@lang/i18n"
import { ContentType, HttpStatus, DriveItemsData, DriveFileData } from "@src/enum"
import { UnauthorizedException } from "@src/exception/Exception"
import { API_PREFIX } from "../OneDriveAdapter"
import { auth } from "./auth"

export async function search(path: string, name: string, request: Request, contentType?: ContentType): Promise<Response> {
    const authorization = await auth()
    if (!authorization) {
        throw new UnauthorizedException(i18n(I18N_KEY.NEED_LOGIN_TO_CONTINUE))
    }
    const reqUrl = new URL(request.url)
    const origin = reqUrl.origin
    const nextToken = reqUrl.searchParams.get("next")
    const url = `${API_PREFIX}/me/drive/root/search(q='${name}')${nextToken ? `?$skiptoken=${nextToken}` : ""}`
    const response = await fetch(url, { headers: { authorization }})
    const items = await response.json() as DriveItemsData
    const { value, "@odata.nextLink": nextLink } = items
    const files = (value as DriveFileData[]).map(({name, webUrl, size, createdDateTime, lastModifiedDateTime, file: { mimeType }}) => {
        const str = new URL(webUrl).pathname.replace("/personal/","")
        const pathname = str.substring(str.indexOf("/"))
        return {
            name,
            size,
            createAt: createdDateTime,
            updateAt: lastModifiedDateTime,
            path: origin + pathname,
            type: mimeType
        }
    })
    const next = new URL(nextLink).searchParams.get("$skiptoken") ?? ""
    if (next) {
        reqUrl.searchParams.set("next", next)
    }
    const data = {
        data: files,
        next: next ? reqUrl.href : null
    }
    return new Response(JSON.stringify(data), {
        headers: {
            ...Cors.corsHeaders
        }
    })
}