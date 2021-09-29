var express = require('express');
var app = express();
var mongoose = require('mongoose');
const CONNECTION_URL = "mongodb://localhost:27017/chat";
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

io.on('connection', () => {
    console.log('a user is connected')
})

server.listen(3000, () => {
    console.log('server is running on port', server.address().port);
});


app.use(express.static(__dirname));


mongoose.connect(CONNECTION_URL, (err) => {
    console.log('mongodb connected', err);
})

var Message = mongoose.model('Message', { name: String, message: String })

app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages);
    })
})


app.post('/messages', (req, res) => {
    var message = new Message(req.body);
    message.save((err) => {
        if (err)
            sendStatus(500);
        io.emit('message', req.body);
        res.sendStatus(200);
    })
})