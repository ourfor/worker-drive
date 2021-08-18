import { Cors } from "@config/Cors";
import { HttpStatus, ResponseContentType } from "@src/enum";
import { Route } from "@route/route";
import { i18n, I18N_KEY } from "@lang/i18n";

export interface Action {
  get: (url: URL, req: Request) => Promise<Response>;
  post: (url: URL, req: Request) => Promise<Response>;
  options: (url: URL, req: Request) => Promise<Response>;
}

export class HttpAction implements Action {
  async get(url: URL, req: Request) {
    let result;
    const pathname = url.pathname
    if (pathname.startsWith("/__")) {
      const callback = Route.map[pathname]
      if (callback) {
        result = callback(req)
      } else {
        result = new Response(i18n(I18N_KEY.NOT_FOUND), { status: HttpStatus.NOT_FOUND })
      }
    } else {
      const type = url.searchParams.get("accept") === "json" ? ResponseContentType.JSON : ResponseContentType.HTML
      result = drive.read(pathname, req, type)
    }
    return result
  }

  async post(url: URL, req: Request) {
    const pathname = url.pathname
    const callback = Route.map[pathname]
    let result;
    if (callback) {
      result = callback(req)
    } else {
      result = drive.write(url.pathname, req);
    }
    return result
  }

  async options(_url: URL, req: Request) {
    const headers = req.headers;
    if (
      headers.get("Origin") !== null &&
      headers.get("Access-Control-Request-Method") !== null &&
      headers.get("Access-Control-Request-Headers") !== null
    ) {
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