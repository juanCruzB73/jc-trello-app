import React, { useEffect, useState } from 'react'
import { authStore } from '../../../store/AuthStore';

export const AuthScreen = () => {
    const [user, setUser] = useState(authStore((state) => (state.user)))
    const decodeJWT = (token: string) => {
        const payload = token.split(".")[1]
        const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(decoded);
    }
    const testLogin = () => {
        const petition = async() => {
            const response = await fetch("http://localhost:3000/api/auth", {method:"POST", headers: { 'Content-Type': 'application/json' }, body:JSON.stringify({"password":"123456","username":"test3"})})
            const data = await response.json()
            localStorage.setItem("token",data.token);
            const token = localStorage.getItem("token")
            const decodedToken = decodeJWT(token!);
            authStore.getState().setUser({uid: decodedToken.uid, username: decodedToken.name});
            setUser(user)
            console.log(user)
        }
        petition();
    }
    useEffect(() => {
        testLogin();
    }, [user])
  return (
    <div>AuthScreen</div>
  )
}
