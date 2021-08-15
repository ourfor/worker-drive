import { ReactElement } from 'react'
import { ServerStyleSheet } from "styled-components";
import { renderToString } from "react-dom/server";
import { ResponseContentType } from '@src/enum';

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