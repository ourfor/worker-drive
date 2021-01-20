import { HttpAction } from './action'
import { Route } from './route'

const action = new HttpAction()

export async function handleRequest(request: Request): Promise<Response> {
  return Route.dispatch(request, action)
}
