import styled from "styled-components"

export const StyledForm = styled.form`
    padding: 2em 3em;
    width: fit-content;
    border-radius: 4px;
    box-shadow: 0 2px 5px 0 #00000029, 0 2px 10px 0 #0000001f;
    background: white;
    &>input, &>button {
        display: block;
        margin: 2em auto;
        font-size: 1.2em;
        border-radius: 0.2em;
        text-align: center;
    }
    &>input, &>textarea {
        text-align: center;
        border-width: 1px;
        border-radius: 0.5em;
        font-weight: 300;
        padding: 0.1em 0.5em;
        outline: none;
        border-style: solid;

        &:hover {
            border-color: pink;
        }
    }
    &>textarea {
        display: block;
        margin: 1em;
        min-width: 30em;
        min-height: 5em;  
    }
    &>button {
        border-width: 1px;
        border-radius: 0.5em;
        font-weight: 300;
        padding: 0.1em 0.5em;
        outline: none;
        border-style: solid;
        cursor: pointer;

        &:hover {
            color: blue;
        }
    }
`