import { CONST_URL } from "@src/const";
import styled from "styled-components";

export const StyledPage = styled.div`
    width: 100%;
    height: fit-content;
    min-height: 100%;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-image: url(${CONST_URL.BACKGROUNDIMAGE});

    .login-title, .login-success-tip {
        font-size: 2em;
        margin: 1em;
        font-weight: 300;
    }
`;
