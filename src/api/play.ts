import { ResponseContentType } from "@src/enum";
import { PlayerHTML, render } from "@page/render";
import { Player } from "@page/Player";

export async function play(req: Request): Promise<Response> {
    const params = new URL(req.url).searchParams;
    const src = params.get("src");
    if (src) {
        const url = new URL(src);
        const dir = url.pathname.substring(0, url.pathname.lastIndexOf("/"));
        let title = params.get("title") ?? "";
        let poster = params.get("poster") ?? `${url.origin}${dir}/fanart.jpg`;
        const caption = params.get("caption") ?? "";
        const thumbnails = params.get("thumbnails") ?? "";
        const needHLS = !/\.(mp4|avi|mkv)$/.test(src);

        if (poster.length === 0) {
            poster = `${url.origin}${dir}/fanart.jpg`;
        }

        return new Response(PlayerHTML({
            title,
            src,
            poster,
            thumbnails,
            caption,
            needHLS
        }), {
            headers: {
                "Content-Type": ResponseContentType.HTML
            }
        });
    }
    return new Response(render(Player()), {
        headers: {
            "Content-Type": ResponseContentType.HTML
        }
    });
}
