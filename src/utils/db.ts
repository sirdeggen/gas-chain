"use client"

import { Submission } from "@/app/page";

// IndexedDB utility for the Gas Chain application
// Handles storage of submissions in a client-side database

// Database connection and schema
const DB_NAME = 'gas-chain-db';
const DB_VERSION = 1;
const SUBMISSIONS_STORE = 'submissions';

// Open/initialize the database
export const openDatabase = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains(SUBMISSIONS_STORE)) {
        // Create submissions store with txid as key
        const store = db.createObjectStore(SUBMISSIONS_STORE, { keyPath: 'txid' });
        
        // Create useful indexes
        store.createIndex('step', 'step', { unique: false });
        store.createIndex('timestamp', 'data.timestamp', { unique: false });
      }
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };

    request.onerror = (event) => {
      console.error('IndexedDB error:', (event.target as IDBOpenDBRequest).error);
      reject(new Error(`IndexedDB error: ${(event.target as IDBOpenDBRequest).error?.message || 'Unknown error'}`));
    };
  });
};

// Save a submission to the database
export const saveSubmission = async (submission: Submission): Promise<void> => {
  try {
    const db = await openDatabase();
    const transaction = db.transaction([SUBMISSIONS_STORE], 'readwrite');
    const store = transaction.objectStore(SUBMISSIONS_STORE);
    
    return new Promise((resolve, reject) => {
      const request = store.put(submission);
      
      request.onsuccess = () => {
        resolve();
      };
      
      request.onerror = (event) => {
        console.error('Error saving submission:', (event.target as IDBRequest).error);
        reject(new Error(`Error saving submission: ${(event.target as IDBRequest).error?.message || 'Unknown error'}`));
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('Failed to save submission:', error);
    throw error;
  }
};

// Get all submissions from the database
export const getAllSubmissions = async (): Promise<Submission[]> => {
  try {
    const db = await openDatabase();
    const transaction = db.transaction([SUBMISSIONS_STORE], 'readonly');
    const store = transaction.objectStore(SUBMISSIONS_STORE);
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      
      request.onsuccess = (event) => {
        resolve((event.target as IDBRequest).result);
      };
      
      request.onerror = (event) => {
        console.error('Error getting submissions:', (event.target as IDBRequest).error);
        reject(new Error(`Error getting submissions: ${(event.target as IDBRequest).error?.message || 'Unknown error'}`));
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('Failed to get submissions:', error);
    return [];
  }
};

// Get submissions by step
export const getSubmissionsByStep = async (step: string): Promise<Submission[]> => {
  try {
    const db = await openDatabase();
    const transaction = db.transaction([SUBMISSIONS_STORE], 'readonly');
    const store = transaction.objectStore(SUBMISSIONS_STORE);
    const index = store.index('step');
    
    return new Promise((resolve, reject) => {
      const request = index.getAll(step);
      
      request.onsuccess = (event) => {
        resolve((event.target as IDBRequest).result);
      };
      
      request.onerror = (event) => {
        console.error('Error getting submissions by step:', (event.target as IDBRequest).error);
        reject(new Error(`Error getting submissions by step: ${(event.target as IDBRequest).error?.message || 'Unknown error'}`));
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error(`Failed to get submissions for step ${step}:`, error);
    return [];
  }
};

// Clear all submissions
export const clearAllSubmissions = async (): Promise<void> => {
  try {
    const db = await openDatabase();
    const transaction = db.transaction([SUBMISSIONS_STORE], 'readwrite');
    const store = transaction.objectStore(SUBMISSIONS_STORE);
    
    return new Promise((resolve, reject) => {
      const request = store.clear();
      
      request.onsuccess = () => {
        resolve();
      };
      
      request.onerror = (event) => {
        console.error('Error clearing submissions:', (event.target as IDBRequest).error);
        reject(new Error(`Error clearing submissions: ${(event.target as IDBRequest).error?.message || 'Unknown error'}`));
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('Failed to clear submissions:', error);
    throw error;
  }
};
