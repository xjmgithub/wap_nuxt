const http = require('http')
const mockserver = require('mockserver')
const server = http.createServer(mockserver('mock')).listen(9001)
server.listen('9001', function() {
    console.log('服务器启动,端口9001')
})
