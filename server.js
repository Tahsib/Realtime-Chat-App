var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
require('dotenv').config()
var mongoose = require('mongoose')

function change_word(word){
    var filter1 = process.env.FILTER1
    filter1 = filter1.split(',')
    console.log(filter1)
    var lower_word = word.toLowerCase()
    console.log(lower_word)
    var j;
    for(j=0;j<filter1.length;j++){
        if ( lower_word == filter1[j]){
            var i,word1;
            word1=word.charAt(0)
            for(i=1;i<word.length-1;i++){
                word1 = word1.concat("*")
            }
            word1 = word1.concat(word.charAt(word.length-1))
            return word1
        }
    }
    
    return word
    
}

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

mongoose.Promise = Promise

var dbUrl='mongodb://' + process.env.USER + ':' + process.env.PASS + '@ds239648.mlab.com:39648/chat-app'

var Message = mongoose.model('Message',{
    name: String,
    message: String
})


app.get('/messages',(req,res)=>{
    Message.find({},(err,messages)=>{
        res.send(messages)
    })
})
app.get('/messages/:user',(req,res)=>{
    var user = req.params.user
    Message.find({name:user},(err,messages)=>{
        res.send(messages)
    })
})

app.post("/messages",(req,res)=>{
    var message = new Message(req.body)
    
    //changing bad words
    var msg = message.message
    var splited_msg = msg.split(" ");
    var changed_splited_msg = splited_msg.map(change_word);
    var changed_msg = changed_splited_msg.toString();
    changed_msg = changed_msg.replace(/,/g,' ')
    
    message.message = changed_msg;
    message.save()
    .then(()=>{
        console.log("Message Saved")
        io.emit('message',req.body)
        res.sendStatus(200);
    })
    .catch((err) => {
        res.sendStatus(500)
        return console.error(err)
    })
})

    
io.on('connection', (socket)=>{
    console.log("User connected")
})

mongoose.connect(dbUrl,{useNewUrlParser: true,useUnifiedTopology: true},(err)=>{
    console.log("MongoDB connected, Error: "+err)
})

var server = http.listen(3000,()=>{
    console.log("Server is listening on port", server.address().port)
})