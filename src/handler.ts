import { Config } from './config'
import { Route } from './route'

enum DriveAuthType {
  TOKEN = 'token',
  CODE = 'code',
}

export async function handleRequest(request: Request): Promise<Response> {
  const { method } = request
  const url = new URL(request.url)
  if (Route.match(url)) {
    let result
    if (Route.isAuth(url)) {
      const config = await Config.get()
      result = auth(
        config.client,
        config.scope,
        DriveAuthType.CODE,
        config.redirect,
      )
    } else if (Route.isCall(url)) {
      result = call(url)
    } else if (Route.isConf(url) && method.toUpperCase() == 'POST') {
      try {
        const params = await request.formData()
        await Config.set({
          client: params.get('client') as string,
          secret: params.get('secret') as string,
          scope: (params.get('scope') as string).split(','),
          redirect: params.get('redirect') as string,
        })
        result = new Response('配置成功')
      } catch (error) {
        result = new Response(error)
      }
    } else {
      result = new Response('URL Not Found')
    }
    return result
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
  const config = await Config.get()
  params.set('client_id', config.client)
  params.set('client_secret', config.secret)
  params.set('grant_type', Config.grantType)
  params.set('scope', config.scope.join(' '))
  params.set('redirect_uri', config.redirect)
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
