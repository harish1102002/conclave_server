const  exp = require("express");
const app = exp();
const cors= require("cors");
const http=require('http').createServer(app);
const {Server}=require('socket.io');
const m = require('mongodb').MongoClient;

let post=[]
let col=null
app.use(exp.json())
app.use(cors())

m.connect("mongodb+srv://harish:harish7@cluster0.ffgjypz.mongodb.net/Kuruk").then((c)=>
col=c.db().collection("conclave")).then(()=>{
    col.find().forEach(e => post.push(e));});

const io = new Server(http,{
    cors:{
        origin:"*",
        credentials: true
    },
})

io.on("connection",(soc)=>{
    soc.on("send",(data)=>{
        col.insertOne(data);
        post.push(data);
        io.emit("receive",data);
    })
})

app.get('/',(req,res)=>res.json(post))
http.listen(process.env.PORT||8000)