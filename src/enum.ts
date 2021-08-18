export enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    OPTIONS = 'OPTIONS',
    PATCH = 'PATCH',
    HEAD = 'HEAD',
    DELETE = 'DELETE',
    TRACE = 'TRACE',
    CONNECT = 'CONNECT',

    // WEBDAV
    PROPFIND = 'PROPFIND',
    PROPPATCH = 'PROPPATCH',
    MKCOL = 'MKCOL',
    COPY = 'COPY',
    MOVE = 'MOVE',
    LOCK = 'LOCK',
    UNLOCK = 'UNLOCK'
}


export enum HttpStatus {
    Not_Found = 404,
    Redirect = 302,
    Unauthorized = 401,
    Ok = 200,
    Multi_Status = 207,
    Unprocessable_Entity = 422,
    Locked = 423,
    Failed_Dependency = 424,
    Insufficient_Storage = 507,
    Precondition_Failed = 412,
    Request_URI_Too_Long = 414
}

export enum ResponseContentType {
    HTML = "text/html;charset=utf-8",
    JSON = "application/json;charset=utf-8",
    XML = "application/xml;charset=utf-8"
}

export enum DriveAuthType {
    TOKEN = 'token',
    CODE = 'code',
}

export const enum DriveDataType {
    FILE = "FILE",
    FOLDER = "FOLDER",
    ITEMS = "ITEMS",
    ERROR = "ERROR"
}

export interface DriveFileData {
    type: DriveDataType.FILE
    name: string,
    eTag: string,
    cTag: string,
    size: number
    createdDateTime?: string,
    lastModifiedDateTime?: string,
    '@microsoft.graph.downloadUrl': string
    file: {
        mimeType: string
    }
}

export interface DriveFolderData {
    type: DriveDataType.FOLDER
    name: string
    size: number
    createdDateTime: string
    folder: {
        childCounter: number
    }
}

export interface DriveErrorData {
    type: DriveDataType.ERROR
    error: {
        code: string
        message: string
    }
}

export interface DriveItemsData {
    type: DriveDataType.ITEMS
    value: (DriveFileData|DriveFolderData)[]
}

export class DriveDataInfo {
    static info(data: DriveAllData): DriveDataType {
        let type;
        if(data.hasOwnProperty('name')) {
            if(data.hasOwnProperty('file')) type = DriveDataType.FILE
            else type = DriveDataType.FOLDER 
        } else if (data.hasOwnProperty('value')) {
            type = DriveDataType.ITEMS
        } else {
            type = DriveDataType.ERROR
        }
        data.type = type
        return type
    }
}

export type DriveAllData = 
    | DriveFileData
    | DriveFolderData
    | DriveErrorData
    | DriveItemsData;

export const log = console