import { ConfigData } from "./type"

export class Config {
  static readonly grantType: string = 'authorization_code'
  static corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
    'Access-Control-Max-Age': '86400',
    'Access-Control-Allow-Headers': 'range'
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
}
