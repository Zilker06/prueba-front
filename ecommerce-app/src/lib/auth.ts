import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithPopup, signOut, signInWithEmailAndPassword, updateProfile, onAuthStateChanged, getAuth } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/config';

const provider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const uid = result.user.uid;
    return result.user;
  } catch (err) {
    console.error('Login error:', err);
    return null;
  }
};

export const registerWithEmail = async (email: string, name: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const uid = userCredential.user.uid;

    console.log("Usuario creado en Auth:", user);

    await setDoc(doc(db, "users", user.uid), {
      name: name,
      email: user.email,
      createdAt: new Date(),
    });

    console.log("Usuario guardado en Firestore");
    return user;
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    return null;
  }
};

export const loginWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (err) {
    console.error('Login error:', err);
    return null;
  }
};

export const logout = async () => {
  const auth = getAuth();
  await auth.signOut();
};

export const onAuthChange = (callback: (user: any) => void) => {
  const auth = getAuth();
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      callback(user); // Pasar los datos del usuario autenticado
    } else {
      callback(null); // Usuario no autenticado
    }
  });
};
