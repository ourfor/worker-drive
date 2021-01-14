import { Config } from './config'
import { Route } from './route'

enum DriveAuthType {
  TOKEN = 'token',
  CODE = 'code',
}

export async function handleRequest(request: Request): Promise<Response> {
  const { method } = request
  const date = await STORE.get('date')
  const author = await STORE.get('author')
  const url = new URL(request.url)
  if (Route.match(url)) {
    if (Route.isAuth(url))
      return auth(
        Config.client,
        Config.scope,
        DriveAuthType.CODE,
        Config.redirect,
      )
    else return call(url)
  } else {
    return link(url.pathname)
  }
}

async function link(path: string): Promise<Response> {
  const url = `https://graph.microsoft.com/v1.0/me/drive/root:${path}`
  const json = await STORE.get('auth')
  let result
  if (json) {
    const token: TokenData = JSON.parse(json)
    const authorization = `${token.token_type} ${token.access_token}`
    try {
      const res = await fetch(url, { headers: { authorization } })
      const data = await res.json()
      const {
        '@microsoft.graph.downloadUrl': href,
        file: { mimeType: type },
      } = data
      const origin = await fetch(href, { headers: { authorization } })
      return new Response(origin.body, {
        headers: {
          ...res.headers,
          ...Config.corsHeaders,
          'Content-Type': type,
        },
      })
    } catch (error) {
      result = new Response(error)
    }
  } else {
    result = new Response('please login to enable this function')
  }
  return result
}

async function auth(
  clientId: string,
  scope: string[],
  responseType: DriveAuthType,
  redirectUri: string,
): Promise<Response> {
  const url = new URL(
    'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
  )
  url.searchParams.set('client_id', clientId)
  url.searchParams.set('scope', scope.join(' '))
  url.searchParams.set('response_type', responseType)
  url.searchParams.set('redirect_uri', redirectUri)

  const location = url.href
  return new Response('redirect to onedrive login', {
    status: 302,
    headers: {
      location,
    },
  })
}

async function call(url: URL): Promise<Response> {
  const code = url.searchParams.get('code')!
  const link = new URL(
    'https://login.microsoftonline.com/common/oauth2/v2.0/token',
  )
  const params = new URLSearchParams()
  params.set('client_id', Config.client)
  params.set('client_secret', Config.secret)
  params.set('grant_type', Config.grantType)
  params.set('scope', Config.scope.join(' '))
  params.set('redirect_uri', Config.redirect)
  params.set('code', code)
  const res = await fetch(link.href, { method: 'post', body: params })
  let result
  if (res.ok) {
    try {
      const data: TokenData = await res.json()
      await STORE.put('auth', JSON.stringify(data))
      result = new Response('登录成功')
    } catch (error) {
      result = new Response(error)
    }
  } else {
    result = res
  }
  return result
}
