import { i18n, I18N_KEY } from "@lang/i18n";
import { StyledForm } from "@style/StyledForm";
import { StyledPage } from "@style/StyledPage";

export function Login() {
    return (
        <StyledPage>
            <div className="login-title">{i18n(I18N_KEY.LOGIN_TITLE)}</div>
            <StyledForm method="POST" action="/__keep__">
                <input name="username" type="text" placeholder={i18n(I18N_KEY.LOGIN_USERNAME)} />
                <input name="password" type="password" placeholder={i18n(I18N_KEY.LOGIN_PASSWORD)} />
                <button>{i18n(I18N_KEY.LOGIN_SUBMIT)}</button>
            </StyledForm>
        </StyledPage>
    )
}

export function LoginSuccessTip() {
    return (
        <StyledPage>
            <div className="login-success-tip">{i18n(I18N_KEY.AUTHORIZE_SUCCESS)}</div>
        </StyledPage>
    )
}

