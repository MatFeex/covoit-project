import React, {createContext, FC, ReactNode, useEffect, useState} from 'react';
import {User} from "../utils/RESTApi";

export interface AuthContextProps {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
    user: null,
    login: () => {},
    logout: () => {}
});

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    useEffect(() => {
        if(user) localStorage.setItem('user', JSON.stringify(user));
    }, [user]);

    const login = (user: User) => {
        setUser(user);
    }

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}