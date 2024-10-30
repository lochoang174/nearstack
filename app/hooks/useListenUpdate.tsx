// import React, { useEffect } from 'react'
// import { useSocket } from '../../context/socketProvider'
// import { fetchMessageChat, setMessageList } from '../../redux/reducers/MessageReducer'
// import { useAppDispatch } from '../../redux/hooks'

// const useListenMessages = () => {
//     const {socket}=useSocket()
//     const dispatch = useAppDispatch()
//     useEffect(()=>{
//         if(socket){
//           socket.on("NewMessage",(data)=>{
//             dispatch(setMessageList(data))
//           })
//         }
//     },[socket])
//   return {}
// }

// export default useListenMessages
