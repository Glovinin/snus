import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";

// Generic helper functions
export const createDocument = async (
  collectionName: string,
  documentId: string,
  data: any
) => {
  try {
    await setDoc(doc(db, collectionName, documentId), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error: any) {
    throw new Error(error.message || "Failed to create document");
  }
};

export const getDocument = async (collectionName: string, documentId: string) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error: any) {
    throw new Error(error.message || "Failed to get document");
  }
};

export const updateDocument = async (
  collectionName: string,
  documentId: string,
  data: any
) => {
  try {
    await updateDoc(doc(db, collectionName, documentId), {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error: any) {
    throw new Error(error.message || "Failed to update document");
  }
};

export const deleteDocument = async (
  collectionName: string,
  documentId: string
) => {
  try {
    await deleteDoc(doc(db, collectionName, documentId));
    return { success: true };
  } catch (error: any) {
    throw new Error(error.message || "Failed to delete document");
  }
};

export const queryCollection = async (
  collectionName: string,
  constraints: any[] = [],
  orderByField?: string,
  orderDirection: "asc" | "desc" = "desc",
  limitCount?: number
) => {
  try {
    let q = query(collection(db, collectionName));
    
    // Apply where constraints
    constraints.forEach((constraint) => {
      q = query(q, where(constraint.field, constraint.operator, constraint.value));
    });
    
    // Apply ordering
    if (orderByField) {
      q = query(q, orderBy(orderByField, orderDirection));
    }
    
    // Apply limit
    if (limitCount) {
      q = query(q, limit(limitCount));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error: any) {
    throw new Error(error.message || "Failed to query collection");
  }
};


