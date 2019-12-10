import React, { useState,useEffect } from 'react'
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import io from 'socket.io-client'
import { green } from '@material-ui/core/colors';
import { getThemeProps } from '@material-ui/styles';

const useStyles=makeStyles(theme =>({

  root:{
    margin:'50px',
    padding:theme.spacing(3,2),
  },
  flex:{
    display:'flex',
    alignItem:'center'
  },
  chatBox:{
    width:'80%',
    marginTop:'500px'
  },
  button:
  {
    margin: theme.spacing(1),
    marginTop:'500px'
  },
  dot:{
    height: '10px',
  width: '10px',
  backgroundColor: 'green',
  borderRadius: '50%',
  display: 'inline-block',
  }

}
))

var socket = io(':3002')




export default function Dashboard(props){

const [initialChat, changeInitialChat] = useState('')
const [toAdd, changeToAdd] = useState([])

useEffect(() => {
  getInitialChatAndRegisterUser(props.location.state.to)
}, []);



async function getInitialChatAndRegisterUser(otherPersonId){
  var toAddUtil = []
  let msgs = ''
  let chat = ''
  let time = ''
  const response = await fetch('Cars/cars/'+props.location.state.name+'/'+otherPersonId, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  
  const data = await response.json();
  if(data.length==0){
    return;
  }
  msgs = data[0].msgs
  Array.from(msgs).forEach(function (arrayItem) {
    chat = "\n"+arrayItem.from+":"+arrayItem.message
    time = getDate(arrayItem.time)



    var newDiv = document.createElement('div');
    newDiv.setAttribute("align", "left")

    // newDiv.style.backgroundColor = "Beige"
    newDiv.innerHTML= chat
    var newSpan = document.createElement('span');
    if(props.location.state.name == arrayItem.from){
    newDiv.style.border= "1px solid blue";
    newSpan.style.backgroundColor = "LIGHTCYAN"
    }else{
      newDiv.style.border= "1px solid green";
      newSpan.style.backgroundColor = "Beige"
    }

    newSpan.innerHTML= time
    newSpan.style.textAlign = "right";
    newSpan.style.display = "block";
    newDiv.append(newSpan)
    document.getElementById('chatScreen').append(newDiv)

  });

  socket.on('client-message',  message => {
    //Replace by documentById get code finally.
  console.log("client-message received"+message.from+" "+message.msg)
  var chat = "\n"+message.from+":"+message.msg
  var time = getDate(message.time)
  console.log("socket.on(client-message) toAdd = "+toAdd)
  console.log("socket.on(client-message) initial chat = "+initialChat)


  var newDiv = document.createElement('div');
  newDiv.setAttribute("align", "left")
  newDiv.style.border= "1px solid green";
  // newDiv.style.backgroundColor = "Beige"
  newDiv.innerHTML= chat
  var newSpan = document.createElement('span');
  newSpan.style.backgroundColor = "Beige"
  newSpan.innerHTML= time
  newSpan.style.textAlign = "right";
  newSpan.style.display = "block";
  newDiv.append(newSpan)
  document.getElementById('chatScreen').append(newDiv)

  // document.getElementById('chatScreen').append(chat+'     '+'@'+'('+time+')'+"\n")


  console.log("socket.on(client-message) toAdd = "+toAdd)
  // changeInitialChat(previousState => {
  //   return JSON.stringify(previousState) + 'blah'
  // })
  })

  socket.emit('new-user', {userName:props.location.state.name})

  }

  const getDate = (dateInMillis)=>{
    var date = new Date(parseInt(dateInMillis));
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    console.log("Get date is beingcalled")

    return date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear()+", "+strTime

  }

const classes = useStyles();

let [textValue, changeTextValue] = useState('')

const userName = props.location.state.name

const handleChatSubmit = (sender, textValue, textTime)=>{
    if(textValue){
    var chat = "\n"+sender+":"+textValue
    var time = getDate(textTime)
    // toAdd.push(<div style={{textAlign:"left", whiteSpace:'pre-line'}}>{chat}<span style={{float:"right"}}>{time}</span></div>)
    // changeToAdd(previousState =>{
    //   previousState.push([<div style={{textAlign:"left", whiteSpace:'pre-line'}}>{chat}<span style={{float:"right"}}>{time}</span></div>])
    //   changeInitialChat(previousState)
    // })

    var newDiv = document.createElement('div');
    newDiv.setAttribute("align", "left")
    newDiv.style.border= "1px solid blue";
    // newDiv.style.backgroundColor = "Beige"
    newDiv.innerHTML= chat
    var newSpan = document.createElement('span');
    newSpan.style.backgroundColor = "LIGHTCYAN"
    newSpan.innerHTML= time
    newSpan.style.textAlign = "right";
    newSpan.style.display = "block";
    newDiv.append(newSpan)
    document.getElementById('chatScreen').append(newDiv)

    // document.getElementById('chatScreen').append(chat+'     '+'@'+'('+time+')'+"\n")

        }
      }

const saveChat = (sender, textValue, textTime) =>{
  if(textValue){
    fetch('Cars/cars', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name:props.location.state.name,friendId:props.location.state.to,msgs:{from :sender,message:textValue, time:textTime}
      }),
    }).then(response => response.json())
    .then(data=>{
      console.log("insert/save called for data"+data)
    })
  }
}

const submitOnSocket = (textValue, textTime)=>{
  if(textValue){
    socket.emit("send-chat-message",{from :props.location.state.name,to:props.location.state.to,message:textValue, messageTime:textTime})
  }
}


return(
    <div>
    <Paper className={classes.root}>
      <Typography variant="h4" component="h4">
      </Typography>
      <Typography variant="h6" component="h6">
      <span className={classes.dot}></span>Chat with {props.location.state.to}
      </Typography>
      <div id="chatScreen" style={{textAlign:"left", whiteSpace:'pre-line'}}>
        {initialChat}
      </div>
    <div className = {classes.flex}>
      <TextField
          id="standard-basic"
          className={classes.chatBox}
          label="Type in your message"
          margin="normal"
          value = {textValue}
          onChange = {(e) => changeTextValue(e.target.value)}
         />
       <Button variant="contained" color="primary" className={classes.button} onClick ={() => {
         const timeInMillisInteger = Date.now()
         const time = getDate(timeInMillisInteger)
         handleChatSubmit(props.location.state.name,textValue, timeInMillisInteger);
         submitOnSocket(textValue, timeInMillisInteger)
         saveChat(props.location.state.name,textValue, timeInMillisInteger.toString());
         changeTextValue('')
         }}>Send</Button>
    </div>
    </Paper>
    </div>
)
}
