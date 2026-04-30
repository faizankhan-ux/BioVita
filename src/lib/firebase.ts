/**
 * Mock Firebase implementation to maintain UI functionality 
 * without external cloud dependencies.
 */

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

// Mock auth state
let currentUser: User | null = JSON.parse(localStorage.getItem('mock_user') || 'null');
const authListeners: ((user: User | null) => void)[] = [];

export const auth: any = {
  get currentUser() {
    return currentUser;
  },
  signOut: () => signOut()
};

export const db = {
  firestoreDatabaseId: 'default'
};

export const googleProvider = {};

const notifyAuthListeners = () => {
  authListeners.forEach(listener => listener(currentUser));
};

export const onAuthStateChanged = (authObj: any, callback: (user: User | null) => void) => {
  authListeners.push(callback);
  // Initial call
  setTimeout(() => callback(currentUser), 0);
  return () => {
    const index = authListeners.indexOf(callback);
    if (index > -1) authListeners.splice(index, 1);
  };
};

export const signInWithGoogle = async () => {
  const mockUser: User = {
    uid: 'mock-user-123',
    email: 'user@example.com',
    displayName: 'Mock User',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mock',
  };
  
  currentUser = mockUser;
  localStorage.setItem('mock_user', JSON.stringify(mockUser));
  
  const users = JSON.parse(localStorage.getItem('mock_db_users') || '{}');
  if (!users[mockUser.uid]) {
    users[mockUser.uid] = {
      ...mockUser,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('mock_db_users', JSON.stringify(users));
  }
  
  notifyAuthListeners();
  return { user: mockUser };
};

export const signInWithEmailAndPassword = async (auth: any, email: string, pass: string) => {
  const mockUser: User = {
    uid: 'mock-user-' + email.split('@')[0],
    email: email,
    displayName: email.split('@')[0],
    photoURL: null,
  };
  currentUser = mockUser;
  localStorage.setItem('mock_user', JSON.stringify(mockUser));
  notifyAuthListeners();
  return { user: mockUser };
};

export const createUserWithEmailAndPassword = async (auth: any, email: string, pass: string) => {
  const mockUser: User = {
    uid: 'mock-user-' + Date.now(),
    email: email,
    displayName: email.split('@')[0],
    photoURL: null,
  };
  currentUser = mockUser;
  localStorage.setItem('mock_user', JSON.stringify(mockUser));
  notifyAuthListeners();
  return { user: mockUser };
};

export const signOut = async (authObj?: any) => {
  currentUser = null;
  localStorage.removeItem('mock_user');
  notifyAuthListeners();
};

export const updateProfile = async (user: any, data: any) => {
  currentUser = { ...currentUser!, ...data };
  localStorage.setItem('mock_user', JSON.stringify(currentUser));
  notifyAuthListeners();
};

// Mock Firestore operations
export const doc = (db: any, ...pathSegments: string[]) => {
  const collection = pathSegments.slice(0, -1).join('/');
  const id = pathSegments[pathSegments.length - 1];
  return { collection, id };
};

export const collection = (db: any, ...pathSegments: string[]) => {
  const path = pathSegments.join('/');
  return { path };
};

export const query = (ref: any, ...constraints: any[]) => ref;
export const where = (field: string, op: string, value: any) => ({ field, op, value });
export const orderBy = (field: string, dir: string) => ({ field, dir });

export const setDoc = async (docRef: any, data: any) => {
  const dbStore = JSON.parse(localStorage.getItem(`mock_db_${docRef.collection}`) || '{}');
  dbStore[docRef.id] = data;
  localStorage.setItem(`mock_db_${docRef.collection}`, JSON.stringify(dbStore));
};

export const updateDoc = async (docRef: any, data: any) => {
  const dbStore = JSON.parse(localStorage.getItem(`mock_db_${docRef.collection}`) || '{}');
  dbStore[docRef.id] = { ...dbStore[docRef.id], ...data };
  localStorage.setItem(`mock_db_${docRef.collection}`, JSON.stringify(dbStore));
};

export const addDoc = async (collRef: any, data: any) => {
  const id = 'mock-' + Math.random().toString(36).substr(2, 9);
  const dbStore = JSON.parse(localStorage.getItem(`mock_db_${collRef.path}`) || '{}');
  dbStore[id] = data;
  localStorage.setItem(`mock_db_${collRef.path}`, JSON.stringify(dbStore));
  return { id };
};

export const getDoc = async (docRef: any) => {
  const dbStore = JSON.parse(localStorage.getItem(`mock_db_${docRef.collection}`) || '{}');
  const data = dbStore[docRef.id];
  return {
    exists: () => !!data,
    data: () => data
  };
};

export const getDocs = async (queryRef: any) => {
  const dbStore = JSON.parse(localStorage.getItem(`mock_db_${queryRef.path}`) || '{}');
  const docs = Object.entries(dbStore).map(([id, data]) => ({
    id,
    data: () => data
  }));
  return { docs };
};

export const getDocFromServer = getDoc;

export const serverTimestamp = () => Timestamp.now();

export class Timestamp {
  seconds: number;
  nanoseconds: number;
  constructor(seconds: number, nanoseconds: number) {
    this.seconds = seconds;
    this.nanoseconds = nanoseconds;
  }
  static now() { return new Timestamp(Math.floor(Date.now() / 1000), 0); }
  static fromDate(date: Date) { return new Timestamp(Math.floor(date.getTime() / 1000), 0); }
  toDate() { return new Date(this.seconds * 1000); }
  toMillis() { return this.seconds * 1000; }
}

export const deleteDoc = async (docRef: any) => {
  const dbStore = JSON.parse(localStorage.getItem(`mock_db_${docRef.collection}`) || '{}');
  delete dbStore[docRef.id];
  localStorage.setItem(`mock_db_${docRef.collection}`, JSON.stringify(dbStore));
};

export const onSnapshot = (ref: any, callback: (snapshot: any) => void, errorCallback?: (err: any) => void) => {
  const update = () => {
    const path = ref.path || ref.collection;
    const dbStore = JSON.parse(localStorage.getItem(`mock_db_${path}`) || '{}');
    const docs = Object.entries(dbStore).map(([id, data]: [string, any]) => ({
      id,
      data: () => data
    }));
    callback({ docs, empty: docs.length === 0 });
  };
  
  update();
  return () => {};
};

