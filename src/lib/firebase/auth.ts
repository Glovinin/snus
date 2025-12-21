import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./config";
import { User, UserRole } from "@/types/user";

export const signUp = async (
  email: string,
  password: string,
  displayName: string,
  role: UserRole = "buyer",
  phone?: string,
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  }
): Promise<FirebaseUser> => {
  try {
    // Create auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Update display name
    await updateProfile(user, { displayName });

    // Create user document in Firestore
    const userData: Omit<User, "id"> = {
      email,
      displayName,
      role,
      createdAt: serverTimestamp() as any,
      preferences: {
        theme: "dark",
        currency: "USD",
      },
      ...(phone && { phone }),
      ...(address && { address }),
    };

    await setDoc(doc(db, "users", user.uid), userData);

    return user;
  } catch (error: any) {
    throw new Error(error.message || "Failed to create account");
  }
};

export const signIn = async (
  email: string,
  password: string
): Promise<FirebaseUser> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message || "Failed to sign in");
  }
};

export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message || "Failed to sign out");
  }
};

export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    throw new Error(error.message || "Failed to send password reset email");
  }
};

export const getUserData = async (userId: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() } as User;
    }
    return null;
  } catch (error) {
    console.error("Error getting user data:", error);
    return null;
  }
};

export const signInWithGoogle = async (role: UserRole = "buyer"): Promise<FirebaseUser> => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if user already exists in Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));

    if (!userDoc.exists()) {
      // Create user document if it doesn't exist
      const userData: Omit<User, "id"> = {
        email: user.email || "",
        displayName: user.displayName || "User",
        role,
        createdAt: serverTimestamp() as any,
        avatarUrl: user.photoURL || undefined,
        preferences: {
          theme: "dark",
          currency: "USD",
        },
      };

      await setDoc(doc(db, "users", user.uid), userData);
    }

    return user;
  } catch (error: any) {
    throw new Error(error.message || "Failed to sign in with Google");
  }
};

export const updateUserData = async (userId: string, data: Partial<User>): Promise<void> => {
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, data, { merge: true });
  } catch (error: any) {
    throw new Error(error.message || "Failed to update user data");
  }
};

export { onAuthStateChanged };
