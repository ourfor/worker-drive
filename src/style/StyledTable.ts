import styled from "styled-components"

export const StyledTable = styled.table`
    border-spacing: 0;
    border: 1px solid gray;
    margin-left: 1em;
    margin-top: 1em;
    background: white;
    & td {
        border-top: 0.5px solid red;
        border-left: 1px solid red;
        padding: 4px;
    }
    tr>td:first-child {
        border-left: 0;
    }
    & a {
        word-wrap: break-word;
        background-color: transparent;
        text-decoration: none;
        outline: 0;
        border-bottom: 1px solid #999;
        color: #222;
        border-bottom-color: #222;
        cursor: pointer;
    }
    i {
        width: 30px;
        height: 30px;
        display: block;
    }
    i.FILE {
        background: center no-repeat url('//static.ourfor.top/www/icons/file.svg');
    }
    i.FOLDER {
        background: center no-repeat url('//static.ourfor.top/www/icons/folder-other.svg');
    }
`