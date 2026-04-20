import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";
import {
    doc,
    setDoc,
    getDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

import { auth, db } from "./firebase-config.js"

export function showAlert(elementId, message) {
    const alert = document.getElementById(elementId)
    if (!alert) return
    alert.textContent = message
    alert.classList.remove('d-none')
}

export function hideAlert(elementId) {
    const alert = document.getElementById(elementId)
    if (!alert) return
    alert.classList.remove('d-none')
    alert.textContent = ''
}

export async function registerUser({ name, email, password, favoriteCity }) {
    const credential = await createUserWithEmailAndPassword(auth, email, password)
    const user = credential.user

    await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        email,
        favoriteCity: favoriteCity || '',
        createdAt: serverTimestamp()
    })

    return user
}

export async function loginUser({ email, password }) {
    const credential = await signInWithEmailAndPassword(auth, email, password)
    return credential.user
}


export async function getCurrentUserProfile(uid) {
    const doc = doc(db, 'users', uid)
    const user = await getDoc(doc)

    if (!user.exists()) return null

    return user.data()
}

export function observeAuth(callback) {
    return onAuthStateChanged(auth, callback)
}

export async function logoutUser() {
    await signOut(auth)
}

export function getFirebaseErrorMessage(error) {
    const code = error?.cod || ''
    switch (code) {
        case 'auth/email.already-in-use':
            return 'Este correo ya esta registrado';
        case 'auth/invalid-email':
            return 'El correo no es válido';
        case 'auth/weak-password':
            return 'La contraseña debe de tener como mínimo 6 caracterres';
        case 'auth/ invalid-credential':
            return ' Correo o contraseña inválida';
        case ' auth/user-not-found':
            return 'No existe una cuenta con este correo';
        case 'auth/wrong-password':
            return 'El password es incorrecto';
        case 'auth/too-many-request':
            return 'Demasiados intentos, intenta más tarde'
        default:
            return error?.message || 'Error inesperado'
    }
}

export function setButtonLoading(button, isLoading, text, loadingText = 'Procesando...') {
    if (!button) return

    button.disabled = isLoading
    button.innerHTML = isLoading ? `
    <span class = "spinner-border spinner-border-sm me-2" aria-hidden = "true"></span>
    ${loadingText}`
        : text
}