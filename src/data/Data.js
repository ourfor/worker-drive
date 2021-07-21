export class Data {
  constructor(state, env) {}

  async fetch(request) {
    let ip = request.headers.get('CF-Connecting-IP')
    let data = await request.text()
    let storagePromise = this.storage.put(ip, data)
    await storagePromise
    return new Response(ip + ' stored ' + data)
  }
}
