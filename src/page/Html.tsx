import { ReactElement } from 'react'
import { ServerStyleSheet } from "styled-components";
import { renderToString } from "react-dom/server";
import { ResponseContentType } from '@src/enum';
import { i18n, I18N_KEY } from '@lang/i18n';

type HtmlProps = { body: string, title: string, style: string, redirect?: boolean, url?: string }
export function Html({ body, title, style, redirect = false, url }: HtmlProps) {
    return (`
        <html style="padding:0;margin:0">
            <head>
                <title>${title}</title>
                <meta charSet="UTF-8" />
                ${redirect ? `<meta http-equiv="refresh" content="3;url=${url}" />` : ""}
                <meta name="Description" content="${title}" />
                <link rel="stylesheet" href="//static.ourfor.top/fonts/font.css" />
                <meta http-equiv="content-type" content="${ResponseContentType.HTML}" />
                <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1, maximum-scale=1, user-scalable=no" />
                ${style}
            </head>
            <body style="width:100%;height:100%;padding:0;margin:0">${body}</body>
        </html>
    `).trimStart()
}

export function render(element: ReactElement): string {
    const sheet = new ServerStyleSheet()
    let html = '';
    const body = renderToString(sheet.collectStyles(element))
    const style = sheet.getStyleTags() // or sheet.getStyleElement();
    html = Html({ body, title: '秘密花园', style })
    sheet.seal()
    return html
}

export function redirect(element: ReactElement, url: string): string {
    const sheet = new ServerStyleSheet()
    let html = '';
    const body = renderToString(sheet.collectStyles(element))
    const style = sheet.getStyleTags() // or sheet.getStyleElement();
    html = Html({ body, title: '秘密花园', redirect: true, style,  url })
    sheet.seal()
    return html
}

type PlayerProps = {
    title?: string,
    src: string,
    poster?: string,
    thumbnails?: string,
    caption?: string,
    needHLS?: boolean
}
export function PlayerHTML({ title, src, poster, thumbnails, caption, needHLS = false }: PlayerProps) {
    return (`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <link rel="shortcut icon" href="//static.ourfor.top/favicon.ico" />
    <!-- plyr : use the latest version of plyr.js -->
    <script src="https://cdn.plyr.io/3.6.2/plyr.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
    <link rel="stylesheet" href="https://cdn.plyr.io/3.6.2/plyr.css" />
    <title>${i18n(I18N_KEY.PLAYER_TITLE)}</title>
    <style>
      body {
        margin: 0;
        height: 100vh;
      }
      .container {
        height: 100%;
      }
      iframe {
        display: none;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <video controls crossorigin playsinline id="player" />
    </div>
    <script>
      document.addEventListener("DOMContentLoaded", () => {
        // For more options see: https://github.com/sampotts/plyr/#options
        // captions.update is required for captions to work with hls.js
        const data = {
          type: "video",
          title: "${title}",
          origin: "${src}",
          captions: { active: true, update: true, language: "zh" },
          poster: "${poster}",
          previewThumbnails: {
            enabled: ${thumbnails?.length != 0},
            src: "${thumbnails}"
          },
          sources: [
            {
              src: ""
            }
          ],
          tracks: [
            {
              kind: "captions",
              label: "Chinese captions",
              srclang: "zh",
              src: "${caption}",
              default: true
            }
          ]
        };
        const player = new Plyr("#player", data);
        player.source = data;

        if (!${needHLS} || !Hls.isSupported()) {
          player.media.src = data.origin;
        } else {
          // For more Hls.js options, see https://github.com/dailymotion/hls.js
          const hls = new Hls();
          hls.loadSource(data.origin);
          hls.attachMedia(player.media);
          window.hls = hls;

          // Handle changing captions
          player.on("languagechange", () => {
            // Caption support is still flaky. See: https://github.com/sampotts/plyr/issues/994
            setTimeout(() => (hls.subtitleTrack = player.currentTrack), 50);
          });
        }

        // Expose player so it can be used from the console
        window.player = player;
      });
    </script>
  </body>
</html>
    `)
}