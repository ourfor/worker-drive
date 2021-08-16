import { Cors } from "@config/Cors";


export async function conf(request: Request): Promise<Response> {
    let result;
    try {
        const params = await request.formData();
        await Cors.set({
            client: params.get('client') as string,
            secret: params.get('secret') as string,
            scope: (params.get('scope') as string).split(','),
            redirect: params.get('redirect') as string,
        });
        result = new Response('配置成功');
    } catch (error) {
        result = new Response(error);
    }
    return result;
}
