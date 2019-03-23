const express= require("express");
const app= express();
const http= require("http");
const server= http.Server(app);
const io= require("socket.io")(server);

app.get("/",(req,res)=>{
  res.json([{
    message:"success"
  }])
})
let sender_users=[];
let receiver_user=[];
let count = 0;
let cc=0;
io.of("/").on("connection", (socket)=>{

  socket.emit("user_id",socket.id);
  count=count+1;
  console.log(count);
  socket.on("user_handle", (handle)=>{
      let new_user={
          user_id:socket.id,
          handle:handle
      };
      cc=cc+1;
      console.log(cc);
      io.emit("online_users", count);
      if(cc %2===1)
      {
        sender_users.push(new_user);
        let find_match=setInterval(()=>{
          if(receiver_user.length!==0)
          {
            io.to(receiver_user[0].user_id).emit("match_found",{match:"1",receiver_id:sender_users[0].user_id , receiver_handle:sender_users[0].handle});
            socket.emit("match_found",{match:"1", receiver_id:receiver_user[0].user_id, receiver_handle:receiver_user[0].handle});
            receiver_user.splice(0,1);
            sender_users.splice(0,1);
            console.log("found");
            clearInterval(find_match);
          }
        },2);
      }
      else
      {
        receiver_user.push(new_user);
      }  
    });
    
    socket.on("typing", data=>{
      socket.to(data.sender_id).emit("get_typing",data.typing);
    })

    socket.on("Left_chat", data=>{
      console.log("leave");
      socket.to(data.receiver_id).emit("leave_chat",true);
    })

    socket.on("message",(data)=>{ 
      io.to(data.sender_id).emit("received_message", data.message);
    });
    
     

     socket.on("disconnect",()=>{
       count=count-1;
       cc=cc-1;
       console.log("user left", count);
       io.emit("online_users", count);
      });
});

let port= process.env.port||5000;
server.listen(port, ()=>{
    console.log("app started");
})
