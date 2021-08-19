import { Cors } from "@config/Cors";
import { HttpMethod, HttpStatus, ResponseContentType } from "@src/enum";
import { Route } from "@route/route";
import { i18n, I18N_KEY } from "@lang/i18n";
import { basicAuthentication, verifyCredentials } from "@util/basicAuth";
import { TOKEN } from "./const";
import { WebDAV } from "@type/XML";

export interface Action {
  get: (url: URL, req: Request) => Promise<Response>;
  post: (url: URL, req: Request) => Promise<Response>;
  options: (url: URL, req: Request) => Promise<Response>;
  propfind: (url: URL, req: Request) => Promise<Response>;
}

export class HttpAction implements Action {

  async propfind(url: URL, req: Request) {
          // The "Authorization" header is sent when authenticated.
          if (req.headers.has('Authorization')) {
            // Throws exception when authorization fails.
            const { username, password } = basicAuthentication(req)
            verifyCredentials(username, password)
    
            if (req.headers.get("Content-Type") && req.headers.get("Depth") === "0") {
              const xml = await req.text()
              const data = WebDAV.xml2js<WebDAV.PropFind>(xml)
              const content = WebDAV.createXMLResponse({
                href: "http://localhost/",
                updateAt: new Date().toISOString(),
                createAt: new Date().toISOString(),
                status: "HTTP/1.1 200 OK",
              })
              const xmlData: WebDAV.XML = {
                multistatus: {
                  _attributes: WebDAV.attributes,
                  response: [
                    content
                  ]
                }
              }
              const wrap = WebDAV.js2xml(xmlData)
              return new Response(wrap, {
                status: HttpStatus.Multi_Status,
                headers: {
                  ...Cors.corsHeaders,
                  "Content-Type": ResponseContentType.XML
                }
              })
            }
            // Only returns this response when no exception is thrown.
            const newReq = new Request(req, { method: HttpMethod.GET, body: null, headers: {
              cookie: `${TOKEN.KEY}=${TOKEN.VALUE}`,
            }})
            return drive.read(url.pathname, newReq, ResponseContentType.XML)
          }
    
          // Not authenticated.
          return new Response('You need to login.', {
            status: 401,
            headers: {
              // Prompts the user for credentials.
              'WWW-Authenticate': 'Basic realm="my scope", charset="UTF-8"'
            }
          })
  }

  async get(url: URL, req: Request) {
    let result;
    const pathname = url.pathname
    if (pathname.startsWith("/__")) {
      const callback = Route.map[pathname]
      if (callback) {
        result = callback(req)
      } else {
        result = new Response(i18n(I18N_KEY.NOT_FOUND), { status: HttpStatus.Not_Found })
      }
    } else {
      const accept = url.searchParams.get("accept")
      let type
      if (!accept || accept == "") {
        type = ResponseContentType.HTML
      } else if (accept == "json") {
        type = ResponseContentType.JSON
      } else {
        type = ResponseContentType.XML
      }
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
        "Access-Control-Allow-Headers": allowHeaders ? allowHeaders : "*"
      }
  
      return new Response(null, {
        headers: respHeaders,
      })
    } else {
      // Handle standard OPTIONS request.
      // If you want to allow other HTTP Methods, you can do that here.
      return new Response(null, {
        headers: {
          ...Cors.corsHeaders,
          Allow: "GET,HEAD,POST,PROPPATCH,PROPFIND,OPTIONS,DELETE,UNLOCK,COPY,LOCK,MOVE",
        },
      })
    }
  }

}