import { ResponseContentType } from "@src/enum"
import { ReactElement } from "react"

type HTML5Props = {
    title?: string,
    styles?: ReactElement[],
    redirect?: boolean,
    url?: string,
    content?: ReactElement,
    script?: string
}
export function HTML5 ({ title, styles, redirect, url, content, script }: HTML5Props) {
    return (
        <html>
            <head>
                <title>{title}</title>
                <meta charSet="utf-8" />
                {redirect ? <meta http-equiv="refresh" content={`3;url=${url}`} /> : null}
                <meta name="Description" content={title} />
                <link rel="stylesheet" href="//static.ourfor.top/fonts/font.css" />
                <meta http-equiv="content-type" content={ResponseContentType.HTML} />
                <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1, maximum-scale=1, user-scalable=no" />
                {styles?.map(style => style)}
            </head>
            <body>{content}</body>
            <script dangerouslySetInnerHTML={{__html: script ?? ""}} />
        </html>
    )
}