import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { create } from 'zustand';
import { db } from './firebase';

export const useChatStore = create((set) => ({
    chatId: null,
    user: null,
    userInfo: "Random Rajesh Entered House.",
    
    changeChat: async (chatId, user) => {
        set({ chatId, user });
        // Fetch the selected user's info when chat changes
        if (user?.id) {
            const userDoc = await getDoc(doc(db, "users", user.id));
            if (userDoc.exists()) {
                set({ userInfo: userDoc.data().info || "Random Rajesh Entered House." });
            }
        }
    },

    fetchUserInfo: async (userId) => {
        try {
            const userDoc = await getDoc(doc(db, "users", userId));
            if (userDoc.exists()) {
                // Only update if this is the currently selected user
                set((state) => {
                    if (state.user?.id === userId) {
                        return { userInfo: userDoc.data().info || "Random Rajesh Entered House." };
                    }
                    return state;
                });
            }
        } catch (error) {
            console.error("Error fetching user info:", error);
        }
    },

    subscribeToUserInfo: (userId) => {
        if (!userId) return () => {};
        
        const userDocRef = doc(db, "users", userId);
        return onSnapshot(userDocRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                // Only update if this is the currently selected user
                set((state) => {
                    if (state.user?.id === userId) {
                        return { userInfo: docSnapshot.data().info || "Random Rajesh Entered House." };
                    }
                    return state;
                });
            }
        });
    }
}));