import { ConfigData } from "@model/ConfigData"

export class Cors {
  static readonly grantType: string = 'authorization_code'
  static corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,HEAD,OPTIONS,PATCH,PROPPATCH,PROPFIND,COPY,MOVE', //,LOCK,UNLOCK
    'Access-Control-Max-Age': '86400',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Expose-Headers': '*',
    'Access-Control-Allow-Credentials': 'true',
    'Allow': 'PROPPATCH,PROPFIND,OPTIONS,COPY,MOVE,DELETE', // ,LOCK,UNLOCK
    'Accept-Ranges': 'bytes',
    'MS-Author-Via': 'DAV',
    'DAV': '1,2',
    "Vary": "Origin"
  }

  static async get(): Promise<ConfigData> {
    const json = await STORE.get('config')
    let result
    if (json) {
      try {
        result = JSON.parse(json)
      } catch (error) {
        await STORE.put('msg', error)
      }
    }
    return result
  }

  static set(config: ConfigData): Promise<any> {
    return STORE.put('config', JSON.stringify(config))
  }

  static withOrigin(origin: string|null, headers: Headers = new Headers()): Headers {
    headers.set('Access-Control-Allow-Origin', origin ? origin : "*")
    headers.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,HEAD,OPTIONS,PATCH,PROPPATCH,PROPFIND,COPY,MOVE') // ,LOCK,UNLOCK
    headers.set('Access-Control-Allow-Headers', 'Origin,Accept,Content-Type,Authorization,Range,Accept-Ranges')
    // DAV, Content-Length, Allow
    headers.set('Access-Control-Expose-Headers', '*')
    headers.set('Access-Control-Allow-Credentials', 'true')
    headers.set('Allow', 'PROPPATCH,PROPFIND,OPTIONS,DELETE,COPY,MOVE') //,LOCK,UNLOCK
    headers.set('Access-Control-Max-Age', '86400')
    headers.set('Accept-Ranges', 'bytes')
    headers.set('MS-Author-Via', 'DAV')
    headers.set('DAV', '1,2')
    headers.set("Vary", "Origin")
    return headers
  }
}
