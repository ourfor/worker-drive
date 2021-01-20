import { Config } from "./config"
import { HttpMethod, HttpStatus } from "./enum"

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
  static dispatch(req: Request, action: Action) {
    const { method } = req
    const url = new URL(req.url)
    let result;
    if(method == HttpMethod.GET) {
      result = action.get(url,req)
    } else if (method == HttpMethod.POST) {
      result = action.post(url,req)
    } else if (method==HttpMethod.OPTIONS||method==HttpMethod.HEAD||method==HttpMethod.CONNECT) {
      result = new Response("",{ status: HttpStatus.OK, headers: Config.corsHeaders })
    } else {
      result = new Response("METHOD NOT SUPPORT", { status: HttpStatus.NOT_FOUND })
    }
    return result
  }
}

export interface Action {
  get(url: URL, req: Request): Promise<Response>|Response
  post(url: URL, req: Request): Promise<Response>|Response
}