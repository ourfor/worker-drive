import { Cors } from "@config/Cors"
import { i18n, I18N_KEY } from "@lang/i18n"
import { TokenData } from "@model/TokenData"
import { BeanType, Provider } from "@service/Provider"
import { StoreService } from "@service/StoreService"
import { TimeEvent } from "@service/TimeService"
import { CONST_URL } from "@src/const"

export async function RefreshOneDriveToken({ time }: TimeEvent): Promise<any> {
    const store = Provider<StoreService>(BeanType.STORE)!

    const date = new Date().toLocaleString('zh-cn')
    return new Promise(async (resolve, reject) => {
        try {
            const json = await store.get<string>('auth')
            if (json) {
                const token: TokenData = JSON.parse(json)
                const url = new URL(CONST_URL.TOKEN)
                const params = new URLSearchParams()
                const config = await Cors.get()
                params.set('grant_type', 'refresh_token')
                params.set('client_id', config.client)
                params.set('client_secret', config.secret)
                params.set('redirect_uri', config.redirect)
                params.set('refresh_token', token.refresh_token)

                const res = await fetch(url.href, { method: 'post', body: params })
                let result,
                    refreshed = false
                if (res.ok) {
                    try {
                        const data: TokenData = await res.json()
                        await store.put('auth', JSON.stringify(data))
                        await store.put('date', date)
                        await store.put('scheduled', `${time}`)
                        refreshed = true
                    } catch (error) {
                        result = error
                    }
                } else {
                    result = res
                }
                await store.put('refreshed', `${refreshed}`)
                resolve(result)
            } else {
                resolve(i18n(I18N_KEY.NEED_INIT))
            }
        } catch (error) {
            reject(error)
        }
    })
}