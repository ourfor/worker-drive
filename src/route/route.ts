import { auth } from "@api/auth"
import { info } from "@api/info"
import { call } from "@api/call"
import { Action } from "@src/action"
import { HttpMethod } from "@src/enum"
import { conf } from "@api/conf"
import { keep } from "@api/keep"
import { login } from "@service/login"
import { play } from "@api/play"

type HttpCallback = (request: Request) => Promise<Response>
type HttpMethodCallback = (url: URL, req: Request) => Promise<Response>

export class Route {
  static authReg = /\/__(auth|call|conf|keep|info)__$/
  static map: {[key: string]: (HttpCallback | undefined)} = {
    "/__info__": info,
    "/__auth__": auth,
    "/__call__": call,
    "/__conf__": conf,
    "/__keep__": keep,
    "/__login__": login,
    "/__play__": play
  }

  static match(url: URL): boolean {
    return Route.authReg.test(url.pathname)
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
    } else if (method == HttpMethod.PROPFIND) {
      result = action.propfind(url, req)
    } else {
      result = new Response(method)
    }
    return result
  }
}