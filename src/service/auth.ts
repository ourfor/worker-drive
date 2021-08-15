import { Cors } from "@config/Cors"
import { CONST_URL, TOKEN } from "@src/const"
import { DriveAuthType, HttpStatus, ResponseContentType } from "@src/enum"
import { TokenData } from "@type/TokenData"
import { i18n, I18N_KEY } from "@lang/i18n"
import { redirect } from "@page/Html"
import { LoginSuccessTip } from "@page/Login"

export async function auth(): Promise<Response> {
    const config = await Cors.get()
    const { redirect, scope, client } = config
    const url = new URL(CONST_URL.AUTHORIZATION)
    url.searchParams.set('client_id', client)
    url.searchParams.set('scope', scope.join(' '))
    url.searchParams.set('response_type', DriveAuthType.CODE)
    url.searchParams.set('redirect_uri', redirect)

    const location = url.href
    return new Response('redirect to onedrive login', {
        status: HttpStatus.REDIRECT,
        headers: {
            location,
        },
    })
}

export async function call(url: URL): Promise<Response> {
    const code = url.searchParams.get('code')!
    const link = new URL(CONST_URL.TOKEN)
    const params = new URLSearchParams()
    const config = await Cors.get()
    params.set('client_id', config.client)
    params.set('client_secret', config.secret)
    params.set('grant_type', Cors.grantType)
    params.set('scope', config.scope.join(' '))
    params.set('redirect_uri', config.redirect)
    params.set('code', code)
    const res = await fetch(link.href, { method: 'post', body: params })
    let result
    if (res.ok) {
        try {
            const data: TokenData = await res.json()
            await STORE.put('auth', JSON.stringify(data))
            result = new Response(i18n(I18N_KEY.LOGIN_SUCCESS))
        } catch (error) {
            result = new Response(error)
        }
    } else {
        result = res
    }
    return result
}

export async function conf(request: Request): Promise<Response> {
    let result;
    try {
        const params = await request.formData()
        await Cors.set({
            client: params.get('client') as string,
            secret: params.get('secret') as string,
            scope: (params.get('scope') as string).split(','),
            redirect: params.get('redirect') as string,
        })
        result = new Response('配置成功')
    } catch (error) {
        result = new Response(error)
    }
    return result
}

export async function keep(request: Request): Promise<Response> {
    // const params = new URL(request.url).searchParams
    // const id = params.get('id')
    const data = await request.formData()
    const username = data.get("username")
    const password = data.get("password")
    if (username === TOKEN.USERNAME && password === TOKEN.PASSWORD) {
        return new Response(redirect(LoginSuccessTip(), "/"), {
            headers: {
                "Set-Cookie": `${TOKEN.KEY}=${TOKEN.VALUE};`,
                "Content-Type": ResponseContentType.HTML
            }
        })
    }
    return new Response(i18n(I18N_KEY.NOT_FOUND))
}


export async function info(): Promise<Response> {
    const data = {
        author: "ourfor",
        email: "ourfor@qq.com",
        version: "v1.0.0-beta",
        description: "文件管理"
    }
    return new Response()
}