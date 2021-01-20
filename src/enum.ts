export enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    OPTIONS = 'OPTIONS',
    PATCH = 'PATCH',
    HEAD = 'HEAD',
    DELETE = 'DELETE',
    TRACE = 'TRACE',
    CONNECT = 'CONNECT'
}

export enum HttpStatus {
    NOT_FOUND = 404,
    REDIRECT = 302,
    OK = 200
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
    size: number
    createdDateTime?: string
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