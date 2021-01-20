import { auth, call, conf, keep } from './auth'
import { HttpStatus } from './enum'
import { read } from './read'
import { Action, Route } from './route'

const action: Action = {
  async get(url, req) {
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
  },

  async post(url, req) {
    let result;
    if (Route.isConf(url)) {
      result = conf(req)
    } else {
      result = new Response('NOT FOUND', { status: HttpStatus.NOT_FOUND })
    }
    return result
  }

}

export async function handleRequest(request: Request): Promise<Response> {
  return Route.dispatch(request, action)
}
