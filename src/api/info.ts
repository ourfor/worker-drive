export async function info(): Promise<Response> {
    const data = {
        author: "ourfor",
        email: "ourfor@qq.com",
        version: "v1.0.0-beta",
        description: "文件管理"
    };
    return new Response();
}
