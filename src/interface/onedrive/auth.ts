import { TokenData } from "@type/TokenData"

export async function auth(): Promise<string | null> {
    const json = await STORE.get('auth')
    if (json) {
        const token: TokenData = JSON.parse(json)
        return `${token.token_type} ${token.access_token}`
    }
    return null
}