import { HttpAction } from '@src/action'
import { Route } from '@route/route'

const action = new HttpAction()

export async function HTTPRequestHandler(request: Request): Promise<Response> {
  return Route.dispatch(request, action)
}
