export class Config {
  static readonly client: string = 'd65c9d3f-7883-4ad6-8282-17213268063b'
  static readonly secret: string = 'AQ-3j_~rvHDmPOZHUK06xx-Kh5As3M9_U0'
  static readonly scope: string[] = ['files.readwrite', 'offline_access']
  static readonly redirect: string = 'https://api.tellkeep.ml/__call__'
  static readonly grantType: string = 'authorization_code'
  static readonly corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
    'Access-Control-Max-Age': '86400',
  }
}
