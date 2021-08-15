import { i18n, I18N_KEY } from "@lang/i18n";
import { StyledForm } from "@style/StyledForm";
import { StyledPage } from "@style/StyledPage";

export function Player() {
    return (
        <StyledPage>
            <div className="login-title">{i18n(I18N_KEY.PLAYER_TITLE)}</div>
            <StyledForm method="GET" action="/__play__">
                <input name="title" type="text" placeholder={i18n(I18N_KEY.PLAYER_NAME)} />
                <textarea name="src" placeholder={i18n(I18N_KEY.PLAYER_SOURCE)} />
                <textarea name="poster" placeholder={i18n(I18N_KEY.PLAYER_POSTER)} />
                <textarea name="thumbnails" placeholder={i18n(I18N_KEY.PLAYER_THUMBNAILS)} />
                <textarea name="caption" placeholder={i18n(I18N_KEY.PLAYER_CAPTION)} />
                <button>{i18n(I18N_KEY.PLAYER_START)}</button>
            </StyledForm>
        </StyledPage>
    )
}