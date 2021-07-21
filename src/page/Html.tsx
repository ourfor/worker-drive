import { DriveDataType, DriveFileData, DriveFolderData } from "../enum"
import { ReactElement } from 'react'
import { ServerStyleSheet } from "styled-components";
import { renderToStaticMarkup } from "react-dom/server";
import { StyledTable } from "@style/StyledTable";
import { Format } from "@util/Format";

type TableProps = { data: (DriveFileData | DriveFolderData)[], href: string }
export function Table({ data, href }: TableProps) {
    return (
        <StyledTable>
            <thead>
                <th>类型</th>
                <th>名称</th>
                <th>修改时间</th>
                <th>大小</th>
            </thead>
            <tbody data-path={href}>
                {data.map(({ name, size, createdDateTime, ...res }) => {
                    const type = res.hasOwnProperty('file') ? DriveDataType.FILE : DriveDataType.FOLDER;
                    const date = new Date(createdDateTime!).toLocaleString("zh-cn")
                    return (
                        <tr>
                            <td><i className={type} /></td>
                            <td><a href={`${href}/${name}`}>{name}</a></td>
                            <td>{date}</td>
                            <td data-size={size}>{Format.size(size)}</td>
                        </tr>
                    )
                })}
            </tbody>
        </StyledTable>
    )
}

type HtmlProps = { body: string, title: string, style: string }
export function Html({ body, title, style }: HtmlProps) {
    return (`
        <html>
            <head>
                <title>${title}</title>
                <meta charSet="UTF-8" />
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                <meta name="Description" content="秘密花园" />
                <link rel="stylesheet" href="//static.ourfor.top/fonts/font.css" />
                <meta http-equiv="content-type" content="text/html;charset=UTF-8" />
                <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1, maximum-scale=1, user-scalable=no" />
                ${style}
            </head>
            <body>${body}</body>
        </html>
    `).trimStart()
}

export function render(element: ReactElement): string {
    const sheet = new ServerStyleSheet()
    let html = '';
    const body = renderToStaticMarkup(sheet.collectStyles(element))
    const style = sheet.getStyleTags() // or sheet.getStyleElement();
    html = Html({ body, title: '秘密花园', style })
    sheet.seal()
    return html
}