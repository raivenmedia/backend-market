import { createContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  getIdToken
} from 'firebase/auth';
import { auth } from '../services/firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Sync user with backend
  const syncWithBackend = async (firebaseToken, name, role) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/sync',
        { name, role }, // Pass name and role during registration
        { headers: { Authorization: `Bearer ${firebaseToken}` } }
      );
      
      setUser(response.data.user);
      setToken(firebaseToken);
      localStorage.setItem('token', firebaseToken);
      return response.data.user;
    } catch (error) {
      console.error('Backend sync failed:', error);
      throw new Error(error.response?.data?.message || 'Failed to sync with server');
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const firebaseToken = await getIdToken(firebaseUser, true);
          await syncWithBackend(firebaseToken);
        } catch (error) {
          console.error("Error syncing on auth change:", error);
          setToken(null);
          setUser(null);
          localStorage.removeItem('token');
        }
      } else {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseToken = await getIdToken(userCredential.user, true);
      return await syncWithBackend(firebaseToken);
    } catch (error) {
      console.error('Firebase login error:', error);
      // Simplify Firebase error messages
      let message = 'Login failed';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
         message = 'Invalid email or password';
      }
      throw new Error(message);
    }
  }, []);

  const register = useCallback(async (name, email, password, role = 'buyer') => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseToken = await getIdToken(userCredential.user, true);
      // Sync and pass name/role so the backend can create the MongoDB user properly
      return await syncWithBackend(firebaseToken, name, role);
    } catch (error) {
      console.error('Firebase register error:', error);
      let message = error.message || 'Registration failed';
      if (error.code === 'auth/email-already-in-use') message = 'Email is already in use';
      if (error.code === 'auth/weak-password') message = 'Password must be at least 6 characters';
      throw new Error(message);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  const updateProfile = useCallback(
    async (profileData) => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.put(
          'http://localhost:5000/api/auth/profile',
          profileData,
          config
        );
        setUser(response.data.user);
        return response.data.user;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Update failed');
      }
    },
    [token]
  );

  const refreshUser = useCallback(async () => {
    if (token) {
      await syncWithBackend(token);
    }
  }, [token]);

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    refreshUser,
    isAuthenticated: !!token && !!user,
  };

  return (
    <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
  );
};

export default AuthContext;
