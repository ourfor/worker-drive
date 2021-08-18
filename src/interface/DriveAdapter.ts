interface DriveAdapter {
    read(path: string, request: Request, isRoot?: boolean): Promise<Response>,
    write(path: string, request: Request): Promise<Response>,
    mkdir(path: string, request: Request): Promise<Response>,
    delete(path: string, request: Request): Promise<Response>,
    search(path: string, name: string, request: Request): Promise<Response>,
    move(source: string, destination: string, request: Request): Promise<Response>,
    copy(source: string, destination: string, request: Request): Promise<Response>
}