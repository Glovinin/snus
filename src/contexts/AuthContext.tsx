"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { onAuthStateChanged, getUserData } from "@/lib/firebase/auth";
import { auth } from "@/lib/firebase/config";
import { User } from "@/types/user";

interface AuthContextType {
  user: FirebaseUser | null;
  userData: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUserData = async () => {
    if (user) {
      const data = await getUserData(user.uid);
      setUserData(data);
    } else {
      setUserData(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const data = await getUserData(firebaseUser.uid);
        setUserData(data);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    const { logout } = await import("@/lib/firebase/auth");
    await logout();
    setUser(null);
    setUserData(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        loading,
        signOut,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

