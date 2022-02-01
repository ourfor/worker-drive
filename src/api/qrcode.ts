import * as qr from 'qrcode'

export async function qrcode(req: Request): Promise<Response> { 
    const params = new URL(req.url).searchParams;
    const size = params.get("size") ?? "1024"
    const data = params.get("data") ?? "Hello World"
    let exception = ""
    let image = ""
    await qr.toString(data, { 
        type: 'svg',
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