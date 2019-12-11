import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Redirect } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Typography from '@material-ui/core/Typography';
import {Link } from 'react-router-dom'
import { pink } from '@material-ui/core/colors';
import Avatar from '@material-ui/core/Avatar';

import PageviewIcon from '@material-ui/icons/Pageview';
import { grey } from '@material-ui/core/colors';
import { Input } from '@material-ui/core';




const useStyles=makeStyles(theme =>({

    root:{
      marginTop : theme.spacing(5),
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
    },
    chat:{
        borderBottom: "1px solid rgb(212, 212, 212)" ,
        //Can add styles to chat if want to afterwards  
    },
    pink: {
      color: '#fff',
      backgroundColor: pink[500],
    },
  }
  ))



export default function FriendList(props){

  // console.log("name = "+props.location.state.name) 

    const classes = useStyles();

    const [users, setChatUsers] = useState(null);

    async function fetchFriends() {
      console.log("calling fetchFriends")
      console.log(props.location.state.name)
      fetch('http://localhost:3000/Cars/cars/'+props.location.state.name, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // body: JSON.stringify({ post: this.state.post }),
      }).then(response => response.json())
      .then(data=>{
        console.log("fetch called"+JSON.stringify(data))
        setChatUsers(data)
      })
    }
    console.log("called fetchFriends")
    //Later, take it to a separate module.
    const getDate = (dateInMillis)=>{
      var date = new Date(parseInt(dateInMillis));
      // var month = ["January", "February", "March", "April", "May", "June",
      // "July", "August", "September", "October", "November", "December"
      // ][mydate.getMonth()];
      // var day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][mydate.getDay()];
      // var hrs = mydate.getHours()
      // var mins = mydate.getMinutes()
      // var fullYear  = mydate.getFullYear()
      // console.log(mydate)
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0'+minutes : minutes;
      var strTime = hours + ':' + minutes + ' ' + ampm;
      console.log("Get date is beingcalled")
      console.log("type of datemillis = "+typeof(dateInMillis))

      return date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear()+"\t\t\t\t\t\t"+strTime

    }
    useEffect(() => {fetchFriends()},[])
    console.log("date = "+Date.now()) 

    //users will be rendered in 2nd render, so first render need to be handled explicitly for users doesnt exist and users exist cases.
    if(users!=null){
      if(users.length==0){
      return  <div><Avatar className={classes.pink}>
              <PageviewIcon />
              </Avatar>
              <h2>Oops! No Old Chats Found</h2>
              </div>
    }
  }
    var chatList = ''
    if(users!=null)
    {chatList = users.map(user =>{
        return  <ListItem alignItems="flex-start" button={true} divider={true} className = {classes.chat} component = {Link} to={{
            pathname:'/home/chat', state: { to: user.friendId, name: user.name}}}>
        {/* <ListItemAvatar>
        <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
        </ListItemAvatar> */}
        <ListItemText
        primary={user.friendId}
        secondary={
        <React.Fragment>
             <Typography
            component="span"
            variant="body2"
            className={classes.inline}
            color="textPrimary"
          >         
            <div   style={{ whiteSpace: 'pre-wrap' ,color : "grey"}}>Last message at: {getDate(user.msgs[user.msgs.length-1].time)}</div>
          </Typography>
          <div>{user.msgs[user.msgs.length-1].from+":"+user.msgs[user.msgs.length-1].message}</div>
        </React.Fragment>
            }
        />
        </ListItem>
      })}
    return(
        <div className = {classes.root}>

          {chatList}

        </div>
    )
}