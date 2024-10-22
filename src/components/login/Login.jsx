// Login.jsx
import { useState } from "react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./login.css";
import { createUserWithEmailAndPassword , signInWithEmailAndPassword} from "firebase/auth";
import { auth, db } from "../../lib/firebase"; 
import { doc, setDoc } from "firebase/firestore"; 
import { getStorage, ref } from "firebase/storage";
import upload from "../../lib/upload";

const Login = () => {
    const [avatar, setAvatar] = useState({
        file: null,
        url: ""
    });

    const [loading,setLoading] = useState(false)

    const handleAvatar = e => {
        if (e.target.files[0]) {
            setAvatar({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            });
        }
    };

    const handleLogin = async(e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.target);

        const { loginEmail, loginPassword } = Object.fromEntries(formData);

        try{

            await signInWithEmailAndPassword(auth,loginEmail,loginPassword);

        }catch(err){
            console.log(err)
            toast.error(err.message)
        }
        finally{
            setLoading(false)
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);

        const { username, regEmail, regPassword } = Object.fromEntries(formData);

        try {
            const res = await createUserWithEmailAndPassword(auth, regEmail, regPassword);

            const imgUrl= await upload(avatar.file)

            await setDoc(doc(db, "users", res.user.uid), {
                        username,
                        regEmail,
                        avatar: imgUrl,
                        id: res.user.uid
                        });
            
                        toast.success("Succesfully Registered, Please Login");
            
            await setDoc(doc(db, "userchats", res.user.uid), {
                        chats: []
                        });
            
        } catch (err) {
            console.log(err);
            toast.error(err.message);
        }finally{
            setLoading(false);
        }
    };

    return (
        <div className='login'>
            <div className="item">
                <h2>Welcome back</h2>
                <form onSubmit={handleLogin}>
                    <input type="text" placeholder="Email" name="loginEmail" />
                    <input type="password" placeholder="Password" name="loginPassword" />
                    <button disabled={loading}>{loading? "Loading" : "Sign In"}</button>
                </form>
            </div>
            <div className="separator"></div>
            <div className="item">
                <h2>Registration</h2>
                <form onSubmit={handleRegister}>
                    <label htmlFor="file">
                        <img src={avatar.url || "./avatar.png"} alt="avatar" />
                        Upload Image
                    </label>
                    <input type="file" id="file" style={{ display: "none" }} onChange={handleAvatar} />
                    <input type="text" placeholder="Username" name="username" />
                    <input type="text" placeholder="Email" name="regEmail" />
                    <input type="password" placeholder="Password" name="regPassword" />
                    <button disabled={loading}>{loading ? "Loading" : "Sign Up"}</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
