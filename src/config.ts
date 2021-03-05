import { ConfigData } from "./type"

export class Config {
  static readonly grantType: string = 'authorization_code'
  static corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,HEAD,OPTIONS,PATCH,PROPFIND,PROPPATCH,MKCOL,COPY,MOVE,LOCK',
    'Access-Control-Max-Age': '86400',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Expose-Headers': '*',
    'Access-Control-Allow-Credentials': 'true'
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

  static withOrigin(origin: string|null): Headers {
    const header = new Headers()
    header.append('Access-Control-Allow-Origin',origin?origin:"*")
    header.append('Access-Control-Allow-Methods','GET,PUT,POST,DELETE,HEAD,OPTIONS,PATCH')
    header.append('Access-Control-Allow-Headers','Origin,Accept,Content-Type,Authorization,Range')
    header.append('Access-Control-Expose-Headers','*')
    header.append('Access-Control-Allow-Credentials','true')
    header.append('Access-Control-Max-Age','86400')
    return header
  }
}
