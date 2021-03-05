import { Action } from "./action"
import { HttpMethod } from "./enum"

export class Route {
  static authReg = /\/__(auth|call|conf|keep)__$/
  static match(url: URL): boolean {
    return Route.authReg.test(url.pathname)
  }
  static isAuth(url: URL): boolean {
    return '/__auth__' == url.pathname
  }
  static isCall(url: URL): boolean {
    return '/__call__' == url.pathname
  }
  static isConf(url: URL): boolean {
    return '/__conf__' == url.pathname
  }
  static isKeep(url: URL): boolean {
    return '/__keep__' == url.pathname
  }
  static async dispatch(req: Request, action: Action): Promise<Response> {
    const { method } = req
    const url = new URL(req.url)
    let result;
    if(method == HttpMethod.GET || method == HttpMethod.HEAD) {
      result = action.get(url,req)
    } else if (method == HttpMethod.POST) {
      result = action.post(url,req)
    } else if (method == HttpMethod.OPTIONS) {
      result = action.options(url,req)
    } else {
      result = new Response()
    }
    return result
  }
}