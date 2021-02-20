export function cookies(req: Request, key: string): string|number {
    const check: {[key: string]: string|number} = {}
    const cookie = req.headers.get('cookie')!
    cookie.split('; ').forEach(item => {
        const [key,value] = item.split('=')
        check[key] = value
    })
    return check[key]
}