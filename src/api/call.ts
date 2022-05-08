import { Cors } from "@config/Cors";
import { CONST_URL } from "@src/const";
import { TokenData } from "@model/TokenData";
import { i18n, I18N_KEY } from "@lang/i18n";
import { StoreService } from "@service/StoreService";
import { BeanType, Provider } from "@service/Provider";

export async function call(request: Request): Promise<Response> {
    const url = new URL(request.url)
    const code = url.searchParams.get('code')!;
    const link = new URL(CONST_URL.TOKEN);
    const params = new URLSearchParams();
    const config = await Cors.get();
    params.set('client_id', config.client);
    params.set('client_secret', config.secret);
    params.set('grant_type', Cors.grantType);
    params.set('scope', config.scope.join(' '));
    params.set('redirect_uri', config.redirect);
    params.set('code', code);
    const res = await fetch(link.href, { method: 'post', body: params });
    let result;
    if (res.ok) {
        try {
            const store = Provider<StoreService>(BeanType.STORE)!
            const data: TokenData = await res.json();
            await store.put('auth', JSON.stringify(data));
            result = new Response(i18n(I18N_KEY.LOGIN_SUCCESS));
        } catch (error: any) {
            result = new Response(error);
        }
    } else {
        result = res;
    }
    return result;
}
