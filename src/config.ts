import { ConfigData } from "./type"

export class Config {
  static readonly grantType: string = 'authorization_code'
  static corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
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
    header.set('Access-Control-Allow-Origin',origin?origin:"*")
    header.set('Access-Control-Allow-Methods','GET,PUT,POST,DELETE,HEAD,OPTIONS,PATCH')
    header.set('Access-Control-Allow-Headers','Origin,Accept,Content-Type,Authorization,Range')
    header.set('Access-Control-Expose-Headers','*')
    header.set('Access-Control-Allow-Credentials','true')
    header.set('Access-Control-Max-Age','86400')
    header.set("Vary", "Origin")
    return header
  }
}
