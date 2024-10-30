import React, { createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({ socket: null,online:[] });
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket phải được sử dụng trong SocketProvider");
  }
  return context;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [online,setOnline]= useState<string[]>([])
  useEffect(() => {
   
      const newSocket = io("http://localhost:3000", {
      });
      setSocket(newSocket);
    //   newSocket.on('getUserOnline',(data)=>{
    //     setOnline(data)
    //   });

      return () => {
        newSocket.close();
      };
    
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
