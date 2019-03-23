import React,{Component} from "react";
import Message from "./message";
class Handle extends Component{
    constructor(props)
    {
        super(props);
        this.state={
            handle:"",
            handle_submit:false
        };
        this.submitform=this.submitform.bind(this);
        this.handlename=this.handlename.bind(this);
    }
    submitform=(event)=>{
        event.preventDefault();
        this.setState({
            handle_submit:true
        });
    }
    handlename=(event)=>{
        this.setState({
            handle:event.target.value
        });
    }
    render(){
        let current=(!this.state.handle_submit)?
                    (
                        <div id="room_name">
                            <h1>Enter Room name</h1>
                            <div>
                                <form id="form1" onSubmit={this.submitform}> 
                                    <input type="text" onChange={(event)=>this.handlename(event)} placeholder="Enter room name here..." name="handle" id="handle" required/>
                                    <input type="submit" value="Submit"/>
                                </form>
                            </div>
                        </div>
                    ):(<Message handle={this.state.handle}/>);
        return(
            <div>
            {current}
            </div>      
        )
    }
}
export default Handle;