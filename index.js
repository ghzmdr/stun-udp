var dgram = require('dgram'),
    server = dgram.createSocket('udp4'),
    dns = require('dns')

dns.lookup('stun-roll.herokuapp.com', function resolved(err, addresses){
    if (err) throw err
    console.log('DNS RESOLVED: ' + addresses)
    server.bind('addresses', 8080)    
})


server.on('message', function (msg, r){
    console.log(r.address + ':' + r.port + ' -> ' + message)
})
