import { i18n, I18N_KEY } from "@lang/i18n";
import { StyledForm } from "@style/StyledForm";
import { StyledPage } from "@style/StyledPage";

export function Config() {
    return (
        <StyledPage>
            <div className="login-title">{i18n(I18N_KEY.CONFIG_CLIENT_TITLE)}</div>
            <StyledForm method="POST" action="/__conf__">
                <input name="title" type="text" placeholder={i18n(I18N_KEY.CONFIG_CLIENT_DESCRIPTION)} />
                <textarea name="client" placeholder={i18n(I18N_KEY.CONFIG_CLIENT_ID)} />
                <textarea name="client" placeholder={i18n(I18N_KEY.CONFIG_CLIENT_SECRET)} />
                <textarea name="scope" placeholder={i18n(I18N_KEY.CONFIG_CLIENT_SCOPE)} />
                <textarea name="redirect" placeholder={i18n(I18N_KEY.CONFIG_CLIENT_REDIRECT)} />
                <button>{i18n(I18N_KEY.PLAYER_START)}</button>
            </StyledForm>
        </StyledPage>
    )
}