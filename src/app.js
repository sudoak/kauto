require("dotenv").config();

const express = require("express");
let bodyParser = require("body-parser");
let mtz = require("moment-timezone");

m = require("moment");
async = require("async");
net = require("net");
port = process.env.PORT || 4400;
// port2 = process.env.PORT2 || 5500;

clients = [];

const regex = /[^a-zA-Z0-9]/g;
//Set default TimeZone
mtz.tz.setDefault("Asia/Kolkata");
//DB
require("./config/db.js");
//Modals
let R = require("./modal/records.schema");
let E = require("./modal/error.schema");
let D = require("./modal/data.schema");
//TCP Server
net
  .createServer(function(socket) {
    socket.name = socket.remoteAddress + ":" + socket.remotePort;
    console.log(`Connection Details -> ${socket.name}`);
    clients.push(socket);

    socket.on("data", async data => {
      let d = data
        .toString()
        .replace(/[$#\r]/g, "")
        .split(",");
      ts = mtz().format();
      const sanitizeArray = d.filter(item => {
        const res = item.search(regex);
        if (res >= 0) {
          return item;
        }
      });
      if (d.length === 5 && sanitizeArray.length > 0) {
        let o = new R({
          clientId: d[0],
          deviceId: d[1],
          totalizedWeight: parseFloat(d[2]),
          speed: parseFloat(d[3]),
          flowRate: parseFloat(d[4]),
          date: ts.substr(0, 10),
          seconds: m(mtz().add(330, "m")).valueOf(),
          timestamp: ts
        });
        await o.save();
      } else {
        let o = new E({
          data: d,
          date: ts.substr(0, 10),
          timestamp: ts
        });
        await o.save();
      }
    });
    socket.on("end", () => {
      clients.splice(clients.indexOf(socket), 1);
      console.log(`Number of Clients -> ${clients.length}`);
    });
  })
  .listen(port, function() {
    console.log("listening on " + port);
  });

//TCP Server 2

// net.createServer(function(socket) {
//     socket.name = socket.remoteAddress + ":" + socket.remotePort
//     console.log(`Connection Details -> ${socket.name}`)
//     clients.push(socket)

//     socket.on('data', async (data) => {

//         let d = data.toString()
//             ts = mtz().format()
//             let o = new D({
//                 data: d,
//                 date: ts.substr(0,10),
//                 timestamp: ts
//             })
//             await o.save()
//     })
//     socket.on('end', ()=> {
//         clients.splice(clients.indexOf(socket), 1)
//         console.log(`Number of Clients -> ${clients.length}`)
//     })
// }).listen(port2,function(){
//     console.log('listening on '+port2)
// })

// Express js Server

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get("/", (req, res) => res.send("Hello World!"));

app.get("/sample", (req, res) => {
  res.status(200).json({ data: { a: "A" } });
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
