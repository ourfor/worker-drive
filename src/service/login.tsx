import { render } from "@page/render"
import { Login } from "@page/Login"
import { ContentType } from "@src/enum"

export async function login(): Promise<Response> {
    const html = render(<Login />)
    return new Response(html, {
        headers: {
            "Content-Type": ContentType.HTML
        }
    })
}