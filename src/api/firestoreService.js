import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc, getDoc, setDoc, query, where, getDocs } from 'firebase/firestore';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile 
} from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD7L8z83d4sOaald_52Y93Xgru3-aquKHo",
  authDomain: "task-management-65c52.firebaseapp.com",
  projectId: "task-management-65c52",
  storageBucket: "task-management-65c52.firebasestorage.app",
  messagingSenderId: "108238071031",
  appId: "1:108238071031:web:d92e8f57e9c9a9e50b9ff2",
  measurementId: "G-68HNSWBGGH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Authentication Functions
export const createUser = async (email, password, userData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update user profile with display name
    await updateProfile(user, {
      displayName: userData.fullName
    });
    
    // Store additional user data in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      ...userData,
      uid: user.uid,
      email: user.email,
      createdAt: new Date().toISOString(),
      createdBy: auth.currentUser?.uid || 'system'
    });
    
    return user;
  } catch (error) {
    throw error;
  }
};

export const signInUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export const getUserData = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    }
    // Throw a specific error when document doesn't exist
    const error = new Error('User document not found');
    error.code = 'not-found';
    throw error;
  } catch (error) {
    throw error;
  }
};

export const getUsersByRole = async (role) => {
  try {
    const q = query(collection(db, 'users'), where('role', '==', role));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(`Error fetching users with role ${role}:`, error);
    return [];
  }
};

export const getAllUsers = async () => {
  try {
    const q = query(collection(db, 'users'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching all users:', error);
    return [];
  }
};

export const updateUserRole = async (uid, newRole, permissions = {}) => {
  try {
    await updateDoc(doc(db, 'users', uid), {
      role: newRole,
      permissions: permissions,
      updatedAt: new Date().toISOString(),
      updatedBy: auth.currentUser?.uid
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Sets up a real-time listener for a Firestore collection.
 * @param {string} collectionName The name of the collection to listen to.
 * @param {function} callback A callback function to handle the snapshot data.
 * @returns {function} An unsubscribe function to detach the listener.
 */
export const getCollectionSnapshot = (collectionName, callback) => {
  const q = collection(db, collectionName);
  return onSnapshot(q, (querySnapshot) => {
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(data);
  });
};

/**
 * Adds a new document to a specified collection.
 * @param {string} collectionName The name of the collection.
 * @param {object} data The data for the new document.
 * @returns {Promise<DocumentReference>} A promise that resolves with the document reference.
 */
export const addDocument = (collectionName, data) => {
  return addDoc(collection(db, collectionName), data);
};

/**
 * Updates an existing document in a specified collection.
 * @param {string} collectionName The name of the collection.
 * @param {string} docId The ID of the document to update.
 * @param {object} data The data to update.
 * @returns {Promise<void>} A promise that resolves when the update is complete.
 */
export const updateDocument = (collectionName, docId, data) => {
  const docRef = doc(db, collectionName, docId);
  return updateDoc(docRef, data);
};

/**
 * Deletes a document from a specified collection.
 * @param {string} collectionName The name of the collection.
 * @param {string} docId The ID of the document to delete.
 * @returns {Promise<void>} A promise that resolves when the delete is complete.
 */
export const deleteDocument = (collectionName, docId) => {
  const docRef = doc(db, collectionName, docId);
  return deleteDoc(docRef);
};
