import { DriveDataType, DriveFileData, DriveFolderData } from "@src/enum";
import { StyledPage } from "@style/StyledPage";
import { StyledTable } from "@style/StyledTable";
import { Format } from "@util/Format";

type ListProps = { data: (DriveFileData | DriveFolderData)[]; href: string; };
export function FileList({ data, href }: ListProps) {
    return (
        <StyledPage>
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
                    const date = new Date(createdDateTime!).toLocaleString("zh-cn");
                    return (
                        <tr>
                            <td><i className={type} /></td>
                            <td><a href={`${href}/${name}`}>{name}</a></td>
                            <td>{date}</td>
                            <td data-size={size}>{Format.size(size)}</td>
                        </tr>
                    );
                })}
            </tbody>
        </StyledTable>
        </StyledPage>
    );
}
