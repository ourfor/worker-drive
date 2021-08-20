import { ReactElement } from 'react'
import { ServerStyleSheet } from "styled-components";
import { renderToStaticMarkup, renderToString } from "react-dom/server";
import { i18n, I18N_KEY } from '@lang/i18n';
import { HTML5 } from './HTML5';

export function render(content: ReactElement): string {
  const sheet = new ServerStyleSheet()
  renderToStaticMarkup(sheet.collectStyles(content))
  const script = (`
    console.log("Hello World")
    document.querySelectorAll(".play").forEach(ele => (ele.href = "/fn/play?src=" + btoa(ele.href)))
  `)
  const styles = sheet.getStyleElement() // or sheet.getStyleElement();
  const html = HTML5({ content, title: '秘密花园', styles, script })
  sheet.seal()
  return renderToStaticMarkup(html)
}

export function redirect(content: ReactElement, url: string): string {
  const sheet = new ServerStyleSheet()
  renderToStaticMarkup(sheet.collectStyles(content))
  const styles = sheet.getStyleElement() // or sheet.getStyleElement();
  const html = HTML5({ content, title: '秘密花园', redirect: true, styles, url })
  sheet.seal()
  return renderToStaticMarkup(html)
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
  const scriptContent = `
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
      sources: [ { src: "" } ],
      tracks: [ {
          kind: "captions",
          label: "Chinese captions",
          srclang: "zh",
          src: "${caption}",
          default: true
        } ]
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
  `

  const styleContent = `
  body {margin: 0;height: 100vh;}
  .container, video {height: 100%;}
  iframe {display: none;}
  `
  return renderToStaticMarkup(
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <link rel="shortcut icon" href="//static.ourfor.top/favicon.ico" />
        <script src="//cdn.plyr.io/3.6.2/plyr.js"></script>
        <script src="//cdn.jsdelivr.net/npm/hls.js@latest"></script>
        <link rel="stylesheet" href="//cdn.plyr.io/3.6.2/plyr.css" />
        <title>{i18n(I18N_KEY.PLAYER_TITLE)}</title>
        <style dangerouslySetInnerHTML={{__html: styleContent }} />
      </head>
      <body>
        <div className="container">
          <video controls={true} crossOrigin="" playsInline={true} id="player" />
        </div>
        <script dangerouslySetInnerHTML={{ __html: scriptContent }} />
      </body>
    </html>
  )
}