var app = require('express')();
var http = require('http').createServer(app);

var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/static/html/index.html');
});

app.get('/xiaohei', function(req, res){
  res.sendFile(__dirname + '/static/html/xiaohei.html');
});

app.get('/ali', function(req, res){
  res.sendFile(__dirname + '/static/html/ali.html');
});

app.get('/lin', function(req, res){
  res.sendFile(__dirname + '/static/html/lin.html');
});

app.get('/cangya', function(req, res){
  res.sendFile(__dirname + '/static/html/cangya.html');
});




io.on('connection', function(socket){
    // 此处的socket是当前某个浏览器与服务器的连接对象


    // 当新用户进来时，向所有人广播此人的id
    io.sockets.emit('addUser',{
        id: socket.id,
        content:"新用户加入"
    })

    // 当新用户进来时，向除了自己之外的所有人广播此人的id
    // socket.broadcast.emit('addUser',{
    //     id: socket.id,
    //     content:"新用户加入"
    // });


    // 向某个用户发送消息
    socket.on('send_to', function(data){
        console.log(data)
        // data = {
        //   from: "发送者id",
        //   to: "收到者id",
        //   content: "xxx"
        // }

        data.from = socket.id

        socket.to(data.to).emit('sendClent', data)
    })

    // 接受来自客户端的数据
    socket.on('chat message', function(msg){
        console.log('message: ' + msg);

        // 将接受到的信息发送给所有人
        io.emit('chat message', msg);


        // 给客户端发送数据
        socket.emit("news", {
            msg: "我是机器人"
        })
    });


    // 添加房间
    socket.on('addRoom', function(data){
        console.log(data)
        socket.join(data.room)
    })

    // 给房间发送消息
    socket.on("sendMsgRoom", function(data){
        console.log(data)
        socket.to(data.room).emit("qunliao", data)
    })
});

// 创建一个chat的命名空间
var chat = io.of('/chat').on('connection', function(socket){

    socket.on("chat message", function(msg){
      console.log(msg)

      // 给客户端发送数据
      chat.emit("chat", {
          msg: msg
      })
    })
})


var test_conn = io.of('/test_conn').on('connection', function(socket){

    socket.on("test message", function(msg){
      console.log(msg)

      // 给客户端发送数据
      test_conn.emit("test", {
          msg: msg
      })
    })
})

http.listen(3000, function(){
    console.log('listening on *:3000');
});