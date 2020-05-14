var express = require('express.io');
var app = express();

app.http().io()

var PORT = 3000

console.log("server started on port " + PORT)

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    res.render('index.ejs');
});

app.io.route('ready', function(req){
    req.io.join(req.data.chat_room);
    req.io.join(req.data.signal_room); // Added the signal room to join on ready
    app.io.room(req.data).broadcast('announce', {
        message: 'New client in the ' + req.data + ' room. '
    })
})

app.io.route('send', function(req){
    app.io.room(req.data.room).broadcast('startmessage', {
        author: req.data.author,
        message: req.data.message
    })
})

// Added the route for Signaling with req.io.room in order to avoid display own message
app.io.route('signal', function(req){
    req.io.room(req.data.room).broadcast('signaling-message', {
        type: req.data.type,
        message: req.data.message
    })
})


app.listen(PORT);