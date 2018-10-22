
require('dotenv').config()
let mtz = require('moment-timezone')
    m = require('moment')
    async = require('async')
    net = require('net')
    port  = process.env.PORT || 4400
    port2  = process.env.PORT2 || 5500
    clients = [];

//Set default TimeZone
mtz.tz.setDefault("Asia/Kolkata");
//DB 
require('./config/db.js')
//Modals
let R = require('./modal/records.schema')
let E = require('./modal/error.schema')
let D = require('./modal/data.schema')
//TCP Server
net.createServer(function(socket) {
    socket.name = socket.remoteAddress + ":" + socket.remotePort
    console.log(`Connection Details -> ${socket.name}`)
    clients.push(socket)
    
    socket.on('data', async (data) => {

        let d = data.toString().replace(/[$#\r]/g, '').split(',')
            ts = mtz().format()
        if(d.length === 5){
            let o = new R({
                clientId : d[0],
                deviceId : d[1],
                totalizedWeight : parseFloat(d[2]),
                speed : parseFloat(d[3]),
                flowRate : parseFloat(d[4]),
                date: ts.substr(0,10),
                seconds: m(ts).valueOf(),
                timestamp: ts
            })
            await o.save()
        }else{
            let o = new E({
                data: d,
                date: ts.substr(0,10),
                timestamp: ts
            })
            await o.save()
        }
    })
    socket.on('end', ()=> {
        clients.splice(clients.indexOf(socket), 1)
        console.log(`Number of Clients -> ${clients.length}`)
    })
}).listen(port,function(){
    console.log('listening on '+port)
})

//TCP Server 2 

net.createServer(function(socket) {
    socket.name = socket.remoteAddress + ":" + socket.remotePort
    console.log(`Connection Details -> ${socket.name}`)
    clients.push(socket)
    
    socket.on('data', async (data) => {

        let d = data.toString()
            ts = mtz().format()
            let o = new D({
                data: d,
                date: ts.substr(0,10),
                timestamp: ts
            })
            await o.save()
    })
    socket.on('end', ()=> {
        clients.splice(clients.indexOf(socket), 1)
        console.log(`Number of Clients -> ${clients.length}`)
    })
}).listen(port2,function(){
    console.log('listening on '+port2)
})