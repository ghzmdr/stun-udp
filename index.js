var dgram = require('dgram'),
    server = dgram.createSocket('udp4'),
    dns = require('dns')

//var url = 'vincentdefeo.me',
//    port = 8080

/*dns.lookup(url, function resolved(err, addresses){
    if (err) throw err
    console.log(url + ' RESOLVED TO: ' + addresses)
})*/

server.bind('178.62.219.22', 38359)

server.on('message', function (msg, r){
    console.log(r.address + ':' + r.port + ' -> ' + message)
})

server.on('listening', function(){
    var address = server.address()
    console.log('Listening on : ' + address.address + ':' + address.port)
})
