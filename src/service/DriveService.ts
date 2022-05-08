import { ContentType } from "@src/enum";

export interface DriveService {
    stat(path: string, request: Request, contentType?: ContentType, isRoot?: boolean): Promise<Response>,
    read(path: string, request: Request, contentType?: ContentType, isRoot?: boolean): Promise<Response>,
    write(path: string, request: Request, contentType?: ContentType): Promise<Response>,
    mkdir(path: string, request: Request, contentType?: ContentType): Promise<Response>,
    delete(path: string, request: Request, contentType?: ContentType): Promise<Response>,
    search(path: string, name: string, request: Request, contentType?: ContentType): Promise<Response>,
    move(source: string, destination: string, request: Request, contentType?: ContentType): Promise<Response>,
    copy(source: string, destination: string, request: Request, contentType?: ContentType): Promise<Response>
}