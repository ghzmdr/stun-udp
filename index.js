var dgram = require('dgram'),
    server = dgram.createSocket('udp4'),
    dns = require('dns'),
    keypress = require('keypress')

var url = 'vincentdefeo.me',
   port = 8080

var clients = []

keypress(process.stdin)

process.stdin.on('keypress', function() {
    console.log("\nGot Keypress\n", clients)

    for (var i = 0; i < clients.length; i++)
        server.send('data from netherlands', 0, clients[i].port, clients[i].addresses)
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
