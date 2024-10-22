import { useEffect } from "react"
import Chat from "./components/chat/Chat"
import Detail from "./components/detail/detail"
import List from "./components/list/list"
import Login from "./components/login/login"
import Notifications from "./components/notifications/Notifications"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./lib/firebase"
import { useUserStore } from "./lib/userStore"
import { useChatStore } from "./lib/chatStore"

const App = () => {

  const {currentUser,isLoading,fetchUserInfo}= useUserStore();

  const {chatId} = useChatStore();

  useEffect(()=>{
    const unSub = onAuthStateChanged(auth,(user)=>{
      fetchUserInfo(user?.uid);
    });

    return () => {
      unSub();
    };
  },[fetchUserInfo]);

  console.log(currentUser)

  if(isLoading) return <div className="loading">Loading...</div>

  return (
    <div className='container'>
      {currentUser?(
          <>
          <button className="button" onClick={()=>{auth.signOut()}}>Logout</button>
          <List/>
          {chatId && <Chat/>}
          </>):(
            <Login />
          )
      }
      <Notifications />
    </div>
  )
}

export default App