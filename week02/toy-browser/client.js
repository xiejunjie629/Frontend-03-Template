const net = require('net')

class ResponseParse {
  constructor() {}
  receive(string) {
    for (let i = 0; i < string.length; i++) {
      this.receiveChar(string.charAt(i))
    }
  }
  receiveChar(char) {

  }
}

class Request {
  constructor(options) {
    this.host = options.host // ip协议所指向的地址
    this.port = options.port || 80 // tcp协议依据的端口号
    // http协议所需的 请求内容
    this.method = options.method || 'GET'
    this.path = options.path || '/'
    this.body = options.body || {}
    this.headers = options.headers || {}
    if (!this.headers['Content-Type']) {
      this.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    }
    // 当Content-type 为 application/json 时， body的格式需转化为JSON
    if (this.headers['Content-Type'] === 'application/json') {
      this.bodyText = JSON.stringify(this.body)
    }
    // 当application/x-www-form-urlencoded 时，body则为 k-v格式
    if (this.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      this.bodyText = Object.keys(this.body).map(key => `${key}=${this.body[key]}`).join('&')
    }
    this.headers['Content-Length'] = this.bodyText.length
  }

  send(connection) {
    return new Promise((resolve, reject) => {
      const parse = new ResponseParse()
      if (connection) {
        connection.write(this.toString())
      } else {
        connection = net.createConnection({
          host: this.host,
          prot: this.port
        }, () => {
          connection.write(this.toString())
        })
      }
      connection.on('data', (data) => {
        console.log('😁: Request -> send -> data', data.toString())
        parse.receive(data.toString())
        if (parse.isFinished) {
          resolve(parse.response)
          connection.end()
        }
      })
      connection.on('error', (err) => {
        reject(err)
        connection.end()
      })
    })
  }

  toString() {
    return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}\r
\r
${this.bodyText}`
  }
}

void async function() {
  let request = new Request({
    method: 'POST',
    host: '127.0.0.1',
    port: '8088',
    path: '/',
    headers: {
      ['X-consum']: 'foo'
    },
    body: {
      name: 'JesseXie'
    }
  })
  let response = await request.send()
  console.log('😁: response', response)
}()

