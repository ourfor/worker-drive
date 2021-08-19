import { ResponseContentType } from "@src/enum"
import { DriveAdapter } from "@src/interface/DriveAdapter"
import { read } from "./onedrive/read"
import { search } from "./onedrive/search"
import { write } from "./onedrive/write"

export const API_PREFIX = "https://graph.microsoft.com/v1.0"

export class OneDriveAdapter implements DriveAdapter {
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
    search = search

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
    read = read
    
    /**
     * 
     * @param path 
     * @param req 
     * @returns 
     * 
     * @see https://docs.microsoft.com/en-us/graph/api/driveitem-put-content?view=graph-rest-1.0&tabs=http
     */
    write = write
}

const onedrive = new OneDriveAdapter()

export {
    onedrive
}