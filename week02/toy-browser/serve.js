const http = require('http')

http.createServer(function(request, response) {
  let body =[]
  request.on('error', (error) => {
    console.error('😁: error', error)
  }).on('data', (chunk) => {
    body.push(chunk.toString())
    console.log(chunk)
  }).on('end', () => {
    body = Buffer.concat(body).toString()
    console.log('😁: body', body)
    response.writeHead(200, {'Content-Type': 'text/html'})
    response.end('hello world\n')
  })
}).listen(8088)

// 终端打印如下信息
console.log('Server running at http://127.0.0.1:8088/');