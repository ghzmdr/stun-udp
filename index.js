var dgram = require('dgram'),
    server = dgram.createSocket('udp4'),
    dns = require('dns')

var url = 'vincentdefeo.me',
   port = 8080

dns.lookup(url, function resolved(err, addresses){
    if (err) throw err
    console.log('\n\tSTARTING...\n' + url + ' RESOLVED TO: ' + addresses)
    server.bind(port, addresses)
})

server.on('message', function (msg, r){
    console.log(' GOT MESSAGE: \n\t' + msg + '\nFROM: ' + r.address + ' : ' + r.port)
    server.send(msg, 0, msg.length, r.port, r.address)
})

server.on('listening', function(){
    var address = server.address()
    console.log('Listening on : ' + address.address + ':' + address.port)
})
