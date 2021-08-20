import { TOKEN } from "@src/const";
import { ContentType } from "@src/enum";
import { i18n, I18N_KEY } from "@lang/i18n";
import { redirect } from "@page/render";
import { LoginSuccessTip } from "@page/Login";

export async function keep(request: Request): Promise<Response> {
    const data = await request.formData();
    const username = data.get("username");
    const password = data.get("password");
    if (username === TOKEN.USERNAME && password === TOKEN.PASSWORD) {
        return new Response(redirect(LoginSuccessTip(), "/"), {
            headers: {
                "Set-Cookie": `${TOKEN.KEY}=${TOKEN.VALUE}; Path=/`,
                "Content-Type": ContentType.HTML
            }
        });
    }
    return new Response(i18n(I18N_KEY.NOT_FOUND));
}
