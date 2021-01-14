export class Route {
  static authReg = /\/__(auth|call)__$/
  static match(url: URL): boolean {
    return Route.authReg.test(url.pathname)
  }
  static isAuth(url: URL): boolean {
    return '/__auth__' == url.pathname
  }
  static isCall(url: URL): boolean {
    return '/__call__' == url.pathname
  }
}
