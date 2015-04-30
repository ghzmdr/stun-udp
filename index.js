var dgram = require('dgram'),
    server = dgram.createSocket('udp4'),
    dns = require('dns'),
    keypress = require('keypress')

var url = '127.0.0.1',
    port = 8080

var clients = []

keypress(process.stdin)
process.stdin.setRawMode(true)

process.stdin.on('keypress', function(c, k) {
    if (c == 'c')
        process.stdin.pause()
    else {
        console.log("\nGot Keypress\n", clients)

        for (var i = 0; i < clients.length; i++)  
        {
            var msg = new Buffer(JSON.stringify(clients[i]))
            server.send(msg, 0, msg.length, clients[i].port, clients[i].addresses)
            clients[i].packetsSent++;
        }
    }
})

dns.lookup(url, function resolved(err, addresses){
    if (err) throw err
    console.log('\nSTARTING...\n' + url + ' RESOLVED TO: ' + addresses)
    server.bind(port, addresses)
})

server.on('listening', function(){
    var address = server.address()
    console.log('Listening on : ' + address.address + ':' + address.port)
})

server.on('message', function (msg, r){
    var clientInfo = {
        'address': r.address,
        'port': r.port,
        'lastSeen': Date.now(),
        'packetsSent': 0
    }

    clients.push(clientInfo)

    console.log('\n==========GOT MESSAGE==========\n' + msg + '\nFROM: ' + r.address + ':' + r.port)
    console.log('\nON: ' + Date.now())

    var resp = new Buffer(JSON.stringify(clientInfo))
    server.send(resp, 0, resp.length, r.port, r.address)    
})

server.on('error', function (err){
	console.log("\n[!!] ERROR: " + err);
})
