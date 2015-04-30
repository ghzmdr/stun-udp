var dgram = require('dgram'),
    server = dgram.createSocket('udp4'),
    dns = require('dns'),
    keypress = require('keypress')

var url = 'vincentdefeo.me',
    port = 8080

var clients = []

keypress(process.stdin)
process.stdin.setRawMode(true)

var testBuffer = new Buffer('data from netherlands')

process.stdin.on('keypress', function(c, k) {
    if (c == 'c')
        process.stdin.pause()
    else {
        console.log("\nGot Keypress\n", clients)

        for (var i = 0; i < clients.length; i++)            
            server.send(testBuffer, 0, testBuffer.length, clients[i].port, clients[i].addresses)
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
    clients.push({'ip': r.address, 'port' : r.port})

    console.log('\n==========GOT MESSAGE==========\n' + msg + '\nFROM: ' + r.address + ':' + r.port)
    console.log('\nON: ' + Date.now())

    server.send(msg, 0, msg.length, r.port, r.address)    
})

server.on('error', function (err){
	console.log("\n[!!] ERROR: " + err);
})
