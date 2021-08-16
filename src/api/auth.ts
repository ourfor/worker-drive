import { Cors } from "@config/Cors";
import { CONST_URL } from "@src/const";
import { DriveAuthType, HttpStatus } from "@src/enum";


export async function auth(): Promise<Response> {
    const config = await Cors.get();
    const { redirect, scope, client } = config;
    const url = new URL(CONST_URL.AUTHORIZATION);
    url.searchParams.set('client_id', client);
    url.searchParams.set('scope', scope.join(' '));
    url.searchParams.set('response_type', DriveAuthType.CODE);
    url.searchParams.set('redirect_uri', redirect);

    const location = url.href;
    return new Response('redirect to onedrive login', {
        status: HttpStatus.REDIRECT,
        headers: {
            location,
        },
    });
}
