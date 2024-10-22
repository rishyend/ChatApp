import { useEffect } from "react";
import "./userInfo.css"
import { useUserStore } from "../../../lib/userStore";
import { db } from "../../../lib/firebase";
import { doc, updateDoc, setDoc, getDoc } from "firebase/firestore";
import { useState } from "react";

const UserInfo = () => {
  const { currentUser } = useUserStore();
  const [editing, setEditing] = useState(false);
  const [infoText, setInfoText] = useState("Random Rajesh Entered House.");

  useEffect(() => {
    const fetchInitialInfo = async () => {
      const userDocRef = doc(db, "users", currentUser.id);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setInfoText(userDoc.data().info || "Random Rajesh Entered House.");
      } else {
        await setDoc(userDocRef, {
          info: "Random Rajesh Entered House.",
          username: currentUser.username,
          avatar: currentUser.avatar || null
        });
      }
    };
    
    fetchInitialInfo();
  }, [currentUser.id]);

  const handleSave = async () => {
    try {
      const userDocRef = doc(db, "users", currentUser.id);
      await updateDoc(userDocRef, { info: infoText });
      setEditing(false);
    } catch (error) {
      console.error("Error saving user info:", error);
    }
  };

  // Close popup when clicking outside
  const handleOverlayClick = (e) => {
    if (e.target.className === 'popup-overlay') {
      setEditing(false);
    }
  };

  return (
    <div className='userInfo'>
      <div className="user">
        <img src={currentUser.avatar || "./avatar.png"} alt="" />
        <h2>{currentUser.username}</h2>
        <p>{ }</p>
      </div>
      <div className="icons">
        <img src="./more.png" alt="" />
        <img src="./video.png" alt="" />
        <img 
          src="./edit.png" 
          alt="Edit" 
          onClick={() => setEditing(true)} 
          style={{ cursor: 'pointer' }} 
        />
      </div>

      {editing && (
        <div className="popup-overlay" onClick={handleOverlayClick}>
          <div className="popup-content">
            <div className="popup-header">
              <h3>Edit Info</h3>
              <button 
                className="close-button" 
                onClick={() => setEditing(false)}
              >
                ×
              </button>
            </div>
            <input
              type="text"
              className="info"
              value={infoText}
              onChange={(e) => setInfoText(e.target.value)}
              placeholder="Edit your info"
              autoFocus
            />
            <button className="save" onClick={handleSave}>
              Save It !
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;