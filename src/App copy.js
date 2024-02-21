import React, { useEffect, useState } from 'react';
import './App.css';
import useAsyncStorage from './hooks/useAsyncStorage';
import useSocket from './hooks/useSocket';
import useAxios from './hooks/useAxios';
import io from 'socket.io-client';


const URL = process.env.REACT_APP_SOCKET;
const LIMIT_TIMEOUT = process.env.REACT_APP_LIMIT_TIMEOUT || 5000; // Establece un límite de tiempo para la 
let getInit;
let socket  = false;

socket = io(URL, {
  transports: ['websocket'],
  withCredentials: true,
  reconnection: true,
}); 

function App() {
  const [admin__,setAdmin__]            =   useState(false);
  const user__                          =   useAsyncStorage("user");
  const axios                           =   useAxios();
  const [loadingAll, setLoadingAll]     =   useState(true); // Estado para controlar si se está cargando todo el contenido
  const userStorage                     =   useAsyncStorage("user");
  const [user, setUser]                 =   useState(user__&&user__.data); 
  const [open, setOpen]                 =   useState(false);
  const [message, setMessage]           =   useState('');
  const [chatRecords, setChatRecords]   =   useState([
    /*{ user: 'yo', message: 'HOLA' },
    { user: 'yo', message: 'QUE MAS' },
    { user: 'el', message: 'hola bien' },
    { user: 'el', message: 'en qué te podemos servir?' },
    { user: 'el', message: 'eres nuevo' },
    { user: 'yo', message: 'Si por favor ayuda' },
    { user: 'yo', message: 'Cuánto cuetas' },*/
  ]);


  useEffect(()=>{
    setOpen(user__?true:false)
  },[])

  getInit=async()=>{
    axios.getData({},"api/v1/dashboard/comments/chat_me").then((response)=>{
      if (response&&response.data) {
        //console.log(response.data)
        setChatRecords(response.data)
      }
    })
  }

  useEffect(()=>{
    getInit()
  },[])

  

  const handleOpen = async () => {
    await axios.postData({},"api/v1/auth/client").then((response)=>{
      if (  response  &&
        response.data &&
        response.code &&
        response.code==="SUCCESS"
      ) {
        //setUser()
        const setStorageAndState  =  {
          access_token:response.data.access_token,
          ...response.data.user,
        };
        userStorage.setData(setStorageAndState).then(resp=>{
          
          //console.log(resp)
        })
      }
    }) 
    //setOpen((open) => !open);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = () => {
    
    if (message.trim() !== '') {
      socket.emit("send-private-message",{message:message,recipientId:1})
      setChatRecords((prevChatRecords) => [
        { user: 'yo', message },
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
    
    console.log(admin__)

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

  
  useEffect(() => {
    
    /* Verifico el estado del almacenamiento si el usuario está logueado */
    if (!user && userStorage.data) {
      setUser(userStorage.data);
      /*vamor a buscar si tiene privilegios de Sadmin*/
      const Sadmin  = userStorage.data.roles.find(search=>search==='Super Admin');
      socket.emit("user-connected",{access_token:userStorage.data.access_token,...userStorage.data,admin:Sadmin?true:false})

      

      const onSetAdmin =  (data)=>{
        console.log(500)
        setAdmin__(data)      
      }
  
      socket.on("setAdmin", onSetAdmin);
      
      return () => {
        socket.off('setAdmin', onSetAdmin);
        socket.disconnect();
      };

    }
    /* Establecer un temporizador para cambiar el estado de loadingAll a false después de cierto tiempo */
    setTimeout(() => setLoadingAll(false), LIMIT_TIMEOUT);
  }, [user, userStorage]);


  
  
  

  return (
    <div className="App">
      {
        open&&(
          <div className="position-relative">
            <div className="chat-content-main">
              <div className="chat-content">
                <div className="header">Bienvenido</div>
                <div className="body">{chatElements}</div>
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
        <img
          title="Habla con nosotros"
          src={
            'https://upload.wikimedia.org/wikipedia/commons/e/e2/Echo_chat_icon.svg'
          }
          className="App-logo"
          alt="logo"
        />
      </div>
    </div>
  );
}

export default App;
