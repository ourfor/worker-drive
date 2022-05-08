import { ContentType } from "@src/enum"
import { DriveService } from "@service/DriveService"
import { stat } from "./onedrive/stat"
import { write } from "./onedrive/write"
import { search } from "./onedrive/search"
import { read } from "./onedrive/read"

export const API_PREFIX = "https://graph.microsoft.com/v1.0"

export class OneDriveService implements DriveService {
    /**
     * get file info
     * @param path 
     * @param request 
     * @param contentType 
     * @param isRoot 
     */
    stat = stat


    /**
     * create directory
     * @param path 
     * @param request 
     * 
     * @see https://docs.microsoft.com/en-us/graph/api/driveitem-post-children?view=graph-rest-1.0&tabs=http
     */
    async mkdir(path: string, request: Request, contentType?: ContentType): Promise<Response> {
        return new Response()
    }

    /**
     * delete file
     * @param path 
     * @param request 
     * 
     * @see https://docs.microsoft.com/en-us/graph/api/driveitem-copy?view=graph-rest-1.0&tabs=http
     */
    async delete(path: string, request: Request, contentType?: ContentType): Promise<Response> {
        return new Response()
    }

    /**
     * search file with name
     * @param path 
     * @param name 
     * @param request 
     * @returns 
     * 
     * @see https://docs.microsoft.com/en-us/graph/api/driveitem-search?view=graph-rest-1.0&tabs=http
     */
    search = search

    /**
     * move file or directory to another place
     * @param source 
     * @param destination 
     * @param request 
     * 
     * @see https://docs.microsoft.com/en-us/graph/api/driveitem-move?view=graph-rest-1.0&tabs=http
     */
    async move(source: string, destination: string, request: Request, contentType?: ContentType): Promise<Response> {
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
    async copy(source: string, destination: string, request: Request, contentType?: ContentType): Promise<Response> {
        return new Response()
    }


    /**
     * read file content
     * @param path 
     * @param req 
     * @param isRoot 
     * @returns 
     * 
     * @see https://docs.microsoft.com/en-us/graph/api/driveitem-get-content?view=graph-rest-1.0&tabs=http
     */
    read = read

    /**
     * write content to file
     * @param path 
     * @param req 
     * @returns 
     * 
     * @see https://docs.microsoft.com/en-us/graph/api/driveitem-put-content?view=graph-rest-1.0&tabs=http
     */
    write = write
}

const onedrive = new OneDriveService()

export {
    onedrive
}