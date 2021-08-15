import { render } from "@page/Html"
import { Login } from "@page/Login"
import { ResponseContentType } from "@src/enum"
import { renderToString } from "react-dom/server"

export async function login(): Promise<Response> {
    const html = render(<Login />)
    return new Response(html, {
        headers: {
            "Content-Type": ResponseContentType.HTML
        }
    })
}