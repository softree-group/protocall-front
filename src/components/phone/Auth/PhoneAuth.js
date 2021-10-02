import {useState} from "react"
import {inputChangeHandler} from "../../../utils";
import "./PhoneAuth.css";
import {UA, WebSocketInterface} from "jssip";

function PhoneAuth() {
   const [data, setData] = useState({});

   const socket = new WebSocketInterface("wss://pbx.softex-team.ru:10089/ws")

   const submit = (e) => {
       e.preventDefault()
       console.log("Submit!", data)

       const configuration = {
           sockets: [socket],
           uri: `sip:${data["username"]}@pbx.softex-team.ru`,
           password: data["password"]
       };

       const ua = new UA(configuration)

       ua.start();

       const eventHandlers = {
           'progress': function(e) {
               console.log('call is in progress');
           },
           'failed': function(e) {
               console.log('call failed with cause: '+ e.data.cause);
           },
           'ended': function(e) {
               console.log('call ended with cause: '+ e.data.cause);
           },
           'confirmed': function(e) {
               console.log('call confirmed');
           },
           'addstream': e => {
               console.log("ADD STREAM", e.stream)

           }
       };

       const options = {
           'eventHandlers': eventHandlers,
           'mediaConstraints': {'audio': true, 'video': false},
       };

       ua.on("registrationFailed", e => {
           console.log("registrationFailed")
       })

       ua.on("registered", e => {
           console.log("registered")

           const session = ua.call("000", options)
       })
   }

   return (
       <div className="phone-auth-form">
           <div className="auth-title">SoftexPhone</div>
           <form onSubmit={ e => submit(e)}>
               <div className="field">
                   <div className="field-name">Username</div>
                   <input type="text" name="username" onChange={e => inputChangeHandler(e, setData)} required={true}/>
               </div>
               <div className="field">
                   <div className="field-name">Password</div>
                   <input type="password" name="password" onChange={e => inputChangeHandler(e, setData)} required={true}/>
               </div>
               <input type="submit" value="Connect"/>
           </form>
           <audio id="remoteAudio"/>
       </div>
   )
}

export default PhoneAuth;
