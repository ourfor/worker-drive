interface TokenData {
  token_type: string
  scope: string
  expires_in: number
  ext_expires_in: number
  access_token: string
  refresh_token: string
}

interface ConfigData {
  client: string
  secret: string
  scope: string[]
  redirect: string
}
