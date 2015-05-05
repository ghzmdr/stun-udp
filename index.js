var dgram = require('dgram'),
    server = dgram.createSocket('udp4'),
    dns = require('dns'),
    keypress = require('keypress')

var url = 'vincentdefeo.me',
    port = 4444

var clients = []

keypress(process.stdin)
process.stdin.setRawMode(true)

process.stdin.on('keypress', function(c, k) {
    if (c == 'c' || k == 'c')
        process.exit(0)

    else if (c == '\'' || k == '\''){
        console.log("\nGot Keypress\n", clients)

        for (var i = 0; i < clients.length; i++)  
        {
            clients[i].packetsSent++
            clients[i].toggle = !clients[i].toggle

            //var msg = new Buffer(JSON.stringify(clients[i]))
            var msg = new Buffer(JSON.stringify({
                        colors: {
                            left: "#FF0000",
                            right: "#2B2B2B"
                        },
                        toggle: false
                    }))
            server.send(msg, 0, msg.length, clients[i].port, clients[i].address)    
            console.log("SENDING TO: ", clients[i].address + ' ' + clients[i].port)
        }
    }

    else if (c == '1' || k == '1')
    {
        console.log(clients)
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
    var toAdd = true, index;

    for (var i = 0; i < clients.length; i++) {
        toAdd = !(r.port == clients[i].port && r.address == clients[i].address)
        if (!toAdd) index = i
    }

    if (toAdd) {
        var clientInfo = {
            'address': r.address,
            'port': r.port,
            'lastSeen': Date.now(),
            'packetsSent': 1,
            'toggle': true
        }

        clients.push(clientInfo)
    } else {
        clients[index].lastSeen = Date.now()
        clients[index].packetsSent++;
    }

    console.log('\n========== GOT PACKET ==========')
    console.log('FROM: ' + r.address + ':' + r.port )
    console.log(''+ (toAdd ? 'UN' : '') + 'KNOWN CLIENT')
    console.log('ON: ' + Date.now())
    console.log('\n===PAYLOAD:\n' + msg)

    //var resp = new Buffer(JSON.stringify(clientInfo || clients[index]) + '\n\n')
    var resp = new Buffer(JSON.stringify({
        colors: {
            left: "#FAFAFA",
            right: "#2B2B2B"
        },
        toggle: false
    }))

    server.send(resp, 0, resp.length, r.port, r.address)    
})

server.on('error', function (err){
	console.log("\n[!!] ERROR: " + err);
})
