import React,{Component} from "react";
import openSocket from "socket.io-client";
let socket=openSocket("http://localhost:5000/");
class Message_area extends Component{
    constructor(props)
    {
        super(props);
        this.state={
            message:"",
            other_id:null,
            other_handle:null,
            match:'0',
            online_users:0,
            leave:false,
            typing:false,
        }
        this.typingeffect=this.typingeffect.bind(this);
        this.submitform=this.submitform.bind(this);
        this.message=this.message.bind(this);
        this.leave_chat=this.leave_chat.bind(this);
    }
    componentDidMount(){
        
        socket.on("user_id",(data)=>{
            console.log(data);
        });

        socket.emit("user_handle",this.props.handle);

        socket.on("match_found",data=>{
            console.log(data);
            this.setState({
                other_handle:data.receiver_handle,
                match:data.match.toString(),
                other_id:data.receiver_id
            });
        });

        socket.on("online_users", (users)=>{
           this.setState({
               online_users:users
           });
       });
            
       socket.on("received_message", data=>{
           console.log(data);
           let sss=document.getElementById("message_area");
            let para = document.createElement("P");
            let t = document.createTextNode(this.state.other_handle+":"+data); 
            para.appendChild(t);
            sss.appendChild(para);
       });

       socket.on("leave_chat", data=>{
           alert("the other guy has left");
           this.setState({
               match:"0"
           });
        socket.emit("user_handle", this.props.handle);
           
       });

       socket.on("get_typing", data=>{
        let sss=document.getElementById("message_area");
        let para = document.createElement("P");
        let t = document.createTextNode(this.state.other_handle+" is typing..."); 
        para.appendChild(t);
        sss.appendChild(para);
       })

    }

    submitform=(event)=>{
        event.preventDefault();
        socket.emit("message",{message:this.state.message, sender_id:this.state.other_id});
            let sss=document.getElementById("message_area");
            let para = document.createElement("P");
            let t = document.createTextNode("You: "+this.state.message); 
            para.appendChild(t);
            sss.appendChild(para);
            document.getElementById("mess").value="";
    }

    message=(event)=>{
        console.log(event.target.value);
        this.setState({
            message:event.target.value
        });

    }

    leave_chat=()=>{
        console.log("read");
        socket.emit("Left_chat", {receiver_id:this.state.other_id});
        this.setState({
            match:"0"
        });
        socket.emit("user_handle", this.props.handle);
    }

    typingeffect=()=>{
        socket.emit("typing", {typing:true,sender_id:this.state.other_id });
    }
    
    render(){
        let uss=(this.state.online_users)?
        (<h2>online users: {this.state.online_users}</h2>):null;
        let show_area=(this.state.match==='1')?
        (
                <div id="room_name">
                <h1>{this.props.handle}</h1>
                <div>{uss}</div>
                <div id="message_area">
                </div>
                <div>
                    <form id="form1" onSubmit={this.submitform}> 
                        <input type="text" onChange={(event)=>this.message(event)} placeholder="Write a message..." id="mess" required/>
                        <input type="submit" value="Send"/>
                    </form>
                </div>
                <button onClick={this.leave_chat}>Left</button>
                </div>
        ):(<h1>Searching for a stranger</h1>);
        return(
            <div>
                {show_area}   
            </div>
        );
    }
}
export default Message_area;