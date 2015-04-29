var dgram = require('dgram'),
    server = dgram.createSocket('udp4'),
    dns = require('dns')

var url = 'vincentdefeo.me',
   port = 8080

dns.lookup(url, function resolved(err, addresses){
    if (err) throw err
    console.log(url + ' RESOLVED TO: ' + addresses)
    server.bind(38359, addresses)
})


server.on('message', function (msg, r){
    console.log(r.address + ':' + r.port + ' -> ' + msg)
})

server.on('listening', function(){
    var address = server.address()
    console.log('Listening on : ' + address.address + ':' + address.port)
})
