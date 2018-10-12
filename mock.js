let http = require('http')
let mockserver = require('mockserver')
var server = http.createServer(mockserver('mock')).listen(9001)
server.listen('9001',function(){
    console.log('服务器启动')
})
 