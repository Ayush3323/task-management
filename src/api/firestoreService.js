import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';

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
