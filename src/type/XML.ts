import convert from 'xml-js'

export namespace WebDAV {
    export type LockType = {
        write: {} | null
    }

    export type LockScope = {
        exclusive?: {} | null,
        shared?: {} | null
    }

    export type LockEntry = {
        lockscope: LockScope
        locktype: LockType
    }

    export type SupportedLock = {
        lockentry: LockEntry[]
    }

    export type ResourceType = {
        collection: {} | null
    }

    export type Prop = {
        getlastmodified: string | Date | null,
        lockdiscovery: {} | null,
        supportedlock: SupportedLock | null,
        creationdate: string | Date | null,
        resourcetype: ResourceType | null,
        displayname: string | null,
        getetag: string,
        getcontentlength?: number | null,
        getcontenttype?: string | null
    }

    export type PropStat = {
        status: string,
        prop: Prop
    }


    export type Response = {
        href: string,
        propstat: PropStat
    }

    export type MultiStatus = {
        _attributes?: {
            "xmlns:D": "DAV:"
        },
        response: Response[]
    }

    export type XML = {
        _declaration?: {
            _attributes: {
                version: "1.0",
                encoding: "utf-8"
            }
        },
        multistatus: MultiStatus
    }

    export type ResponseData = {
        href: string,
        status: string,
        updateAt: string,
        createAt: string,
        name: string,
        etag: string,
        length: number | null,
        type: string | null
    }
    export function createXMLResponse({
        href,
        status,
        updateAt,
        createAt,
        name,
        etag,
        length,
        type
    }: ResponseData): Response {
        return {
            href,
            propstat: {
                status,
                prop: {
                    getlastmodified: updateAt,
                    creationdate: createAt,
                    displayname: name,
                    getetag: etag,
                    lockdiscovery: null,
                    getcontentlength: length,
                    getcontenttype: type,
                    resourcetype: null,
                    supportedlock: {
                        lockentry: [
                            {
                                lockscope: {
                                    exclusive: null
                                },
                                locktype: {
                                    write: null
                                }
                            }, {
                                lockscope: {
                                    shared: null
                                },
                                locktype: {
                                    write: null
                                }
                            }
                        ]
                    }
                }
            }
        }
    }


    export function js2xml(data: XML): string {
        const options = {
            compact: true,
            spaces: 4,
            elementNameFn: (name: string) => "D:" + name
        }
        return convert.js2xml(data, options)
    }
}