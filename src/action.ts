import { auth, call, conf, keep } from "./auth";
import { Config } from "./config";
import { HttpStatus } from "./enum";
import { read } from "./read";
import { Route } from "./route";
import { upload } from "./write";

export interface Action {
  get: (url: URL, req: Request) => Promise<Response>;
  post: (url: URL, req: Request) => Promise<Response>;
  options: (url: URL, req: Request) => Promise<Response>;
}

export class HttpAction implements Action {
  async get(url: URL, req: Request) {
    let result;
    if (Route.match(url)) {
      if (Route.isAuth(url)) {
        result = auth()
      } else if (Route.isCall(url)) {
        result = call(url)
      } else if (Route.isKeep(url)) {
        result = keep(req)
      } else {
        result = new Response('NOT FOUND', { status: HttpStatus.NOT_FOUND })
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
        ...Config.corsHeaders,
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