import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const URL = process.env.REACT_APP_SOCKET;

const useSocket = (props) => {

  const [admin, setAdmin]               =   useState(false);
  const [isConnected, setIsConnected]   =   useState(false);
  const socketRef = useRef(null);

  const onSendMessage = (message) => {
    socketRef.current.emit("send-private-message", {
      recipientId:admin,
      message:message,
    });
  };

  const onSendMessageNotAdmin = (user_id , message) => {
    socketRef.current.emit("send-private-message-not-admin", {
      user_id:user_id,
      message:message,
    });
  };
  
  useEffect(() => {
    // Crear una instancia de socket y configurarla
    socketRef.current = io(URL, {
      transports: ['websocket'],
      withCredentials: true
    });

    const onMessage = (message) => {
      //dispatchEvent(message)      
    };

    const onAdmin = (data) => {
      // Manejar el evento setAdmin si es necesario
      setAdmin(data); // Establecer admin en true cuando se recibe el evento
    };

    const onConnect = () => {
      setIsConnected(true);
      socketRef.current.emit("get-admin", {});
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    // Agregar oyentes de eventos
    socketRef.current.on("message", onMessage);
    socketRef.current.on("setAdmin", onAdmin);
    socketRef.current.on("connect", onConnect);
    socketRef.current.on("disconnect", onDisconnect);

    return () => {
      // Eliminar oyentes de eventos y desconectar el socket
      socketRef.current.off('message', onMessage);
      socketRef.current.off('setAdmin', onAdmin);
      socketRef.current.off("connect", onConnect);
      socketRef.current.off("disconnect", onDisconnect);
      socketRef.current.disconnect();
    };
  }, [URL]);

  return { socket: socketRef.current, admin, isConnected, onSendMessage, onSendMessageNotAdmin};
  
};

export default useSocket;
