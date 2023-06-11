import React, {createContext, FC, ReactNode, useEffect, useState} from 'react';
import {getConnectedUser, Token, User} from "../api/RESTApi";

export interface AuthContextProps {
    token: Token | null;
    user: User | null;
    login: (user: Token) => void;
    logout: () => void;
    updateUser: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
    token: null,
    user: null,
    login: () => {},
    logout: () => {},
    updateUser: () => {}
});

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
    const [token, setToken] = useState<Token | null>(() => {
        const storedUser = localStorage.getItem('token');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        if(token) {
            localStorage.setItem('token', JSON.stringify(token));
            getConnectedUser(token.token).then(user => setUser(user))
        }
    }, [token]);
    const login = (token: Token) => setToken(token);

    const logout = () => {
        setToken(null);
        localStorage.removeItem('token');
    }
    const updateUser = () => {
        if(token) getConnectedUser(token.token).then(user => setUser(user))
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function checkValidity(token: Token) {
    return new Date(token.expiry) > new Date();
}