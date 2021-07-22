import { CONST_URL } from '@src/const'
import { TokenData } from '@type/TokenData'
import { Cors } from '@config/Cors'
import { i18n, I18N_KEY } from '@lang/i18n'

export async function handleSchedule({
  scheduledTime,
}: ScheduledEvent): Promise<any> {
  const date = new Date().toLocaleString('zh-cn')
  return new Promise(async (resolve, reject) => {
    try {
      const json = await STORE.get('auth')
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
            await STORE.put('auth', JSON.stringify(data))
            await STORE.put('date', date)
            await STORE.put('scheduled', `${scheduledTime}`)
            refreshed = true
          } catch (error) {
            result = error
          }
        } else {
          result = res
        }
        await STORE.put('refreshed', `${refreshed}`)
        resolve(result)
      } else {
        resolve(i18n(I18N_KEY.NEED_INIT))
      }
    } catch (error) {
      reject(error)
    }
  })
}
