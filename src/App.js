import React, { useEffect, useState } from 'react';
import './App.css';
import useAsyncStorage from './hooks/useAsyncStorage';
import useAxios from './hooks/useAxios';
import io from 'socket.io-client';

const URL = process.env.REACT_APP_SOCKET;
let getInit;
let socket  = false;

socket = io(URL, {
  transports: ['websocket'],
  withCredentials: true,
  reconnection: true,
});

let userId_=0

function App() {
  const messagesContainerRef            =   React.useRef(null);
  const [admin__,setAdmin__]            =   useState(false);
  const user__                          =   useAsyncStorage("user");
  const axios                           =   useAxios();
  const [user, setUser]                 =   useState(); 
  const [open, setOpen]                 =   useState(false);
  const [message, setMessage]           =   useState('');
  const [chatRecords, setChatRecords]   =   useState([]);


  const onMessage = ({message,userId}) => {          
    if(parseInt(userId)===parseInt(userId_.id)){
      setChatRecords((prevMessages) => [message,...prevMessages]);
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight+1000;
        setTimeout(() => {        
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
          }, 500);
      }        
    }      
  };

  // Registro del evento message-user en el socket
  useEffect(() => {
    socket.on("message-user", onMessage);
    return () => {
      socket.off("message-user", onMessage);
    };
  }, []); // Solo se ejecuta una vez al montar el componente

  useEffect(()=>{
   
    const searchUser=async()=>{

      await user__.getDataFromStorage("user").then(response=>{

        if (!response) {

          return preinit().then(response=>{
            searchUser()
          })
          
        }

        userId_ = response
        setUser(response);
        getInit();

        const Sadmin  = response.roles.find(search=>search==='Super Admin');
        socket.emit("user-connected",{access_token:response.access_token,...response,admin:Sadmin?true:false})

        const onSetAdmin =  (data)=>{
          setAdmin__(data)      
        }

        socket.on("setAdmin", onSetAdmin);

         
        
        //socket.on("message-user", onMessage);
        
        return () => {
          socket.off('setAdmin', onSetAdmin);
          
        };
        
      })

      setOpen(user__&&user__.id?true:false)

    }


    const preinit=async()=>{
      await axios.postData({},"api/v1/auth/client").then((response)=>{
        if (  response  &&
          response.data &&
          response.code &&
          response.code==="SUCCESS"
        ) {

          const setStorageAndState  =  {
            access_token:response.data.access_token,
            ...response.data.user,
          };  
          setUser(response.data.user);
          user__.setData(setStorageAndState).then(resp=>{
          
            //console.log(resp)
          })      
        }
      }) 
      
    }
    searchUser()
    //preinit()

  },[])

  getInit=async()=>{
    axios.getData({},"api/v1/dashboard/comments/chat_me").then((response)=>{
      if (response&&response.data) {
        //console.log(response.data)
        setChatRecords(response.data)
      }
    })
  }

  
  const handleOpen = async () => {
    if (open) {
      setOpen(false)
    }else{
      //searchUser()
      setOpen(true)
    }
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = () => {
    
    if (message.trim() !== '') {
      socket.emit("send-private-message",{message:message,recipientId:admin__})
      setChatRecords((prevChatRecords) => [
        {
          "id": 160,
          "mensaje": message,
          "visible": 1,
          "new": 1,
          "user_id": 1,
          "created_at": "2024-02-20T05:17:22.000000Z",
          "updated_at": "2024-02-20T05:17:22.000000Z",
          "fecha": "20/02/2024 05:17",
          "autor": {
            "id": user.id,
            "name": "Jorge",
            "surname": "Méndez",
            "email": "admin@programandoweb.net",
            "avatar_fullurl": "https://calive-back.hostingcolombiano.cloud/images/uploads/fakes/avatar.webp"
          },
          "replys": []
        },        
        ...prevChatRecords,
      ]);
      setMessage('');
      onSubmit()
    }
  };

  const onSubmit = async ()=>{

    let inputs           =   {
      mensaje:message
    }

    let currentDate     = new Date();
    let formattedDate   = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
    

    //playNotificationSound();
    let message_new = {
        mensaje: inputs.mensaje,
        fecha: formattedDate,
        autor: "Visitante",
        user_id: "el"
    }
    
    let messages_ = [...chatRecords]
        messages_.push(message_new)
    
    socket.emit("send-private-message",{message:message_new,recipientId:admin__})    

    await axios.postData({...message_new},"api/v1/dashboard/comments/send");    
    
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  const chatElements = chatRecords.map((record, index) => (
    <div key={index} className={((parseInt(user.id)===parseInt(record&&record.autor&&record.autor.id))||!record.autor)?"yo":"el"}>
      {record.mensaje}
    </div>
  ));

  
  
  return (
    <div className="App">
      {
        open&&(
          <div className="position-relative">
            <div className="chat-content-main">
              <div className="chat-content">
                <div className="header">
                  <div className='contenedor'>
                    <div className='div-izquierdo'>
                      <img src={"https://www.diablillas.com/wp-content/uploads/2024/02/logo.png"} alt="programandoweb" title="desarrollador programandoweb" />
                    </div>
                    <div className='div-derecho'>
                      Bienvenid@ a diablillas.com
                      <br/>Llamadas: 3152568630
                    </div>
                  </div>                  
                </div>
                <div className="body" ref={messagesContainerRef}>{chatElements}</div>
                <div className="footer">
                  <textarea
                    value={message}
                    onChange={handleMessageChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Escribe un mensaje..."
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        )
      }
      <div onClick={handleOpen}>
        <div className='content-logo'>
          <img
            title="Habla con nosotros"
            src={'https://www.diablillas.com/wp-content/uploads/2024/02/chat.png'}
            className="App-logo ico"
            alt="logo"
          />
        </div>
      </div>
    </div>
  );
}

export default App;
