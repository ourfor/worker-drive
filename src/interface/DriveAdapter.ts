import { ResponseContentType } from "@src/enum";

export interface DriveAdapter {
    read(path: string, request: Request, contentType?: ResponseContentType, isRoot?: boolean): Promise<Response>,
    write(path: string, request: Request, contentType?: ResponseContentType): Promise<Response>,
    mkdir(path: string, request: Request, contentType?: ResponseContentType): Promise<Response>,
    delete(path: string, request: Request, contentType?: ResponseContentType): Promise<Response>,
    search(path: string, name: string, request: Request, contentType?: ResponseContentType): Promise<Response>,
    move(source: string, destination: string, request: Request, contentType?: ResponseContentType): Promise<Response>,
    copy(source: string, destination: string, request: Request, contentType?: ResponseContentType): Promise<Response>
}