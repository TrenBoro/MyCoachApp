import { createContext, useContext, useState, useEffect } from "react";
import { authFetch } from "../utils/authFetch";

const AuthContext = createContext();

export function AuthProvider({children}) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("access");
        if (token) {
            authFetch("http://localhost:8000/exercises/api/me/")
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data && data.username) setUser(data);
            })
        }
    }, []);

    async function login(username, password) {
        const response = await authFetch("http://localhost:8000/exercises/api/token/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem("access", data.access);
            localStorage.setItem("refresh", data.refresh);
            // fetch user info
            const userRes = await authFetch("http://localhost:8000/exercises/api/me/");
            const userData = await userRes.json();
            setUser(userData);
            return { success: true }
        } else {
            return { success: false, error: data.detail || "Login Failed!"};
        }
    }

    function logout() {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{user, setUser, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

export default function useAuth() {
    return useContext(AuthContext);
}