import { Cors } from "@config/Cors";
import { HttpStatus } from "@src/enum";
import { read } from "@service/read";
import { Route } from "@route/route";
import { upload } from "@service/write";
import { i18n, I18N_KEY } from "@lang/i18n";
import { login } from "@service/login";
import { auth, call, conf, info, keep, play } from "@api/api";

export interface Action {
  get: (url: URL, req: Request) => Promise<Response>;
  post: (url: URL, req: Request) => Promise<Response>;
  options: (url: URL, req: Request) => Promise<Response>;
}

export class HttpAction implements Action {
  async get(url: URL, req: Request) {
    let result;
    if (url.pathname.startsWith("/__")) {
      if (Route.isAuth(url)) {
        result = auth()
      } else if (Route.isCall(url)) {
        result = call(url)
      } else if (Route.isKeep(url)) {
        result = keep(req)
      } else if (Route.isInfo(url)) {
        result = info()
      } else if (Route.isPlay(url)) {
        result = play(req)
      } else if (Route.isLogin(url)) {
        result = login()
      } else {
        result = new Response(i18n(I18N_KEY.NOT_FOUND), { status: HttpStatus.NOT_FOUND })
      }
    } else {
      result = read(url.pathname, req)
    }
    return result
  }

  async post(url: URL, req: Request) {
    let result;
    if (Route.isConf(url)) {
      result = conf(req)
    } else if (Route.isKeep(url)) {
        result = keep(req)
    } else {
      result = upload(url.pathname, req);
    }
    return result
  }

  async options(_url: URL, req: Request) {
    const headers = req.headers;
    if (
      headers.get("Origin") !== null &&
      headers.get("Access-Control-Request-Method") !== null &&
      headers.get("Access-Control-Request-Headers") !== null
    ){
      // Handle CORS pre-flight request.
      // If you want to check or reject the requested method + headers
      // you can do that here.
      const allowHeaders = req.headers.get("Access-Control-Request-Headers")
      const respHeaders = {
        ...Cors.corsHeaders,
      // Allow all future content Request headers to go back to browser
      // such as Authorization (Bearer) or X-Client-Name-Version
        "Access-Control-Allow-Headers": allowHeaders?allowHeaders:"*"
      }
  
      return new Response(null, {
        headers: respHeaders,
      })
    }
    else {
      // Handle standard OPTIONS request.
      // If you want to allow other HTTP Methods, you can do that here.
      return new Response(null, {
        headers: {
          Allow: "GET, HEAD, POST, OPTIONS",
        },
      })
    }
  }

}