import * as qr from 'qrcode'

export async function qrcode(req: Request): Promise<Response> { 
    const params = new URL(req.url).searchParams;
    const size = params.get("size") ?? "1024"
    const data = params.get("data") ?? "Hello World"
    const type = params.get("type") == 'utf8' ? 'utf8' : 'svg'
    let exception = ""
    let image = ""
    await qr.toString(data, { 
        type,
        errorCorrectionLevel: "H",
        width: parseInt(size)
    }, (error, data) => {
        exception = JSON.stringify(error)
        image = data
    }) 
    const headers = { "Content-Type": "image/svg+xml" }
    return new Response(image, {
        headers
    })
}