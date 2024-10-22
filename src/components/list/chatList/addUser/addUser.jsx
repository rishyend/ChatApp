import { useState } from "react";
import { db } from "../../../../lib/firebase";
import "./addUser.css"
import {
    collection,
    getDoc,
    getDocs,
    doc,
    query,
    serverTimestamp,
    setDoc,
    where,
    updateDoc,
    arrayUnion
} from "firebase/firestore"
import { useUserStore } from "../../../../lib/userStore";

const AddUser = () => {
  const [user,setUser]= useState(null)

  const{currentUser} = useUserStore()

  const handleSearch = async e => {
    e.preventDefault()
    const formData=new FormData(e.target);
    const username=formData.get("username");

    try {

      const docRef = collection(db, "users");
    const q = query(docRef, where("username", "==", username));

    const shot= await getDocs(q)

    if(!shot.empty)
    {
       setUser(shot.docs[0].data())
    }
      
      } catch (err) {
          console.log(err)
        }
      };
    
    const handleAdd = async(e) =>{
      const chatRef= collection(db, "chats"); //for showing list
      const userChatRef= collection(db, "userchats"); 


      try {
        const newChatRef=doc(chatRef)
        await setDoc(newChatRef,{
          createdAt: serverTimestamp(),
          messages: []
        });

        await updateDoc(doc(userChatRef, user.id),{
          chats: arrayUnion({
            chatId: newChatRef.id,
            lastMessage: "",
            receiverId: currentUser.id,
            updatedAt: Date.now(), //timestamp won't work in arrayunion elements
          })
        });

        await updateDoc(doc(userChatRef, currentUser.id),{
          chats: arrayUnion({
            chatId: newChatRef.id,
            lastMessage: "",
            receiverId: user.id,
            updatedAt: Date.now(), //timestamp won't work in arrayunion elements
          })
        })
      } catch (err) {
        console.log(err)
      }
    }

  return (
    <div className='addUser'>
        <form onSubmit={handleSearch}>
            <input type="text" placeholder="Username" name="username"/>
            <button>Search</button>
        </form>
        {user && <div className="user">
            <div className="detail">
                <img src={user.avatar || "./avatar.png"} alt="" />
                <span>{user.username}</span>
            </div>
            <button onClick={handleAdd}>Add User</button>
        </div>}
    </div>
  )
}

export default AddUser