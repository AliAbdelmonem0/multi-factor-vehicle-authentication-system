import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "./api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(sessionStorage.getItem("token") || "");
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            // Here you could decode token or verify with backend
            const role = sessionStorage.getItem("role");
            const username = sessionStorage.getItem("username");
            setUser({ role, username });
        }
    }, [token]);

    const login = async (username, password) => {
        const formData = new URLSearchParams();
        formData.append("username", username);
        formData.append("password", password);

        const response = await fetch(`${API_URL}/token`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData,
        });

        if (!response.ok) throw new Error("Invalid credentials");

        const data = await response.json();
        sessionStorage.setItem("token", data.access_token);
        sessionStorage.setItem("role", data.role);
        sessionStorage.setItem("username", data.username);
        setToken(data.access_token);
        setUser({ role: data.role, username: data.username });

        return data.role; // return role for redirection
    };

    const logout = () => {
        setToken("");
        setUser(null);
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("role");
        sessionStorage.removeItem("username");
        // Also clean up localStorage just in case
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("username");
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
