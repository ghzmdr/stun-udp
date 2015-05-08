var dgram = require('dgram'),
    server = dgram.createSocket('udp4'),
    dns = require('dns'),
    keypress = require('keypress')

var url = 'vincentdefeo.me',
    port = 4444

var clients = []

var RIGHT_HUE = 200, LEFT_HUE = 100

var sendInterval = false;


keypress(process.stdin)
process.stdin.setRawMode(true)

process.stdin.on('keypress', function(c, k) {
    if (c == 'q' || k == 'q')
        process.exit(0)

    else if (c == 's' || k == 's') {
        sendPackets()        
    }

    else if (c == 'r' || k == 'r') {
        sendPackets(true)        
    }

    else if (c == 'l' || k == 'l') {
        console.log("\n\n==== CLIENTS ====\n\n", clients)
    }

    else if (c == '0' || k == '0') {
        if (!sendInterval) 
            sendInterval = setInterval(sendPackets, 1000)        
    }

    else if (c == '9' || k == '9') {
        if (sendInterval){
            clearInterval(sendInterval)
            sendInterval = false
        }
    }
})

function sendPackets(random, singleHost) {
    console.log("\nSENDING " + (random ? "RADOMIZED " : "") + "PACKETS TO " + (singleHost ? "1 CLIENT" : clients.length + " CLIENTS"))

    var msg = craftPacket(random)

    if (singleHost){
        if (singleHost.packetsSent)
            singleHost.packetsSent++

        server.send(msg, 0, msg.length, singleHost.port, singleHost.address)
    }

    else for (var i = 0; i < clients.length; i++) {
        clients[i].packetsSent++
        clients[i].toggle = !clients[i].toggle                

        server.send(msg, 0, msg.length, clients[i].port, clients[i].address)  
    }
}

function craftPacket(random) {
    rCol = random ? Math.floor(Math.random()*360 +1) : RIGHT_HUE
    lCol = random ? Math.floor(Math.random()*360 +1) : LEFT_HUE

    var payloadObj = {
            hue: {
                right: rCol,
                left: lCol
            },  
            saturation: 100,
            lightness: 50
        }

    return new Buffer(JSON.stringify(payloadObj))
}

function printUsage() {
    console.log('\n\n====== USAGE =====\n')
    console.log("\tQ\t--\tQuit (also deletes clients cache)")
    console.log("\tR\t--\tSend packet with randomized hues")
    console.log("\tS\t--\tSend packet standard hues (R: 100, L:200)")
    console.log("\tL\t--\tDisplay known clients")
    console.log("\t0\t--\tStart sending packets every 1000ms")
    console.log("\t9\t--\tStop sending packets every 1000ms")
}

dns.lookup(url, function resolved(err, addresses){
    if (err) throw err
    console.log('\nSTARTING...\n' + url + ' RESOLVED TO: ' + addresses)
    server.bind(port, addresses)
    printUsage()
})

server.on('listening', function(){
    var address = server.address()
    console.log('\n\nListening on : ' + address.address + ':' + address.port)    
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

    sendPackets(false, {port: r.port, address: r.address})
})

server.on('error', function (err){
	console.log("\n[!!] ERROR: " + err);
})
