import { useRef, useState, useEffect } from "react";
import "./chat.css";
import EmojiPicker from "emoji-picker-react";
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import upload from "../../lib/upload";

const Chat = () => {
  const [chat, setChat] = useState();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [img, setImg] = useState({ file: null, url: "" });
  const [showInfoPopup, setShowInfoPopup] = useState(false); // Add state for popup visibility

  const { chatId, user, userInfo, subscribeToUserInfo } = useChatStore();
  const { currentUser } = useUserStore();

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });

    return () => {
      unSub();
    };
  }, [chatId]);

  useEffect(() => {
    let unsubscribe;
    if (user?.id) {
      unsubscribe = subscribeToUserInfo(user.id);
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user?.id, subscribeToUserInfo]);

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
  };

  const handleImg = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleSend = async () => {
    if (text === "") return; // Correct condition

    let imgUrl = null;

    try {
      if (img.file) {
        imgUrl = await upload(img.file);
      }

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl }),
        }),
      });

      // Update unread messages and last message for the other user
      const userIDs = [currentUser.id, user.id];
      userIDs.forEach(async (id) => {
        const userChatRef = doc(db, "userchats", id);
        const userChatsSnapshot = await getDoc(userChatRef);

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();
          const chatIndex = userChatsData.chats.findIndex((c) => c.chatId === chatId);

          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen = id === currentUser.id;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatRef, {
            chats: userChatsData.chats,
          });
        }
      });
    } catch (err) {
      console.log(err);
    }

    setImg({ file: null, url: "" });
    setText("");
  };

  const handleOverlayClick = () => {
    setShowInfoPopup(false); // Close the popup when overlay is clicked
  };

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src={user?.avatar || "./avatar.png"} alt="" />
          <div className="texts">
            <span>{user?.username}</span>
            <p>{userInfo}</p> {/* Display the updated user info */}
          </div>
        </div>
        <div className="icons">
          <img src="./phone.png" alt="Phone" />
          <img src="./video.png" alt="Video" />
          <img
            src="./info.png"
            alt="Info"
            onClick={() => setShowInfoPopup(true)} // Show the info popup
            style={{ cursor: "pointer" }}
          />
        </div>
      </div>

      {/* Info Popup */}
      {showInfoPopup && (
        <div className="popup-overlay" onClick={handleOverlayClick}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}> {/* Stop propagation so click on popup doesn't close it */}
            <div className="popup-header">
              <h3>ABOUT</h3>
              <button className="close-button" onClick={() => setShowInfoPopup(false)}>
                ×
              </button>
            </div>
            <div className="user-info-content">
              <img src={user?.avatar || "./avatar.png"} alt="Avatar" className="user-info-avatar" />
              <div className="user-info-details">
                <div className="user-info-username">{user?.username}</div>
                <div className="user-info-status">{userInfo}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="center">
        {chat?.messages?.map((message) => (
          <div className={message.senderId === currentUser.id ? "message own" : "message"} key={message?.createdAt}>
            <div className="texts">
              {message.img && <img src={message.img} alt="Message" />}
              <p>{message.text}</p>
            </div>
          </div>
        ))}
        {img.url && (
          <div className="message own">
            <div className="texts">
              <img src={img.url} alt="Preview" />
            </div>
          </div>
        )}
        <div ref={endRef}></div>
      </div>
      
      <div className="bottom">
        <div className="icons">
          <label htmlFor="file">
            <img src="./img.png" alt="Attach" />
          </label>
          <input type="file" id="file" style={{ display: "none" }} onChange={handleImg} />
          <img src="./camera.png" alt="Camera" />
          <img src="./mic.png" alt="Mic" />
        </div>
        <input
          type="text"
          className="input"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="emoji">
          <img src="./emoji.png" alt="Emoji" onClick={() => setOpen((prev) => !prev)} />
          {open && (
            <div className="picker">
              <EmojiPicker onEmojiClick={handleEmoji} />
            </div>
          )}
        </div>
        <button className="sendButton" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
