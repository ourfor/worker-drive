import { auth, call, conf, keep } from "./auth";
import { HttpStatus } from "./enum";
import { read } from "./read";
import { Route } from "./route";
import { upload } from "./write";

export interface Action {
  get: (url: URL, req: Request) => Promise<Response>;
  post: (url: URL, req: Request) => Promise<Response>;
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

}